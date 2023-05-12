#!/bin/bash
python3 create_onnx.py \
    --input_shape="224,224" \
    --output_path="models/mobilenet_v2.onnx"