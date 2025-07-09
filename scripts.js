// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Documento cargado y listo para scripts.");

    // --- Funciones de Carga de Datos Dinámicos ---
    async function loadServices() {
        try {
            const response = await fetch('data/servicios.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const services = await response.json();
            const servicesGrid = document.querySelector('#services .services-grid');
            if (servicesGrid) {
                servicesGrid.innerHTML = ''; // Limpiar placeholders si los hubiera
                services.forEach(service => {
                    const card = document.createElement('div');
                    card.className = 'service-card fade-in'; // Añadir fade-in para animación
                    card.innerHTML = `
                        <img src="${service.icono}" alt="Icono ${service.nombre}" class="service-icon">
                        <h3>${service.nombre}</h3>
                        <p>${service.descripcion}</p>
                    `;
                    servicesGrid.appendChild(card);
                });
                observeFadeInElements(); // Re-observar elementos para animación después de cargar
            }
        } catch (error) {
            console.error("No se pudieron cargar los servicios:", error);
            const servicesGrid = document.querySelector('#services .services-grid');
            if (servicesGrid) servicesGrid.innerHTML = "<p>Error al cargar servicios.</p>";
        }
    }

    async function loadProjects() {
        try {
            const response = await fetch('data/proyectos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projects = await response.json();
            const projectsGrid = document.querySelector('#projects .projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = ''; // Limpiar placeholders
                projects.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'project-card fade-in'; // Añadir fade-in para animación
                    card.innerHTML = `
                        <img src="${project.imagen}" alt="Imagen ${project.nombre}" class="project-image">
                        <div class="project-info">
                            <h3>${project.nombre}</h3>
                            <p>${project.resumen}</p>
                        </div>
                    `;
                    projectsGrid.appendChild(card);
                });
                observeFadeInElements(); // Re-observar elementos para animación después de cargar
            }
        } catch (error) {
            console.error("No se pudieron cargar los proyectos:", error);
            const projectsGrid = document.querySelector('#projects .projects-grid');
            if (projectsGrid) projectsGrid.innerHTML = "<p>Error al cargar proyectos.</p>";
        }
    }

    // Cargar datos dinámicos
    loadServices(); // Esto ya llama a observeFadeInElements internamente al final
    loadProjects(); // Esto ya llama a observeFadeInElements internamente al final

    // Implementar menú hamburguesa para móviles
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            if (mainNav.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-label', 'Cerrar menú');
                mobileMenuToggle.textContent = '✕';
            } else {
                mobileMenuToggle.setAttribute('aria-label', 'Abrir menú');
                mobileMenuToggle.textContent = '☰';
            }
        });
    }

    // Smooth scroll y cierre de menú móvil
    document.querySelectorAll('#main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-label', 'Abrir menú');
                mobileMenuToggle.textContent = '☰';
            }
            // El smooth scroll es manejado por CSS `scroll-behavior: smooth;`
        });
    });

    // Validación del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;
            let errors = [];

            if (name === "") { isValid = false; errors.push("El nombre es obligatorio."); }
            if (email === "") { isValid = false; errors.push("El correo electrónico es obligatorio."); }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { isValid = false; errors.push("Formato de correo no válido."); }
            if (message === "") { isValid = false; errors.push("El mensaje es obligatorio."); }

            if (isValid) {
                formStatus.textContent = "Mensaje enviado con éxito (simulación).";
                formStatus.className = 'success';
                contactForm.reset();
                console.log("Formulario válido. Datos:", { name, email, message });
            } else {
                formStatus.innerHTML = "Corrija los errores:<br>" + errors.join("<br>");
                formStatus.className = 'error';
            }
        });
    }

    // Animaciones 'fade-in' al hacer scroll (re-aplicar para elementos cargados dinámicamente)
    // Esta función ahora se llamará después de cargar contenido dinámico también.
    function observeFadeInElements() {
        const fadeInElements = document.querySelectorAll('.fade-in:not(.visible)'); // Solo observar los no visibles
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInElements.forEach(el => {
            scrollObserver.observe(el);
        });
    }
    // Observar elementos estáticos inicialmente
    observeFadeInElements();
    // Se podría llamar a observeFadeInElements() al final de loadServices y loadProjects
    // si se quiere asegurar que los nuevos elementos también son observados.
    // Sin embargo, como las clases .fade-in se añaden al crear los elementos,
    // y observeFadeInElements() se llama después de las cargas, debería funcionar.
    // Para mayor robustez, podríamos usar MutationObserver en las grids o llamar explícitamente.

    // (Opcional) Slider de testimonios (CSS overflow-x: auto; es la base)
    // const testimonialsSlider = document.querySelector('.testimonials-slider');
    // if (testimonialsSlider && testimonialsSlider.children.length > 1) {
        // console.log("Slider de testimonios con scroll horizontal activo."); // Comentado para producción
    // }

    // Resaltar enlace activo en menú
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('#main-nav ul li a');
    function changeLinkState() {
        let index = sections.length;
        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLinks[index]) {
           navLinks[index].classList.add('active');
        }
    }
    changeLinkState();
    window.addEventListener('scroll', changeLinkState);

    // Actualizar año en footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
