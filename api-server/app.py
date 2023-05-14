import os
import sys
sys.path.insert(0, os.path.abspath('models/yunet'))
sys.path.insert(0, os.path.abspath('models/mobilenetv2'))

import time
import yaml
import uuid
import argparse
from pathlib import Path
from flask import Flask, request
from flask_cors import CORS, cross_origin

import cv2
import numpy as np

from utils.format.response import format_response
from utils.format.face_detection import format_yunet_output
from utils.format.image_classification import format_mobilenetv2_output

from yunet.yunet_onnx import YuNetONNX
from mobilenetv2.mobilenetv2_onnx import MobileNetv2


def get_parser():
    parser = argparse.ArgumentParser()
    
    parser.add_argument('--config', type=str, default='configs.yml', help='Path to config file')

    return parser
    

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



@app.route('/mobilenetv2-image-classification', methods=['POST'])
def mobilenetv2_image_classification():
    start = time.time()
    
    # Get image from requests
    if 'image' not in request.files:
        return format_response(
            'error',
            'Image not found!',
            None,
            time.time() - start
        )
        
    image = request.files['image']
    ext = image.filename.split('.')[-1]
    if ext.lower() not in configs['mobilenetv2']['exts']:
        return format_response(
            'error',
            '{} not supported!'.format(ext),
            None,
            time.time() - start
        )
    
    # save image to local
    image_path = os.path.join(configs['app']['tmp_dir'], '{}.{}'.format(uuid.uuid4(), ext))
    image.save(image_path)
    
    # Forward image through Yunet
    image = cv2.imread(image_path)
    outputs = mobilenetv2.inference(image)
    os.remove(image_path)
    
    # Fostprocessing output
    results = format_mobilenetv2_output(
        outputs
    )
    
    return format_response(
        'success',
        'Operation success!',
        results,
        time.time() - start
    )


@app.route('/yunet-face-detection', methods=['POST'])
def yunet_face_detection():
    start = time.time()
    
    # Get image from requests
    if 'image' not in request.files:
        return format_response(
            'error',
            'Image not found!',
            None,
            time.time() - start
        )
        
    image = request.files['image']
    ext = image.filename.split('.')[-1]
    if ext.lower() not in configs['yunet']['exts']:
        return format_response(
            'error',
            '{} not supported!'.format(ext),
            None,
            time.time() - start 
        )
    
    # save image to local
    image_path = os.path.join(configs['app']['tmp_dir'], '{}.{}'.format(uuid.uuid4(), ext))
    image.save(image_path)
    
    # Forward image through Yunet
    image = cv2.imread(image_path)
    bboxes, landmarks, scores = yunet.inference(image)
    os.remove(image_path)
    
    # Fostprocessing output
    results = format_yunet_output(
        bboxes,
        landmarks,
        scores
    )
    
    return format_response(
        'success',
        'Operation success!',
        results,
        time.time() - start
    )


@app.route('/hello')
def hello_world():
    return 'Hello, World!'


if __name__ == '__main__':
    parser = get_parser()
    args = parser.parse_args()
    
    # Load configs
    with open(args.config, 'r') as f:
        configs = yaml.load(f, yaml.FullLoader)
    
    # Make dirs
    Path(configs['app']['tmp_dir']).mkdir(parents=True, exist_ok=True)
    
    # Load Yunet model
    input_shape = tuple(map(int, configs['yunet']['input_shape'].split(',')))
    yunet = YuNetONNX(
        model_path=configs['yunet']['model_path'],
        input_shape=input_shape,
        conf_th=configs['yunet']['score_th'],
        nms_th=configs['yunet']['nms_th'],
        topk=configs['yunet']['topk'],
        keep_topk=configs['yunet']['keep_topk'],
    )
    
    # Load Mobilenetv2 Model
    input_shape = tuple(map(int, configs['mobilenetv2']['input_shape'].split(',')))
    mobilenetv2 = MobileNetv2(
        onnx_path=configs['mobilenetv2']['model_path'],
        input_shape=input_shape,
        label_path=configs['mobilenetv2']['label_path'],
        topk=configs['mobilenetv2']['topk']
    )
    
    # Run app
    app.run(
        host=configs['app']['host'],
        port=configs['app']['port'],
        threaded=configs['app']['threaded']
    )