from emotion_analyzer import EmotionAnalyzer
from pydantic import BaseModel
import openai
from openai import OpenAI

class EmotionAnalysisResponse(BaseModel):
    emotions: dict  # {'emotion_name': intensity}

class OpenAIEmotionAnalyzer(EmotionAnalyzer):
    def __init__(self, model: str):
        self.client = OpenAI()
        self.model = model

    def analyze_emotions(self, poem: str) -> dict:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {'role': 'user', 'content': f"Analyze the emotions in this poem: {poem}"}
            ]
        )

        # Example response processing
        emotions = {}  # Fill this with the parsed response
        for emotion in ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust', 'Anticipation', 'Trust', 'Love']:
            # Dummy logic for illustration
            emotions[emotion] = response.choices[0].message.content.count(emotion) * 10  # Example of setting intensity

        return emotions