import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

# Constantes para chaves de API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")

# Constantes para prompts
SENTIMENT_PROMPT = """
Analise o seguinte texto e avalie a intensidade de cada um dos seguintes sentimentos, atribuindo uma pontuação de 0 a 10, onde 0 significa "ausente" e 10 significa "extremamente presente". Forneça o resultado em formato JSON com as chaves e valores correspondentes aos seguintes sentimentos:
{{
    "Amor": 0,
    "Calma": 0,
    "Energética": 0,
    "Feliz": 0,
    "Raiva": 0,
    "Triste": 0
}}

Certifique-se de considerar tanto o tom geral do texto quanto a relação emocional subjacente entre os personagens, eventos e atmosfera do livro.

Texto: {book_description}
"""

PLAYLIST_PROMPT = """
Com base no texto e na análise dos sentimentos, crie uma playlist de 6 músicas que se relacionem profundamente com o livro descrito. Cada música deve refletir uma emoção principal específica, conforme os sentimentos analisados: Amor, Calma, Energética, Feliz, Raiva, e Triste,
pode usar seu proprio conhecimento para ver se a música se encaixa no estilo de livro.

A resposta deve ser no formato JSON, onde cada música será representada por um objeto com os seguintes campos:

    - 'music': Nome da música
    - 'artist': Nome do artista
    - 'keyword': Uma palavra descritiva que capture a essência da relação entre a música e o livro. Escolha entre: 'Amor', 'Calma', 'Energética', 'Feliz', 'Raiva', 'Triste'.
    - 'description': Descrição detalhada do motivo de ter escolhido essa música para o livro, explicando como ela reflete a emoção representada pela palavra-chave e sua relação com a trama ou os personagens.

Regras:
1. Selecione músicas que tenham maior probabilidade de estar disponíveis no Spotify.
2. Escolha músicas que complementem o tom do livro, a jornada emocional dos personagens ou a atmosfera geral da narrativa.
3. Explique de forma clara e convincente a relação entre a música e o sentimento escolhido, destacando trechos específicos do texto, se aplicável.
4. Inclua músicas internacionais e nacionais que sejam amplamente reconhecidas e relevantes ao contexto do livro.

Texto: {book_description}
"""

app = Flask(__name__)

# Função para configurar a API do Google Generative AI
def configure_model():
    genai.configure(api_key=GOOGLE_API_KEY)
    return genai.GenerativeModel(model_name="gemini-1.5-flash")

def configure_spotify():
    return spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID, 
                                                                 client_secret=SPOTIPY_CLIENT_SECRET))

# Inicializar o modelo e o cliente do Spotify uma vez, para reutilizar
model = configure_model()
spotify_client = configure_spotify()

# Função para consultar a Google Books API e obter a descrição do livro
def get_book_description(book_title):
    url = f'https://www.googleapis.com/books/v1/volumes?q={book_title}&key={GOOGLE_BOOKS_API_KEY}'
    response = requests.get(url)
    books = response.json()

    if 'items' not in books:
        return None, None  # Retorna None para ambos caso não encontre
    
    categories_set = set()
    book_image_url = None

    for edition in books['items']:
        book_data = edition['volumeInfo']
        description = book_data.get('description', None)
        categories_set.update(book_data.get('categories', []))
        book_image_url = book_data.get('imageLinks', {}).get('thumbnail', None)

        if description: 
            categories = ', '.join(categories_set) if categories_set else 'Categoria não disponível'
            book_info = f"{description}\n\nEstilo: {categories}"
            return book_info, book_image_url

    return "Descrição não disponível para os livros encontrados.", book_image_url

# Função para buscar a URL da faixa e imagem do álbum no Spotify
def get_spotify_info(artist, music):
    query = f"{artist} {music}"
    results = spotify_client.search(query, limit=1, type='track', market='BR')
    
    if results['tracks']['items']:
        track = results['tracks']['items'][0]
        track_url = track['external_urls']['spotify']
        album_image_url = track['album']['images'][0]['url']
        return track_url, album_image_url
    return None, None

# Rota para a página principal
@app.route('/')
def index():
    return render_template('index.html')

# Rota para a página de resultados
@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/generate-response', methods=['POST'])
def generate_response():

    try:
        data = request.json
        book_title = data.get('book_title')

        if not book_title:
            return jsonify({"error": "Título do livro não fornecido."}), 400

        book_description, book_image_url = get_book_description(book_title)

        if not book_description:
            return jsonify({"error": "Livro não encontrado ou sem descrição."}), 404

        sentiment_response = model.generate_content(
            SENTIMENT_PROMPT.format(book_description=book_description),
            generation_config=genai.GenerationConfig(response_mime_type='application/json')
        )

        sentiment_scores = json.loads(sentiment_response.candidates[0].content.parts[0].text)

        playlist_response = model.generate_content(
            PLAYLIST_PROMPT.format(book_description=book_description),
            generation_config=genai.GenerationConfig(response_mime_type='application/json')
        )

        response_content = playlist_response.candidates[0].content.parts[0].text
        playlist = json.loads(response_content)

        for item in playlist['playlist']:
            artist = item["artist"]
            music = item["music"]
            track_url, album_image_url = get_spotify_info(artist, music)
            item["track_url"] = track_url if track_url else "#"
            item["album_image_url"] = album_image_url if album_image_url else ""

        response_json = {
            "book": {
                "title": book_title,
                "description": book_description,
                "image_url": book_image_url,
                "sentiment_scores": sentiment_scores  
            },
            "playlist": playlist["playlist"]
        }
        
        return jsonify(response_json)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)