// ============================================
//  Portfolio — Main JavaScript
//  Author: Devansh Gupta
// ============================================

(function () {
    'use strict';

    // ---- DOM READY ----
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initLoader();
        initCursor();
        initNavbar();
        initMobileMenu();
        initRevealObserver();
        initSkillBars();
        initCounters();
        initCardTilt();
        initRippleButtons();
        initBackToTop();
        initContactForm();
        initSmoothScroll();
    }

    // Make initRevealObserver globally accessible (for LinkedIn posts page)
    window.initRevealObserver = initRevealObserver;

    // ================================================
    // 1. PAGE LOADER
    // ================================================
    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        const minTime = 800;
        const start = performance.now();

        function hideLoader() {
            const elapsed = performance.now() - start;
            const remaining = Math.max(0, minTime - elapsed);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                // Trigger reveals after loader hides
                setTimeout(() => {
                    document.querySelectorAll('.reveal-up').forEach(el => {
                        if (isInViewport(el)) el.classList.add('revealed');
                    });
                }, 100);
            }, remaining);
        }

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
        }
    }

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    }

    // ================================================
    // 2. CUSTOM CURSOR
    // ================================================
    function initCursor() {
        const dot = document.getElementById('cursorDot');
        const outline = document.getElementById('cursorOutline');
        if (!dot || !outline) return;

        // Don't show custom cursor on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            dot.style.display = 'none';
            outline.style.display = 'none';
            return;
        }

        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Smooth outline follow
        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        // Hover state on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .card, .btn, input, textarea, select');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('hover');
                outline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('hover');
                outline.classList.remove('hover');
            });
        });

        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = '0';
            outline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity = '1';
            outline.style.opacity = '0.5';
        });
    }

    // ================================================
    // 3. NAVBAR SCROLL EFFECT
    // ================================================
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;
        let ticking = false;

        function onScroll() {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        onScroll();
    }

    // ================================================
    // 4. MOBILE MENU
    // ================================================
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isActive = toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close on link click
        menu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ================================================
    // 5. SCROLL REVEAL (IntersectionObserver)
    // ================================================
    function initRevealObserver() {
        const revealElements = document.querySelectorAll('.reveal-up:not(.revealed)');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // ================================================
    // 6. SKILL BAR ANIMATION
    // ================================================
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        if (!skillBars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ================================================
    // 7. COUNTER ANIMATION
    // ================================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (target - startVal) * ease);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }

    // ================================================
    // 8. CARD TILT EFFECT
    // ================================================
    function initCardTilt() {
        // Only on non-touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        const cards = document.querySelectorAll('.card, .project-card, .linkedin-post-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ================================================
    // 9. BUTTON RIPPLE EFFECT
    // ================================================
    function initRippleButtons() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.classList.add('btn-ripple');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ================================================
    // 10. BACK TO TOP
    // ================================================
    function initBackToTop() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        btn.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================================================
    // 11. CONTACT FORM HANDLER
    // ================================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const status = document.getElementById('formStatus');
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" style="animation: spin 1s linear infinite;">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="40" stroke-dashoffset="10" stroke-linecap="round"/>
                </svg>
                Sending...
            `;
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Show success message
                status.style.display = 'block';
                status.className = 'form-status success';
                status.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';

                // Reset form
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Hide status after 5 seconds
                setTimeout(() => {
                    status.style.display = 'none';
                }, 5000);
            }, 1500);

            /*
            // ===== REAL FORM SUBMISSION =====
            // To use a real service, uncomment this and replace the URL:
            //
            // Option 1: Formspree (https://formspree.io)
            // fetch('https://formspree.io/f/YOUR_ID', {
            //     method: 'POST',
            //     body: new FormData(form),
            //     headers: { 'Accept': 'application/json' }
            // })
            // .then(res => {
            //     if (res.ok) {
            //         status.className = 'form-status success';
            //         status.textContent = '✓ Message sent!';
            //         form.reset();
            //     } else {
            //         throw new Error('Submission failed');
            //     }
            // })
            // .catch(() => {
            //     status.className = 'form-status error';
            //     status.textContent = '✗ Something went wrong. Please try again.';
            // })
            // .finally(() => {
            //     status.style.display = 'block';
            //     submitBtn.innerHTML = originalText;
            //     submitBtn.disabled = false;
            // });
            */
        });
    }

    // ================================================
    // 12. SMOOTH SCROLL (for same-page anchors)
    // ================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

})();
