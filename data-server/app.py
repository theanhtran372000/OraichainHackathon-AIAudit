import os
import yaml
import time
import json
import argparse
from datetime import datetime
from loguru import logger
from pathlib import Path
from flask_cors import CORS, cross_origin
from flask import Flask, request, send_file
from zipfile import ZipFile

from utils.format import format_response
from loaders import ICDataset

def get_parser():
  parser = argparse.ArgumentParser()
  
  parser.add_argument('--config', type=str, default='configs.yml', help='Path to config file')
  
  return parser

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/upload-dataset', methods=['POST'])
def upload_dataset():
  start = time.time()
  
  # Get request info
  data = request.form
  if 'user' not in data \
    or 'dataset' not in data \
    or 'task' not in data \
    or 'zipfile' not in request.files:
      
    logger.error('Data not found!')
    return format_response(
      'error',
      'Keyword not found!',
      None,
      time.time() - start
    )
    
  user = data['user']
  task = data['task']
  dataset = data['dataset'] # Name
  _file = request.files['zipfile']
  logger.info('User {} upload an {} dataset named {}'.format(user, task, dataset))
  
  Path(os.path.join(configs['storage']['dir'], user, task)).mkdir(parents=True, exist_ok=True)
  if dataset in os.listdir(os.path.join(configs['storage']['dir'], user, task)):
    logger.error('Name {} existed!'.format(dataset))
    return format_response(
      'error',
      'Name {} existed!'.format(dataset),
      None,
      time.time() - start
    )
  
  dest_dir = os.path.join(configs['storage']['dir'], user, task, dataset)
  Path(dest_dir).mkdir(parents=True, exist_ok=True)
  
  # Save zip file
  zippath = os.path.join(dest_dir, 'data.zip')
  _file.save(zippath)
  logger.info('Zipfile save to {}'.format(zippath))
  
  # Unzip
  old_name = _file.filename.split('.')[0]
  with ZipFile(zippath, 'r') as zipobj:
    Path(dest_dir).mkdir(parents=True, exist_ok=True)
    zipobj.extractall(dest_dir)
    
  # rename
  datadir = os.path.join(dest_dir, 'data')
  os.rename(os.path.join(dest_dir, old_name), datadir)
    
  logger.success('All data save to {}'.format(datadir))
  
  dataset_info = {
    'time': datetime.now().strftime("%Y-%m-%d"),
    'owner': user,
    'task': task
  }

  with open(os.path.join(dest_dir, 'info.json'), 'w') as f:
    json.dump(dataset_info, f)
    
  logger.success('Data info save to {}'.format(os.path.join(dest_dir, 'info.json')))
  
  return format_response(
    'success',
    'Operation success!',
    None,
    time.time() - start
  )

@app.route('/get-dataset-list', methods=['POST'])
def get_dataset_list():
  start = time.time()
  
  # Get request info
  data = request.form
  if 'user' not in data \
    or 'task' not in data:
    logger.error('Data not found!')
    return format_response(
      'error',
      'Keyword not found!',
      None,
      time.time() - start
    )
    
  user = data['user']
  task = data['task']
  
  user_dir = os.path.join(configs['storage']['dir'], user, task)
  Path(user_dir).mkdir(parents=True, exist_ok=True)
  
  list_dataset = os.listdir(user_dir)
  logger.success('Get list dataset success!')
  
  return format_response(
    'success',
    'Operation success!',
    list_dataset,
    time.time() - start
  )
  
@app.route('/get-an-image', methods=['POST'])
def get_an_image():
  start = time.time()
  
  # Get request info
  data = request.form
  if ('user' not in data or 'task' not in data) or ('dataset' not in data or 'index' not in data):
    logger.error('Keyword not found!')
    return format_response(
      'error',
      'Data not found!',
      None,
      time.time() - start
    )
    
  user = data['user']
  task = data['task']
  dataset = data['dataset']
  index = int(data['index'])
  
  if task not in configs['task']['supported']:
    logger.error('Task {} not supported!'.format(task))
    return format_response(
      'error',
      'Task {} not supported!'.format(task),
      None,
      time.time() - start
    )
  
  datapath = os.path.join(configs['storage']['dir'], user, task, dataset, 'data')
  if not os.path.exists(datapath):
    logger.error('Dataset not existed!')
    return format_response(
      'error',
      'Dataset not existed!',
      None,
      time.time() - start
    )
  
  if task == 'ic':
    dataset = ICDataset(datapath)
    imagepath, _ = dataset[index]
    return send_file(imagepath)
  
  
@app.route('/get-a-label', methods=['POST'])
def get_a_label():
  start = time.time()
  
  # Get request info
  data = request.form
  if ('user' not in data or 'task' not in data) or ('dataset' not in data or 'index' not in data):
    logger.error('Keyword not found!')
    return format_response(
      'error',
      'Data not found!',
      None,
      time.time() - start
    )
    
  user = data['user']
  task = data['task']
  dataset = data['dataset']
  index = int(data['index'])
  
  if task not in configs['task']['supported']:
    logger.error('Task {} not supported!'.format(task))
    return format_response(
      'error',
      'Task {} not supported!'.format(task),
      None,
      time.time() - start
    )
  
  datapath = os.path.join(configs['storage']['dir'], user, task, dataset, 'data')
  if not os.path.exists(datapath):
    logger.error('Dataset not existed!')
    return format_response(
      'error',
      'Dataset not existed!',
      None,
      time.time() - start
    )
    
  if task == 'ic':
    dataset = ICDataset(datapath)
    _, label = dataset[index]
    return format_response(
      'success',
      'Operation success!',
      label,
      time.time() - start
    )
    
@app.route('/get-dataset-info', methods=['POST'])
def get_dataset_info():
  start = time.time()
  
  # Get request info
  data = request.form
  if ('user' not in data or 'task' not in data) or 'dataset' not in data:
    logger.error('Keyword not found!')
    return format_response(
      'error',
      'Data not found!',
      None,
      time.time() - start
    )
    
  user = data['user']
  task = data['task']
  dataset = data['dataset']
  
  if task not in configs['task']['supported']:
    logger.error('Task {} not supported!'.format(task))
    return format_response(
      'error',
      'Task {} not supported!'.format(task),
      None,
      time.time() - start
    )
  
  datadir = os.path.join(configs['storage']['dir'], user, task, dataset)
  datapath = os.path.join(datadir, 'data')
  if not os.path.exists(datapath):
    logger.error('Dataset not existed!')
    return format_response(
      'error',
      'Dataset not existed!',
      None,
      time.time() - start
    )
    
  with open(os.path.join(datadir, 'info.json')) as f:
    info = json.load(f)
    
  if task == 'ic':
    dataset = ICDataset(datapath)
    info['len'] = len(dataset)
    
    return info

  else:
    logger.error('Task {} not supported!'.format(task))
    return format_response(
      'error',
      'Task {} not supported!'.format(task),
      None,
      time.time() - start
    )

if __name__ == '__main__':
  parser = get_parser()
  args = parser.parse_args()
  
  # Load configs
  with open (args.config, 'r') as f:
    configs = yaml.load(f, yaml.FullLoader)
  
  # Create dir
  Path(configs['storage']['dir']).mkdir(parents=True, exist_ok=True)
  
  # Run server
  app.run(
    host=configs['app']['host'],
    port=configs['app']['port'],
    threaded=configs['app']['threaded']
  )