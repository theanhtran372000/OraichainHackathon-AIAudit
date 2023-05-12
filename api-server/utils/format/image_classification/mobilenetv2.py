def format_mobilenetv2_output(outputs):
    return [
        (label, float(conf)) \
            for label, conf in outputs
    ]