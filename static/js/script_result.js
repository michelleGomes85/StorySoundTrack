/**
 * Dados das músicas
 */
document.addEventListener('DOMContentLoaded', function () {

    const playlist = JSON.parse(localStorage.getItem('playlist'));
    
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
            emojiDiv.onclick = () => openModal(getEmojiFromEmotion(song.keyword), song.description); 
            musicSlide.appendChild(emojiDiv);
            
            const playButton = document.createElement('button');
            playButton.classList.add('play-button');
            playButton.innerText = '▶';
            playButton.onclick = () => playSong(song.track_url);
            musicSlide.appendChild(playButton);
            
            swiperContainer.appendChild(musicSlide);
        });

         // Inicializa o Swiper
         var swiper = new Swiper('.swiper-container', {

            slidesPerView: 3,
            spaceBetween: 50,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            loop: false,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
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

function playSong(trackUrl) {
    window.open(trackUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {

    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    // Recupera os dados do livro do localStorage
    const bookDescription = localStorage.getItem('bookDescription');
    const bookImageUrl = localStorage.getItem('bookImageUrl');
    const sentimentScores = JSON.parse(localStorage.getItem('sentimentScores'));

    // Exibe as informações do livro
    document.getElementById('bookImage').src = bookImageUrl;
    document.getElementById('bookTitle').innerText = localStorage.getItem('bookTitle');
    document.getElementById('bookDescription').innerText = bookDescription;

    // Configura o gráfico de sentimentos
    const sentimentChartCtx = document.getElementById('sentimentChart').getContext('2d');

    const sentimentChart = new Chart(sentimentChartCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(sentimentScores),
            datasets: [{
                label: 'Intensidade dos Sentimentos',
                data: Object.values(sentimentScores),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',  // Amor (vermelho suave)
                    'rgba(75, 192, 192, 0.5)',  // Calma (turquesa)
                    'rgba(255, 205, 86, 0.5)',  // Energética (amarelo)
                    'rgba(255, 159, 64, 0.5)',  // Feliz (laranja)
                    'rgba(255, 69, 0, 0.5)',    // Raiva (vermelho intenso)
                    'rgba(54, 54, 54, 0.5)'     // Triste (cinza) 
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',  // Amor
                    'rgba(75, 192, 192, 1)',  // Calma
                    'rgba(255, 205, 86, 1)',  // Energética
                    'rgba(255, 159, 64, 1)',  // Feliz
                    'rgba(255, 69, 0, 1)',    // Raiva
                    'rgba(54, 54, 54, 1)'     // Triste  
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });    
})
    
// Função para abrir o modal
function openModal(emoji, descricao) {
    const modal = document.getElementById('modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalEmoji = document.getElementById('modal-emoji');
    const modalDescricao = document.getElementById('modal-descricao');

    modalEmoji.textContent = emoji;
    modalDescricao.textContent = descricao;
    modal.style.display = 'block';
    modalBackdrop.style.display = 'block'; 
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    modal.style.display = 'none';
    modalBackdrop.style.display = 'none'; 
}

// Função para abrir o modal da descrição
function openModalDescription() {

    const modal = document.getElementById('modal_description');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalTitle = document.getElementById('modal-title');
    const modalDescricao = document.getElementById('modal-complete-description');

    modalTitle.textContent = document.getElementById('bookTitle').innerText;
    modalDescricao.textContent = document.getElementById('bookDescription').innerText;
    modal.style.display = 'block';
    modalBackdrop.style.display = 'block'; 
}

// Função para fechar o modal da descrição
function closeModalDescription() {
    const modal = document.getElementById('modal_description');
    const modalBackdrop = document.getElementById('modal-backdrop');

    modal.style.display = 'none';
    modalBackdrop.style.display = 'none';
}