let allGames = [];
let currentCategory = 'All';
let searchQuery = '';

const gridContainer = document.getElementById('games-grid');
const playerContainer = document.getElementById('player-container');
const gridView = document.getElementById('grid-view');
const categoriesContainer = document.getElementById('categories');
const searchInput = document.getElementById('search-input');
const iframe = document.getElementById('game-iframe');
const gameTitle = document.getElementById('game-title');
const gameDesc = document.getElementById('game-desc');
const gameCat = document.getElementById('game-cat-tag');

async function init() {
  try {
    const response = await fetch('./src/data/games.json');
    allGames = await response.json();
    renderCategories();
    renderGames();
  } catch (error) {
    console.error('Error loading games:', error);
  }
}

function renderCategories() {
  const categories = ['All', ...new Set(allGames.map(g => g.category))];
  categoriesContainer.innerHTML = categories.map(cat => `
    <button class="category-btn ${cat === currentCategory ? 'active' : ''}" onclick="setCategory('${cat}')">
      ${cat}
    </button>
  `).join('');
}

window.setCategory = (cat) => {
  currentCategory = cat;
  renderCategories();
  renderGames();
};

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderGames();
});

function renderGames() {
  const filtered = allGames.filter(game => {
    const matchesCat = currentCategory === 'All' || game.category === currentCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery) || 
                          game.category.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
        <p style="color: var(--text-muted);">No games found matching your search.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(game => `
    <div class="game-card" onclick="playGame('${game.id}')">
      <div style="position: relative; overflow: hidden;">
        <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail" referrerpolicy="no-referrer">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent);"></div>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem;">
          <div class="game-category">${game.category}</div>
          <div class="game-title">${game.title}</div>
        </div>
      </div>
    </div>
  `).join('');
}

window.playGame = (id) => {
  const game = allGames.find(g => g.id === id);
  if (!game) return;

  iframe.src = game.url;
  gameTitle.textContent = game.title;
  gameDesc.textContent = game.description;
  gameCat.textContent = game.category;

  gridView.classList.add('hidden');
  playerContainer.style.display = 'flex';
  window.scrollTo(0, 0);
};

window.backToGrid = () => {
  iframe.src = '';
  playerContainer.style.display = 'none';
  gridView.classList.remove('hidden');
};

window.toggleFullscreen = () => {
  const wrapper = document.querySelector('.iframe-wrapper');
  wrapper.classList.toggle('fullscreen');
  const closeBtn = document.getElementById('close-fs');
  closeBtn.classList.toggle('hidden');
};

window.openNewTab = () => {
  if (iframe.src) {
    window.open(iframe.src, '_blank');
  }
};

init();
