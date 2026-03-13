let palette = [];
let dragIdx = null;
let selectedFmt = 'hex';

function mkCol(hex) {
  return { id: Math.random().toString(36).slice(2), hex, locked: false };
}

function genPalette() {
  palette = palette.map(c => c.locked ? c : mkCol(randomHex()));
  renderPalette();
}

function addCol() {
  if (palette.length >= 10) { showToast('Maximum 10 colours'); return; }
  palette.push(mkCol(randomHex()));
  renderPalette();
}

function removeCol(idx) {
  if (palette.length <= 2) { showToast('Minimum 2 colours'); return; }
  palette.splice(idx, 1);
  renderPalette();
}

function toggleLock(idx) {
  palette[idx].locked = !palette[idx].locked;
  renderPalette();
}

function copyHex(idx) {
  const h = palette[idx].hex.toUpperCase();
  navigator.clipboard.writeText(h).then(() => showToast('Copied ' + h)).catch(() => showToast(h));
}

function openShades(idx) {
  const { h, s } = hexToHsl(palette[idx].hex);
  const row = document.getElementById('shadesRow');
  row.innerHTML = '';
  [10,20,30,40,50,60,70,80,90].forEach(l => {
    const sh = hslToHex(h, s, l);
    const tc = textColour(sh);
    const d = document.createElement('div');
    d.className = 'shade-swatch';
    d.style.background = sh;
    d.innerHTML = `<span class="shade-label" style="color:${tc}">${sh.toUpperCase()}</span>`;
    d.onclick = () => { navigator.clipboard.writeText(sh); showToast('Copied ' + sh.toUpperCase()); };
    row.appendChild(d);
  });
  openModal('shadesModal');
}

function openContrast(idx) {
  const hex = palette[idx].hex;
  const ratio = Math.max(contrastRatio(hex, '#000000'), contrastRatio(hex, '#ffffff'));
  document.getElementById('contrastPair').innerHTML = `
    <div class="contrast-half" style="background:${hex};color:#000"><span>Aa</span><small>Black text</small></div>
    <div class="contrast-half" style="background:${hex};color:#fff"><span>Aa</span><small>White text</small></div>`;
  document.getElementById('contrastScore').textContent = ratio.toFixed(2) + ':1';
  const checks = [
    { l: 'AA Normal', p: ratio >= 4.5 }, { l: 'AA Large', p: ratio >= 3 },
    { l: 'AAA Normal', p: ratio >= 7 },  { l: 'AAA Large', p: ratio >= 4.5 },
  ];
  document.getElementById('ratingsRow').innerHTML = checks.map(c =>
    `<span class="r-badge ${c.p ? 'pass' : 'fail'}">${c.l} ${c.p ? 'PASS' : 'FAIL'}</span>`
  ).join('');
  openModal('contrastModal');
}

function openInfo(idx) {
  const hex = palette[idx].hex;
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = hexToHsl(hex);
  const cmyk = hexToCmyk(hex);
  document.getElementById('infoSwatch').style.background = hex;
  document.getElementById('infoCells').innerHTML = [
    ['HEX', hex.toUpperCase()],
    ['RGB', `rgb(${r}, ${g}, ${b})`],
    ['HSL', `hsl(${h}, ${s}%, ${l}%)`],
    ['CMYK', `cmyk(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`],
    ['Name', colourName(hex)],
    ['Luminance', luminance(hex).toFixed(4)],
  ].map(([lbl, val]) =>
    `<div class="info-cell" onclick="copyVal('${val}')"><div class="info-lbl">${lbl}</div><div class="info-val">${val}</div></div>`
  ).join('');
  openModal('infoModal');
}

function copyVal(v) {
  navigator.clipboard.writeText(v).then(() => showToast('Copied: ' + v));
}

function renderPalette() {
  const container = document.getElementById('palette');
  container.innerHTML = '';
  palette.forEach((col, idx) => {
    const tc = textColour(col.hex);
    const el = document.createElement('div');
    el.className = 'colour-col' + (col.locked ? ' locked' : '');
    el.dataset.id = col.id;
    el.draggable = true;

    el.innerHTML = `
      <div class="colour-swatch" style="background:${col.hex}">
        <div class="drag-handle" style="color:${tc}70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
          </svg>
        </div>
        <div class="lock-pip" style="color:${tc}90" onclick="toggleLock(${idx})">
          ${col.locked
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`}
        </div>
        <div class="colour-actions">
          ${palette.length > 2 ? `<button class="c-action del" onclick="removeCol(${idx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button>` : ''}
          <button class="c-action" onclick="openContrast(${idx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>Contrast</button>
          <button class="c-action" onclick="openShades(${idx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>Shades</button>
          <button class="c-action" onclick="copyHex(${idx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy Hex</button>
          <button class="c-action" onclick="openInfo(${idx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Colour Info</button>
          <button class="c-action ${col.locked ? 'on' : ''}" onclick="toggleLock(${idx})"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>${col.locked ? 'Unlock' : 'Lock'}</button>
        </div>
      </div>
      <div class="colour-footer" onclick="copyHex(${idx})">
        <div class="hex-val">${col.hex.toUpperCase()}</div>
        <div class="name-val">${colourName(col.hex)}</div>
      </div>`;

    el.addEventListener('dragstart', () => { dragIdx = idx; setTimeout(() => el.classList.add('dragging'), 0); });
    el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('drag-over'); });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      if (dragIdx === null || dragIdx === idx) return;
      palette.splice(idx, 0, palette.splice(dragIdx, 1)[0]);
      dragIdx = null;
      renderPalette();
    });
    el.addEventListener('dragend', () => {
      document.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over'));
    });

    container.appendChild(el);
  });
}

document.getElementById('exportGrid').addEventListener('click', e => {
  const opt = e.target.closest('.export-opt');
  if (!opt) return;
  document.querySelectorAll('.export-opt').forEach(o => o.classList.remove('selected'));
  opt.classList.add('selected');
  selectedFmt = opt.dataset.fmt;
});

function doExport() {
  const hexes = palette.map(c => c.hex.toUpperCase());
  const dl = (name, content) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    a.download = name;
    a.click();
  };

  if (selectedFmt === 'hex') dl('palette.txt', hexes.join('\n'));
  else if (selectedFmt === 'rgb') dl('palette-rgb.txt', hexes.map(h => { const { r,g,b } = hexToRgb(h); return `rgb(${r}, ${g}, ${b})`; }).join('\n'));
  else if (selectedFmt === 'css') dl('palette.css', `:root {\n${hexes.map((h,i) => `  --color-${i+1}: ${h};`).join('\n')}\n}`);
  else if (selectedFmt === 'tailwind') dl('tailwind-colors.js', `module.exports = {\n  colors: {\n${hexes.map((h,i) => `    'brand-${i+1}': '${h}',`).join('\n')}\n  }\n};`);
  else if (selectedFmt === 'svg') dl('palette.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="${hexes.length*100}" height="100">\n${hexes.map((h,i) => `  <rect x="${i*100}" y="0" width="100" height="100" fill="${h}"/>`).join('\n')}\n</svg>`);
  else if (selectedFmt === 'code') dl('palette.js', `const palette = [${hexes.map(h => `'${h}'`).join(', ')}];`);
  else if (selectedFmt === 'ase') dl('palette-hex.txt', 'ASE export - import these hex values into Adobe:\n\n' + hexes.join('\n'));
  else if (selectedFmt === 'img') exportImage();
  else if (selectedFmt === 'pdf') exportPDF();

  closeModal('exportModal');
  showToast('Exported as ' + selectedFmt.toUpperCase());
}

function exportImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 200 * palette.length;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  palette.forEach((col, i) => {
    ctx.fillStyle = col.hex;
    ctx.fillRect(i * 200, 0, 200, 260);
    ctx.fillStyle = textColour(col.hex);
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(col.hex.toUpperCase(), i * 200 + 100, 218);
    ctx.font = '12px monospace';
    ctx.fillText(colourName(col.hex), i * 200 + 100, 238);
  });
  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'palette.png';
    a.click();
  });
}

function exportPDF() {
  const w = window.open('', '_blank');
  const swatches = palette.map(col => `
    <div style="flex:1;background:${col.hex};display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:20px">
      <div style="color:${textColour(col.hex)};font-family:monospace;font-size:14px;font-weight:bold;margin-bottom:4px">${col.hex.toUpperCase()}</div>
      <div style="color:${textColour(col.hex)};font-family:monospace;font-size:11px;opacity:.7">${colourName(col.hex)}</div>
    </div>`).join('');
  w.document.write(`<html><head><title>Palette</title><style>*{margin:0;padding:0;box-sizing:border-box}body{height:100vh;display:flex}</style></head><body>${swatches}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
}
