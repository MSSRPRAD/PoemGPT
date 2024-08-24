from flask import Blueprint, request, jsonify, session
from functools import wraps

from database import db
from app.models.user import User

bp = Blueprint('auth', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Not logged in"}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    user_id = session.get('user_id')
    return User.query.get(user_id) if user_id else None

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    user = User(name=data['name'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({"message": "Logged in successfully"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

@bp.route('/user', methods=['GET'])
@login_required
def get_user():
    user = get_current_user()
    return jsonify({
        "name": user.name,
        "email": user.email,
        "credits_left": user.credits_left
    }), 200

# Example of using the helper function in another route
@bp.route('/update_credits', methods=['POST'])
@login_required
def update_credits():
    user = get_current_user()
    data = request.json
    user.credits_left += data.get('credits', 0)
    db.session.commit()
    return jsonify({"message": "Credits updated", "credits_left": user.credits_left}), 200