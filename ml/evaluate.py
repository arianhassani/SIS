import yaml
from pytorch_forecasting import Baseline, TemporalFusionTransformer
from pytorch_forecasting.metrics import MAE
import torch
import logging
import matplotlib.pyplot as plt
from .setup_data import setup_data
from .preprocess import preprocess
from .dataset import build_dataset
from .predict import NBA_Pred_Model

logger = logging.getLogger(__name__)


def generate_baseline(val_loader):
    # calculate baseline mean absolute error, i.e. predict next value as the last available value from the history
    baseline_predictions = Baseline().predict(val_loader, return_y=True)
    # Mean Absolute Error
    mae: torch.Tensor = MAE()(baseline_predictions.output, baseline_predictions.y)
    accuracy = 1 - mae.item()
    return mae, accuracy

def model_acc(model, val_loader):
    predictions = model.predict(val_loader, return_y=True, trainer_kwargs=dict(accelerator="cpu"))
    mae: torch.Tensor = MAE()(predictions.output, predictions.y)
    accuracy = 1 - mae.item()
    return mae, accuracy

def interpret(model, val_loader):
    raw_predictions = model.predict(val_loader, mode="raw", return_x=True)
    interpretation = model.interpret_output(raw_predictions.output, reduction="sum")
    figures = model.plot_interpretation(interpretation)

    for figure in figures.values():
        figure.show()

def evaluate(model, val_loader):
    # model = NBA_Pred_Model(**config)
    # print(model.predict({ 'home': {'teamId': '1610612738'}, 'away': {'teamId': '1610612761'}}))
    # print(model.predict({ 'home': {'teamId': '1610612761'}, 'away': {'teamId': '1610612738'}}))

    mae, acc = generate_baseline(val_loader)
    logger.info(f'Baseline - Accuracy: {acc}')
    mae, acc = model_acc(model, val_loader)
    logger.info(f'model - Accuracy: {acc}')
    interpret(model, val_loader)

def get_test_data():
    games_df = preprocess()
    training, validation, train_loader, val_loader = build_dataset(games_df)
    return val_loader

if __name__ == '__main__':
    config = setup_data(2023, 2024, is_train=False)
    model = TemporalFusionTransformer.load_from_checkpoint(config['best_tft'])
    val_loader = get_test_data()
    evaluate(model, val_loader)