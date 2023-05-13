import argparse

import torch
from torchvision import models, transforms


# Parse args
parser = argparse.ArgumentParser()
parser.add_argument('--input_shape', type=str, default='224,224', help='The shape of input image')
parser.add_argument('--output_path', type=str, default='models/mobilenet_v2.onnx', help='ONNX output path')

args = parser.parse_args()

# Prepare model
mobilenet_v2 = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)

# Fake input
image_shape = tuple(map(int, args.input_shape.split(',')))
image_height = image_shape[1]
image_width = image_shape[0]
x = torch.randn(1, 3, image_height, image_width, requires_grad=True)

# Forward
torch_out = mobilenet_v2(x)

# Export the model
torch.onnx.export(
    mobilenet_v2,              # model being run
    x,                         # model input (or a tuple for multiple inputs)
    args.output_path,          # where to save the model (can be a file or file-like object)
    export_params=True,        # store the trained parameter weights inside the model file
    do_constant_folding=True,  # whether to execute constant folding for optimization
    input_names = ['input'],   # the model's input names
    output_names = ['output'], # the model's output names
    verbose=True
) 

