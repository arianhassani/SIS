import pandas as pd
import yaml
import os
import typing as tp

with open(os.path.join(__package__, "config.yaml"),"r") as file_object:
    config=yaml.load(file_object, Loader=yaml.SafeLoader)
assert config

def _read_games() -> pd.DataFrame:
    
    data_dir = os.path.join(__package__, config['data_dir'])
    games_csv = os.path.join(data_dir, 'games.csv')
    games_df = pd.read_csv(games_csv)

    return games_df

def preprocess(start: int = None, end: int = None) -> pd.DataFrame:
    # win streak
    
    games_df: pd.DataFrame = _read_games()

    if start:
        start = start % 100
        condition = games_df['SEASON_ID'].mod(100) >= start
        if end:
            end = end % 100
            condition &= games_df['SEASON_ID'].mod(100) <= end

        games_df = games_df[condition]

    games_df['GAME_DATE'] = pd.to_datetime(games_df['GAME_DATE'])
    games_df['WL'] = games_df['WL'].replace({'W': '1', 'L': '0'}).astype('category')
    games_df['TEAM_ID'] = games_df['TEAM_ID'].astype(str).astype('category')

    games_df['is_home'] = (~games_df['MATCHUP'].str.contains('@')).astype(int).astype(str).astype('category')
    games_df['SEASON_ID'] = games_df['SEASON_ID'].astype(str).astype('category')

    def assign_opponent(group):
        group['OPPONENT_ID'] = group['TEAM_ID'].iloc[::-1].values
            
        return group

    games_df = games_df.groupby('GAME_ID').apply(assign_opponent).reset_index(drop=True)

    print((games_df['is_home'].astype(int) == games_df['WL'].astype(int)).sum() / len(games_df))

    # games_df = games_df.sort_values(['TEAM_ID', 'SEASON_ID', 'GAME_DATE'])

    games_df['time_idx']  = games_df.groupby(['TEAM_ID', 'SEASON_ID']).cumcount()

    games_df['day_of_week'] = games_df['GAME_DATE'].dt.day_of_week.astype(str).astype('category')

    games_df = games_df.drop(columns=['TEAM_ABBREVIATION', 'TEAM_NAME',\
                            'MATCHUP', 'VIDEO_AVAILABLE'], errors='ignore')
    games_df = games_df.dropna()

    
    return games_df


if __name__ == '__main__':
    preprocess(2022)


