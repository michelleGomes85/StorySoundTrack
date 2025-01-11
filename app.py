from flask import Flask, request, jsonify, render_template
from services.book_service import get_book_description
from services.spotify_service import get_spotify_info
from services.ai_service import analyze_sentiment, generate_playlist
from utils.helpers import parse_json_response
from config.config import ERROR_MESSAGES, FLASK_CONFIG

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/result')
def result():
    return render_template('result.html')

@app.route('/generate-response', methods=['POST'])
def generate_response():
    try:
        data = request.json
        book_title = data.get('book_title')

        if not book_title:
            return jsonify({"error": ERROR_MESSAGES["BOOK_TITLE_NOT_PROVIDED"]}), 400

        book_description, book_image_url = get_book_description(book_title)

        if not book_description:
            return jsonify({"error": ERROR_MESSAGES["BOOK_NOT_FOUND"]}), 404

        sentiment_scores = parse_json_response(analyze_sentiment(book_description))

        print(sentiment_scores)
        
        playlist = parse_json_response(generate_playlist(book_description))

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
        return jsonify({"error": ERROR_MESSAGES["GENERIC_ERROR"]}), 500
    
if __name__ == '__main__':
    app.run(host=FLASK_CONFIG["HOST"], port=FLASK_CONFIG["PORT"], debug=FLASK_CONFIG["DEBUG"])