import yaml
from pytorch_forecasting import Baseline, TemporalFusionTransformer, TimeSeriesDataSet
from .preprocess import preprocess, decoder_preprocess
from .NBA_data import NBA_data
from datetime import date
import pandas as pd
import logging
import os

logger = logging.getLogger(__name__)

class NBA_Pred_Model:
  def __init__(self, best_model_path, start_year=2024, end_year=2025, **kwargs):
    self.model = TemporalFusionTransformer.load_from_checkpoint(best_model_path)
    nba_data = NBA_data(**kwargs)
    nba_data.download_games(start_year, end_year)
    self.teams = nba_data.download_teams()
    self.all_teams_df = preprocess(start_year, end_year)
    self.encoder_data_map = { g['TEAM_ID']: g for g in self.all_teams_df.groupby('TEAM_ID') }

  def predict(self, input):
    home = input["home"]['teamId']
    away = input["away"]['teamId']
    today = date.today()
    encoder_data = self.encoder_data_map[home]
    decoder_dict = {
      'TEAM_ID': home,
      'OPPONENT_ID': away,
      'SEASON_ID': 1,
      'GAME_DATE': today,
      'day_of_week': today.isoweekday,
      'is_home': '1',
      'time_idx': 1,
      }
    decoder_data = decoder_preprocess(decoder_dict)
    prediction_data = pd.concat([encoder_data, decoder_data], ignore_index=True)
    y_pred = self.model.predict(prediction_data, mode="raw", return_y=True)
    logging.info(f'{self.teams[home]} vs {self.teams[away]} odds: {y_pred}')
    return y_pred

# # select last known data point and create decoder data from it by repeating it and incrementing the month
# # in a real world dataset, we should not just forward fill the covariates but specify them to account
# # for changes in special days and prices (which you absolutely should do but we are too lazy here)
# last_data = data[lambda x: x.time_idx == x.time_idx.max()]
# decoder_data = pd.concat(
#     [last_data.assign(date=lambda x: x.date + pd.offsets.MonthBegin(i)) for i in range(1, max_prediction_length + 1)],
#     ignore_index=True,
# )

# # add time index consistent with "data"
# decoder_data["time_idx"] = decoder_data["date"].dt.year * 12 + decoder_data["date"].dt.month
# decoder_data["time_idx"] += encoder_data["time_idx"].max() + 1 - decoder_data["time_idx"].min()

# # adjust additional time feature(s)
# decoder_data["month"] = decoder_data.date.dt.month.astype(str).astype("category")  # categories have be strings

# # combine encoder and decoder data
# new_prediction_data = pd.concat([encoder_data, decoder_data], ignore_index=True)


# def predict(model):
#   new_raw_predictions = best_tft.predict(new_prediction_data, mode="raw", return_x=True)

if __name__ == '__main__':
  with open(os.path.join(__package__, "config.yaml"),"r") as file_object:
    config=yaml.load(file_object, Loader=yaml.SafeLoader)
  assert config
  model = NBA_Pred_Model(**config)

  
  