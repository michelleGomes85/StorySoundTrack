import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
SPOTIPY_CLIENT_ID = client_id=os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")

app = Flask(__name__)

# Função para configurar a API do Google Generative AI
def configure_model():
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    return model

def configure_spotify():
    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID, 
                                                               client_secret=SPOTIPY_CLIENT_SECRET))
    return sp

# Inicializar o modelo uma vez, para reutilizar
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

# Função para buscar a prévia, URL da faixa e imagem do álbum no Spotify
def get_spotify_info(artist, music):
    query = f"{artist} {music}"
    results = spotify_client.search(query, limit=3, type='track', market='BR')  # Aumentei o limite para 3 para capturar mais resultados
    
    if results['tracks']['items']:
        track = results['tracks']['items'][0]
        
        preview_url = track.get('preview_url', None)
        track_url = track['external_urls']['spotify']
        album_image_url = track['album']['images'][0]['url']

        return preview_url, track_url, album_image_url
    return None, None, None

# Rota para a página principal
@app.route('/')
def index():
    return render_template('index.html')

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

        prompt = f"""
                    Crie uma playlist de 5 músicas que combinem com o seguinte livro: {book_description}

                    A resposta deve ser no formato JSON, onde cada música será representada por um objeto com os seguintes campos:

                    - 'music': Nome da música
                    - 'artist': Nome do artista
                    - 'description': Descrição do motivo de ter escolhido essa música para o livro.

                    Escolha músicas que têm maior probabilidade de estarem disponível no Spotify.

                    Certifique-se de responder sempre em português, mas pode incluir músicas internacionais. E de incluir essas chaves exatamente como indicadas no formato JSON.
                    """
        
        # Gerar o conteúdo com base no prompt
        chat = model.generate_content(prompt, generation_config=genai.GenerationConfig(response_mime_type='application/json'))
        
        response_content = chat.candidates[0].content.parts[0].text
        
        # Carregar a string JSON em um objeto Python
        playlist = json.loads(response_content)
        
        # Adicionar o link da prévia, URL da faixa e imagem do álbum de cada música da playlist
        for item in playlist['playlist']:
            artist = item["artist"]
            music = item["music"]
            preview_url, track_url, album_image_url = get_spotify_info(artist, music)
            
            if preview_url:
                item["preview_url"] = preview_url
            else:
                item["preview_url"] = "Prévia não disponível"
            
            if track_url:
                item["track_url"] = track_url
            
            if album_image_url:
                item["album_image_url"] = album_image_url

        response_json = {
            "book_description": book_description,
            "book_image_url": book_image_url,
            "playlist": playlist
        }
        
        # Exibir o resultado final antes de retornar a resposta
        print("Resultado da playlist gerada:")
        print(json.dumps(response_json, indent=2))
        
        return jsonify(response_json)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
