import requests
from config.config import GOOGLE_BOOKS_API_KEY

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