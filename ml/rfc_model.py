
from sklearn import metrics
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns
# Tree Visualisation
from sklearn.tree import export_graphviz
from IPython.display import Image


# Modelling
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, ConfusionMatrixDisplay
from sklearn.model_selection import RandomizedSearchCV, train_test_split
from scipy.stats import randint

# Tree Visualisation
from sklearn.tree import export_graphviz
from IPython.display import Image

#Player stats
# Get all player stats for each year
from nba_api.stats.static import players, teams
from nba_api.stats.endpoints import playergamelog, playercareerstats, playercareerstats, playergamelogs
from nba_api.stats.static import teams
from nba_api.stats.endpoints import teamgamelogs, leaguegamelog, boxscoreadvancedv2


import numpy as np
import pandas as pd
import os

import joblib
class RandomClassifierPrediction:

    def get_prediction(team_1_id,_team_2_id,team_1_home_flag_init):
        dataset = pd.read_csv('./ml/data/team_dataset_final.csv')
        model = joblib.load('./ml/data/rcf_mod.pkl')

        dataset.sort_values(by='GAME_DATE', inplace=True)

        team_1_name = teams.find_team_name_by_id(team_id=team_1_id)['full_name']
        
        team_2_name = teams.find_team_name_by_id(team_id=_team_2_id)['full_name']

        team_1_home_games= dataset[dataset['home_TEAM_NAME'] == team_1_name]
        team_1_last_home_game_date = team_1_home_games.iloc[[-1]].sort_index()

        team_1_away_games= dataset[dataset['away_TEAM_NAME'] == team_1_name]
        team_1_last_away_game_date = team_1_away_games.iloc[[-1]].sort_index()

        

        if team_1_last_home_game_date['GAME_DATE'].values > team_1_last_away_game_date['GAME_DATE'].values:
            team_1_last_game = pd.DataFrame(team_1_last_home_game_date)
            team_1_home_flag = True

        else:
            team_1_last_game = pd.DataFrame(team_1_last_away_game_date)
            team_1_home_flag = False
        

        

        # compare these two values to find the latest game and extract respective columns

        # do the same for both teams

        team_2_home_games= dataset[dataset['home_TEAM_NAME'] == team_2_name]
        team_2_last_home_game_date = team_2_home_games.iloc[[-1]].sort_index()

        team_2_away_games= dataset[dataset['away_TEAM_NAME'] == team_2_name]
        team_2_last_away_game_date = team_2_away_games.iloc[[-1]].sort_index()


        if team_2_last_home_game_date['GAME_DATE'].values > team_2_last_away_game_date['GAME_DATE'].values:
            team_2_home_flag = True
            team_2_last_game = pd.DataFrame(team_2_last_home_game_date)
        else:
            team_2_home_flag = False
            team_2_last_game = pd.DataFrame(team_2_last_away_game_date)
        
        home_start_letter = 'H_'
        away_start_letter = 'A_'

        if team_1_home_flag:
            # if home drop all away columns
            cols_to_drop = [col for col in team_1_last_game.columns if col.startswith(away_start_letter)]

            # Drop those columns
            team_1_last_game = team_1_last_game.drop(columns=cols_to_drop)
            team_1_last_game.drop(columns=['H_Team_Elo_After'],inplace=True)
            
        else:
            # drop all home columns
        
            cols_to_drop = [col for col in team_1_last_game.columns if col.startswith(home_start_letter)]

            # Drop those columns
            team_1_last_game = team_1_last_game.drop(columns=cols_to_drop)
            team_1_last_game.drop(columns=['A_Team_Elo_After'],inplace=True)
        

        team_1_last_game.drop(columns=['GAME_ID' ,'GAME_DATE' ,'home_TEAM_NAME' , 'away_TEAM_NAME','win_label'], inplace=True)
        team_1_last_game.reset_index(drop=True, inplace=True)
        

        if team_2_home_flag:
            # if home drop all away columns
            cols_to_drop = [col for col in team_2_last_game.columns if col.startswith(away_start_letter)]

            # Drop those columns
            team_2_last_game = team_2_last_game.drop(columns=cols_to_drop)
            team_2_last_game.drop(columns=['H_Team_Elo_After'],inplace=True)
            
        else:
            #drop all home columns
            cols_to_drop = [col for col in team_2_last_game.columns if col.startswith(home_start_letter)]

            # Drop those columns
            team_2_last_game = team_2_last_game.drop(columns=cols_to_drop)
            team_2_last_game.drop(columns=['A_Team_Elo_After'],inplace=True)
        

        team_2_last_game.drop(columns=['GAME_ID' ,'GAME_DATE' ,'home_TEAM_NAME' , 'away_TEAM_NAME','win_label'],inplace=True)
        team_2_last_game.reset_index(drop=True, inplace=True)

        

        #now we decide who is home and who is away

        if team_1_home_flag_init:
            # if team 1 is chosen to be home

            team_1_last_game.columns = [col.replace(away_start_letter, home_start_letter) for col in team_1_last_game.columns]
            team_2_last_game.columns = [col.replace(home_start_letter, away_start_letter) for col in team_1_last_game.columns]

        else:
            # if team 2 is chosen to be home

            team_1_last_game.columns = [col.replace(home_start_letter, away_start_letter) for col in team_1_last_game.columns]
            team_2_last_game.columns = [col.replace(away_start_letter, home_start_letter) for col in team_1_last_game.columns]
        
        

        

        column_order =  ['H_Team_Elo_Before', 'A_Team_Elo_Before' , 'H_Last_10_Avg_MIN', 
        'H_Last_10_Avg_FGM'  ,'H_Last_10_Avg_FGA' , 'H_Last_10_Avg_FG_PCT' , 'H_Last_10_Avg_FG3M' , 
        'H_Last_10_Avg_FG3A'  ,'H_Last_10_Avg_FG3_PCT' , 'H_Last_10_Avg_FTM'  ,'H_Last_10_Avg_FTA'  ,'H_Last_10_Avg_FT_PCT' ,
        'H_Last_10_Avg_OREB' , 'H_Last_10_Avg_DREB' , 'H_Last_10_Avg_REB' , 'H_Last_10_Avg_AST' , 'H_Last_10_Avg_STL' , 'H_Last_10_Avg_BLK' ,
        'H_Last_10_Avg_TOV' , 'H_Last_10_Avg_PF' , 'H_Last_10_Avg_PTS',  'H_Last_10_Avg_PLUS_MINUS' , 'A_Last_10_Avg_MIN',  'A_Last_10_Avg_FGM', 
        'A_Last_10_Avg_FGA' , 'A_Last_10_Avg_FG_PCT'  ,'A_Last_10_Avg_FG3M',  'A_Last_10_Avg_FG3A' , 'A_Last_10_Avg_FG3_PCT' , 'A_Last_10_Avg_FTM' , 
        'A_Last_10_Avg_FTA', 'A_Last_10_Avg_FT_PCT',  'A_Last_10_Avg_OREB'  ,'A_Last_10_Avg_DREB' , 'A_Last_10_Avg_REB' , 'A_Last_10_Avg_AST' , 'A_Last_10_Avg_STL', 
        'A_Last_10_Avg_BLK' , 'A_Last_10_Avg_TOV'  ,'A_Last_10_Avg_PF' , 'A_Last_10_Avg_PTS'  ,'A_Last_10_Avg_PLUS_MINUS']
        
        result = pd.concat([team_1_last_game, team_2_last_game], axis=1, join='outer')
        result = result.reindex(columns=column_order)

        # predict_result = model.predict(result)
        predict_proba = model.predict_proba(result)
        # print(predict_result, predict_proba)

        # if predict result = 1, then home team wins
        home_team_win_result = False
        predict_prob = predict_proba[0][0]

        # if predict_result[0] == 1:
        #     home_team_win_result = True
        #     predict_prob = predict_proba[0][1]
        
        #probability of home team wins
        return predict_prob[1]
    

    #lazy way of doing it haha
    def process_request(data):
        team_id_1 = data['home']['teamId']
        team_id_2 = data['away']['teamId']
        team_1_home_flag = True

        return RandomClassifierPrediction.get_prediction(team_id_1,team_id_2, team_1_home_flag)

