from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def populate_emotions():
    from app.models import Emotion

    for emotion_name in Config.EMOTIONS:
        existing_emotion = Emotion.query.filter_by(name=emotion_name).first()
        if existing_emotion is None:
            emotion = Emotion(name=emotion_name)
            db.session.add(emotion)
    db.session.commit()