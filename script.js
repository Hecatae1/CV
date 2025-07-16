document.addEventListener('DOMContentLoaded', () => {
    // Fade-in/fade-out for sections
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

    // Certificate upload and management
    const uploadInput = document.getElementById('certificateUpload');
    const gallery = document.getElementById('certificateGallery');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.modal-close');

    // Load certificates from localStorage
    const loadCertificates = () => {
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        gallery.innerHTML = '';
        certificates.forEach((src, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'certificate-item';
            imgContainer.innerHTML = `
                <img src="${src}" alt="Certificate ${index + 1}">
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            gallery.appendChild(imgContainer);

            // Double-click to zoom
            const img = imgContainer.querySelector('img');
            img.addEventListener('dblclick', () => {
                modalImage.src = src;
                modal.style.display = 'flex';
            });
        });

        // Delete button event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
                certificates.splice(index, 1);
                localStorage.setItem('certificates', JSON.stringify(certificates));
                loadCertificates();
            });
        });
    };

    // Upload certificates
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

    // Clear all certificates
    window.clearCertificates = () => {
        localStorage.removeItem('certificates');
        loadCertificates();
    };

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