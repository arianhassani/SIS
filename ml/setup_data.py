import logging
import yaml
from .NBA_data import NBA_data
import os

logger = logging.getLogger(__name__)
base_dir = __package__

def setup_data():
		
		with open(os.path.join(base_dir, "config.yaml"),"r") as file_object:
				config=yaml.load(file_object, Loader=yaml.SafeLoader)
		assert config
		config['base_dir'] = base_dir
		config.log_dir = os.path.join(base_dir, config['log_dir'] or 'logs')
		config.data_dir = os.path.join(base_dir, config['data_dir'] or 'data')
		
		if not os.path.exists(os.path.join(base_dir, 'logs')):
			os.mkdir(os.path.join(base_dir, 'logs'))
		logging.basicConfig(level=config['logging_level'], format='%(asctime)s [%(levelname)s] - %(module)s: %(message)s', handlers=[
																logging.StreamHandler(), 
																logging.FileHandler(os.path.join(base_dir, 'logs/games_download.log'), mode='w')])
		NBA_data.download_games()
		NBA_data.download_players()
		NBA_data.download_teams()
		NBA_data.download_player_games()


if __name__ == '__main__':
		setup_data()