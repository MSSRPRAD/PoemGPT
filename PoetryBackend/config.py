import os
from datetime import timedelta
import logging
import redis

class Config:
    # Server
    PORT = 5000
    HOST = '127.0.0.1'

    # Base directory (PoetryBackend/)
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # Keys
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

    # Emotions
    EMOTIONS = ['Positive', 'Negative', 'Neutral', 'Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust', 'Anticipation', 'Trust', 'Love']

    # Logging
    LOG_TO_STDOUT = False
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    LOG_LEVEL = logging.INFO
    LOG_DIR = os.environ.get('LOG_DIR') or os.path.join(BASE_DIR, 'logs')
    LOG_FILE = os.path.join(LOG_DIR, 'app.log')

    # Secret Keys
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hushhhhhhhhh'

    # Database
    DATABASE_DIR = os.path.join(BASE_DIR, 'database')
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os.path.join(DATABASE_DIR, "app.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url('redis://127.0.0.1:6379')
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)

    @classmethod
    def init_app(cls, app):
        # Ensure log directory exists
        os.makedirs(cls.LOG_DIR, exist_ok=True)
        # Ensure database directory exists
        os.makedirs(cls.DATABASE_DIR, exist_ok=True)
        # Set the database URI
        app.config['SQLALCHEMY_DATABASE_URI'] = cls.SQLALCHEMY_DATABASE_URI