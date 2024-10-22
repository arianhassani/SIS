import yaml
from pytorch_forecasting import Baseline, TemporalFusionTransformer, TimeSeriesDataSet

def setup(best_model_path, **kwargs):
  best_tft = TemporalFusionTransformer.load_from_checkpoint(best_model_path)
  encoder_data = get_encoder_data()

def get_encoder_data():
  pass
  seasons = get_last_n_seasons()
  encoded = preprocess(seasons)
  # select last 24 months from data (max_encoder_length is 24)
encoder_data = data[lambda x: x.time_idx > x.time_idx.max() - max_encoder_length]

# select last known data point and create decoder data from it by repeating it and incrementing the month
# in a real world dataset, we should not just forward fill the covariates but specify them to account
# for changes in special days and prices (which you absolutely should do but we are too lazy here)
last_data = data[lambda x: x.time_idx == x.time_idx.max()]
decoder_data = pd.concat(
    [last_data.assign(date=lambda x: x.date + pd.offsets.MonthBegin(i)) for i in range(1, max_prediction_length + 1)],
    ignore_index=True,
)

# add time index consistent with "data"
decoder_data["time_idx"] = decoder_data["date"].dt.year * 12 + decoder_data["date"].dt.month
decoder_data["time_idx"] += encoder_data["time_idx"].max() + 1 - decoder_data["time_idx"].min()

# adjust additional time feature(s)
decoder_data["month"] = decoder_data.date.dt.month.astype(str).astype("category")  # categories have be strings

# combine encoder and decoder data
new_prediction_data = pd.concat([encoder_data, decoder_data], ignore_index=True)


def predict(model):
  new_raw_predictions = best_tft.predict(new_prediction_data, mode="raw", return_x=True)

if __name__ == '__main__':
  with open(os.path.join(__package__, "config.yaml"),"r") as file_object:
    config=yaml.load(file_object, Loader=yaml.SafeLoader)
  assert config
  setup(**config)

  
  