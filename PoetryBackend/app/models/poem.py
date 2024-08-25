from sqlalchemy import Column, Integer, String
from database import db

class Poem(db.Model):
    __tablename__ = 'poems'
    
    id = Column(Integer, primary_key=True)
    prompt = Column(String(255), nullable=False)
    text = Column(String, nullable=False)

    def __repr__(self):
        return f'<Poem {self.id}: {self.text[:30]}...>'