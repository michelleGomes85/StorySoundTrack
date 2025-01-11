function closeModal() {
    const modal = document.getElementById('modal-id');
    const overlay = document.getElementById('overlay');

    modal.style.display = 'none';
    overlay.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {

    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    function openModal(message) {

        const modal = document.getElementById('modal-id');
        const overlay = document.getElementById('overlay');
        const errorMessage = document.getElementById('error-message');
    
        errorMessage.innerText = message;
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
    
    document.getElementById('searchBtn').onclick = async function (event) {
        
        event.preventDefault();

        const bookTitle = document.getElementById('book-title').value.trim();

        if (!bookTitle) {
            openModal('Por favor, digite o título do livro.');
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
            openModal(error.message);
            console.error(error);
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    };

    // Função para salvar dados no localStorage
    function localStorageDatas(responseData) {
        localStorage.setItem('bookTitle', responseData.book.title);
        localStorage.setItem('bookDescription', responseData.book.description);
        localStorage.setItem('bookImageUrl', responseData.book.image_url);
        localStorage.setItem('playlist', JSON.stringify(responseData.playlist));
        localStorage.setItem('sentimentScores', JSON.stringify(responseData.book.sentiment_scores));
    }
});