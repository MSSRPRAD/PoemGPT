from sqlalchemy import Column, Integer, ForeignKey
from database import db

class LineEmotion(db.Model):
    __tablename__ = 'line_emotions'
    
    id = Column(Integer, primary_key=True)
    line_id = Column(Integer, ForeignKey('lines.id'), nullable=False)
    emotion_id = Column(Integer, ForeignKey('emotions.id'), nullable=False)
    intensity = Column(Integer, nullable=False)  # Intensity from 0 to 100

    def __repr__(self):
        return f'<LineEmotion line_id={self.line_id}, emotion_id={self.emotion_id}, intensity={self.intensity}>'