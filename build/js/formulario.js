document.addEventListener("DOMContentLoaded", () => {
    const email = {
      email: "",
      cc: "",
      asunto: "",
      mensaje: "",
    };
  
  
    //SELECCIONAR LOS ELEMENTOS DE LA INTERFAZ
    const inputEmail = document.querySelector("#email");
    const inputAsunto = document.querySelector("#asunto");
    const inputMensaje = document.querySelector("#mensaje");
    const inputNombre = document.querySelector('#nombre')
    const formulario = document.querySelector("#formulario");
    const btnSubmit = document.querySelector('#formulario button[type="submit"]');
    const btnReset = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector("#spinner");
  
    //ASIGNAR EVENTOS
    inputEmail.addEventListener("blur", validar);
    
    inputNombre.addEventListener("blur", validar);
  
    inputAsunto.addEventListener("blur", validar);
  
    inputMensaje.addEventListener("blur", validar);
  
    formulario.addEventListener("submit", enviarEmail);
  
    btnReset.addEventListener("click", (e) => {
      e.preventDefault();
  
      resetFormulario();
    });

  
    //FUNCIONES
    function enviarEmail(e) {
      e.preventDefault();
      
      btnSubmit.disabled = true;
      btnSubmit.classList.add('opacity')
      
      spinner.classList.add("mostrar");
      spinner.classList.remove("ocultar");
  
      emailjs.send('fedeFogliatto', 'template_t92vnsk', email)
                          .then(() => {
                            setTimeout(() => {
                              
                              spinner.classList.add("ocultar");
                              spinner.classList.remove("mostrar");
                        
                              resetFormulario();
                              
                        
                        
                              const alertaExito = document.createElement("P");
                              alertaExito.classList.add('alertaExito');
                              alertaExito.textContent = "Mensaje enviado correctamente";
                              formulario.appendChild(alertaExito);
                        
                              setTimeout(() => {
                                alertaExito.remove();
                              }, 3000);
                            }, 3000);
                          })
                          .catch((error) => {
                              alert('Hubo un error al enviar el mensaje.')
                              console.error('Error:', error)
                          })
  
      
    }
  
    function validar(e) {
      console.log(e.target.value)
        if (e.target.value.trim() === "") {
          mostrarAlerta(
            `El campo ${e.target.id} esta vacio`,
            e.target.parentElement
          ); //se posiciona en el elemento padre
          email[e.target.name] = "";
          comprobarEmail();
          return;
        }
  
      if (e.target.id === "email" && !validarEmail(e.target.value)) {
        mostrarAlerta("El correo ingresado no es valido", e.target.parentElement);
        email[e.target.name] = "";
        comprobarEmail();
        return;
      }
  
  
      limpiarAlerta(e.target.parentElement);
  
      //ASIGNAR LOS VALORES
      email[e.target.name] = e.target.value.trim();
      console.log(email);
      //COMPROBAR EL OBJETO EMAIL
      comprobarEmail();
    }
  
    function mostrarAlerta(mensaje, referencia) {
      limpiarAlerta(referencia);
  
      //GENERAR ALERTA EN HTML
      const error = document.createElement("P");
      error.textContent = mensaje;
      error.classList.add("alertaError");
  
      //INYECTAR EL ERROR EN EL FORMULARIO
      referencia.appendChild(error);
    }
  
    function limpiarAlerta(referencia) {
      const alerta = referencia.querySelector(".alertaError");
  
      if (alerta) {
        alerta.remove();
      }
    }
  
    function validarEmail(email) {
      const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  
      const resultado = regex.test(email);
      return resultado;
    }
  
    function comprobarEmail() {
      const {cc, ...camposObligatorios} = email
      
      if (Object.values(camposObligatorios).includes("")) {
        btnSubmit.classList.add("opacity");
        btnSubmit.disabled = true;
      } else {
        btnSubmit.classList.remove("opacity");
        btnSubmit.disabled = false;
      }
    }
  
    function resetFormulario() {
      //REINICIAR OBJETO
      email.email = "";
      email.asunto = "";
      email.mensaje = "";
  
      formulario.reset();
  
      comprobarEmail();
    }
  });
  