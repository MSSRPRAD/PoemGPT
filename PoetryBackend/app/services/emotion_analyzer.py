from abc import ABC, abstractmethod

class EmotionAnalyzer(ABC):
    @abstractmethod
    def analyze_emotions(self, poem: str) -> dict:
        """
        Analyzes the given poem and returns emotional intensities.
        
        Args:
            poem (str): The poem to analyze.
        
        Returns:
            dict: A dictionary where keys are emotions and values are intensities (0-100).
        """
        pass