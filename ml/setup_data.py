import logging
import yaml
from .NBA_data import NBA_data
import os

logger = logging.getLogger(__name__)
base_dir = __package__

def make_config_dir(config, key, default):
	dir = os.path.join(config['base_dir'], default)
	if key in config:
		dir = os.path.join(base_dir, config[key])
	config[key] = dir
	if not os.path.exists(config[key]):
		os.mkdir(config[key])
	
def setup_data():
		print(base_dir)
		with open(os.path.join(base_dir, "config.yaml"),"r") as file_object:
			config=yaml.load(file_object, Loader=yaml.SafeLoader)
		assert config
		config['base_dir'] = base_dir
		make_config_dir(config, 'log_dir', 'logs')
		make_config_dir(config, 'data_dir', 'data')
		make_config_dir(config, 'lightning_log_dir', 'lightning_logs')
		
		logging.basicConfig(level=config['logging_level'], format='%(asctime)s [%(levelname)s] - %(module)s: %(message)s', handlers=[
																logging.StreamHandler(), 
																logging.FileHandler(os.path.join(config['log_dir'], 'games_download.log'), mode='w')])
		logger.info('Starting downloads...')
		nba_data = NBA_data(config)
		nba_data.download_games()
		nba_data.download_players()
		nba_data.download_teams()
		nba_data.download_player_games()
		return config


if __name__ == '__main__':
		setup_data()