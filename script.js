document.addEventListener('DOMContentLoaded', () => {
    // Fade-in for sections
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Hero image animation on scroll
    const heroImage = document.getElementById('heroImage');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            heroImage.style.width = '80px';
            heroImage.style.height = '80px';
            heroImage.style.position = 'fixed';
            heroImage.style.top = '10px';
            heroImage.style.left = '20px';
            heroImage.style.borderRadius = '50%';
            heroImage.style.zIndex = '200';
        } else {
            heroImage.style.width = '50%';
            heroImage.style.height = 'auto';
            heroImage.style.position = 'absolute';
            heroImage.style.top = '50%';
            heroImage.style.left = '50%';
            heroImage.style.transform = 'translate(-50%, -50%)';
            heroImage.style.borderRadius = '15px';
            heroImage.style.zIndex = '10';
        }
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Certificate upload and management (view-only for clients)
    const uploadInput = document.getElementById('certificateUpload');
    const gallery = document.getElementById('certificateGallery');
    const modal = document.getElementById('imageModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.modal-close');

    // Load certificates from localStorage
    const loadCertificates = () => {
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        gallery.innerHTML = '';
        certificates.forEach((src, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'certificate-item';
            const isImage = src.startsWith('data:image');
            const content = isImage ? `<img src="${src}" alt="Certificate ${index + 1}">` : `<object data="${src}" type="application/pdf" width="100%" height="200">PDF</object>`;
            imgContainer.innerHTML = content;
            gallery.appendChild(imgContainer);

            // Double-click to zoom (view-only)
            const element = imgContainer.querySelector(isImage ? 'img' : 'object');
            element.addEventListener('dblclick', () => {
                modalContent.innerHTML = content;
                modal.style.display = 'flex';
            });
        });
    };

    // Upload certificates (admin-only action)
    uploadInput.addEventListener('change', (event) => {
        const files = event.target.files;
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                certificates.push(e.target.result);
                localStorage.setItem('certificates', JSON.stringify(certificates));
                loadCertificates();
            };
            reader.readAsDataURL(file);
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    loadCertificates();
});