// Inicialização do sidenav para responsividade
document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
});

document.getElementById('searchBtn').onclick = async function(event) {
    
    event.preventDefault();

    const bookTitle = document.getElementById('book-title').value.trim();

    if (!bookTitle) {
        document.getElementById('error-message').innerText = 'Por favor, digite o título do livro.';
        return;
    }

    document.getElementById('loading').style.display = 'block'; 

    try {
        const response = await fetch('/generate-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_title: bookTitle })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro desconhecido no servidor.');
        }

        const responseData = await response.json();

        window.location.href = '/result';

        console.log(responseData); 

    } catch (error) {
        document.getElementById('error-message').innerText = error.message;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
};

// const emojiMap = {
//     'emocionante': '✨',
//     'sombrio': '🌑',
//     'nostálgico': '🌅',
//     'misterioso': '🕵️‍♂️',
//     'aventureiro': '🏞️'
// };

// function displayPlaylist(data) {
//     const playlistContainer = document.getElementById('playlist-container');
//     playlistContainer.innerHTML = ''; 

//     if (data && data.playlist && data.playlist.playlist && data.playlist.playlist.length > 0) {
//         data.playlist.playlist.forEach(item => {
//             const emoji = emojiMap[item.keyword] || '';
//             const trackElement = document.createElement('div');
//             trackElement.className = 'track';
//             trackElement.innerHTML = `
//                 <p><strong>Música:</strong> ${item.music} ${emoji}</p>
//                 <p><strong>Artista:</strong> ${item.artist}</p>
//                 <p><strong>Descrição:</strong> ${item.description}</p>
//                 ${item.track_url ? `<a href="${item.track_url}" target="_blank">Ouça no Spotify</a>` : ''}
//                 ${item.album_image_url ? `<img src="${item.album_image_url}" alt="Capa do álbum" style="width: 100px;">` : ''}
//             `;
//             playlistContainer.appendChild(trackElement);
//         });
//     } else {
//         playlistContainer.innerHTML = '<p>Nenhuma música encontrada.</p>';
//     }
// }

