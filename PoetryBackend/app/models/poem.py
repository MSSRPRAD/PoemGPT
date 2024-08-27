from database import db
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String

class Poem(db.Model):
    __tablename__ = 'poems'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    prompt = Column(String(255), nullable=False)
    text = Column(String, nullable=False)
    line_count = Column(Integer, nullable=False)

    def __repr__(self):
        return f'<Poem {self.id}: {self.text[:30]}...>'