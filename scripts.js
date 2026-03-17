document.addEventListener('DOMContentLoaded', () => {
    const navbar   = document.getElementById('navbar');
    const menuBtn  = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // ── 1. Scrolled Navbar ────────────────────────────────────────────────────
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        highlightActiveLink();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── 2. Mobile Menu ───────────────────────────────────────────────────────
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        const spans  = menuBtn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        }
    });

    // Close on nav link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        });
    });

    // ── 3. Active Nav Highlight ───────────────────────────────────────────────
    function highlightActiveLink() {
        let current = '';
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    }

    // ── 4. Scroll Reveal ─────────────────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
        revealObserver.observe(el);
    });

    // ── 5. Stagger Cert Cards ─────────────────────────────────────────────────
    document.querySelectorAll('.cert-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.05}s`;
    });

    // ── 6. Stagger Info Chips ─────────────────────────────────────────────────
    document.querySelectorAll('.info-chip').forEach((chip, i) => {
        chip.style.transitionDelay = `${0.15 + i * 0.08}s`;
    });
});
