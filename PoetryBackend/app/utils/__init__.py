from app.services.openai_poem_generator import PoemGenerator
from .db import populate_emotions, save_poem, get_poems_by_user

def generate_poem(prompt: str, model: PoemGenerator):
    return model.generate_poem(prompt)