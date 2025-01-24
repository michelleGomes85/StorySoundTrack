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

    const inputElement = document.getElementById("book-title");
    const input = inputElement.value.trim();

    if (!input) {
      openModal("Por favor, insira o título do livro seguido de ' - ' e o nome do autor. Caso não saiba o nome do autor, basta escrever apenas o nome do livro, seguido de ' - ...'. ");
      inputElement.value = "";
      inputElement.focus();
      return;
    }

    const separatorIndex = input.lastIndexOf(" - ");
    if (separatorIndex === -1) {
      openModal("Por favor, insira o título do livro seguido de ' - ' e o nome do autor. Caso não saiba o nome do autor, basta escrever apenas o nome do livro, seguido de ' - ...'. ");
      inputElement.value = "";
      inputElement.focus();
      return;
    }

    const bookTitle = input.substring(0, separatorIndex).trim();
    const authorName = input.substring(separatorIndex + 3).trim();

    if (!bookTitle || !authorName) {
      openModal(
        "Por favor, insira tanto o título do livro quanto o nome do autor."
      );
      return;
    }

    document.getElementById("loading").style.display = "block";

    try {
      const response = await fetch("/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_title: input, author_name: authorName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro desconhecido no servidor.");
      }

      const responseData = await response.json();

      fillDatas(responseData);
      inputElement.value = "";

    } catch (error) {
      openModal(error.message);
    } finally {
      document.getElementById("loading").style.display = "none";
    }
  };

  document
    .getElementById("book-title")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        document.getElementById("searchBtn").click();
      }
    });
});

let emotionChart = null; 

function fillDatas(data) {

  const content_result = document.getElementById('result');
  const bookImage = document.getElementById("book-image");
  const bookDescription = document.getElementById("book-description");
  const bookTitle = document.getElementById("title-book");

  // Preenche os dados do livro
  bookImage.src = data.book.image_url;
  bookImage.alt = `Capa do livro: ${data.book.title}`;
  bookDescription.textContent = data.book.description;
  bookTitle.textContent = data.book.title;

  // Preenche os cards da playlist
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = ''; 

  data.playlist.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card fade-in"; 

    card.innerHTML = `
      <div class="card-top" style="background-color: ${item.color};"></div>
      <div class="card-image">
        <img src="${item.album_image_url}" alt="${item.emotion}">
      </div>
      <div class="card-content">
        <h2>${item.emotion}</h2>
        <p><strong>${item.song}</strong> - ${item.artist}</p>
        <p>${item.description}</p>
      </div>
      <div class="card-action">
        <button class="play-button" data-track-url="${item.track_url}">▶</button>
      </div>
    `;

    cardsContainer.appendChild(card);

    // Adiciona um delay para cada card aparecer gradativamente
    setTimeout(() => {
      card.classList.add('visible');
    }, index * 500);
  });

  // Destrói o gráfico anterior, se existir
  if (emotionChart) {
    emotionChart.destroy();
  }

  // Criação do gráfico de teia com Chart.js
  const ctx = document.getElementById("emotionChart").getContext("2d");

  const emotions = data.playlist.map((item) => item.emotion);
  const intensities = data.playlist.map((item) => item.intensity);
  const colors = data.playlist.map((item) => item.color);

  const data_graphic = {
    labels: emotions,
    datasets: [
      {
        label: "Intensidade das Emoções",
        data: intensities,
        backgroundColor: colors,
      },
    ],
  };

  emotionChart = new Chart(ctx, {
    type: "polarArea",
    data: data_graphic,
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 6,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });

  // Mostra o container de resultados
  content_result.style.display = 'block';

  // Rola a tela até o container de resultados
  content_result.scrollIntoView({ behavior: 'smooth' });

  // Adiciona eventos aos botões de play
  const playButtons = document.querySelectorAll(".play-button");
  playButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const trackUrl = this.getAttribute("data-track-url");
      window.open(trackUrl, "_blank");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
    const backToTopButton = document.getElementById("back-to-top");
  
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) { // Mostra o botão após 300px de scroll
        backToTopButton.style.display = "block";
      } else {
        backToTopButton.style.display = "none";
      }
    });
  
    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth" 
      });
    });
  });