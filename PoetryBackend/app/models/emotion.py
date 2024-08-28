from sqlalchemy import Column, Integer, String
from database import db

class Emotion(db.Model):
    __tablename__ = 'emotions'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return f'<Emotion {self.name}>'