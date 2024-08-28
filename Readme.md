## Submission for the Vurbalize 2024 BITS Hyderabad Campus Hiring Hackathon


# Poetry Generation and Analysis Web Application

## Overview

This project is a web application that generates poems based on user prompts and provides analysis of the generated poems. It consists of a Flask backend and a React frontend, offering features such as user authentication, poem generation, and sentiment analysis.

## Features

- User registration and authentication
- Poem generation using AI
- Real-time poem generation with Socket.IO
- Sentiment analysis of generated poems
- User dashboard to view and manage generated poems
- Credit system for poem generation
- Persistent storage of data
- Logging Mechanism

## Tech Stack

### Backend
- Flask (Python web framework)
- SQLAlchemy (ORM for database management)
- Socket.IO (for real-time communication)
- Redis (for session management)
- OpenAI API (for poem generation)

### Frontend
- React (JavaScript library for building user interfaces)
- TypeScript (for type-safe JavaScript)
- Socket.IO Client (for real-time communication with the backend)

## Project Structure

The project is divided into two main parts:

1. PoetryBackend: Contains the Flask server and API endpoints
2. PoetryFrontend: Contains the React application for the user interface

## Setup and Installation

### Backend Setup
1. Navigate to the PoetryBackend directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables (OPENAI_API_KEY, SECRET_KEY, etc.)
4. Run the server: `python run.py`

### Frontend Setup
1. Navigate to the PoetryFrontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Future Improvements

- Two Factor Authentication using OAuth or Emailing Login Links or Authenticator Apps
- Abstract Database Manager Class to allow for different Database Integrations
- Add social features like sharing poems
- Better frontend state management using Redux
- Implement a more robust credit system or subscription model