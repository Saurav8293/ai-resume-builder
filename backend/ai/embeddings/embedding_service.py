import google.generativeai as genai
import numpy as np
from typing import List
import os
from dotenv import load_dotenv
load_dotenv()
class EmbeddingService:
    """
    Convert text to numbers (vectors) for similarity comparison.
    
    CONCEPT: Embeddings
    - Text → Array of 768 numbers
    - Similar meanings → Similar numbers
    - "I love Python" ≈ "Python is my favorite" (high similarity)
    - "I love Python" ≠ "I love pizza" (low similarity)
    
    MATH CONCEPT: Cosine Similarity
    - Measures angle between two vectors
    - 1.0 = identical direction (same meaning)
    - 0.0 = perpendicular (unrelated)
    - -1.0 = opposite (opposite meaning)
    """
    
    def __init__(self, model_name: str = "models/embedding-001"):
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model_name = model_name
        print(f"✅ EmbeddingService ready: {model_name}")
    
    def embed(self, text: str) -> List[float]:
        """Convert text to vector of 768 numbers."""
        result = genai.embed_content(
            model=self.model_name,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple texts at once (more efficient)."""
        return [self.embed(t) for t in texts]
    
    def similarity(self, text1: str, text2: str) -> float:
        """
        Calculate similarity between two texts (0 to 1).
        
        Uses cosine similarity formula:
        similarity = (A · B) / (||A|| × ||B||)
        
        Where:
        - A · B = dot product (multiply matching elements, sum them)
        - ||A|| = magnitude (length of vector)
        """
        emb1 = np.array(self.embed(text1))
        emb2 = np.array(self.embed(text2))
        
        dot_product = np.dot(emb1, emb2)
        magnitude1 = np.linalg.norm(emb1)
        magnitude2 = np.linalg.norm(emb2)
        
        return float(dot_product / (magnitude1 * magnitude2))
    
    def find_most_similar(self, query: str, documents: List[str], top_k: int = 3) -> List[tuple]:
        """
        Find most similar documents to query.
        
        Returns: [(index, score), ...] sorted by similarity
        """
        query_emb = np.array(self.embed(query))
        
        scores = []
        for i, doc in enumerate(documents):
            doc_emb = np.array(self.embed(doc))
            score = np.dot(query_emb, doc_emb) / (np.linalg.norm(query_emb) * np.linalg.norm(doc_emb))
            scores.append((i, float(score)))
        
        # Sort by score descending
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]