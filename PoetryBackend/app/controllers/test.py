from flask import Blueprint

bp = Blueprint('test', __name__)

@bp.route('/', methods=['GET'])
def test():
    return "Hello World!", 200