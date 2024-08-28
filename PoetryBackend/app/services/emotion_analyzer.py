from abc import ABC, abstractmethod
from typing import List, Dict, Tuple

from pydantic import BaseModel

class EmotionAnalyzer(ABC):
    def __init__(self):
        pass
    
    @abstractmethod
    def analyze_lines(self, poem: str) -> List[Tuple[str, str]]:
        """
        Analyze emotions for each line in the poem.
        Returns a list of tuples where each tuple contains (line, emotion).
        """
        pass
    
    @abstractmethod
    def analyze_overall(self, poem: str) -> Dict[str, float]:
        """
        Analyze overall emotions for the poem.
        Returns a dictionary of emotions (4th onwards) with their intensities.
        """
        pass

    @abstractmethod
    def get_analysis(self, poem: str) -> str:
        """
        Returns a brief writeup or analysis of the poem.
        """
        pass

from pydantic import BaseModel
from typing import List, Dict, Tuple
from config import Config

class LineEmotion(BaseModel):
    line: str
    emotion: str

class EmotionDetail(BaseModel):
    name: str
    intensity: float

class OverallEmotions(BaseModel):
    emotions: List[EmotionDetail]

class PoemAnalysis(BaseModel):
    analysis: str