import pandas as pd
import yaml
import os

with open(os.path.join(__package__, "config.yaml"),"r") as file_object:
    config=yaml.load(file_object, Loader=yaml.SafeLoader)
assert config

def _read_games() -> pd.DataFrame:
    
    data_dir = os.path.join(__package__, config['data_dir'])
    games_csv = os.path.join(data_dir, 'games.csv')
    games_df = pd.read_csv(games_csv)

    return games_df

def preprocess() -> pd.DataFrame:
    # preprocessed_path = os.path.join(config['data_dir'], 'preprocessed.csv')
    # games_df.to_csv(preprocessed_path, index=False)
    # games_df = pd.read_csv(preprocessed_path)

    games_df: pd.DataFrame = _read_games()
    
    games_df['GAME_DATE'] = pd.to_datetime(games_df['GAME_DATE'])
    games_df['WL'] = games_df['WL'].astype('category')
    games_df['TEAM_ID'] = games_df['TEAM_ID'].astype(str).astype('category')

    games_df = games_df.sort_values(['TEAM_ID', 'SEASON_ID', 'GAME_DATE'])

    games_df['time_idx']  = games_df.groupby(['TEAM_ID', 'SEASON_ID']).cumcount()

    games_df['day_of_week'] = games_df['GAME_DATE'].dt.day_of_week

    games_df = games_df.drop(columns=['TEAM_ABBREVIATION', 'TEAM_NAME',\
                            'MATCHUP', 'VIDEO_AVAILABLE'], errors='ignore')
    games_df = games_df.dropna()
    games_df.info()
    
    return games_df


if __name__ == '__main__':
    preprocess()


