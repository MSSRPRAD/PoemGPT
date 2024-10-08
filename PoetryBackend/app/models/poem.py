from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from database import db

class Poem(db.Model):
    __tablename__ = 'poems'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    prompt = Column(String(255), nullable=False)
    text = Column(String, nullable=False)
    line_count = Column(Integer, nullable=False)
    analysis = Column(String, nullable=True)  # Field to store overall analysis

    def __repr__(self):
        return f'<Poem {self.id}: {self.text[:30]}...>'