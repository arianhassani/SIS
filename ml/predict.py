import numpy as np
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
import torch.nn.functional as F

logger = logging.getLogger(__name__)
torch.set_float32_matmul_precision('medium')
class NBA_Pred_Model:
  def __init__(self, best_tft, win_len=5, **kwargs):
    self.model = TemporalFusionTransformer.load_from_checkpoint(best_tft)
    nba_data = NBA_data(**kwargs)
    # nba_data.download_games(start_year, end_year)
    # self.teams = nba_data.download_teams()
    self.teams = nba_data.get_teams_dict()
    self.players = nba_data.get_players_dict()

    self.all_teams_df = preprocess(win_len=win_len, **kwargs)
    self.encoder_data_map = { g[0]: g[1] for g in self.all_teams_df.groupby('TEAM_ID') }
    self.win_len = win_len

  def add_players(self, decoder_dict, home_players, away_players):
    home_p = {f'PLAYER_{i + 1}': p for i, p in enumerate(home_players)}
    away_p = {f'OPPONENT_PLAYER_{i + 1}': p for i, p in enumerate(away_players)}

    return {**decoder_dict, **home_p, **away_p}

    

  def predict(self, input):
    home = input["home"]
    away = input["away"]
    home_team = home['teamId']
    away_team = away['teamId']
    # home_players = []
    # away_players = []
    # if 'playerIds' in home:
    home_players = [str(p) for p in home['playerIds']]
    # if 'playerIds' in away:
    away_players = [str(p) for p in away['playerIds']]

    today = date.today()
    encoder_data: pd.DataFrame = self.encoder_data_map[home_team]
    opponent_games: pd.DataFrame = self.encoder_data_map[away_team]
    decoder_dict = encoder_data.iloc[-1].to_dict()
    decoder_dict = {**decoder_dict,
      'TEAM_ID': home_team,
      'OPPONENT_ID': away_team,
      # 'SEASON_ID': encoder_data.iloc[0]['SEASON_ID'],
      'GAME_DATE': today,
      'day_of_week': str(today.isoweekday() - 1),
      'is_home': '1',
      'time_idx': encoder_data.iloc[-1]['time_idx'] + 1,
      'opponent_WL_rolling_avg': opponent_games.iloc[-self.win_len:]['WL_int'].mean(),
      'matchup_WL_rolling_avg': opponent_games.iloc[-self.win_len:]['WL_int'].mean(),
      'index': [0],
      'year': encoder_data.iloc[-1]['year'],
    }
    decoder_dict = self.add_players(decoder_dict, home_players, away_players)
    # print('opp rolling avg: ', decoder_dict['opponent_WL_rolling_avg'])
    # encoder_data = self.all_teams_df
    encoder_data = encoder_data.drop(columns=['WL_int', 'GAME_ID'])
    decoder_data = pd.DataFrame(decoder_dict)
    prediction_data = pd.concat([encoder_data, decoder_data], ignore_index=True)
    # prediction_data.info()
    # quantiles = self.model.predict(prediction_data, mode="quantiles")
    y_pred: torch.Tensor = self.model.predict(prediction_data)
    y_pred = y_pred.squeeze(dim=0)[-1].item()

    y_pred = 0.2 + y_pred * 0.6 # smooth odds
    # y_pred = self.smooth_odds(quantiles)
    # print(y_pred.prediction.output)    # probabilities = F.softmax(y_pred_t.output, dim=-1)
    # probabilities = F.softmax(y_pred_t.prediction, dim=-1)
    # print(y_pred_t)
    # y_pred = y_pred_t[-1].item()
    logger.info(f'{self.teams[home_team]["nickname"]} vs {self.teams[away_team]["nickname"]} odds: {y_pred}')
    
    return y_pred

  def smooth_odds(self, quantiles):
    return sum(quantiles[0, 0]).item() / 7


if __name__ == '__main__':
  config = setup_data(start_year=2023, end_year=2024, is_train=False)
  model = NBA_Pred_Model(**config)
  res = []
  team_ids = list(model.teams.keys())
  player_ids = np.array(list(model.players.keys()))
  n = len(team_ids)
  n = 5
  for i in range(n):
    for j in range(i + 1, n):
      res.append(model.predict({ 
        'home': {
          'teamId': team_ids[i], 
          'playerIds': list(np.random.choice(player_ids, size=5, replace=False))
        },
        'away': {
          'teamId': team_ids[j],
          'playerIds': list(np.random.choice(player_ids, size=5, replace=False))
        }
      }))
  # res.append(model.predict({ 'home': {'teamId': '1610612738',
  #         'playerIds': [958,2207,1499,1065,72]}, 'away': {'teamId': '1610612761', 'playerIds': [2306,1541,164,1721,376]}}))
  # res.append(model.predict({ 'home': {'teamId': '1610612761', 'playerIds': [2306,1541,164,1721,376]}, 'away': {'teamId': '1610612738',
  #         'playerIds': [958,2207,1499,1065,72]}}))
  # res.append(model.predict({ 'home': {'teamId': '1610612738', 'playerIds': [965,965,965,965,965]}, 'away': {'teamId': '1610612761',
  #         'playerIds': [72,72,72,72,72]}}))
  # res.append(model.predict({ 'home': {'teamId': '1610612738', 'playerIds': [965,965,965,965,965]}, 'away': {'teamId': '1610612761',
  #         'playerIds': [72,72,72,72,72]}}))
  # res.append(model.predict({ 'home': {'teamId': '1610612748'}, 'away': {'teamId': '1610612738'}}))

  print(res)
  