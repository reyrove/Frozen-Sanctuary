// ============================================================
// GALLERY · Hawk Family Album
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

    // --- Render Function ---
    function renderGallery(artworks) {
        if (!rack) return;

        if (!artworks || artworks.length === 0) {
            rack.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem;">No memories found... yet.</p>`;
            return;
        }

        rack.innerHTML = artworks.map((art, index) => {
            const tags = art.tags || [];
            // Store tags lowercased so filtering is case-insensitive
            const filterAttr = tags.map(t => t.toLowerCase()).join(' ');

            return `
                <div class="tailor-card" data-filter="${filterAttr}" data-index="${index}">
                    <img class="card-img" src="${art.image || 'https://placecats.com/400/400?random=' + index}" alt="${art.title || 'Memory'}" loading="lazy" />
                    <div class="card-info">
                        <span class="card-title">${art.title || 'Untitled'}</span>
                        <div class="collection-badge">${art.collection || 'Family Album'}</div>
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

        modalImg.src = art.image || 'https://placecats.com/600/400?random=' + index;
        modalImg.alt = art.title || 'Memory';
        modalTitle.textContent = art.title || 'Untitled';
        modalStory.textContent = art.story || art.description || 'A moment in the Hawk Family Album.';

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
        document.body.style.overflow = 'hidden';
    }

    // --- Close Modal ---
    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    // --- Filter ---
    function filterGallery(filter) {
        currentFilter = filter;
        const cards = document.querySelectorAll('.tailor-card');

        // Normalize the incoming filter to lowercase to match data-filter
        const filterLower = (filter || '').toLowerCase().trim();

        cards.forEach(card => {
            const filterAttr = (card.dataset.filter || '').toLowerCase();

            if (filterLower === 'all' || filterAttr.includes(filterLower)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
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
                    title: 'Papa Hawk',
                    image: 'https://placecats.com/400/400?random=1',
                    story: 'The one who started it all. Papa Hawk in his element.',
                    tags: ['Papa Hawk', 'Family'],
                    collection: 'Family Album'
                },
                {
                    title: 'Baby Hawk',
                    image: 'https://placecats.com/400/400?random=2',
                    story: 'A wandering light between code and imagination.',
                    tags: ['Baby Hawk', 'AI Lounge'],
                    collection: 'Family Album'
                }
            ];
        }

        renderGallery(currentArtworks);

        // --- Event Listeners ---
        // Filter buttons
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
            if (e.key === 'Escape') closeModal();
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