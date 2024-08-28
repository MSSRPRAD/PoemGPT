from openai import OpenAI
from typing import List
from config import Config

from .emotion_analyzer import EmotionAnalyzer, LineEmotion, OverallEmotions, PoemAnalysis


class OpenAIEmotionAnalyzer():
    def __init__(self, model: str = 'gpt-4o-mini'):
        super().__init__()
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)
        self.model = model

    def analyze_lines(self, poem: str) -> List[LineEmotion]:
        self.poem = poem

        line_emotions = []
        line_emotions_list = Config.EMOTIONS[:3]  # ['Positive', 'Negative', 'Neutral']
        lines = poem.split('\n')

        for line in lines:
            response = self.client.beta.chat.completions.parse(
                model=self.model,
                messages=[
                    {"role": "system", "content": f"Analyze the emotion of this line considering these emotions: {', '.join(line_emotions_list)}. Return the emotion in the same case as the one in the list."},
                    {"role": "user", "content": line},
                ],
                response_format=LineEmotion,
            )
            line_emotion = response.choices[0].message.parsed
            line_emotions.append(line_emotion)

        return line_emotions

    def analyze_overall(self, poem: str) -> OverallEmotions:
        self.poem = poem

        overall_emotions_list = Config.EMOTIONS[3:]  # ['Joy', 'Sadness', 'Anger', ...]

        response = self.client.beta.chat.completions.parse(
            model=self.model,
            messages=[
                {"role": "system", "content": f"Extract the emotions of the whole poem considering these emotions: {', '.join(overall_emotions_list)}. Return the emotion in the same case as the one in the list."},
                {"role": "user", "content": poem},
            ],
            response_format=OverallEmotions,
        )
        overall_emotions = response.choices[0].message.parsed
        return overall_emotions

    def get_analysis(self, poem: str) -> str:
        self.poem = poem
        # Call OpenAI to get a brief analysis of the poem
        response = self.client.beta.chat.completions.parse(
            model=self.model,
            messages=[
                {"role": "system", "content": "Provide an analysis of this poem."},
                {"role": "user", "content": self.poem},
            ],
            response_format=PoemAnalysis
        )
        analysis = response.choices[0].message.parsed
        return analysis