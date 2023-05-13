def format_yunet_output(bboxes, landmarks, scores):
    results = []
    
    n_samples = len(bboxes)
    
    for i in range(n_samples):
        results.append({
            'bbox': bboxes[i].tolist(),
            'lm': landmarks[i].tolist(),
            'conf': scores[i].tolist(),
            'label': 'face'
        })
    
    return results