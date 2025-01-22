import requests
import json
from config.config import GOOGLE_BOOKS_API_KEY

def get_book_description(book_title, author_name=None):
    try:
        
        query = f"intitle:{book_title}"
        if author_name:
            query += f"+inauthor:{author_name}"

        url = f'https://www.googleapis.com/books/v1/volumes?q={query}&key={GOOGLE_BOOKS_API_KEY}'
        response = requests.get(url)
        response.raise_for_status() 

        books = response.json()

        if books['totalItems'] == 0:
            return None
        
        book_info = {
            "title": None,
            "authors": None,
            "description": None,
            "image_url": None
        }

        for edition in books['items']:
            book_data = edition['volumeInfo']

            if not book_info["title"]:
                book_info["title"] = book_data.get('title')

            if not book_info["authors"]:
                book_info["authors"] = book_data.get('authors')

            if not book_info["description"]:
                book_info["description"] = book_data.get('description')

            if not book_info["image_url"]:
                image_links = book_data.get('imageLinks', {})
                book_info["image_url"] = image_links.get('thumbnail')

            if all(book_info.values()):
                break

        if not all(book_info.values()):
            return None

        return json.dumps(book_info, ensure_ascii=False, indent=4)

    except requests.exceptions.RequestException as e:
        return None
