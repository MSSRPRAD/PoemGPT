from flask import Flask
from flask_session import Session
from config import Config
import logging
from logging.handlers import RotatingFileHandler
import os

from app.controllers import test_bp, auth_bp
from database import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    config_class.init_app(app)

    # Database & Session
    Session(app)
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Register logging
    if not app.debug and not app.testing:
        file_handler = RotatingFileHandler(app.config['LOG_FILE'], maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(app.config['LOG_FORMAT']))
        file_handler.setLevel(app.config['LOG_LEVEL'])
        app.logger.addHandler(file_handler)

        app.logger.setLevel(app.config['LOG_LEVEL'])
        app.logger.info('PoetryBackend startup')
    else:
        stream_handler = logging.StreamHandler()
        stream_handler.setLevel(logging.INFO)
        app.logger.addHandler(stream_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('Poetry startup')


    # Register blueprints
    app.register_blueprint(test_bp, url_prefix='/')
    app.register_blueprint(auth_bp, url_prefix='/')
    return app