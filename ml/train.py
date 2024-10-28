from lightning.pytorch.callbacks import EarlyStopping, LearningRateMonitor
from lightning.pytorch.loggers import TensorBoardLogger
import lightning.pytorch as pl
from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
from pytorch_forecasting.data import GroupNormalizer
from pytorch_forecasting.metrics import MAE, SMAPE, PoissonLoss, QuantileLoss
from .dataset import build_dataset
from .preprocess import preprocess
from .setup_data import setup_data
from .evaluate import evaluate
import torch
import logging
import yaml
import os
from lightning.pytorch.tuner import Tuner
from pytorch_forecasting.models.temporal_fusion_transformer.tuning import optimize_hyperparameters
import pickle

with open(os.path.join(__package__, "config.yaml"),"r") as file_object:
    config=yaml.load(file_object, Loader=yaml.SafeLoader)
assert config
logging.basicConfig(level=config['logging_level'], format='%(asctime)s [%(levelname)s] - %(module)s: %(message)s', handlers=[
                                                            logging.StreamHandler(), 
                                                            logging.FileHandler(os.path.join(__package__, 'logs/tft_train.log'), mode='w')])


def lr_finder(tft, trainer, train_dataloader, val_dataloader):
    res = Tuner(trainer).lr_find(
        tft,
        train_dataloaders=train_dataloader,
        val_dataloaders=val_dataloader,
        max_lr=10,
        min_lr=1e-6,
    )
    print(f"suggested learning rate: {res.suggestion()}")
    fig = res.plot(show=True, suggest=True)
    fig.show()
    return res.suggestion()

def train(log_dir, data_dir, base_dir, lightning_log_dir, device=None, **args):
    pl.seed_everything(42)
    games_df = preprocess()
    training, validation, train_loader, val_loader = build_dataset(games_df)

    

    # configure network and trainer
    early_stop_callback = EarlyStopping(monitor="val_loss", min_delta=1e-4, patience=10, verbose=False, mode="min")
    lr_logger = LearningRateMonitor()  # log the learning rate
    tb_logger = TensorBoardLogger(base_dir)  # logging results to a tensorboard

    torch.set_float32_matmul_precision('medium')
    if not device:
       device = 'gpu' if torch.cuda.is_available() else 'cpu'
    trainer = pl.Trainer(
        max_epochs=75,
        accelerator=device,
        enable_model_summary=True,
        gradient_clip_val=0.1,
        limit_train_batches=50,  # coment in for training, running valiation every 30 batches
        # fast_dev_run=True,  # comment in to check that networkor dataset has no serious bugs
        callbacks=[lr_logger, early_stop_callback],
        logger=tb_logger,
    )

    tft = TemporalFusionTransformer.from_dataset(
        training,
        learning_rate=3e-2,
        hidden_size=16, # 16
        attention_head_size=2, # 2
        dropout=0.1,
        hidden_continuous_size=8, # 8
        loss=QuantileLoss(),
        log_interval=10,  # uncomment for learning rate finder and otherwise, e.g. to 10 for logging every 10 batches
        optimizer="Ranger",
        reduce_on_plateau_patience=4,
    )



    # study = optimize_hyperparameters(
    #     train_loader,
    #     val_loader,
    #     model_path="optuna_test",
    #     n_trials=100,
    #     max_epochs=50,
    #     gradient_clip_val_range=(0.01, 1.0),
    #     hidden_size_range=(8, 128),
    #     hidden_continuous_size_range=(8, 128),
    #     attention_head_size_range=(1, 4),
    #     learning_rate_range=(0.001, 0.1),
    #     dropout_range=(0.1, 0.3),
    #     trainer_kwargs=dict(limit_train_batches=30),
    #     reduce_on_plateau_patience=4,
    #     use_learning_rate_finder=False,  # use Optuna to find ideal learning rate or use in-built learning rate finder
    # )
    # study_dir = os.path.join(base_dir, "test_study.pkl")
    # with open(study_dir, "wb") as fout:
    #     pickle.dump(study, fout)

    # print(study.best_trial.params)

    # lr = lr_finder(tft, trainer, train_loader, val_loader)
    
    print(f"Number of parameters in network: {tft.size()/1e3:.1f}k")

    trainer.fit(
        tft,
        train_dataloaders=train_loader,
        val_dataloaders=val_loader,
    )

    best_model_path = trainer.checkpoint_callback.best_model_path
    print(best_model_path)
    best_tft = TemporalFusionTransformer.load_from_checkpoint(best_model_path)

    evaluate(best_tft, val_loader)

    # best_tft = TemporalFusionTransformer.load_from_checkpoint(best_model_path)
    config_path = os.path.join(base_dir, "config.yaml")

    with open(config_path,"r") as file_object:
      config=yaml.load(file_object, Loader=yaml.SafeLoader)

    config['best_tft'] = best_model_path

    with open(config_path, "w") as file_object:
      yaml.dump(config, file_object)
    

if __name__ == '__main__':
    logger = logging.getLogger(__name__)
    config = setup_data()
    train(**config)