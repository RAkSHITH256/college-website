document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // --- Sticky Header & Active Link Updating ---
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id], header[id="home"]'); // Including hero

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Initial trigger for elements already in viewport ---
    // small timeout to ensure DOM is fully ready and CSS is applied
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                 el.classList.add('visible');
            }
        });
    }, 100);

    // --- Application Form Handling ---
    const applicationForm = document.getElementById('application-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI Update: loading state
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Gather data
            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Send POST request to backend API
                const response = await fetch('/api/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = result.message || 'Application submitted successfully!';
                    applicationForm.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.textContent = result.error || 'Failed to submit application.';
                }
            } catch (error) {
                console.error('Submission error:', error);
                formStatus.className = 'form-status error';
                formStatus.textContent = 'A network error occurred. Please try again.';
            } finally {
                // Restore UI
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});
