import numpy as np
import onnxruntime
import cv2

class MobileNetv2():
    def __init__(self, onnx_path, input_shape, label_path, topk=5):
        self.onnx_path = onnx_path
        self.onnx_session = onnxruntime.InferenceSession(self.onnx_path)
        
        self.input_shape = input_shape
        self.topk = topk
        
        # Load labels (imagenet labels)
        self.label_path = label_path
        with open(self.label_path, "r") as f:
            self.categories = [s.strip() for s in f.readlines()]
    
    def inference(self, image):
        # run session
        output = self.onnx_session.run(
            [], 
            {
                'input':self.preprocess_image(image)
            }
        )[0]
        
        # Post process output
        output = output.flatten()
        output = self.softmax(output) # this is optional
        
        tups = [(conf, i) for i, conf in enumerate(output)]
        sorted_tups = sorted(tups, reverse=True)
        
        topk_tups = sorted_tups[:self.topk]
        topk_tups = [(self.categories[i], conf) for conf, i in topk_tups]
        return topk_tups
    
    def softmax(self, x):
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum()
    
    def preprocess_image(self, image):
        
        width, height = self.input_shape
        channel = 3
        image = cv2.resize(image, (width, height))
        image_data = np.asarray(image).astype(np.float32)
        image_data = image_data.transpose([2, 0, 1]) # transpose to CHW
        
        mean = np.array([0.079, 0.05, 0]) + 0.406
        std = np.array([0.005, 0, 0.001]) + 0.224
        
        for channel in range(image_data.shape[0]):
            image_data[channel, :, :] = (image_data[channel, :, :] / 255 - mean[channel]) / std[channel]
            
        image_data = np.expand_dims(image_data, 0)
        
        return image_data