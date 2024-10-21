from pytorch_forecasting import Baseline, TemporalFusionTransformer, TimeSeriesDataSet

def setup(best_model_path, **args):
  best_tft = TemporalFusionTransformer.load_from_checkpoint(best_model_path)

def predict():
  pass
  
  