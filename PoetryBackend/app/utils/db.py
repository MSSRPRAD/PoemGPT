from datetime import datetime

from database import db
from config import Config
from app.models import Poem, Line, LineEmotion, Emotion, User

def populate_emotions():
    for emotion_name in Config.EMOTIONS:
        existing_emotion = Emotion.query.filter_by(name=emotion_name).first()
        if existing_emotion is None:
            emotion = Emotion(name=emotion_name)
            db.session.add(emotion)
    db.session.commit()

def save_poem(user_id, prompt, poem_text, line_emotions):
    poem = Poem(user_id=user_id, timestamp=datetime.utcnow(), prompt=prompt, text=poem_text, line_count=len(line_emotions))
    db.session.add(poem)
    db.session.flush()  # Flush to get the poem ID

    for line_number, line_text, emotion_id, intensity in line_emotions:
        line = Line(poem_id=poem.id, line_number=line_number, text=line_text)
        db.session.add(line)
        db.session.flush()  # Flush to get the line ID

        line_emotion = LineEmotion(line_id=line.id, emotion_id=emotion_id, intensity=intensity)
        db.session.add(line_emotion)

    db.session.commit()
    return poem

def get_poems_by_user(user_id):
    return Poem.query.filter_by(user_id=user_id).order_by(Poem.timestamp.desc()).all()

def get_poem_with_emotions(poem_id):
    poem = Poem.query.get(poem_id)
    if not poem:
        return None

    lines = Line.query.filter_by(poem_id=poem_id).order_by(Line.line_number.asc()).all()

    result = {
        'poem': poem,
        'lines': []
    }

    for line in lines:
        line_emotions = LineEmotion.query.filter_by(line_id=line.id).all()
        emotions = [{
            'emotion': Emotion.query.get(line_emotion.emotion_id).name,
            'intensity': line_emotion.intensity
        } for line_emotion in line_emotions]

        result['lines'].append({
            'line_number': line.line_number,
            'text': line.text,
            'emotions': emotions
        })

    return result

def get_all_emotions():
    return Emotion.query.order_by(Emotion.name.asc()).all()
