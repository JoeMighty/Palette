function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === id);
  });
  if (id === 'explore') renderExplore();
}

function buildHeroBg() {
  const bg = document.getElementById('heroBg');
  if (!bg) return;
  for (let i = 0; i < 10; i++) {
    const row = document.createElement('div');
    row.className = 'hero-bg-row';
    const doubled = [...SHOWCASE_PALETTES, ...SHOWCASE_PALETTES];
    doubled.forEach(pal => pal.forEach(col => {
      const chip = document.createElement('div');
      chip.className = 'hero-bg-chip';
      chip.style.background = col;
      row.appendChild(chip);
    }));
    bg.appendChild(row);
  }
}

function buildCtaBg() {
  const bg = document.getElementById('ctaBg');
  if (!bg) return;
  SHOWCASE_PALETTES[0].forEach(col => {
    const s = document.createElement('div');
    s.className = 'cta-bg-swatch';
    s.style.background = col;
    bg.appendChild(s);
  });
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space' && document.getElementById('generator').classList.contains('active')) {
    e.preventDefault();
    genPalette();
  }
  if (e.code === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

palette = [
  mkCol('#264653'), mkCol('#2A9D8F'), mkCol('#E9C46A'), mkCol('#F4A261'), mkCol('#E76F51'),
];

buildHeroBg();
buildCtaBg();
renderPalette();
