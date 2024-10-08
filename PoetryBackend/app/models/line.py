from sqlalchemy import Column, Integer, ForeignKey
from database import db

class Line(db.Model):
    __tablename__ = 'lines'

    id = Column(Integer, primary_key=True)
    poem_id = Column(Integer, ForeignKey('poems.id'), nullable=False)
    line_no = Column(Integer, nullable=False)  # Line number in the poem
    emotion_id = Column(Integer, ForeignKey('emotions.id'), nullable=False)  # Link to Emotion

    def __repr__(self):
        return f'<Line {self.line_no} of Poem {self.poem_id}>'