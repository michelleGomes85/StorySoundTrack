import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
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

# Mensagens de erro
ERROR_MESSAGES = {
    "BOOK_TITLE_NOT_PROVIDED": "Título do livro não fornecido.",
    "BOOK_NOT_FOUND": "Livro não encontrado ou sem descrição.",
    "GENERIC_ERROR": "Ocorreu um erro inesperado. Por favor, tente novamente."
}

# Configurações do Flask
FLASK_CONFIG = {
    "HOST": "0.0.0.0",
    "PORT": 5000,
    "DEBUG": True
}