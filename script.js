/**
 * Joshua Kyle C. Dimayuga - Professional Portfolio Script
 * Interactive features, animations, and UI/UX logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. LOADER & INITIALIZATION
    // ==========================================
    const loaderScreen = document.getElementById('loaderScreen');
    const yearSpan = document.getElementById('year');
    
    // Set Footer Year
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Hide Loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loaderScreen) loaderScreen.classList.add('hidden');
            // Trigger AOS for hero immediately
            initAOS();
            animateStats();
        }, 800);
    });

    // ==========================================
    // 2. CURSOR GLOW EFFECT
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            cursorGlow.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // ==========================================
    // 3. NAVIGATION & SCROLL LOGIC
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const backToTop = document.getElementById('backToTop');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Sticky Navbar & Back to Top
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar scrolled state
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Hamburger Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isExpanded ? 'auto' : 'hidden'; // Prevent scroll when open
        });
    }

    // Close Mobile Menu on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Back to Top Click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 4. ANIMATE ON SCROLL (AOS)
    // ==========================================
    function initAOS() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    // Once animated, no need to track anymore
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    }

    // ==========================================
    // 5. STATS COUNTER ANIMATION
    // ==========================================
    function animateStats() {
        const stats = document.querySelectorAll('.stat-num');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            let current = 0;
            const duration = 2000;
            const increment = target / (duration / 16); // 60fps approx

            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            };
            updateCount();
        });
    }

    // ==========================================
    // 6. PROJECT FILTERING
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category.includes(filter)) {
                    card.classList.remove('hide');
                    // Add a slight delay for re-appearing animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 300);
                }
            });
        });
    });

    // ==========================================
    // 7. LIGHTBOX GALLERY
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const src = img.getAttribute('src');
                lightboxImg.setAttribute('src', src);
                lightboxImg.setAttribute('alt', img.getAttribute('alt'));
                lightbox.removeAttribute('hidden');
                document.body.style.overflow = 'hidden';
            });

            // Accessibility: Enter key to open
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') item.click();
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.setAttribute('hidden', '');
            document.body.style.overflow = 'auto';
        });

        // Close on outside click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightboxClose.click();
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
                lightboxClose.click();
            }
        });
    }

    // ==========================================
    // 8. CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('form-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous feedback
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            // Basic validation
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            const subject = document.getElementById('contact-subject').value;

            if (!name || !email || !message) {
                showToast('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate loading
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Submit using fetch to Formsubmit
            fetch('https://formsubmit.co/ajax/kyle.dimayuga18@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject || 'New message from portfolio',
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                
                if (data.success === 'true' || data.success === true) {
                    // Show success
                    formFeedback.textContent = 'Thank you! Your message has been sent.';
                    formFeedback.classList.add('feedback-success');
                    showToast('Message sent successfully!');
                    contactForm.reset();
                } else {
                    showToast('Oops! Something went wrong.', 'error');
                }
            })
            .catch(error => {
                btnText.textContent = originalText;
                submitBtn.disabled = false;
                showToast('Oops! Something went wrong.', 'error');
                console.log(error);
            });
        });
    }

    // ==========================================
    // 9. TOAST NOTIFICATION
    // ==========================================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        const toastIcon = toast.querySelector('.toast-icon');

        if (!toast) return;

        toastMsg.textContent = message;
        
        if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
            toast.style.borderLeftColor = '#f87171';
        } else {
            toastIcon.className = 'fas fa-check-circle toast-icon';
            toast.style.borderLeftColor = 'var(--color-accent-base)';
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
