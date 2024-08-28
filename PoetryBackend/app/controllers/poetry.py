from flask import Blueprint, request, jsonify, session
from flask_socketio import emit

from app.services.openai_poem_generator import OpenAIPoemGenerator
from app.utils.db import save_poem
from app.utils import generate_poem
from app.services.openai_emotional_analyzer import OpenAIEmotionAnalyzer
from app.controllers.auth import get_current_user, login_required
from app import socketio
from database import db
from app.models import Poem, Line, Emotion, PoemEmotion

bp = Blueprint('poetry', __name__)
emotion_analyzer = OpenAIEmotionAnalyzer(model='gpt-4o-mini')
poem_generator = OpenAIPoemGenerator(model='gpt-4o-mini')

@socketio.on('generate_poem')
@login_required
def handle_generate_poem(data):
    prompt = data.get('prompt')
    if not prompt:
        emit('error', {"error": "Prompt is required"})
        return
    
    user = get_current_user()
    if user.credits_left <= 0:
        emit('error', {"error": "Not enough credits to generate a poem."})
        return
    
    generated_text = ""
    for chunk in generate_poem(prompt, poem_generator):
        generated_text += chunk
        socketio.emit('poem_chunk', {'chunk': chunk})
    
    # Analyze emotions line by line
    line_emotions = emotion_analyzer.analyze_lines(generated_text)  
    # Analyze overall poem emotions
    overall_emotions = emotion_analyzer.analyze_overall(generated_text)  
    # Get the poem analysis
    poem_analysis = emotion_analyzer.get_analysis(generated_text)  

    # Save the poem, line emotions, and overall emotions
    save_poem(user.id, prompt, generated_text, line_emotions, overall_emotions.emotions, poem_analysis.analysis)

    user.credits_left -= 1
    db.session.commit()

    socketio.emit('poem_complete', {'message': 'Poem generation complete'})

@bp.route('/poem/<int:poem_id>', methods=['GET'])
@login_required
def get_poem_details(poem_id):
    poem = Poem.query.get(poem_id)
    if not poem:
        return jsonify({"error": "Poem not found"}), 404

    lines = Line.query.filter_by(poem_id=poem.id).all()
    line_emotions = []
    for line in lines:
        emotion = Emotion.query.get(line.emotion_id)
        line_emotions.append({
            "line_no": line.line_no,
            "emotion": emotion.name if emotion else None
        })

    overall_emotions = PoemEmotion.query.filter_by(poem_id=poem.id).all()
    overall_emotion_details = []
    for poem_emotion in overall_emotions:
        emotion = Emotion.query.get(poem_emotion.emotion_id)
        overall_emotion_details.append({
            "emotion": emotion.name if emotion else None,
            "intensity": poem_emotion.intensity
        })

    response = {
        "id": poem.id,
        "user_id": poem.user_id,
        "timestamp": poem.timestamp,
        "prompt": poem.prompt,
        "text": poem.text,
        "line_count": poem.line_count,
        "analysis": poem.analysis,
        "line_emotions": line_emotions,
        "overall_emotions": overall_emotion_details
    }

    return jsonify(response)

@bp.route('/user/poems', methods=['GET'])
@login_required
def get_user_poems():
    poems = Poem.query.filter_by(user_id=session['user_id']).all()
    if not poems:
        return jsonify({"message": "No poems found for this user"}), 404

    response = [
        {
            "id": poem.id,
            "prompt": poem.prompt,
            "timestamp": poem.timestamp
        }
        for poem in poems
    ]

    return jsonify(response)