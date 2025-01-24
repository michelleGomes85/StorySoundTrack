import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Constantes para chaves de API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
SPOTIPY_CLIENT_ID = os.getenv("SPOTIPY_CLIENT_ID")
SPOTIPY_CLIENT_SECRET = os.getenv("SPOTIPY_CLIENT_SECRET")

PLAYLIST_PROMPT = """
Pegue o seguinte livro {book_title}: {book_description}. 
Divida a obra em 6 sentimentos predominantes e escolha uma música que reflita cada sentimento e tenha grande probabilidade de estar no Spotify.

Forneça como resposta um JSON estruturado assim:
Nome do JSON que envolve tudo playlist:

    "emotion": "Sentimento predominante",
    "color": "Cor que reflete o sentimento, em tons escuros e adequados ao sentimento. Use cores como vinho (#800000) para paixão, azul marinho (#000080) para tristeza, verde-escuro (#006400) para esperança, etc. Evite cores claras ou pastéis."
    "song": "Música que reflete o sentimento escolhido (com alta probabilidade de estar no Spotify)",
    "artist": "Autor da música",
    "description": "Descrição breve do porquê do sentimento e da escolha da música, citando situações do livro",
    "intensity": "Nota para a intensidade do sentimento no livro, de 1 a 5"
"""

# Mensagens de erro
ERROR_MESSAGES = {
    "BOOK_TITLE_NOT_PROVIDED": "Título do livro não fornecido.",
    "BOOK_NOT_FOUND": "Livro não encontrado.",
    "GENERIC_ERROR": "Ocorreu um erro inesperado. Por favor, tente novamente."
}

# Configurações do Flask
FLASK_CONFIG = {
    "HOST": "0.0.0.0",
    "PORT": 5000,
    "DEBUG": True
}