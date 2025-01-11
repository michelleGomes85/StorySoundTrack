import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from config.config import SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET

def configure_spotify():
    return spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=SPOTIPY_CLIENT_ID, 
                                                                client_secret=SPOTIPY_CLIENT_SECRET))

def get_spotify_info(artist, music):
    spotify_client = configure_spotify()
    query = f"{artist} {music}"
    results = spotify_client.search(query, limit=1, type='track', market='BR')
    
    if results['tracks']['items']:
        track = results['tracks']['items'][0]
        track_url = track['external_urls']['spotify']
        album_image_url = track['album']['images'][0]['url']
        return track_url, album_image_url
    
    return None, None