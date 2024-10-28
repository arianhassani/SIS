from pytorch_forecasting import TimeSeriesDataSet
from pytorch_forecasting.data import GroupNormalizer, NaNLabelEncoder
import pandas as pd
from .preprocess import preprocess

def build_train_dataset(training_df: pd.DataFrame, max_prediction_length: int, max_encoder_length: int) -> TimeSeriesDataSet:
    return TimeSeriesDataSet(
        training_df,
        time_idx='time_idx',
        target='WL',
        group_ids=['TEAM_ID'],
        min_encoder_length=max_encoder_length // 2,
        max_encoder_length=max_encoder_length,
        min_prediction_length=1,
        max_prediction_length=max_prediction_length,
        static_categoricals=['TEAM_ID', 'OPPONENT_ID'],
        time_varying_known_categoricals=[
            # 'is_home', 
                                         'day_of_week',
                                         'PLAYER_1', 'PLAYER_2', 'PLAYER_3', 'PLAYER_4', 'PLAYER_5',
                    'OPPONENT_PLAYER_1', 'OPPONENT_PLAYER_2', 'OPPONENT_PLAYER_3', 'OPPONENT_PLAYER_4', 'OPPONENT_PLAYER_5'
                    ],
        time_varying_known_reals=['time_idx', 
                                  'opponent_WL_rolling_avg', 
                                  'year'
                                  # 'matchup_WL_rolling_avg'
                                  ],
        time_varying_unknown_categoricals=['WL'],
        time_varying_unknown_reals=[
            # "PTS"
            # ,'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A', 'FG3_PCT', 'FTM', 'FTA', 'FT_PCT', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF' ,'PLUS_MINUS'
        ],
        add_relative_time_idx=True,
        add_target_scales=True,
        add_encoder_length=True,
        categorical_encoders={
            'PLAYER_1': NaNLabelEncoder(add_nan=True), 
            'PLAYER_2': NaNLabelEncoder(add_nan=True), 
            'PLAYER_3': NaNLabelEncoder(add_nan=True), 
            'PLAYER_4': NaNLabelEncoder(add_nan=True), 
            'PLAYER_5': NaNLabelEncoder(add_nan=True),
            'OPPONENT_PLAYER_1': NaNLabelEncoder(add_nan=True),
            'OPPONENT_PLAYER_2': NaNLabelEncoder(add_nan=True), 
            'OPPONENT_PLAYER_3': NaNLabelEncoder(add_nan=True), 
            'OPPONENT_PLAYER_4': NaNLabelEncoder(add_nan=True), 
            'OPPONENT_PLAYER_5': NaNLabelEncoder(add_nan=True)
        }
    )
def build_dataset(games_df: pd.DataFrame):
    games_df.info()
    training_cutoff = 82
    max_prediction_length = 1
    max_encoder_length = 10

    training_df = games_df.groupby('TEAM_ID').apply(lambda x: x.iloc[:-training_cutoff]).reset_index(drop=True)

    training = build_train_dataset(training_df, max_prediction_length, max_encoder_length)

    validation = TimeSeriesDataSet.from_dataset(training, games_df, predict=True, stop_randomization=True)

    batch_size = 128  # set this between 32 to 128
    train_dataloader = training.to_dataloader(train=True, batch_size=batch_size, num_workers=2)
    val_dataloader = validation.to_dataloader(train=False, batch_size=batch_size * 10, num_workers=2)

    return training, validation, train_dataloader, val_dataloader

if __name__ == '__main__':
    df = preprocess()
    build_dataset(df)