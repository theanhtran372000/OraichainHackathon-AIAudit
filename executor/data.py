import os
import uuid
import requests
from PIL import Image
from torch.utils.data import Dataset, DataLoader

class TinyImagenet(Dataset):
  def __init__(self, image_dir):
    self.image_dir = image_dir
    self.classes = os.listdir(image_dir)
    
    self.imagepaths = []
    self.labels = []
    
    for c in self.classes:
      paths = os.listdir(os.path.join(self.image_dir, c))
      self.imagepaths.extend([os.path.join(self.image_dir, c, path) for path in paths])
      self.labels.extend([c] * len(paths))
      
  def __len__ (self):
    return len(self.imagepaths)
  
  def __getitem__(self, index):
    return self.imagepaths[index], self.labels[index]
  
def create_dataloader(dataset, batch_size=32, shuffle=True):
  return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)


class ServerDataset(Dataset):
  def __init__(self, user, task, dataset, configs):
    self.user = user
    self.task = task
    self.dataset = dataset
    self.configs = configs
    
  def get_url(self):
    return 'http://{}:{}'.format(self.configs['data']['host'], self.configs['data']['port'])
  
  def __len__(self):
    response = requests.post(
      os.path.join(self.get_url(), 'get-dataset-info'),
      data={
        'user': self.user,
        'task': self.task,
        'dataset': self.dataset
      }
    )
    
    data = response.json()
    return data['len']
  
  def __getitem__(self, index):
    response = requests.post(
      os.path.join(self.get_url(), 'get-an-image'),
      data={
        'user': self.user,
        'task': self.task,
        'dataset': self.dataset,
        'index': index
      }
    )
    
    imagename = '{}.jpg'.format(uuid.uuid4())
    imagepath = os.path.join(self.configs['save'], imagename)
    with open(imagepath, 'wb') as f:
      f.write(response.content)
    
    response = requests.post(
      os.path.join(self.get_url(), 'get-a-label'),
      data={
        'user': self.user,
        'task': self.task,
        'dataset': self.dataset,
        'index': index
      }
    )
    
    label = response.json()['result']
      
    return imagepath, label
  
if __name__ == '__main__':
  import yaml
  with open('configs.yml') as f:
    configs = yaml.load(f, yaml.FullLoader)
    
  dataset = ServerDataset('theanh', 'ic', 'tiny_imagenet', configs)
  print(dataset[0])
  print(len(dataset))
    