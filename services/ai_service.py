import google.generativeai as genai
from config.config import GOOGLE_API_KEY, PLAYLIST_PROMPT

def configure_model():
    genai.configure(api_key=GOOGLE_API_KEY)
    return genai.GenerativeModel(model_name="gemini-1.5-flash")

def generate_playlist(book_title, book_description):
    model = configure_model()
    playlist_response = model.generate_content(
        PLAYLIST_PROMPT.format(book_title=book_title, book_description=book_description),
        generation_config=genai.GenerationConfig(response_mime_type='application/json')
    )
    
    return playlist_response.candidates[0].content.parts[0].text