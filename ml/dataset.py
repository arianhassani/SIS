from pytorch_forecasting import TimeSeriesDataSet
from pytorch_forecasting.data import GroupNormalizer
import pandas as pd
from .preprocess import preprocess

def build_train_dataset(games_df: pd.DataFrame, training_cutoff: int, max_prediction_length: int, max_encoder_length: int) -> TimeSeriesDataSet:
    return TimeSeriesDataSet(
        games_df[lambda x: x.time_idx < training_cutoff],
        time_idx='time_idx',
        target='WL',
        group_ids=['SEASON_ID', 'TEAM_ID'],
        min_encoder_length=max_encoder_length // 2,
        max_encoder_length=max_encoder_length,
        min_prediction_length=1,
        max_prediction_length=max_prediction_length,
        static_categoricals=['TEAM_ID', 'SEASON_ID', 'OPPONENT_ID'],
        time_varying_known_categoricals=['is_home', 'day_of_week'],
        time_varying_known_reals=['time_idx', 
                                  'opponent_WL_rolling_avg', 
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
    )
def build_dataset(games_df: pd.DataFrame):
    games_df.info()
    training_cutoff = 60
    max_prediction_length = 1
    max_encoder_length = 10

    # alternative is to group by season and encode team_id

    training = build_train_dataset(games_df, training_cutoff, max_prediction_length, max_encoder_length)

    validation = TimeSeriesDataSet.from_dataset(training, games_df, predict=True, stop_randomization=True)

    batch_size = 128  # set this between 32 to 128
    train_dataloader = training.to_dataloader(train=True, batch_size=batch_size, num_workers=2)
    val_dataloader = validation.to_dataloader(train=False, batch_size=batch_size * 10, num_workers=2)

    return training, validation, train_dataloader, val_dataloader

if __name__ == '__main__':
    df = preprocess()
    build_dataset(df)