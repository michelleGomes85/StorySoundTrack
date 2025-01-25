const elems = document.querySelectorAll(".sidenav");
M.Sidenav.init(elems);


document.addEventListener("DOMContentLoaded", function() {
    const videoContainer = document.querySelector('.video-container-my');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videoContainer.classList.add('visible'); 
            } else {
                videoContainer.classList.remove('visible'); 
            }
        });
    }, {
        threshold: 0.5 
    });

    observer.observe(videoContainer); 
});