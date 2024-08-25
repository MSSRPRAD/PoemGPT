from flask import Blueprint, request
from flask_socketio import emit

from app.services.openai_poem_generator import OpenAIPoemGenerator
from app.controllers.auth import get_current_user, login_required
from app import socketio
from app.models import User
from database import db

bp = Blueprint('poetry', __name__)
poem_generator = OpenAIPoemGenerator(model='gpt-4o-mini')

@socketio.on('generate_poem')
@login_required
def handle_generate_poem(data):
    prompt = data.get('prompt')
    user = get_current_user()

    if not prompt:
        emit('error', {"error": "Prompt is required"})
        return
    
    if user.credits_left <= 0:
        emit('error', {"error": "Not enough credits to generate a poem."})
        return
    
    # Reduce credits
    user.credits_left -= 1
    db.session.commit()

    for chunk in poem_generator.generate_poem(prompt):
        print(chunk)
        socketio.emit('poem_chunk', {'chunk': chunk})

    socketio.emit('poem_complete', {'message': 'Poem generation complete'})