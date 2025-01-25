
function closeModal() {
  const modal = document.getElementById("modal-id");
  const overlay = document.getElementById("overlay");

  modal.style.display = "none";
  overlay.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
  M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'));
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));

  const inputElement = document.getElementById("book-title");

  document.querySelectorAll('.fixed-action-btn .btn-floating').forEach(button => {
      button.addEventListener('click', function() {
          
          const tooltipText = button.getAttribute('data-tooltip');
          
          if (inputElement.disabled == false)
            inputElement.value = tooltipText;

          document.getElementById("searchBtn").click();
      });
  });
});

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
      openModal("Por favor, insira o título do livro seguido de ' - ' e o nome do autor. Caso não saiba o nome do autor, basta escrever apenas o nome do livro, seguido de ' - ...'. Exemplos ao lado, ao passar o mouse na ?");
      inputElement.value = "";
      inputElement.focus();
      return;
    }

    const separatorIndex = input.lastIndexOf(" - ");
    if (separatorIndex === -1) {
      openModal("Por favor, insira o título do livro seguido de ' - ' e o nome do autor. Caso não saiba o nome do autor, basta escrever apenas o nome do livro, seguido de ' - ...'. Exemplos ao lado, ao passar o mouse na ?");
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

    inputElement.disabled = true;
    searchBtn.disabled = true;
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
      inputElement.disabled = false;
      searchBtn.disabled = false;
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

// Função para observar elementos e aplicar animação
function observeElements(selector) {
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.2 
  });

  elements.forEach((element) => {
    observer.observe(element);
  });
}

let emotionChart = null; 

function fillDatas(data) {

  book_datas(data);

  playlist_datas(data);

  graphic_datas(data);

  observeElements('.fade-in');
}

document.addEventListener("DOMContentLoaded", function () {

  const backToTopButton = document.getElementById("back-to-top");
  const btnFloating = document.querySelector('.btn-floating');

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopButton.style.display = "block";
      btnFloating.style.display = "none";
    } else {
      backToTopButton.style.display = "none";
      btnFloating.style.display = "block";
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth" 
    });
  });
});

function book_datas(data) {

  const content_result = document.getElementById('result');
  const footer = document.querySelector('.footer');
  const top_card = document.querySelector('.top-card');
  const bookImage = document.getElementById("book-image");
  const bookDescription = document.getElementById("book-description");
  const bookTitle = document.getElementById("title-book");
  
  bookImage.src = data.book.image_url;
  bookImage.alt = `Capa do livro: ${data.book.title}`;
  bookDescription.textContent = data.book.description;
  bookTitle.textContent = data.book.title;

  content_result.style.display = 'flex';
  footer.style.display = 'block';
  content_result.scrollIntoView({ behavior: 'smooth' });
  if (top_card) 
    top_card.classList.add('fade-in');

  const description = document.getElementById('book-description');
  const modal = document.getElementById('modal');
  const modalDescription = document.getElementById('modal-description');
  const closeModal = document.querySelector('.close');

  if (description) {

    const descriptionText = description.textContent;
    const descriptionHeight = description.scrollHeight;

    if (descriptionHeight > 60) {
      description.classList.add('truncated');

      const seeMoreButton = description.nextElementSibling;
      if (seeMoreButton && seeMoreButton.classList.contains('see-more')) {
        seeMoreButton.style.display = 'block'; // Exibe o botão

        seeMoreButton.addEventListener('click', () => {
          
          modalDescription.innerHTML = `
            <h2>${bookTitle.textContent}</h2>
            <p>${descriptionText}</p>
          `;

          modal.style.display = 'block';
        });
      }
    }
  }

  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function playlist_datas(data) {

  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = ''; 

  data.playlist.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card fade-in"; 

    card.innerHTML = `
      <div class="card">
        <img src="${item.album_image_url}" class="album-cover">
        <div class="song-title">${item.song}</div>
        <div class="artist-name">${item.artist}</div>
        <div class="quote"><span style="color: ${item.color}; font-weight: bold;">${item.emotion}</span> - ${item.description}</div>
        <a class="spotify-logo play-button" data-track-url="${item.track_url}">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Logo do Spotify">
            <span>Spotify</span>
        </a>
    `;

    cardsContainer.appendChild(card);
  });

  const playButtons = document.querySelectorAll(".play-button");
  playButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const trackUrl = this.getAttribute("data-track-url");
      window.open(trackUrl, "_blank");
    });
  });
}

function graphic_datas(data) {

  // Destrói o gráfico anterior, se existir

  if (emotionChart) {
    emotionChart.destroy();
  }

  // Criação do gráfico de teia com Chart.js
  const ctx = document.getElementById("emotionChart").getContext("2d");

  const emotions = data.playlist.map((item) => item.emotion);
  const intensities = data.playlist.map((item) => item.intensity);
  
  const colors = data.playlist.map((item) => {
    
    if (item.color.startsWith('#')) {

      let r = parseInt(item.color.slice(1, 3), 16);
      let g = parseInt(item.color.slice(3, 5), 16);
      let b = parseInt(item.color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.5)`;
    }
    return item.color;
  });

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
            color: "white", 
            backdropColor: "rgba(0, 0, 0, 0)",
          },
        },
      },
    },
  });

  const chartContainer = document.getElementById("emotionChart").parentElement;
  chartContainer.classList.add('fade-in');
}