from sqlalchemy import Column, Integer, ForeignKey
from database import db

class PoemEmotion(db.Model):
    __tablename__ = 'poem_emotions'

    id = Column(Integer, primary_key=True)
    poem_id = Column(Integer, ForeignKey('poems.id'), nullable=False)
    emotion_id = Column(Integer, ForeignKey('emotions.id'), nullable=False)  # Link to Emotion
    intensity = Column(Integer, nullable=True)  # Intensity of the emotion

    def __repr__(self):
        return f'<PoemEmotion {self.poem_id} - Emotion {self.emotion_id}>'