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
    user_id = session['user_id']
    return User.query.get(user_id) if user_id else None

@bp.route('/register/', methods=['POST'])
def register():
    data = request.json
    # Check if the email is already registered
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # Create a new user and handle exceptions
    try:
        user = User(name=data['name'], email=data['email'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"error": "Registration failed. Please try again."}), 500

@bp.route('/login/', methods=['POST'])
def login():
    session.pop("user_id", None)
    data = request.json
    # Check for the presence of email and password
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    # Fetch the user from the database
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"error": "Email not registered"}), 404  # Not found

    # Check password validity
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        return jsonify({"message": "Logged in successfully"}), 200

    return jsonify({"error": "Invalid password"}), 401  # Unauthorized

@bp.route('/logout/', methods=['POST'])
@login_required
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"}), 200

@bp.route('/user/', methods=['GET'])
@login_required
def get_user():
    user = get_current_user()
    if user is None:
        return jsonify({"error": "User not found"}), 404  # Not found
    return jsonify({
        "name": user.name,
        "email": user.email,
        "credits_left": user.credits_left
    }), 200