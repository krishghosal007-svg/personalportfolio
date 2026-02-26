document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Determine offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple interaction on the form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';

            // Simulate an API call
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = 'linear-gradient(45deg, #10b981, #059669)';
                btn.style.opacity = '1';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // Parallax effect for the orbs based on mouse movement
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const factor = index === 0 ? 30 : -30;
            const moveX = (x - 0.5) * factor;
            const moveY = (y - 0.5) * factor;

            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            orb.style.transition = 'transform 0.5s ease-out';
        });
    });

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled;
        }
    });

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    const hoverElements = document.querySelectorAll('a, button, input, textarea, .project-card, .about-grid');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Typing Effect Logic
    const typingSpan = document.querySelector('.typing-text');
    const roles = ["Software Developer", "React.js Enthusiast", "Data Analyst", "Laravel Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typingSpan) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1000);

    // 3D Tilt Effect for Cards
    const cards = document.querySelectorAll('.project-card, .about-grid, .contact-form');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            // Reset transformation
            card.style.transform = 'perspective(1000px) translateY(0) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // Velocity Edit Effect for About Profile Video
    const aboutVideo = document.querySelector('.profile-video');

    if (aboutVideo) {
        let lastScrollY = window.scrollY;
        let speedTimeout;
        const basePlaybackRate = 1.0;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;

            // Limit checking frequency or check if video is in viewport to optimize
            const rect = aboutVideo.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                let targetRate = basePlaybackRate + (scrollDelta * 0.05);
                targetRate = Math.min(targetRate, 4.0); // Cap max speed

                if (!isNaN(aboutVideo.duration)) {
                    aboutVideo.playbackRate = targetRate;
                }

                clearTimeout(speedTimeout);
                speedTimeout = setTimeout(() => {
                    let slowDownInterval = setInterval(() => {
                        if (aboutVideo.playbackRate > basePlaybackRate) {
                            aboutVideo.playbackRate -= 0.1;
                            if (aboutVideo.playbackRate < basePlaybackRate) {
                                aboutVideo.playbackRate = basePlaybackRate;
                                clearInterval(slowDownInterval);
                            }
                        } else {
                            clearInterval(slowDownInterval);
                        }
                    }, 50);
                }, 100);
            }
        });
    }
});
