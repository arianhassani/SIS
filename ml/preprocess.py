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

def preprocess(start: int=None, end: int=None, win_len=5, **kwargs) -> pd.DataFrame:
    # win streak
    
    games_df: pd.DataFrame = _read_games()

    if start:
        start = start % 100
        condition = games_df['SEASON_ID'].mod(100) >= start
        if end:
            end = end % 100
            condition &= games_df['SEASON_ID'].mod(100) <= end

        games_df = games_df[condition]

    games_df = games_df.dropna()

    # games_df = games_df.groupby(['SEASON_ID', 'TEAM_ID']).apply(lambda x: x.iloc[:-40])

    
    games_df['GAME_DATE'] = pd.to_datetime(games_df['GAME_DATE'])
    games_df['WL'] = games_df['WL'].replace({'W': '1', 'L': '0'}).astype('category')
    games_df['TEAM_ID'] = games_df['TEAM_ID'].astype(str).astype('category')

    games_df['is_home'] = (~games_df['MATCHUP'].str.contains('@')).astype(int).astype(str).astype('category')
    games_df['SEASON_ID'] = games_df['SEASON_ID'].astype(str).astype('category')
    games_df['year'] = games_df['GAME_DATE'].dt.year
    games_df['month'] = games_df['GAME_DATE'].dt.month

    def assign_opponent(group):
        group['OPPONENT_ID'] = group['TEAM_ID'].iloc[::-1].values
            
        return group

    games_df = games_df.groupby('GAME_ID').apply(assign_opponent).reset_index(drop=True)

    games_df['WL_int'] = games_df['WL'].astype(int)
    def rolling_fn(group: pd.DataFrame):
        return group.shift(1).rolling(win_len, min_periods=0).mean()
    
    games_df['opponent_WL_rolling_avg'] = games_df.sort_values('GAME_DATE').groupby(['OPPONENT_ID'])['WL_int'].apply(rolling_fn).reset_index(level=[0], drop=True)
                                                                                                                                             
    games_df['matchup_WL_rolling_avg'] = games_df.sort_values('GAME_DATE').groupby(['TEAM_ID', 'OPPONENT_ID'])['WL_int'].apply(rolling_fn).reset_index(level=[0, 1], drop=True)

    games_df['opponent_WL_rolling_avg'] = games_df['opponent_WL_rolling_avg'].fillna(0.5)
    games_df['matchup_WL_rolling_avg'] = games_df['matchup_WL_rolling_avg'].fillna(0.5)

    # games_df['time_idx']  = games_df.groupby(['TEAM_ID', 'SEASON_ID']).cumcount()

    # games_df = games_df.groupby('GAME_ID').first()

    # games_df['time_idx']  = games_df.groupby(['SEASON_ID', 'TEAM_ID']).cumcount()
    games_df['time_idx']  = games_df.groupby(['TEAM_ID']).cumcount()

    games_df['day_of_week'] = games_df['GAME_DATE'].dt.day_of_week.astype(str).astype('category')

    games_df = games_df.drop(columns=['TEAM_ABBREVIATION', 'TEAM_NAME',\
                            'MATCHUP', 'VIDEO_AVAILABLE',\
                                "PTS",'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A',\
                                'FG3_PCT', 'FTM', 'FTA', 'FT_PCT', 'OREB', 'MIN',\
                                'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF','PLUS_MINUS',\
                                'SEASON_ID'
                                    ], errors='ignore')
    # games_df['PTS'] = games_df['PTS'].astype(float)
    # create rolling avg of n games
    # .mean() of last n games
    
    # games_df['opponent_WL_rolling_avg'] = games_df.sort_values('GAME_DATE').groupby(['TEAM_ID', 'SEASON_ID'])['WL'].rolling(win_len, min_periods=1).mean()
    
    # games_df[columns_to_convert] = games_df[columns_to_convert].astype(float)
    # games_df['PLUS_MINUS'].sample(10)
    games_df.info()
    # print(games_df.groupby(['TEAM_ID', 'SEASON_ID']).count())
    # print(games_df.groupby(['TEAM_ID', 'SEASON_ID']).size().min())
    return games_df


if __name__ == '__main__':
    preprocess(2022)


