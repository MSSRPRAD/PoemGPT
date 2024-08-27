from sqlalchemy import Column, Integer, ForeignKey, String
from database import db

class Line(db.Model):
    __tablename__ = 'lines'
    
    id = Column(Integer, primary_key=True)
    poem_id = Column(Integer, ForeignKey('poems.id'), nullable=False)
    line_number = Column(Integer, nullable=False)
    text = Column(String, nullable=False)

    def __repr__(self):
        return f'<Line {self.line_number}: {self.text[:30]}...>'