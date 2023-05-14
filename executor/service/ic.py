import requests
import time
import json
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import numpy as np

def calculate_metrics(api, dataloader):
  
  labels = []
  predicts = []
  model_time = []
  network_time = []
  success = 0
  n_samples = len(dataloader)
  
  for i, (imagepath, label) in enumerate(dataloader):
    
    imagepath = imagepath[0]
    label = label[0]
    
    print('[{}/{}] Running ...'.format(i + 1, n_samples))
    
    start = time.time()
    response = requests.post(
      api,
      files={
        'image': open(imagepath, 'rb')
      }
    )
    response_time = time.time() - start
    
    response = json.loads(response.content.decode('utf-8'))
    if response['state'] == 'success':
      success += 1
      labels.append(label)
      predicts.append(response['result'][0][0])
      print('Success: Real - {}    Predict - {}'.format(label, response['result'][0][0]))
      model_time.append(response['time_elapsed'])
      network_time.append(response_time - response['time_elapsed'])
    else:
      print('Fail: ' + response['message'])
    
    # time.sleep(0.5)
      
  if len(labels) == 0:
    return {
      'total_requests': n_samples,
      'success': success,
      'precision': 0,
      'recall': 0,
      'f1': 0,
      'model_time': 0,
      'network_time': 0,
      'total_time': 0,
      'accuracy': 0
    }
  
  else:
    precision = precision_score(np.array(labels), np.array(predicts), average='micro')
    recall = recall_score(np.array(labels), np.array(predicts), average='micro')
    f1 = f1_score(np.array(labels), np.array(predicts), average='micro')
    accuracy = accuracy_score(np.array(labels), np.array(predicts))
    
    print('Precision: ', precision)
    print('Recall: ', recall)
    print('F1 Score: ', f1)
    print('Accuracy: ', accuracy)
    print('Time elapsed: ', sum(model_time) / len(model_time))
    
    return {
      'total_requests': n_samples,
      'success': success,
      'precision': precision,
      'recall': recall,
      'f1': f1,
      'model_time': sum(model_time) / len(model_time),
      'network_time': sum(network_time) / len(network_time),
      'total_time': sum(model_time) / len(model_time) + sum(network_time) / len(network_time),
      'accuracy': accuracy
    }
  