# API Server

This is the source code for the API Server. The API Server is the party that provides the API and requests verification.

## 1. Installation
- Create environments
```
python -m venv venv
source venv/bin/activate
pip install -U pip setuptools
pip install -r requirements.txt
```
- Configs program params in `configs.yml`
- Run the program
```
cd ..
bash scripts/run.sh
```

## 2. API Endpoints
### a. Face detection - Yunet
- Endpoint: /yunet-face-detection
- Input:
```
image: <Image file>
```
- Output:
```
{
    "message": "Operation success!",
    "result": [
        {
            "bbox": [
                67,
                18,
                24,
                26
            ],
            "conf": 0.6071205139160156,
            "label": "face",
            "lm": [
                [
                    75,
                    28
                ],
                [
                    85,
                    28
                ],
                [
                    80,
                    33
                ],
                [
                    75,
                    37
                ],
                [
                    84,
                    37
                ]
            ]
        }
    ],
    "state": "success",
    "time_elapsed": 0.2438030242919922
}
```

### b. Image classificationn - Mobilenetv2
- Endpoint: /mobilenetv2-image-classification
- Input:
```
image: <Image file>
```
- Output:
```
{
    "message": "Operation success!",
    "result": [
        [
            "Samoyed",
            0.06710068136453629
        ],
        [
            "Great Pyrenees",
            0.023640329018235207
        ],
        [
            "Pomeranian",
            0.013986569829285145
        ],
        [
            "collie",
            0.012817362323403358
        ],
        [
            "ice bear",
            0.008715474978089333
        ]
    ],
    "state": "success",
    "time_elapsed": 0.07421565055847168
}
```