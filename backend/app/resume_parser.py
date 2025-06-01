import pdfplumber
import re
from typing import Dict, List, Tuple

class ResumeParser:
    def __init__(self):
        self.sections = {
            'education': r'(?i)(education|academic|qualification)',
            'experience': r'(?i)(experience|work|employment)',
            'skills': r'(?i)(skills|technical|competencies)',
            'projects': r'(?i)(projects|portfolio)',
            'achievements': r'(?i)(achievements|awards|accomplishments)'
        }

    def parse_pdf(self, file_path: str) -> str:
        """Extract text from PDF file."""
        try:
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    text += page.extract_text() or ""
                return text
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")

    def analyze_resume(self, text: str) -> Dict:
        """Analyze resume content and return metrics."""
        # Basic metrics
        word_count = len(text.split())
        section_scores = self._analyze_sections(text)
        
        # Calculate overall score (placeholder logic)
        overall_score = min(100, (word_count / 500) * 100)  # Example scoring
        
        return {
            "word_count": word_count,
            "section_scores": section_scores,
            "overall_score": overall_score
        }

    def _analyze_sections(self, text: str) -> Dict[str, float]:
        """Analyze each section of the resume."""
        scores = {}
        for section, pattern in self.sections.items():
            matches = re.findall(pattern, text)
            scores[section] = len(matches) * 20  # Example scoring
        return scores

    def get_improvements(self, text: str) -> List[str]:
        """Get improvement suggestions for the resume."""
        improvements = []
        
        # Check for common issues
        if len(text.split()) < 200:
            improvements.append("Resume is too short. Consider adding more details.")
        
        if not re.search(r'(?i)(experience|work)', text):
            improvements.append("No work experience section found. Add your work history.")
            
        if not re.search(r'(?i)(skills|technical)', text):
            improvements.append("No skills section found. List your technical and soft skills.")
            
        return improvements 