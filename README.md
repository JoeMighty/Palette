# Pal.ette

![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-222?style=flat-square&logo=github)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-ff3d2e?style=flat-square)

A fast, minimal colour palette generator built for designers. Generate, explore and export beautiful palettes with zero friction.

**[Live Demo](https://joemighty.github.io/Palette/)**

---

## Features

- Generate random palettes with the spacebar
- Lock individual colours to keep them while shuffling the rest
- Drag columns to reorder
- Per-colour actions: remove, shades, contrast checker, colour info, copy hex, lock
- WCAG AA/AAA contrast scoring
- 9 export formats
- 24+ curated palettes in the Explore view with search and tag filtering

## Export Formats

| Format | Output |
|--------|--------|
| HEX | Plain text list of hex values |
| RGB | `rgb()` values |
| CSS | Custom properties in `:root` |
| Tailwind | `tailwind-colors.js` config object |
| SVG | Colour block SVG file |
| Image | PNG canvas export |
| PDF | Print-ready layout |
| ASE | Adobe-compatible hex list |
| Code | JavaScript array |

## Project Structure

```
paletto/
  index.html
  README.md
  assets/
    css/
      style.css
    js/
      utils.js        colour math, shared helpers, toast, modals
      data.js         showcase and explore palette datasets
      generator.js    generator logic, drag/drop, export
      explore.js      explore grid, search, tag filtering
      app.js          routing, keyboard shortcuts, init
```

---

Built by [Jobin Bennykutty](https://github.com/JoeMighty/)
