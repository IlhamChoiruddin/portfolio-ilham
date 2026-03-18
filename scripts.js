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
// ── 2. Mobile Menu (SAFE) ─────────────────────────────────────────
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        const spans  = menuBtn.querySelectorAll('span');

        if (spans.length === 3) {
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity   = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity   = '';
                spans[2].style.transform = '';
            }
        }
    });
}

    // Close on nav link click
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('open');

        if (menuBtn) {
            const spans = menuBtn.querySelectorAll('span');
            if (spans.length === 3) {
                spans[0].style.transform = '';
                spans[1].style.opacity   = '';
                spans[2].style.transform = '';
            }
        }
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
if ('IntersectionObserver' in window) {
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

} else {
    // fallback kalau tidak support
    document.querySelectorAll('.reveal, .reveal-delay').forEach(el => {
        el.classList.add('visible');
    });
}

    // ── 5. Stagger Cert Cards ─────────────────────────────────────────────────
    document.querySelectorAll('.cert-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.05}s`;
    });

    // ── 6. Stagger Info Chips ─────────────────────────────────────────────────
    document.querySelectorAll('.info-chip').forEach((chip, i) => {
        chip.style.transitionDelay = `${0.15 + i * 0.08}s`;
    });
    // ── 7. Project & PDF Modal ──────────────────────────────────────────────
    const modal = document.getElementById('projectModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalPdf = document.getElementById('modalPdf');
    const modalContent = document.querySelector('.modal-content');
    const modalImagePlaceholder = document.getElementById('modalImagePlaceholder');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const openPdfBtns = document.querySelectorAll('.open-pdf-btn');

    if (modal && modalOverlay && modalClose) {
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modalImage) {
                    modalImage.src = '';
                    modalImage.classList.remove('loaded');
                }
                if (modalPdf) {
                    modalPdf.src = '';
                    setTimeout(() => { modalPdf.classList.remove('loaded'); }, 10);
                }
                if (modalContent) modalContent.classList.remove('pdf-mode');
                if (modalImagePlaceholder) modalImagePlaceholder.style.display = 'flex';
            }, 300); // Wait for transition
        };

        if (openModalBtns.length > 0) {
            openModalBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const imgSrc = btn.getAttribute('data-img');
                    
                    if (modalContent) modalContent.classList.remove('pdf-mode');
                    modal.classList.add('active');
                    
                    if (modalPdf) modalPdf.classList.remove('loaded');
                    if (modalImagePlaceholder) modalImagePlaceholder.style.display = 'flex';
                    if (modalImage) modalImage.classList.remove('loaded');
                    
                    if (imgSrc && modalImage) {
                        modalImage.src = imgSrc;
                        modalImage.onload = () => {
                            if (modalImagePlaceholder) modalImagePlaceholder.style.display = 'none';
                            modalImage.classList.add('loaded');
                        };
                        modalImage.onerror = () => {
                            if (modalImagePlaceholder) modalImagePlaceholder.style.display = 'flex';
                            if (modalImagePlaceholder) modalImagePlaceholder.innerHTML = '<span>Belum Ada Gambar Preview</span>';
                            modalImage.classList.remove('loaded');
                        };
                    } else {
                        if (modalImagePlaceholder) modalImagePlaceholder.innerHTML = '<span>Belum Ada Gambar Preview</span>';
                    }
                });
            });
        }

        if (openPdfBtns.length > 0) {
            openPdfBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pdfSrc = btn.getAttribute('data-pdf');
                    
                    if (modalContent) modalContent.classList.add('pdf-mode');
                    modal.classList.add('active');
                    
                    if (modalImage) modalImage.classList.remove('loaded');
                    if (modalImagePlaceholder) modalImagePlaceholder.style.display = 'none';
                    if (modalPdf && pdfSrc) {
                        modalPdf.src = pdfSrc;
                        modalPdf.classList.add('loaded');
                    }
                });
            });
        }

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
});
