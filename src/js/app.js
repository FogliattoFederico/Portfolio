document.addEventListener("DOMContentLoaded", function () {
  sandwich();
  scrollNav();
  mostrarModal();
});

function sandwich() {
  const nav = document.querySelector("#nav");
  const abrir = document.querySelector("#open");
  const cerrar = document.querySelector("#close");
  const body = document.body;
  const menuOptions = nav.querySelectorAll("a"); // Selecciona las opciones del menú

  if (!nav || !abrir || !cerrar) {
    console.error("Uno o más elementos no existen en el DOM.");
    return;
  }

  abrir.addEventListener("click", () => {
    nav.classList.add("visible");
    body.classList.add("overflow-hidden");
  });

  cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
    body.classList.remove("overflow-hidden");
  });

  // Cierra el menú al hacer clic en una opción
  menuOptions.forEach((option) => {
    option.addEventListener("click", () => {
      nav.classList.remove("visible");
      body.classList.remove("overflow-hidden");
    });
  });
}

function scrollNav() {
  const navLinks = document.querySelectorAll(".nav-list a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionScroll = e.target.getAttribute("href");
      const section = document.querySelector(sectionScroll);
      section.scrollIntoView({ behavior: "smooth" });
    });
  });
}

function mostrarModal() {
  const demo = document.querySelector("#videoProject1"); 
  demo.addEventListener("click", (e) => {
    e.preventDefault();

    // Avoid multiple modals
    if (document.querySelector(".modal")) {
      return;
    }

    // Create modal
    const modal = document.createElement("DIV");
    modal.classList.add("modal");

    // Modal content (customize this part)
    modal.innerHTML = `
      <div class="modal-content">
      <h2 class="modal-title">Demo</h2>
      <!-- Add your video or iframe here -->
      <iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/gGYvIlU6gAI?autoplay=1&mute=1&enablejsapi=1" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin" 
      allowfullscreen
      loading="lazy">
      </iframe>      
      <span class="close-modal">&times;</span>
      </div>
    `;

    // Append to body
    document.body.classList.add("overflow-hidden");
    document.body.appendChild(modal);

    // Close modal on X button click
    const closeBtn = modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", () => {
      closeModal(modal);
    });

    // Close modal on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    // Close modal on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal(modal);
      }
    });
  });
}

// Helper function to close modal with animation
function closeModal(modal) {
  modal.classList.add("fade-out");
  setTimeout(() => {
    modal.remove();
    document.body.classList.remove("overflow-hidden");
  }, 500);
}
