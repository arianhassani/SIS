import logging
import yaml
from NBA_data import *

logger = logging.getLogger(__name__)

def setup_data():
		
		with open("config.yaml","r") as file_object:
				config=yaml.load(file_object, Loader=yaml.SafeLoader)
		assert config
		logging.basicConfig(level=config['logging_level'], format='%(asctime)s [%(levelname)s] - %(module)s: %(message)s', handlers=[
																logging.StreamHandler(), 
																logging.FileHandler('logs/games_download.log', mode='w')])
		download_games()
		download_players()
		download_teams()
		download_player_games()


if __name__ == '__main__':
		setup_data()