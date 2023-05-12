from mobilenetv2 import MobileNetv2
import cv2

model = MobileNetv2(
    'models/mobilenet_v2.onnx',
    (224, 224),
    'save/imagenet_classes.txt'
)

image = cv2.imread('save/test.jpg')

outputs = model.inference(image)
for label, conf in outputs:
    print('{} - {}'.format(label, conf))
