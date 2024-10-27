import yaml
from pytorch_forecasting import Baseline, TemporalFusionTransformer, TimeSeriesDataSet
from .preprocess import preprocess
from .NBA_data import NBA_data
from datetime import date
import pandas as pd
import logging
import os
from .setup_data import setup_data
import torch

logger = logging.getLogger(__name__)

class NBA_Pred_Model:
  def __init__(self, best_tft, win_len=5, **kwargs):
    self.model = TemporalFusionTransformer.load_from_checkpoint(best_tft)
    nba_data = NBA_data(**kwargs)
    # nba_data.download_games(start_year, end_year)
    # self.teams = nba_data.download_teams()
    self.teams = nba_data.get_teams_dict()

    self.all_teams_df = preprocess(win_len=win_len, **kwargs)
    self.encoder_data_map = { g[0]: g[1] for g in self.all_teams_df.groupby('TEAM_ID') }
    self.win_len = win_len

  def predict(self, input):
    home = input["home"]['teamId']
    away = input["away"]['teamId']
    today = date.today()
    encoder_data: pd.DataFrame = self.encoder_data_map[home]
    opponent_games: pd.DataFrame = self.encoder_data_map[away]
    decoder_dict = {
      'TEAM_ID': home,
      'OPPONENT_ID': away,
      # 'SEASON_ID': encoder_data.iloc[0]['SEASON_ID'],
      'GAME_DATE': today,
      'day_of_week': str(today.isoweekday() - 1),
      'is_home': '1',
      'time_idx': encoder_data.iloc[-1]['time_idx'] + 1,
      'opponent_WL_rolling_avg': opponent_games.iloc[-self.win_len:]['WL_int'].mean(),
      'index': [0],
      'year': encoder_data.iloc[-1]['year'],
      'WL': '0' # needs to be filled but is irrelevant in decoding
    }
    encoder_data = encoder_data.drop(columns=['WL_int', 'GAME_ID'])
    decoder_data = pd.DataFrame(decoder_dict)
    prediction_data = pd.concat([encoder_data, decoder_data], ignore_index=True)
    
    y_pred_t: torch.Tensor = self.model.predict(prediction_data)
    y_pred = y_pred_t[-1].item()
    logger.info(f'{self.teams[home]["nickname"]} vs {self.teams[away]["nickname"]} odds: {y_pred}')
    
    return y_pred

if __name__ == '__main__':
  config = setup_data(start_year=2023, end_year=2024, is_train=False)
  model = NBA_Pred_Model(**config)
  model.predict({ 'home': {'teamId': '1610612738'}, 'away': {'teamId': '1610612761'}})
  model.predict({ 'home': {'teamId': '1610612761'}, 'away': {'teamId': '1610612738'}})

  
  