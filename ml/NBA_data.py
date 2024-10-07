from typing import List
from nba_api.stats.endpoints import leaguegamelog
from nba_api.stats.static import players, teams
from csv import DictWriter
import time
import os
import logging
import yaml
from functools import cache
import pandas as pd
from tqdm import trange

logger = logging.getLogger(__name__)

with open("config.yaml","r") as file_object:
  config=yaml.load(file_object, Loader=yaml.SafeLoader)

def _get_all_games(start_year=1946, end_year=2023) -> List[pd.DataFrame]:
  results = []
  for year in trange(start_year, end_year):
    season = '{}-{}'.format(year, str(year + 1)[-2:])
    res = leaguegamelog.LeagueGameLog(counter=10000, season=season)
    res_frame = res.get_data_frames()[0]
    results.append(res_frame)
    time.sleep(1)
  return results

def download_games() -> None:
  games_path = os.path.join(config['data_dir'], 'games.csv')
  if os.path.exists(games_path):
    logger.info(f'{games_path} already exists. Download skipped.')
    return
  logger.info('Downloading games...')
  seasons_df = pd.concat(_get_all_games(2000, 2023))
  seasons_df.to_csv(games_path, index=False)

def download_players():
  players_path = os.path.join(config['data_dir'], 'players.csv')
  if os.path.exists(players_path):
    logger.info(f'{players_path} already exists. Download Skipped.')
    return
  logger.info('Downloading players...')
  player_list = players.get_players()
  player_list = [{'idx': i, **p} for i, p in enumerate(player_list)]
  with open(players_path, 'w') as players_file:
    fieldnames = list(player_list[0].keys())
    writer = DictWriter(players_file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(player_list)

def download_teams():
  teams_path = os.path.join(config['data_dir'], 'teams.csv')
  if os.path.exists(teams_path):
    logger.info(f'{teams_path} already exists. Download Skipped.')
    return
  logger.info('Downloading teams...')
  teams_list = teams.get_teams()
  teams_list = [{'idx': i, **p} for i, p in enumerate(teams_list)]
  with open(teams_path, 'w') as teams_file:
    fieldnames = list(teams_list[0].keys())
    writer = DictWriter(teams_file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(teams_list)


def download_player_games():
  pass



  
  



