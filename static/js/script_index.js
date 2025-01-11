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

        localStorageDatas(responseData);

        window.location.href = '/result';

    } catch (error) {
        console.log(error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
};

function localStorageDatas(responseData) {
    localStorage.setItem('bookTitle', responseData.book.title);
    localStorage.setItem('bookDescription', responseData.book.description);
    localStorage.setItem('bookImageUrl', responseData.book.image_url);
    localStorage.setItem('playlist', JSON.stringify(responseData.playlist.playlist));
    localStorage.setItem('sentimentScores', JSON.stringify(responseData.book.sentiment_scores));
}

