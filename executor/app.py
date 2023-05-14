import os
import yaml
import time
import requests
import argparse
from flask import Flask, request
from flask_cors import CORS, cross_origin
from data import create_dataloader, TinyImagenet, ServerDataset
from service import ic
from utils.format import format_response


def get_parser():
  parser = argparse.ArgumentParser()
  parser.add_argument('--config', type=str, default='configs.yml', help='Path to config file')
  return parser


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# API
@app.route('/audit', methods=['POST'])
def audit():
  start = time.time()
  
  # Get task type
  api = request.form['api']
  address = request.form['address']
  model_name = request.form['model_name']
  task = request.form['task']
  dataset_name = request.form['dataset_name']
  
  # Create data generator
  
  dataset = ServerDataset(
    str(address),
    task,
    dataset_name,
    configs
  )
  
  dataloader = create_dataloader(
    dataset,
    configs['dataset']['batch_size'],
    configs['dataset']['shuffle']
  )
  
  report = ic.calculate_metrics(api, dataloader)
  
  # TODO: Send report to Aggregator
  response = requests.post(
    'http://{}:{}/api/contract'.format(
      configs['forward']['host'],
      configs['forward']['port']
    ),
    data={
      "verifier": address,
      "id": model_name,
      "request_type": "image",
      "report": {
        "image_classification": {
          "accuracy": int(report['accuracy'] * 10 ** configs['forward']['exp']),
          "f1_score": int(report['f1'] * 10 ** configs['forward']['exp']),
          "precision": int(report['precision'] * 10 ** configs['forward']['exp']),
          "recall": int(report['recall'] * 10 ** configs['forward']['exp'])
        }
      },
      "info": {
        "api": api,
        "hearbeat": "hearbeat",
        "task": task,
        "model_name": model_name
      }
    }
  )
  
  print('Response: ', str(response.content))
  
  return format_response(
    'success',
    'Operation success!',
    None,
    time.time() - start
  )
  
  
if __name__ == '__main__':
  # Parse args
  parser = get_parser()
  args = parser.parse_args()
  
  # Load config
  with open(args.config, 'r') as f:
    configs = yaml.load(f, yaml.FullLoader)

  os.makedirs(configs['save'], exist_ok=True)

  # Run flask app
  app.run(
    host=configs['app']['host'],
    port=configs['app']['port'],
    threaded=configs['app']['threaded']
  )