import os
from torch.utils.data import Dataset

class ICDataset(Dataset):
  def __init__(self, image_dir):
    self.image_dir = image_dir
    self.classes = os.listdir(image_dir)
    
    self.imagepaths = []
    self.labels = []
    
    for c in sorted(self.classes):
      paths = sorted(os.listdir(os.path.join(self.image_dir, c)))
      self.imagepaths.extend([os.path.join(self.image_dir, c, path) for path in paths])
      self.labels.extend([c] * len(paths))
      
  def __len__ (self):
    return len(self.imagepaths)
  
  def __getitem__(self, index):
    return self.imagepaths[index], self.labels[index]