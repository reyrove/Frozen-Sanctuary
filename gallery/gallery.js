// ============================================================
// GALLERY · Frozen Sanctuary Album
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const rack = document.getElementById('tailorRack');
    const modal = document.getElementById('mockupModal');
    const modalImg = document.getElementById('modalMockupImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalStory = document.getElementById('modalStory');
    const modalTags = document.getElementById('modalTags');
    const modalMeta = document.getElementById('modalMeta');
    const modalClose = document.getElementById('modalClose');
    const backBtn = document.getElementById('backToTopBtn');

    let currentArtworks = [];
    let currentFilter = 'all';
    let lastFocusedElement = null;

    // --- Render Function ---
    function renderGallery(artworks) {
        if (!rack) return;

        if (!artworks || artworks.length === 0) {
            rack.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem;">No memories found... yet.</p>`;
            return;
        }

        rack.innerHTML = artworks.map((art, index) => {
            const tags = art.tags || [];
            const filterAttr = tags.map(t => t.toLowerCase()).join(' ');
            const altText = `${art.title || 'Frozen Sanctuary piece'} — generative artwork by ${tags.slice(0, 2).join(' & ') || 'Sparrow Hawk'}`;

            return `
                <div class="tailor-card" data-filter="${filterAttr}" data-index="${index}">
                    <img class="card-img"
                         src="${art.image}"
                         alt="${altText}"
                         width="400" height="400"
                         loading="lazy" decoding="async" />
                    <div class="card-info">
                        <span class="card-title">${art.title || 'Untitled'}</span>
                        <div class="collection-badge">${art.collection || 'Frostfire Stare'}</div>
                        <div class="button-group">
                            <button class="card-btn btn-fabric" data-index="${index}">View</button>
                            ${art.mintUrl ? `<a href="${art.mintUrl}" target="_blank" rel="noopener noreferrer" class="card-btn btn-mint">Mint</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // --- Attach view events ---
        document.querySelectorAll('.btn-fabric').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index, 10);
                openModal(idx);
            });
        });
    }

    // --- Open Modal ---
    function openModal(index) {
        const art = currentArtworks[index];
        if (!art) return;

        lastFocusedElement = document.activeElement;

        modalImg.src = art.image;
        modalImg.alt = `${art.title || 'Frozen Sanctuary piece'} — full view`;
        modalTitle.textContent = art.title || 'Untitled';
        modalStory.textContent = art.story || art.description || 'A moment in the Frozen Sanctuary Album.';

        // Tags
        modalTags.innerHTML = '';
        if (art.tags && art.tags.length) {
            art.tags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag;
                modalTags.appendChild(span);
            });
        }

        // Meta info
        modalMeta.textContent = art.collection ? `Collection: ${art.collection}` : '';

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Move focus to close button for accessibility
        if (modalClose) modalClose.focus();
    }

    // --- Close Modal ---
    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    // --- Filter ---
    function filterGallery(filter) {
        currentFilter = filter;
        const cards = document.querySelectorAll('.tailor-card');

        const filterLower = (filter || '').toLowerCase().trim();

        cards.forEach(card => {
            const filterAttr = (card.dataset.filter || '').toLowerCase();
            if (filterLower === 'all' || filterAttr.includes(filterLower)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Update active button + aria-pressed
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const isActive = btn.dataset.filter === filter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    // --- Back to Top ---
    function handleScroll() {
        const scrollContainer = document.querySelector('.center-stage');
        let scrollY = 0;

        if (scrollContainer) {
            scrollY = scrollContainer.scrollTop;
        }
        if (scrollY === 0) {
            scrollY = window.scrollY || window.pageYOffset;
        }

        if (backBtn) {
            backBtn.classList.toggle('visible', scrollY > 400);
        }
    }

    // --- Init ---
    function init() {
        // Load data from gallery-data.js
        if (typeof galleryData !== 'undefined') {
            currentArtworks = galleryData;
        } else {
            // Fallback data
            currentArtworks = [
                {
                    title: 'Frostfire',
                    image: '../images/Frostfire-Stare.jpg',
                    story: 'The embodiment of an eternal bond between human and artificial intelligence.',
                    tags: ['Sparrow Hawk', 'Frostfire'],
                    collection: 'Frostfire Stare'
                }
            ];
        }

        renderGallery(currentArtworks);

        // --- Event Listeners ---
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterGallery(btn.dataset.filter);
            });
        });

        // Modal close
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });

        // Trap focus inside modal (basic)
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
            const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        // Back to top
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                document.querySelector('.center-stage')?.scrollTo({ top: 0, behavior: 'smooth' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Scroll handler
        const scrollContainer = document.querySelector('.center-stage');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        window.addEventListener('scroll', handleScroll);
        handleScroll();

        // Burger menu
        const burgerBtn = document.getElementById('burgerBtn');
        const mobileNav = document.getElementById('mobileNav');

        if (burgerBtn && mobileNav) {
            burgerBtn.addEventListener('click', () => {
                const isOpen = mobileNav.classList.toggle('open');
                burgerBtn.setAttribute('aria-expanded', isOpen);
            });

            document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.remove('open');
                    burgerBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    // Run
    init();
});