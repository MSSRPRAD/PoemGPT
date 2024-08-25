from sqlalchemy import Column, Integer, ForeignKey
from database import db

class PoemEmotion(db.Model):
    __tablename__ = 'poem_emotions'
    
    id = Column(Integer, primary_key=True)
    poem_id = Column(Integer, ForeignKey('poems.id'), nullable=False)
    emotion_id = Column(Integer, ForeignKey('emotions.id'), nullable=False)
    intensity = Column(Integer, nullable=False)  # Intensity from 0 to 100

    def __repr__(self):
        return f'<PoemEmotion poem_id={self.poem_id}, emotion_id={self.emotion_id}, intensity={self.intensity}>'