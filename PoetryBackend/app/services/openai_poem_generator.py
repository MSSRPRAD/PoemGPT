import time
import os

import openai
from openai import OpenAI

from app.services.poem_generator import PoemGenerator
from config import Config

class OpenAIPoemGenerator(PoemGenerator):
    def __init__(self, model: str):
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)
        self.model = model

    def generate_poem(self, prompt: str):
        """
        Generates a poem based on the provided prompt character by character.
        This is a generator function that yields each chunk of the generated poem.
        
        Args:
            prompt (str): The prompt to generate a poem from.
        
        Yields:
            str: The generated poem chunk.
        """
        start_time = time.time()
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": f"Generate a poem based on the following prompt. Do not include any other text than the poem itself."},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0,
            stream=True
        )

        for chunk in response:
            chunk_message = chunk.choices[0].delta.content
            if chunk_message:
                yield chunk_message
                
        yield "Poem generation completed."