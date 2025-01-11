import google.generativeai as genai
from config.config import GOOGLE_API_KEY, SENTIMENT_PROMPT, PLAYLIST_PROMPT

def configure_model():
    genai.configure(api_key=GOOGLE_API_KEY)
    return genai.GenerativeModel(model_name="gemini-1.5-flash")

def analyze_sentiment(book_description):

    prompt = SENTIMENT_PROMPT.format(book_description=book_description)

    model = configure_model()

    sentiment_response = model.generate_content(
                        prompt,
                        generation_config=genai.GenerationConfig(response_mime_type='application/json')
                    )

    return sentiment_response.candidates[0].content.parts[0].text

def generate_playlist(book_description):
    model = configure_model()
    playlist_response = model.generate_content(
        PLAYLIST_PROMPT.format(book_description=book_description),
        generation_config=genai.GenerationConfig(response_mime_type='application/json')
    )
    
    return playlist_response.candidates[0].content.parts[0].text