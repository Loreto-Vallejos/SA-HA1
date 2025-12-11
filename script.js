document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Menu Logic --- */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    // Open Menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Close Menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close Menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    /* --- Contact Form & Toast --- */
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    // Funciones de Validación del formulario - (Modificado por seba - washington)


    function validarNombre(nombre) {
        return nombre.trim().length >= 3;
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarIdea(idea) {
        return idea.trim().length >= 10;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const idea = formData.get('idea');

            // Validar nombre
            if (!validarNombre(name)) {
                alert('El nombre debe tener al menos 3 caracteres');
                document.getElementById('name').value = '';
                return;
            }

            // Validar email
            if (!validarEmail(email)) {
                alert('Por favor ingresa un email válido');
                document.getElementById('email').value = '';
                return;
            }

            // Validar idea
            if (!validarIdea(idea)) {
                alert('La idea debe tener al menos 10 caracteres');
                document.getElementById('idea').value = '';
                return;
            }

            console.log(`Mensaje recibido de: ${name}`);

            // Show Toast
            showToast();

            // Reset Form
            contactForm.reset();
        });
    }

    function showToast() {
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /* --- Scroll Reveal (Optional Simple Effect) --- */
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'top',
            distance: '60px',
            duration: 2000,
            delay: 200,
        });
    }

    // Simple Intersection Observer for fade-in elements
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.card, .section__title, .hero__content');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    /* --- Carousel --- */
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(n) {
        if (!slides || slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        slides[n].classList.add('active');
    }

    if (totalSlides > 0) {
        showSlide(currentSlide);

        const nextBtn = document.querySelector('.carousel-control.next');
        const prevBtn = document.querySelector('.carousel-control.prev');

        if (nextBtn) nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        });

        // Auto change every 5s
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 5000);
    }

});



    

    //testimonial WASHINGTON M.

  document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    let current = 0;

    // Muestra la tarjeta actual
    function showCard(index) {
      cards.forEach(card => card.classList.remove('is-active'));
      cards[index].classList.add('is-active');
    }

    // Mostrar la primera al cargar
    showCard(current);

    // Cambiar cada 5 segundos (5000 ms)
    setInterval(() => {
      current = (current + 1) % cards.length;
      showCard(current);
    }, 5000);
  });

  

  

