document.getElementById('book-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const bookTitle = document.getElementById('book-title').value;
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error-message').innerHTML = '';

    try {
        const response = await fetch('/generate-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ book_title: bookTitle })
        });

        console.log(response);
        
    } catch (error) {
        document.getElementById('error-message').innerText = error.message;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});
