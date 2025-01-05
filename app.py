from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")

app = Flask(__name__)

# Função para configurar a API do Google Generative AI
def configure_model():
    
    genai.configure(api_key=GOOGLE_API_KEY)

    # Inicialização do modelo
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash"
    )
    
    return model

# Inicializar o modelo uma vez, para reutilizar
model = configure_model()

# Função para consultar a Google Books API e obter a descrição do livrorequests

def get_book_description(book_title):
    
    url = f'https://www.googleapis.com/books/v1/volumes?q={book_title}&key={GOOGLE_BOOKS_API_KEY}'
    response = requests.get(url)
    books = response.json()

    if 'items' not in books:
        return None  

    categories_set = set()  
    
    # Percorrer todas as edições para encontrar uma descrição válida
    for edition in books['items']:
        book_data = edition['volumeInfo']
        description = book_data.get('description', None)

        categories_set.update(book_data.get('categories', []))

        if description: 
            categories = ', '.join(categories_set) if categories_set else 'Categoria não disponível'
            # Formatando a descrição e estilo
            book_info = f"{description}\n\nEstilo: {categories}"
            return book_info

    return "Descrição não disponível para os livros encontrados."

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

        book_description = get_book_description(book_title)

        if not book_description:
            return jsonify({"error": "Livro não encontrado ou sem descrição."}), 404

        chat = model.start_chat(history=[])
        prompt = f"Crie uma playlist de 5 músicas que combinem com o seguinte livro: {book_description}\n\n - Retorne a resposta em formato JSON, onde seja fácil localizar somente o nome da música e seu autor separado por música - autor"
        response = chat.send_message(prompt)
        
        music_list = response.text.strip().split("\n")  # Separando as músicas por linha

        music_data = []
        for music in music_list:
            parts = music.split(" - ")
            if len(parts) == 2:  
                music_data.append({"musica": parts[0], "autor": parts[1]})
        
        return jsonify({"music_list": music_data})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
