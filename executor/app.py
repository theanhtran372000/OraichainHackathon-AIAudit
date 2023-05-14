import yaml
import argparse
from flask import Flask, request
from data import create_dataloader, TinyImagenet
from service import ic


def get_parser():
  parser = argparse.ArgumentParser()
  parser.add_argument('--config', type=str, default='configs.yml', help='Path to config file')
  return parser


app = Flask(__name__)


# API
@app.route('/audit', methods=['POST'])
def audit():
  
  # Get task type
  api = request.form['api']
  task = request.form['task']
  
  # Recieve Eueno data
  # TODO: ....
  # Fake dataset
  
  # Create data generator
  dataloader = create_dataloader(
    dataset,
    configs['dataset']['batch_size'],
    configs['dataset']['shuffle']
  )
  
  report = ic.calculate_metrics(api, dataloader)
  
  # TODO: Send report to Aggregator
  
  return report
  
  
if __name__ == '__main__':
  # Parse args
  parser = get_parser()
  args = parser.parse_args()
  
  # Load config
  with open(args.config, 'r') as f:
    configs = yaml.load(f, yaml.FullLoader)

  # Create dataset
  dataset = TinyImagenet(configs['dataset']['dir'])

  # Run flask app
  app.run(
    host=configs['app']['host'],
    port=configs['app']['port'],
    threaded=configs['app']['threaded']
  )