from abc import ABC, abstractmethod

class PoemGenerator(ABC):
    @abstractmethod
    def generate_poem(self, prompt: str):
        """
        Generates a poem based on the provided prompt character by character.
        
        Args:
            prompt (str): The prompt to generate a poem from.
        
        Returns:
            str: The generated poem.
        """
        pass