document.addEventListener('DOMContentLoaded', function () {

    const playlist = JSON.parse(localStorage.getItem('playlist'));  // Recupera a playlist armazenada no localStorage
    
    if (playlist) {
        const swiperContainer = document.querySelector('.swiper-wrapper');  
        playlist.forEach(song => {

            // Criação da div para cada música
            const musicSlide = document.createElement('div');
            musicSlide.classList.add('swiper-slide');
            musicSlide.setAttribute('data-emotion', song.keyword);  
            
            // Adicionando imagem da música
            const albumImage = document.createElement('img');
            albumImage.src = song.album_image_url || 'https://via.placeholder.com/300x200'; 
            albumImage.alt = `Álbum de ${song.music}`;
            musicSlide.appendChild(albumImage);
            
            // Nome da música
            const musicTitle = document.createElement('h3');
            musicTitle.innerText = song.music;
            musicSlide.appendChild(musicTitle);
            
            // Nome do artista
            const artistName = document.createElement('p');
            artistName.innerText = song.artist;
            musicSlide.appendChild(artistName);
            
            // Emoji e descrição do emoji
            const emojiDiv = document.createElement('div');
            emojiDiv.classList.add('emoji');
            emojiDiv.innerText = getEmojiFromEmotion(song.keyword);
            emojiDiv.onclick = () => abrirModal(getEmojiFromEmotion(song.keyword), song.description); 
            musicSlide.appendChild(emojiDiv);
            
            const playButton = document.createElement('button');
            playButton.classList.add('play-button');
            playButton.innerText = '▶';
            playButton.onclick = () => playSong(song.track_url);
            musicSlide.appendChild(playButton);
            
            swiperContainer.appendChild(musicSlide);
        });
    }
});


function getEmojiFromEmotion(emotion) {
    const emojis = {
        Feliz: '😊',
        Triste: '😢',
        Amor: '❤️',
        Raiva: '😡',
        Calma: '😌',
        Energética: '💥'
    };
    return emojis[emotion] || '😊';  
}

function abrirModal(emoji, description) {
    const modalText = document.querySelector('#modal-text');
    const modal = document.querySelector('#emotion-modal');
    
    modalText.innerText = `${emoji} - ${description}`;
    modal.style.display = 'flex';  
}

function playSong(trackUrl) {
    window.open(trackUrl, '_blank');
}
