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

def get_players() -> pd.DataFrame:
    data_dir = os.path.join(__package__, config['data_dir'])
    player_games_csv = os.path.join(data_dir, 'player_games.csv')
    player_games_df = pd.read_csv(player_games_csv)

    return player_games_df

def add_opponent_player_ids(games_df: pd.DataFrame):
    opponent_df = games_df.copy()
    opponent_df = opponent_df.sort_values(['GAME_ID', 'TEAM_ID'], ascending=[True, False]).reset_index(drop=True)
    opponent_df = opponent_df.rename(columns={
        'PLAYER_1': 'OPPONENT_PLAYER_1',
        'PLAYER_2': 'OPPONENT_PLAYER_2',
        'PLAYER_3': 'OPPONENT_PLAYER_3',
        'PLAYER_4': 'OPPONENT_PLAYER_4',
        'PLAYER_5': 'OPPONENT_PLAYER_5'
    })

    # small_df = games_df[games_df['GAME_ID'] == '22301198']
    # print(small_df[['TEAM_ID', 'OPPONENT_ID']])
    games_df = games_df.merge(
        opponent_df[['GAME_ID', 'TEAM_ID', 'OPPONENT_PLAYER_1', 'OPPONENT_PLAYER_2', 'OPPONENT_PLAYER_3', 'OPPONENT_PLAYER_4', 'OPPONENT_PLAYER_5']],
        left_on=['GAME_ID', 'OPPONENT_ID'], 
        right_on=['GAME_ID', 'TEAM_ID'], 
        how='left'
    )

    games_df.drop(columns=['TEAM_ID_y'], inplace=True)
    games_df.rename(columns={'TEAM_ID_x': 'TEAM_ID'}, inplace=True)

    # print(games_df[['PLAYER_1', 'PLAYER_2', 'OPPONENT_PLAYER_1', 'OPPONENT_PLAYER_2']])
    return games_df

    
def add_player_ids(games_df: pd.DataFrame, player_games_df: pd.DataFrame) -> pd.DataFrame:

    player_games_df.info()

    player_games_df['TEAM_ID'] = player_games_df['TEAM_ID'].astype(str).astype('category')
    player_games_df['GAME_ID'] = player_games_df['GAME_ID'].astype(str).astype('category')
    player_games_df['PLAYER_ID'] = player_games_df['PLAYER_ID'].astype(str).astype('category')
    player_games_df[['MINUTES', 'SECONDS']] = player_games_df['MIN_SEC'].str.split(':', expand=True)
    player_games_df['MINUTES'] = player_games_df['MINUTES'].astype(int)
    player_games_df['SECONDS'] = player_games_df['SECONDS'].astype(int)
    player_games_df = player_games_df.sort_values(['GAME_ID', 'TEAM_ID', 'MINUTES', 'SECONDS'], ascending=[True, True, False, False])

    top_5_players_df = player_games_df.groupby(['GAME_ID', 'TEAM_ID']).head(5)

    top_5_players_df.loc[:, 'PLAYER_RANK'] = top_5_players_df.groupby(['GAME_ID', 'TEAM_ID']).cumcount() + 1

    pivot_df = top_5_players_df.pivot_table(index=['GAME_ID', 'TEAM_ID'], 
                                        columns='PLAYER_RANK', 
                                        values='PLAYER_ID', aggfunc='first').reset_index()
    
    pivot_df.columns = ['GAME_ID', 'TEAM_ID', 'PLAYER_1', 'PLAYER_2', 'PLAYER_3', 'PLAYER_4', 'PLAYER_5']
    games_df = pd.merge(games_df, pivot_df, on=['GAME_ID', 'TEAM_ID'], how='left')
    # print(games_df[(games_df['GAME_ID'] == '22301198') & (games_df['TEAM_ID'] == '1610612744')])
    # print(top_5_players_df[(top_5_players_df['GAME_ID'] == '22301198') & (top_5_players_df['TEAM_ID'] == '1610612744')])

    # def assign_opponent_players(group):
    #     reversed_group = group.iloc[::-1].reset_index(drop=True)

    #     for i in range(1, 6):
    #         group[f'OPPONENT_PLAYER_{i}'] = reversed_group[f'PLAYER_{i}'].values

    #     return group

    #     # ['PLAYER_1', 'PLAYER_2', 'PLAYER_3', 'PLAYER_4', 'PLAYER_5']
    # games_df.groupby('GAME_ID').apply(assign_opponent_players).reset_index(drop=True)

    games_df = add_opponent_player_ids(games_df)
    games_df.info()
    print(games_df[['GAME_ID', 'TEAM_ID', 'TEAM_NAME', \
                    'PLAYER_1', 'PLAYER_2', 'PLAYER_3', 'PLAYER_4', 'PLAYER_5',\
                    'OPPONENT_PLAYER_1', 'OPPONENT_PLAYER_2', 'OPPONENT_PLAYER_3', 'OPPONENT_PLAYER_4', 'OPPONENT_PLAYER_5']].tail(5))
    return games_df

def preprocess(start: int=None, end: int=None, win_len=5, **kwargs) -> pd.DataFrame:
    # win streak
    
    games_df: pd.DataFrame = _read_games()
    player_games_df: pd.DataFrame = get_players()
    player_games_df = player_games_df.dropna(subset=['MIN_SEC'])

    # if start:
    #     start = start % 100
    #     condition = games_df['SEASON_ID'].mod(100) >= start
    #     # player_condition = player_games_df['SEASON_ID'].mod(100) >= start
    #     if end:
    #         end = end % 100
    #         condition &= games_df['SEASON_ID'].mod(100) <= end
    #         # player_condition = player_games_df['SEASON_ID'].mod(100) >= start

    #     games_df = games_df[condition]
    #     # player_games_df = player_games_df[player_condition]

    games_df = games_df.dropna()

    # games_df = games_df.groupby(['SEASON_ID', 'TEAM_ID']).apply(lambda x: x.iloc[:-40])

    
    
    games_df['GAME_DATE'] = pd.to_datetime(games_df['GAME_DATE'])
    # games_df = games_df.sort_values('GAME_DATE')
    games_df['WL'] = games_df['WL'].replace({'W': '1', 'L': '0'}).astype('category')
    games_df['TEAM_ID'] = games_df['TEAM_ID'].astype(str).astype('category')
    games_df['GAME_ID'] = games_df['GAME_ID'].astype(str).astype('category')

    games_df['is_home'] = (~games_df['MATCHUP'].str.contains('@')).astype(int).astype(str).astype('category')
    games_df['SEASON_ID'] = games_df['SEASON_ID'].astype(str).astype('category')
    games_df['year'] = games_df['GAME_DATE'].dt.year

    

    # def assign_opponent(group):
    #     group['OPPONENT_ID'] = group['TEAM_ID'].iloc[::-1].values
            
    #     return group

    # games_df = games_df.groupby('GAME_ID').apply(assign_opponent).reset_index(drop=True)

    # games_df.info()

    # print(games_df['OPPONENT_ID'].tail(5))

    # sampled_game_ids = games_df['GAME_ID'].sample(5)

    # sampled_games_df = games_df[games_df['GAME_ID'].isin(sampled_game_ids)]
    # print(sampled_games_df)

    # games_df.drop(columns='OPPONENT_ID')

    games_df = games_df.sort_values(['GAME_ID', 'TEAM_ID'])
    games_df['OPPONENT_ID'] = games_df.groupby('GAME_ID')['TEAM_ID'].transform(lambda x: x.iloc[::-1].values)
    games_df.reset_index(drop=True, inplace=True)

    # games_df['OPPONENT_ID'] = games_df.groupby('GAME_ID')['TEAM_ID'].shift(-1)

    # games_df['OPPONENT_ID'] = games_df['OPPONENT_ID'].fillna(games_df.groupby('GAME_ID')['TEAM_ID'].shift(1))

    games_df = add_player_ids(games_df, player_games_df)

    

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
    games_df = games_df.dropna()
    games_df = games_df.sort_values('GAME_DATE')
    games_df['time_idx']  = games_df.groupby(['TEAM_ID']).cumcount()

    games_df['day_of_week'] = games_df['GAME_DATE'].dt.day_of_week.astype(str).astype('category')

    games_df = games_df.drop(columns=['TEAM_ABBREVIATION', 'TEAM_NAME',\
                            'MATCHUP', 'VIDEO_AVAILABLE',\
                                # "PTS",'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A',\
                                # 'FG3_PCT', 'FTM', 'FTA', 'FT_PCT', 'OREB', 'MIN',\
                                # 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF','PLUS_MINUS',\
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
    preprocess(1996)


