let activeFilter = 'all';

function setFilter(el, tag) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeFilter = tag;
  renderExplore();
}

function filterPalettes() {
  renderExplore();
}

function renderExplore() {
  const grid = document.getElementById('palettesGrid');
  const query = document.getElementById('searchInput').value.toLowerCase();
  const results = EXPLORE_PALETTES.filter(p => {
    const tagMatch = activeFilter === 'all' || p.tags.includes(activeFilter);
    const searchMatch = !query || p.name.toLowerCase().includes(query);
    return tagMatch && searchMatch;
  });

  grid.innerHTML = results.map(p => `
    <div class="palette-card">
      <div class="palette-card-swatches">
        ${p.colors.map(c => `<div class="palette-card-swatch" style="background:${c}"></div>`).join('')}
      </div>
      <div class="palette-card-overlay">
        <button class="overlay-btn" onclick="loadIntoGenerator(${JSON.stringify(p.colors).replace(/"/g,'&quot;')})">Open in Generator</button>
      </div>
      <div class="palette-card-info">
        <div class="palette-card-name">${p.name}</div>
        <div class="palette-card-meta">
          <div class="palette-card-likes">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${p.likes}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function loadIntoGenerator(colors) {
  palette = colors.map(c => mkCol(c));
  showPage('generator');
  renderPalette();
}
