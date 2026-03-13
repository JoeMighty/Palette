function randomHex() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function hexToRgb(h) {
  return { r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16) };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hexToHsl(h) {
  const { r, g, b } = hexToRgb(h);
  return rgbToHsl(r, g, b);
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return '#' + f(0) + f(8) + f(4);
}

function hexToCmyk(h) {
  let { r, g, b } = hexToRgb(h);
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

function luminance(h) {
  const { r, g, b } = hexToRgb(h);
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function textColour(h) {
  return luminance(h) > 0.179 ? '#1a1814' : '#f5f3ee';
}

const COLOUR_NAMES = [
  ['#FF0000','Red'],['#FF4500','OrangeRed'],['#FF6347','Tomato'],['#FF7F50','Coral'],
  ['#FFA500','Orange'],['#FFD700','Gold'],['#FFFF00','Yellow'],['#ADFF2F','GreenYellow'],
  ['#00FF00','Lime'],['#32CD32','LimeGreen'],['#228B22','ForestGreen'],['#008000','Green'],
  ['#00FF7F','SpringGreen'],['#00FFFF','Cyan'],['#00CED1','DarkTurquoise'],['#1E90FF','DodgerBlue'],
  ['#0000FF','Blue'],['#00008B','DarkBlue'],['#8B008B','DarkMagenta'],['#FF00FF','Magenta'],
  ['#FF1493','DeepPink'],['#FF69B4','HotPink'],['#FFC0CB','Pink'],['#FFFFFF','White'],
  ['#C0C0C0','Silver'],['#808080','Gray'],['#000000','Black'],['#A52A2A','Brown'],
  ['#D2691E','Chocolate'],['#F4A460','SandyBrown'],['#DAA520','Goldenrod'],['#808000','Olive'],
  ['#556B2F','DarkOliveGreen'],['#20B2AA','LightSeaGreen'],['#5F9EA0','CadetBlue'],
  ['#4682B4','SteelBlue'],['#6495ED','CornflowerBlue'],['#4169E1','RoyalBlue'],
  ['#7B68EE','MediumSlateBlue'],['#9370DB','MediumPurple'],['#8A2BE2','BlueViolet'],
  ['#4B0082','Indigo'],['#800080','Purple'],['#DC143C','Crimson'],['#B22222','Firebrick'],
  ['#2F4F4F','DarkSlateGray'],['#8FBC8F','DarkSeaGreen'],['#F5DEB3','Wheat'],
  ['#D2B48C','Tan'],['#BC8F8F','RosyBrown'],
];

function colourName(hex) {
  hex = hex.toUpperCase();
  const { r: r1, g: g1, b: b1 } = hexToRgb(hex);
  let best = 'Unknown', bestDist = Infinity;
  for (const [h, name] of COLOUR_NAMES) {
    const { r, g, b } = hexToRgb(h);
    const dist = Math.sqrt((r-r1)**2 + (g-g1)**2 + (b-b1)**2);
    if (dist < bestDist) { bestDist = dist; best = name; }
  }
  return best;
}

let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
