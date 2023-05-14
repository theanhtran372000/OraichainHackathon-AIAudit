import os
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

