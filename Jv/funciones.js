// Evento de desplazamiento para cambiar el estilo del encabezado
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header_superiol");
    if (header) {
        header.classList.toggle("abajo", window.scrollY > 0);
    }
});

document.addEventListener('DOMContentLoaded', function () { 
    const carousel = document.querySelector('.carousel');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const nextButton = carousel.querySelector('.carousel-control.next');
    let currentIndex = 0;

    function updateCarousel(index) {
        const offset = -index * 100; // Calcula la posición en porcentaje
        carousel.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
    }

    function moveSlide(direction) {
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = items.length - 1; // Ir al último elemento si retrocedes desde el primero
        } else if (currentIndex >= items.length) {
            currentIndex = 0; // Ir al primero si avanzas desde el último
        }
        updateCarousel(currentIndex);
    }

    prevButton.addEventListener('click', () => moveSlide(-1));
    nextButton.addEventListener('click', () => moveSlide(1));

    // Inicializar la posición del carrusel
    updateCarousel(currentIndex);

    // Mover automáticamente el carrusel cada 3 segundos
    setInterval(() => {
        moveSlide(1); // Avanzar al siguiente elemento automáticamente
    }, 3000); // 3000 milisegundos = 3 segundos
});





// Función para agregar un producto al carrito
function addProducto(ID_Guante, token) {
    if (!ID_Guante || !token) {
        console.error("ID_Guante o token no válidos.");
        return;
    }

    const cantidadInput = document.getElementById('cantidad'); // Obtener el input de cantidad
    const cantidad = parseInt(cantidadInput.value); // Convertir el valor a entero
    const maxCantidad = parseInt(cantidadInput.max); // Obtener el máximo permitido del atributo "max"

    // Validar cantidad seleccionada
    if (cantidad < 1) {
        alert("Debe seleccionar una cantidad válida.");
        cantidadInput.value = 1; // Ajustar la cantidad mínima
        return;
    } else if (cantidad > maxCantidad) {
        alert("La cantidad no puede exceder las unidades disponibles.");
        cantidadInput.value = maxCantidad; // Ajustar la cantidad al máximo permitido
        return;
    }

    const url = "carrito.php"; // URL donde se manejará la solicitud
    const formData = new FormData();
    formData.append("ID_Guante", ID_Guante);
    formData.append("action", "agregar"); // Acción para agregar al carrito
    formData.append("token", token); // Agregar el token para seguridad
    formData.append("cantidad", cantidad); // Añadir la cantidad al FormData

    // Enviar los datos usando fetch
    fetch(url, { 
        method: "POST", 
        body: formData, 
        mode: "cors" 
    })
    .then(response => response.json()) // Esperar respuesta en formato JSON
    .then(data => {
        if (data.ok) {
            // Si la respuesta es positiva, actualizar el número de productos en el carrito
            const element = document.getElementById("num_cart");
            if (element) element.innerHTML = data.numero;
        } else {
            // En caso de error, mostrar un mensaje
            console.error("No se pudo agregar el producto al carrito.");
            alert(data.error || "Error al procesar la solicitud.");
        }
    })
    .catch(error => console.error("Error al agregar producto al carrito:", error)); // Manejo de errores
}


function adjustQuantity(change, max) {
    const input = document.getElementById('cantidad');
    let value = parseInt(input.value) + change;
    
    if (value < 1) value = 1;
    if (value > max) value = max;
    
    input.value = value;
}

function validarCantidad(input, max) {
    if (input.value < 1) {
        input.value = 1;
    } else if (input.value > max) {
        input.value = max;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButton = document.querySelector('#close-modal');
    const pedidoIdInput = document.querySelector('#pedido-id');
    const cancelForm = document.getElementById('cancel-form');
    const tipoCuentaSelect = document.getElementById('tipoCuenta');
    const errorRazon = document.getElementById('errorRazon');

    // Abrir modal
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pedidoId = button.getAttribute('data-id');
            pedidoIdInput.value = pedidoId; // Asignar el ID del pedido al input oculto
            modal.classList.add('modal--show');
        });
    });

    // Cerrar modal
    closeModalButton.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('modal--show');
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal--show');
        }
    });

    // Validar selección de razón antes de enviar el formulario
    cancelForm.addEventListener('submit', (e) => {
        if (tipoCuentaSelect.value === '') {
            e.preventDefault(); // Evitar envío si no hay selección
            errorRazon.style.display = 'block'; // Mostrar mensaje de error
        } else {
            errorRazon.style.display = 'none'; // Ocultar mensaje de error
        }
    });
});

function cerrarMensaje() {
    document.getElementById('mensaje').style.display = 'none';
}

// Mostrar o ocultar la notificación al hacer clic en el icono
document.body.addEventListener('click', function(event) {
    let notificacion = document.getElementById('notificacion');

    if (event.target.closest('#toggle-notificacion')) {
        event.preventDefault();

        // Si la notificación no ha sido abierta antes, marcarla como leída
        if (!notificacion.classList.contains('active')) {
            fetch('../Templeate/marcar_leidas.php', {
                method: 'POST'
            }).then(response => response.text())
              .then(data => {
                if (data === 'success') {
                    let contador = document.getElementById('notificacion-contador');
                    if (contador) {
                        contador.style.display = 'none'; // Oculta el contenedor del número
                    }
                    // Guardar en localStorage que la notificación ya fue abierta
                    localStorage.setItem('notificacion_abierta', 'true');
                }
              });
        }

        notificacion.classList.toggle('active');
    } else {
        if (notificacion.classList.contains('active') && !event.target.closest('#notificacion')) {
            notificacion.classList.remove('active');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('../Templeate/contar_no_leidas.php')
        .then(response => response.json())
        .then(data => {
            let contador = document.getElementById('notificacion-contador');

            if (contador) {
                if (data.total > 0) {
                    contador.textContent = data.total; // Mostrar número
                    contador.style.display = 'inline-block'; // Asegurar que se muestre
                } else {
                    contador.style.display = 'none'; // Ocultar el contenedor completamente
                }
            }
        });

        let cerrarNotificacion = document.getElementById('cerrarNotificacion');
        if (cerrarNotificacion) {
            cerrarNotificacion.addEventListener('click', function() {
                let notificacion = document.getElementById('notificacion');
                notificacion.classList.remove('active');
            });
        }


});




function togglePassword() {
    var passwordField = document.getElementById("contrasena");
    var toggleText = document.getElementById("toggleText");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleText.textContent = "Ocultar";
    } else {
        passwordField.type = "password";
        toggleText.textContent = "Mostrar";
    }
}

