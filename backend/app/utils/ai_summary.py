import os
import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_website_text(url: str) -> str | None:
    try:
        with httpx.Client(follow_redirects=True) as client:
            response = client.get(url, timeout=10.0)
            response.raise_for_status()
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for script in soup(["script", "style", "nav", "footer"]):
            script.decompose()

        text = soup.get_text()
        
        clean_text = " ".join(text.split())
        
        return clean_text[:50000]

    except Exception as e:
        print(f"Error fetching URL: {e}")
        return None

async def generate_summary(url: str) -> str | None:
    text_content = get_website_text(url)
    
    if not text_content:
        raise HTTPException(status_code=400, detail="Could not extract content from URL")

    prompt = f"""
    You are a helpful assistant. Please read the following web page content and provide a 
    concise, 3-sentence summary of what this page is about.
    
    Page Content:
    {text_content}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")
