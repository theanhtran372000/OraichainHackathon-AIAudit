def format_response(state, message, result, time_elapsed):
    return {
        'state': state,
        'result': result,
        'message': message,
        'time_elapsed': time_elapsed
    }