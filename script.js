let currentCategory = 'all';
let searchQuery = '';
let menuData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const menuGrid = document.getElementById('menu-grid');
    const filterContainer = document.querySelector('.menu-controls');
    const searchInput = document.getElementById('menu-search');

    // Fetch data from data.json
    async function fetchMenu() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data.menu;
        } catch (error) {
            console.error('Error fetching menu:', error);
            return null;
        }
    }

    // Render Menu Items
    function renderMenu() {
        if (!menuGrid || !menuData) return;
        menuGrid.innerHTML = '';

        Object.entries(menuData).forEach(([catId, items]) => {
            // Category Filter
            if (currentCategory !== 'all' && catId !== currentCategory) return;

            // Search Filter
            const matchingItems = items.filter(item => 
                item.name.toLowerCase().includes(searchQuery)
            );

            if (matchingItems.length > 0) {
                const section = document.createElement('div');
                section.className = 'menu-section';
                
                // Add decorative corners
                section.innerHTML = `
                    <div class="corner-br"></div>
                    <div class="corner-bl"></div>
                    <h3 class="menu-category-title" style="text-transform: capitalize;">${catId.replace(/_/g, ' ')}</h3>
                    <div class="menu-list">
                        ${matchingItems.map(item => `
                            <div class="menu-item">
                                <span class="item-name">${item.name}</span>
                                <span class="item-dots"></span>
                                <span class="item-price">₹${item.price}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                menuGrid.appendChild(section);
            }
        });

        if (menuGrid.innerHTML === '') {
            menuGrid.innerHTML = `<div style="grid-column: 1/-1; padding: 100px; text-align: center; color: var(--text-muted); width: 100%;">No dishes found matching "${searchQuery}"</div>`;
        }
    }

    // Initial Load
    menuData = await fetchMenu();
    if (menuData) renderMenu();

    // Filter Logic
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.category;
                renderMenu();
            }
        });
    }

    // Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderMenu();
        });
    }

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
