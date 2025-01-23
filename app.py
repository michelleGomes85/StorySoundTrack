from flask import Flask, request, jsonify, render_template
from services.book_service import get_book_description
from services.spotify_service import get_spotify_info
from services.ai_service import analyze_sentiment, generate_playlist
from utils.helpers import parse_json_response
from config.config import ERROR_MESSAGES, FLASK_CONFIG

import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result')
def result():
    return render_template('result_test.html')

@app.route('/generate-response', methods=['POST'])
def generate_response():
    try:
        data = request.json
        book_title = data.get('book_title')
        author_name = data.get('author_name')

        if not book_title:
            return jsonify({"error": ERROR_MESSAGES["BOOK_TITLE_NOT_PROVIDED"]}), 400

        book_info = get_book_description(book_title, author_name)
        if book_info == None:
            return jsonify({"error": ERROR_MESSAGES["BOOK_NOT_FOUND"]}), 404

        book_info = json.loads(book_info)
        book_title_from_api = book_info.get("title")
        book_description = book_info.get("description")
        book_image_url = book_info.get("image_url")

        sentiment_scores = parse_json_response(analyze_sentiment(book_description))

        playlist = parse_json_response(generate_playlist(book_description))

        for item in playlist['playlist']:
            artist = item["artist"]
            music = item["music"]
            track_url, album_image_url = get_spotify_info(artist, music)
            item["track_url"] = track_url if track_url else "#"
            item["album_image_url"] = album_image_url if album_image_url else ""

        response_json = {
            "book": {
                "title": book_title_from_api, 
                "description": book_description,
                "image_url": book_image_url,
                "sentiment_scores": sentiment_scores  
            },

            "playlist": playlist["playlist"]
        }
        
        return jsonify(response_json)

    except Exception as e:
        return jsonify({"error": ERROR_MESSAGES["GENERIC_ERROR"]}), 500
    
if __name__ == '__main__':
    app.run(host=FLASK_CONFIG["HOST"], port=FLASK_CONFIG["PORT"], debug=FLASK_CONFIG["DEBUG"])
