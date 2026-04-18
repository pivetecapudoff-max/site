/* ================================================================
   REVO BOT — script.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────
       1. PARTICLE CANVAS
    ──────────────────────────────────────── */
    const canvas  = document.getElementById('particles-canvas');
    const ctx     = canvas.getContext('2d');
    let   W, H, particles = [], mouseX = 0, mouseY = 0;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); spawnParticles(); });

    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawnParticles() {
        particles = [];
        const count = Math.floor((W * H) / 14000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x:     rand(0, W),
                y:     rand(0, H),
                r:     rand(0.5, 2.2),
                vx:    rand(-0.18, 0.18),
                vy:    rand(-0.22, 0.08),
                alpha: rand(0.1, 0.45),
                hue:   rand(0, 360), // white particles
            });
        }
    }
    spawnParticles();

    let animId;
    function drawParticles() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            // mouse repulsion
            const dx = p.x - mouseX, dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120 * 0.6;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
            // friction
            p.vx *= 0.98; p.vy *= 0.98;

            p.x += p.vx; p.y += p.vy;

            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });

        // draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            
            // Connect to mouse
            const hdx = a.x - mouseX, hdy = a.y - mouseY;
            const hDist = hdx * hdx + hdy * hdy;
            if (hDist < 12000) {
                const opacity = (1 - hDist / 12000) * 0.25;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1.0;
                ctx.stroke();
            }

            // Connect to other particles
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 14000) {
                    const opacity = (1 - d2 / 14000) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        // Interactive 3D Glitch
        const glitch = document.querySelector('.glitch');
        if (glitch) {
            const gx = (e.clientX / window.innerWidth - 0.5) * 12;
            const gy = (e.clientY / window.innerHeight - 0.5) * 12;
            glitch.style.setProperty('--gx', `${gx}px`);
            glitch.style.setProperty('--gy', `${gy}px`);
        }

        // Parallax Download Rings
        const rings = document.querySelector('.download-rings');
        if (rings) {
            const rx = (e.clientX / window.innerWidth - 0.5) * -60;
            const ry = (e.clientY / window.innerHeight - 0.5) * -60;
            rings.style.transform = `translate(${rx}px, ${ry}px)`;
        }
    });


    /* ────────────────────────────────────────
       2. NAVBAR SCROLL EFFECT
    ──────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });


    /* ────────────────────────────────────────
       3. SCROLL REVEAL
    ──────────────────────────────────────── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el    = entry.target;
                const delay = el.style.getPropertyValue('--d') || '0s';
                el.style.transitionDelay = delay;
                el.classList.add('visible');
                revealObs.unobserve(el);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));


    /* ────────────────────────────────────────
       4. ANIMATED COUNTERS
    ──────────────────────────────────────── */
    function animateCounter(el, target, duration = 1600) {
        const start   = performance.now();
        const initial = parseInt(el.textContent) || 0;

        function formatNum(n) {
            if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            return Math.round(n).toString();
        }

        function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
            const current  = initial + (target - initial) * ease;
            el.textContent = formatNum(current);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = formatNum(target);
        }
        requestAnimationFrame(step);
    }

    const counterEls = document.querySelectorAll('.hstat-n[data-target]');
    let countersStarted = false;

    const counterObs = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting) && !countersStarted) {
            countersStarted = true;
            counterEls.forEach(el => {
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
            });
        }
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObs.observe(heroStats);


    /* ────────────────────────────────────────
       5. FAQ ACCORDION
    ──────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-q');
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // close all
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            });
            // toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* ────────────────────────────────────────
       6. SCROLL INDICATOR HIDE ON SCROLL
    ──────────────────────────────────────── */
    const scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) {
        window.addEventListener('scroll', () => {
            scrollInd.style.opacity = window.scrollY > 120 ? '0' : '';
        }, { passive: true });
    }


    /* ────────────────────────────────────────
       7. DYNAMIC SPOTLIGHT HOVER EFFECT
    ──────────────────────────────────────── */
    const hoverCards = document.querySelectorAll('.feature-card, .step, .review-card');
    hoverCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ────────────────────────────────────────
       8. SMOOTH ACTIVE NAV LINK
    ──────────────────────────────────────── */
    const sections  = document.querySelectorAll('section[id], header[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');

    const sectionObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => a.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObs.observe(s));


    /* ────────────────────────────────────────
       9. CUSTOM CURSOR
    ──────────────────────────────────────── */
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;
        let mx = cx;
        let my = cy;

        // Smooth cursor tracking loop
        function loopCursor() {
            cx += (mx - cx) * 0.25;
            cy += (my - cy) * 0.25;
            cursor.style.transform = `translate3d(calc(${cx}px - 50%), calc(${cy}px - 50%), 0)`;
            requestAnimationFrame(loopCursor);
        }
        requestAnimationFrame(loopCursor);

        window.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
        });

        const interactables = document.querySelectorAll('a, button');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

});

