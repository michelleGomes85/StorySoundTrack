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
Divida a obra em 6 emoções predominantes e escolha uma música que reflita cada emoção e tenha grande probabilidade de estar no Spotify.

Forneça como resposta um JSON estruturado assim:
Nome do JSON que envolve tudo playlist:

    "emotion": "Emoção predominante",
    "color": "Uma cor distinta que simboliza a emoção, escolhida para contrastar bem com um fundo preto. Escolha cores que se destaquem (ex: vermelho para raiva, azul para tristeza, verde para esperança, etc.), em hexadecimal",
    "song": "Música que reflete a emoção escolhida (com alta probabilidade de estar no Spotify)",
    "artist": "Autor da música",
    "description": "Descrição breve do porquê da emoção e da escolha da música, citando situações do livro",
    "intensity": "Nota para a intensidade da emoção no livro, de 1 a 5"

Regras:
    -> Responda em português
    -> Escolha músicas váriaveis, se estiver de acordo com o contexto (nacional ou internacional)
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