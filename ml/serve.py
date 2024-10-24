from flask import Flask
from flask import request, make_response
from .setup_data import setup_data
from .predict import NBA_Pred_Model

app = Flask(__name__)

config = setup_data(start_year=2023, end_year=2024)
tft = NBA_Pred_Model(**config)

@app.post('/predict')
def predict():
    data = request.get_json()
    return make_response({
        "tft": tft.predict(data)
        })