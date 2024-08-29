from datetime import datetime
from typing import List, Dict

from app.services.emotion_analyzer import EmotionAnalyzer, EmotionDetail, LineEmotion

from database import db
from config import Config
from app.models import Poem, Line, Emotion, PoemEmotion, User

def populate_emotions():
    for emotion_name in Config.EMOTIONS:
        existing_emotion = Emotion.query.filter_by(name=emotion_name).first()
        if not existing_emotion:
            emotion = Emotion(name=emotion_name)
            db.session.add(emotion)
    db.session.commit()

def save_poem(user_id, prompt, text, line_emotions: List[LineEmotion], overall_emotions: List[EmotionDetail], analysis: str):
    # Calculate line count based on the text
    line_count = len(text.splitlines())

    # Create a new Poem instance with line_count
    poem = Poem(user_id=user_id, prompt=prompt, text=text, line_count=line_count, analysis=analysis)
    db.session.add(poem)
    db.session.commit()

    for line_emotion in line_emotions:
        # Assuming 'emotion' contains the name of the emotion
        emotion_record = Emotion.query.filter_by(name=line_emotion.emotion).first()
        if emotion_record:
            line = Line(poem_id=poem.id, line_no=line_emotion.line, emotion_id=emotion_record.id)
            db.session.add(line)

    for emotion_detail in overall_emotions:
        # Assuming 'emotion_id' corresponds to the emotion name
        emotion_record = Emotion.query.filter_by(name=emotion_detail.name).first()
        if emotion_record:
            poem_emotion = PoemEmotion(poem_id=poem.id, emotion_id=emotion_record.id, intensity=emotion_detail.intensity)
            db.session.add(poem_emotion)

    db.session.commit()
    return poem.id


def get_user_by_id(user_id):
    return User.query.filter_by(id=user_id).first()

def get_poems_by_user(user_id):
    return Poem.query.filter_by(user_id=user_id).all()