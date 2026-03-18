import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace all certificate links using regex
html = re.sub(
    r'<a href="(certificates/[^>]+.pdf)" target="_blank" rel="noopener" class="cert-link">\s*📄\s*Lihat Sertifikat\s*</a>',
    r'<button class="cert-link open-pdf-btn" data-pdf="\1" style="cursor:pointer; font-family:inherit; text-align:left;">📄 Lihat Sertifikat</button>',
    html
)

html = re.sub(
    r'<a href="(certificates/[^"]+)" target="_blank" rel="noopener" class="cert-link">\s*📄\s*Lihat\s*Sertifikat\s*</a>',
    r'<button class="cert-link open-pdf-btn" data-pdf="\1" style="cursor:pointer; font-family:inherit; text-align:left;">📄 Lihat Sertifikat</button>',
    html
)

html = re.sub(
    r'<img src="" alt="Project Detail" id="modalImage" class="modal-image">\n\s*<div id="modalImagePlaceholder" class="modal-image-fallback">',
    r'<img src="" alt="Project Detail" id="modalImage" class="modal-image">\n                <iframe src="" id="modalPdf" class="modal-pdf" style="display:none; width:100%; height:100%; min-height:80vh; border:none;" title="Sertifikat"></iframe>\n                <div id="modalImagePlaceholder" class="modal-image-fallback">',
    html
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# 2. Update styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '.modal-content.pdf-mode' not in css:
    css_append = '''

.modal-content.pdf-mode {
    width: 90vw;
    height: 90vh;
    max-width: 1200px;
}

.modal-pdf.loaded {
    display: block;
}
'''
    with open('styles.css', 'a', encoding='utf-8') as f:
        f.write(css_append)


# 3. Update scripts.js
with open('scripts.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_start = js.find('    // ── 7. Project Modal')
if js_start != -1:
    js_top = js[:js_start]
    
    new_js_end = '''    // ── 7. Project & PDF Modal ──────────────────────────────────────────────
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
'''
    with open('scripts.js', 'w', encoding='utf-8') as f:
        f.write(js_top + new_js_end)
print('Finished updating files')
