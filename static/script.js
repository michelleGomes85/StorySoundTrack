$(document).ready(function() {

    $('#searchButton').click(function() {
        
        const bookTitle = $('#bookTitle').val();

        if (!bookTitle) {
            alert('Por favor, insira o nome do livro.');
            return;
        }

        $.ajax({
            url: 'generate-response',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ book_title: bookTitle }),
            success: function(response) {
                if (response.error) {
                    $('#bookDescription').html(`<p>Error: ${response.error}</p>`);
                    return;
                }

                // Exibir a descrição do livro
                $('#bookDescription').html(`<h2>Descrição do Livro:</h2><p>${response.book_description || 'Descrição não disponível'}</p>`);

                // Exibir a lista de músicas geradas pela IA
                const musicList = response.music_list;
                let musicHtml = "<h3>Playlist de Músicas:</h3><ul>";
                musicList.forEach(function(song) {
                    musicHtml += `<li>${song}</li>`;
                });
                musicHtml += "</ul>";
                $('#musicPlaylist').html(musicHtml);
            },
            error: function(xhr) {
                $('#bookDescription').html(`<p>Erro: ${xhr.responseJSON.error}</p>`);
            }
        });
    });
});