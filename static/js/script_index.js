function closeModal() {
  const modal = document.getElementById("modal-id");
  const overlay = document.getElementById("overlay");

  modal.style.display = "none";
  overlay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);

  function openModal(message) {
    const modal = document.getElementById("modal-id");
    const overlay = document.getElementById("overlay");
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerText = message;
    modal.style.display = "block";
    overlay.style.display = "block";
  }

  document.getElementById("searchBtn").onclick = async function (event) {
    event.preventDefault();

    const input = document.getElementById("book-title").value.trim();

    if (!input) {
      openModal("Por favor, digite o título do livro e o nome do autor.");
      return;
    }

    const separatorIndex = input.lastIndexOf(" - ");
    if (separatorIndex === -1) {
      openModal('Por favor, insira o título do livro seguido de " - " e o nome do autor.');
      return;
    }

    const bookTitle = input.substring(0, separatorIndex).trim();
    const authorName = input.substring(separatorIndex + 3).trim();

    if (!bookTitle || !authorName) {
        openModal('Por favor, insira tanto o título do livro quanto o nome do autor.');
        return;
    }

    document.getElementById("loading").style.display = "block";

    try {
      const response = await fetch("/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_title: input, author_name: authorName}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro desconhecido no servidor.");
      }

      const responseData = await response.json();

      localStorageDatas(responseData);

      window.location.href = "/result";
    } catch (error) {
      openModal(error.message);
    } finally {
      document.getElementById("loading").style.display = "none";
    }
  };

  // Função para salvar dados no localStorage
  function localStorageDatas(responseData) {
    localStorage.setItem("bookTitle", responseData.book.title);
    localStorage.setItem("bookDescription", responseData.book.description);
    localStorage.setItem("bookImageUrl", responseData.book.image_url);
    localStorage.setItem("playlist", JSON.stringify(responseData.playlist));
    localStorage.setItem(
      "sentimentScores",
      JSON.stringify(responseData.book.sentiment_scores)
    );
  }

  document
    .getElementById("book-title")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
      }
    });
});
