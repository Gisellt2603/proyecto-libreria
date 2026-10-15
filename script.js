/* CARRUTSEL BANNERS */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("heroSliderTrack");
    const dots = document.querySelectorAll("#heroIndicators .indicator-dot");
    if (!track || dots.length === 0) return;

    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentIndex);
        });
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3500);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();
});

/* OCUALTAR CONTRASEÑA CON ICONO DEL JITO */
document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".btn-toggle-password");

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target") || "passwordInput";
            const targetInput = document.getElementById(targetId);
            const icon = btn.querySelector("i");

            if (targetInput && icon) {
                const isPassword = targetInput.getAttribute("type") === "password";
                targetInput.setAttribute("type", isPassword ? "text" : "password");
                
                if (isPassword) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                } else {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        });
    });
});

/* CARGAR DATOS DINAMICOS EN LA PAGINA DETALLE LIBRO */
document.addEventListener("DOMContentLoaded", () => {
    const detalleTitulo = document.getElementById("detalleTitulo");
    if (!detalleTitulo) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get("id") || "1";

    if (typeof catalogoLibros !== "undefined") {
        const libroEncontrado = catalogoLibros.find(libro => String(libro.id) === String(libroId));

        if (libroEncontrado) {
            document.title = `${libroEncontrado.titulo} - Librería El Recreo`;
            detalleTitulo.textContent = libroEncontrado.titulo;
            
            const autorEl = document.getElementById("detalleAutor");
            if (autorEl) autorEl.textContent = libroEncontrado.autor;
            
            const precioEl = document.getElementById("detallePrecio");
            if (precioEl) precioEl.textContent = libroEncontrado.precio;
            
            const sinopsisEl = document.getElementById("detalleSinopsis");
            if (sinopsisEl) sinopsisEl.textContent = libroEncontrado.sinopsis;

            const portadaImg = document.getElementById("detallePortada");
            if (portadaImg) {
                portadaImg.src = libroEncontrado.portada;
                portadaImg.alt = libroEncontrado.titulo;
            }

            if (libroEncontrado.detalles) {
                const setEl = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = val || "-";
                };
                setEl("specPeso", libroEncontrado.detalles.peso);
                setEl("specAutor", libroEncontrado.autor);
                setEl("specEditorial", libroEncontrado.detalles.editorial);
                setEl("specAlto", libroEncontrado.detalles.alto);
                setEl("specAncho", libroEncontrado.detalles.ancho);
                setEl("specFormato", libroEncontrado.detalles.formato);
                setEl("specPaginas", libroEncontrado.detalles.paginas);
                setEl("specIsbn", libroEncontrado.detalles.isbn);
                setEl("specIdioma", libroEncontrado.detalles.idioma);
            }
        }
    }
});

/* CONTADOR DE CANTIDAD DE LIBROS + Y - */
document.addEventListener("DOMContentLoaded", () => {
    const btnRestar = document.getElementById("btnRestar");
    const btnSumar = document.getElementById("btnSumar");
    const valorCantidad = document.getElementById("valorCantidad");

    if (btnRestar && btnSumar && valorCantidad) {
        let cant = 1;

        btnSumar.addEventListener("click", () => {
            cant++;
            valorCantidad.textContent = cant;
        });

        btnRestar.addEventListener("click", () => {
            if (cant > 1) {
                cant--;
                valorCantidad.textContent = cant;
            }
        });
    }
});

/* GESTION DE LISTA DE DESEOS */
function obtenerDeseos() {
    return JSON.parse(localStorage.getItem("misDeseos")) || [];
}

function guardarDeseos(lista) {
    localStorage.setItem("misDeseos", JSON.stringify(lista));
}

// Clic en los corazones
document.addEventListener("DOMContentLoaded", () => {
    const listaDeseos = obtenerDeseos();
    const botonesCorazon = document.querySelectorAll(".btn-wishlist");

    botonesCorazon.forEach((boton) => {
        const tarjeta = boton.closest(".book-card");
        if (!tarjeta) return;

        const enlace = tarjeta.querySelector("a[href*='detalle_libro.html?id=']");
        let libroId = null;
        if (enlace) {
            const url = new URL(enlace.href, window.location.origin);
            libroId = url.searchParams.get("id");
        }

        const icono = boton.querySelector("i");

        if (libroId && listaDeseos.includes(libroId) && icono) {
            icono.classList.remove("fa-regular");
            icono.classList.add("fa-solid");
        }

        boton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!libroId) return;

            let deseosActuales = obtenerDeseos();

            if (deseosActuales.includes(libroId)) {
                deseosActuales = deseosActuales.filter(id => id !== libroId);
                if (icono) {
                    icono.classList.remove("fa-solid");
                    icono.classList.add("fa-regular");
                }
            } else {
                deseosActuales.push(libroId);
                if (icono) {
                    icono.classList.remove("fa-regular");
                    icono.classList.add("fa-solid");
                }
            }

            guardarDeseos(deseosActuales);
        });
    });
});

// Pintar la lista en lista-deseos.html
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedorWishlist");
    if (!contenedor) return;

    function renderizarDeseos() {
        const deseos = obtenerDeseos();
        contenedor.innerHTML = "";

        if (deseos.length === 0) {
            contenedor.innerHTML = `
                <div style="text-align: center; color: #777; padding: 40px 0;">
                    <i class="fa-regular fa-heart" style="font-size: 40px; margin-bottom: 15px; color: #ccc;"></i>
                    <p>Tu lista de deseos está vacía por el momento.</p>
                </div>
            `;
            return;
        }

        if (typeof catalogoLibros !== "undefined") {
            deseos.forEach((id) => {
                const libro = catalogoLibros.find(item => String(item.id) === String(id));
                if (libro) {
                    const fila = document.createElement("article");
                    fila.classList.add("wishlist-item");
                    fila.innerHTML = `
                        <div class="wishlist-cover">
                            <a href="detalle_libro.html?id=${libro.id}">
                                <img src="${libro.portada}" alt="${libro.titulo}">
                            </a>
                        </div>
                        <div class="wishlist-info">
                            <h2 class="wishlist-book-title"><a href="detalle_libro.html?id=${libro.id}">${libro.titulo}</a></h2>
                            <span class="wishlist-book-author">${libro.autor}</span>
                            <span class="wishlist-book-price">${libro.precio}</span>
                            <p class="wishlist-book-desc">${libro.sinopsis}</p>
                            <div class="wishlist-actions">
                                <button class="btn-add-cart">Añadir al carrito</button>
                                <button class="btn-remove-wishlist" data-id="${libro.id}">Eliminar de mi lista</button>
                            </div>
                        </div>
                    `;
                    contenedor.appendChild(fila);
                }
            });

            document.querySelectorAll(".btn-remove-wishlist").forEach((btnBorrar) => {
                btnBorrar.addEventListener("click", () => {
                    const idParaBorrar = btnBorrar.getAttribute("data-id");
                    let deseosRestantes = obtenerDeseos().filter(id => id !== idParaBorrar);
                    guardarDeseos(deseosRestantes);
                    renderizarDeseos();
                });
            });
        }
    }

    renderizarDeseos();
});


/* FUNCION PARA EL CARRITO DE COMPRAS */

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("miCarrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("miCarrito", JSON.stringify(carrito));
}

function parsearPrecio(precioStr) {
    if (!precioStr) return 0;
    const limpio = String(precioStr).replace(/[^0-9.,]/g, "").replace(",", ".");
    return parseFloat(limpio) || 0;
}

/* escuchar botones añadir carrito a cualquier pagina */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const tarjeta = btn.closest(".book-card") || btn.closest(".wishlist-info");
            if (!tarjeta) return;

            const enlace = tarjeta.querySelector("a[href*='detalle_libro.html?id=']");
            let libroId = null;
            if (enlace) {
                const url = new URL(enlace.href, window.location.origin);
                libroId = url.searchParams.get("id");
            }

            if (libroId) {
                agregarProductoCarrito(libroId, 1);
            }
        });
    });

    // desde la página de detalle del libro
    const btnComprarDetalle = document.querySelector(".btn-comprar");
    if (btnComprarDetalle) {
        btnComprarDetalle.addEventListener("click", () => {
            const urlParams = new URLSearchParams(window.location.search);
            const libroId = urlParams.get("id") || "1";
            const cantEl = document.getElementById("valorCantidad");
            const cantidad = cantEl ? parseInt(cantEl.textContent) || 1 : 1;

            agregarProductoCarrito(libroId, cantidad);
        });
    }

    function agregarProductoCarrito(id, cantidad) {
        let carrito = obtenerCarrito();
        const itemExistente = carrito.find(p => String(p.id) === String(id));

        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({ id: String(id), cantidad: cantidad });
        }

        guardarCarrito(carrito);
        alert("¡Libro agregado al carrito con éxito!");
    }
});

// renderizar y calcular en carrito.html
document.addEventListener("DOMContentLoaded", () => {
    const contenedorCarrito = document.getElementById("contenedorCarrito");
    if (!contenedorCarrito) return; // Si no estamos en carrito.html, no hace nada

    function renderizarCarrito() {
        const carrito = obtenerCarrito();
        contenedorCarrito.innerHTML = "";

        if (carrito.length === 0) {
            contenedorCarrito.innerHTML = `
                <div style="text-align: center; color: #777; padding: 50px 0;">
                    <i class="fa-solid fa-cart-shopping" style="font-size: 45px; margin-bottom: 15px; color: #ccc;"></i>
                    <p style="font-size: 15px;">Tu carrito de compras está vacío.</p>
                </div>
            `;
            actualizarTotales(0);
            return;
        }

        let totalGeneral = 0;

        if (typeof catalogoLibros !== "undefined") {
            carrito.forEach((item) => {
                const libro = catalogoLibros.find(l => String(l.id) === String(item.id));
                if (libro) {
                    const precioUnit = parsearPrecio(libro.precio);
                    const subtotal = precioUnit * item.cantidad;
                    totalGeneral += subtotal;

                    const fila = document.createElement("div");
                    fila.classList.add("cart-row");
                    fila.innerHTML = `
                        <div class="cart-prod-info">
                            <div class="cart-cover-box">
                                <img src="${libro.portada}" alt="${libro.titulo}">
                            </div>
                            <span class="cart-prod-name">${libro.titulo}</span>
                        </div>
                        <div class="cart-price">S/${precioUnit.toFixed(2)}</div>
                        <div>
                            <div class="cart-qty-box">
                                <button type="button" class="cart-qty-btn btn-cart-minus" data-id="${libro.id}">-</button>
                                <span class="cart-qty-num">${item.cantidad}</span>
                                <button type="button" class="cart-qty-btn btn-cart-plus" data-id="${libro.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-subtotal">S/${subtotal.toFixed(2)}</div>
                        <div>
                            <button type="button" class="btn-delete-item" data-id="${libro.id}" aria-label="Eliminar">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    `;
                    contenedorCarrito.appendChild(fila);
                }
            });

            actualizarTotales(totalGeneral);
            asignarEventosCarrito();
        }
    }

    function actualizarTotales(total) {
        const formatted = `S/${total.toFixed(2)}`;
        const subtotalEl = document.getElementById("cartSubtotalText");
        const totalEl = document.getElementById("cartTotalText");
        if (subtotalEl) subtotalEl.textContent = formatted;
        if (totalEl) totalEl.textContent = formatted;
    }

    function asignarEventosCarrito() {
        // Botón restar cantidad
        document.querySelectorAll(".btn-cart-minus").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                let carrito = obtenerCarrito();
                const item = carrito.find(p => String(p.id) === String(id));
                if (item) {
                    if (item.cantidad > 1) {
                        item.cantidad--;
                    } else {
                        carrito = carrito.filter(p => String(p.id) !== String(id));
                    }
                    guardarCarrito(carrito);
                    renderizarCarrito();
                }
            });
        });

        // Botón sumar cantidad
        document.querySelectorAll(".btn-cart-plus").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                let carrito = obtenerCarrito();
                const item = carrito.find(p => String(p.id) === String(id));
                if (item) {
                    item.cantidad++;
                    guardarCarrito(carrito);
                    renderizarCarrito();
                }
            });
        });

        // Botón borrar libro (X)
        document.querySelectorAll(".btn-delete-item").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                let carrito = obtenerCarrito().filter(p => String(p.id) !== String(id));
                guardarCarrito(carrito);
                renderizarCarrito();
            });
        });
    }

    renderizarCarrito();
});
// ===================================================
// 1. CARRUSEL DEL BANNER PRINCIPAL
// ===================================================
/* document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("heroSliderTrack");
    const dots = document.querySelectorAll("#heroIndicators .indicator-dot");
    if (!track || dots.length === 0) return;

    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentIndex);
        });
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();
}); */

// ===================================================
// 2. MOSTRAR / OCULTAR CONTRASEÑA (OJITO)
// ===================================================
/* document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".btn-toggle-password");

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target") || "passwordInput";
            const targetInput = document.getElementById(targetId);
            const icon = btn.querySelector("i");

            if (targetInput && icon) {
                const isPassword = targetInput.getAttribute("type") === "password";
                targetInput.setAttribute("type", isPassword ? "text" : "password");
                
                if (isPassword) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                } else {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        });
    });
}); */


// CARGAR DATOS DINÁMICOS EN DETALLE_LIBRO.HTML

/* document.addEventListener("DOMContentLoaded", () => {
    const detalleTitulo = document.getElementById("detalleTitulo");
    if (!detalleTitulo) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get("id") || "1"; 


    if (typeof catalogoLibros !== "undefined") {
        const libroEncontrado = catalogoLibros.find(libro => String(libro.id) === String(libroId));

        if (libroEncontrado) {
            document.title = `${libroEncontrado.titulo} - Librería El Recreo`;
            detalleTitulo.textContent = libroEncontrado.titulo;
            document.getElementById("detalleAutor").textContent = libroEncontrado.autor;
            document.getElementById("detallePrecio").textContent = libroEncontrado.precio;
            document.getElementById("detalleSinopsis").textContent = libroEncontrado.sinopsis;

            const portadaImg = document.getElementById("detallePortada");
            if (portadaImg) {
                portadaImg.src = libroEncontrado.portada;
                portadaImg.alt = libroEncontrado.titulo;
            }

            if (libroEncontrado.detalles) {
                document.getElementById("specPeso").textContent = libroEncontrado.detalles.peso;
                document.getElementById("specAutor").textContent = libroEncontrado.autor;
                document.getElementById("specEditorial").textContent = libroEncontrado.detalles.editorial;
                document.getElementById("specAlto").textContent = libroEncontrado.detalles.alto;
                document.getElementById("specAncho").textContent = libroEncontrado.detalles.ancho;
                document.getElementById("specFormato").textContent = libroEncontrado.detalles.formato;
                document.getElementById("specPaginas").textContent = libroEncontrado.detalles.paginas;
                document.getElementById("specIsbn").textContent = libroEncontrado.detalles.isbn;
                document.getElementById("specIdioma").textContent = libroEncontrado.detalles.idioma;
            }
        } else {
            detalleTitulo.textContent = "Libro no encontrado";
        }
    }
}); */

// ===================================================
// 4. CONTADOR DE CANTIDAD DE LIBROS (+ / -)
// ===================================================
/* document.addEventListener("DOMContentLoaded", () => {
    const btnRestar = document.getElementById("btnRestar");
    const btnSumar = document.getElementById("btnSumar");
    const valorCantidad = document.getElementById("valorCantidad");

    if (btnRestar && btnSumar && valorCantidad) {
        let cant = 1;

        btnSumar.addEventListener("click", () => {
            cant++;
            valorCantidad.textContent = cant;
        });

        btnRestar.addEventListener("click", () => {
            if (cant > 1) {
                cant--;
                valorCantidad.textContent = cant;
            }
        });
    }
}); */





// Carrusel del Banner Principal
/* document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("heroSliderTrack");
    const dots = document.querySelectorAll("#heroIndicators .indicator-dot");
    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, idx) => {
            dot.classList.toggle("active", idx === currentIndex);
        });
    }

    function nextSlide() {
        let nextIndex = (currentIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });


    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();
}); */

/* CODIGO PARA CERRAR EL OJITO */
/* document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("togglePasswordBtn");
    const passwordInput = document.getElementById("passwordInput");
    const toggleIcon = document.getElementById("togglePasswordIcon");

    if (toggleBtn && passwordInput && toggleIcon) {
        toggleBtn.addEventListener("click", () => {
            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");
            
            /* abrir cerrar ojio 
            if (isPassword) {
                toggleIcon.classList.remove("fa-eye");
                toggleIcon.classList.add("fa-eye-slash");
            } else {
                toggleIcon.classList.remove("fa-eye-slash");
                toggleIcon.classList.add("fa-eye");
            }
        });
    }
}); */

/* document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".btn-toggle-password");

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const targetInput = document.getElementById(targetId);
            const icon = btn.querySelector("i");

            if (targetInput) {
                const isPassword = targetInput.getAttribute("type") === "password";
                targetInput.setAttribute("type", isPassword ? "text" : "password");
                
                if (isPassword) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                } else {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            }
        });
    });
}); */

/* LLAMAR LIBRO PARA IR A PAGINA DETALLE LIBRO */

/* document.addEventListener("DOMContentLoaded", () => {

    const detalleTitulo = document.getElementById("detalleTitulo");
    if (!detalleTitulo) return;
    const urlParams = new URLSearchParams(window.location.search);
    const libroId = urlParams.get("id") || "1"; 


    if (typeof catalogoLibros !== "undefined") {
        const libroEncontrado = catalogoLibros.find(libro => libro.id === libroId);

        if (libroEncontrado) {
        
            document.title = `${libroEncontrado.titulo} - Librería El Recreo`;
            detalleTitulo.textContent = libroEncontrado.titulo;
            document.getElementById("detalleAutor").textContent = libroEncontrado.autor;
            document.getElementById("detallePrecio").textContent = libroEncontrado.precio;
            document.getElementById("detalleSinopsis").textContent = libroEncontrado.sinopsis;

            const portadaImg = document.getElementById("detallePortada");
            if (portadaImg) {
                portadaImg.src = libroEncontrado.portada;
                portadaImg.alt = libroEncontrado.titulo;
            }

            if (libroEncontrado.detalles) {
                document.getElementById("specPeso").textContent = libroEncontrado.detalles.peso;
                document.getElementById("specAutor").textContent = libroEncontrado.autor;
                document.getElementById("specEditorial").textContent = libroEncontrado.detalles.editorial;
                document.getElementById("specAlto").textContent = libroEncontrado.detalles.alto;
                document.getElementById("specAncho").textContent = libroEncontrado.detalles.ancho;
                document.getElementById("specFormato").textContent = libroEncontrado.detalles.formato;
                document.getElementById("specPaginas").textContent = libroEncontrado.detalles.paginas;
                document.getElementById("specIsbn").textContent = libroEncontrado.detalles.isbn;
                document.getElementById("specIdioma").textContent = libroEncontrado.detalles.idioma;
            }
        } else {
            detalleTitulo.textContent = "Libro no encontrado";
        }
    }
}); */

/* AUMENTAR CONTADOR DE CANTIDAD DE LIBIORS */

/* document.addEventListener("DOMContentLoaded", () => {
    const btnRestar = document.getElementById("btnRestar");
    const btnSumar = document.getElementById("btnSumar");
    const valorCantidad = document.getElementById("valorCantidad");

    if (btnRestar && btnSumar && valorCantidad) {
        let cant = 1;

        btnSumar.addEventListener("click", () => {
            cant++;
            valorCantidad.textContent = cant;
        });

        btnRestar.addEventListener("click", () => {
            if (cant > 1) {
                cant--;
                valorCantidad.textContent = cant;
            }
        });
    }
}); */
