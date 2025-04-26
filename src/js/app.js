document.addEventListener("DOMContentLoaded", function () {
    
    sandwich();
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
  