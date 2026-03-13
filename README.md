# Paletto

A fast, minimal colour palette generator built for designers. Generate, explore and export beautiful palettes with zero friction.

**[Live Demo](https://joemighty.github.io/paletto/)**

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

HEX, RGB, CSS custom properties, Tailwind config, SVG, PNG image, PDF (print), ASE (Adobe), JavaScript

## Project Structure

```
paletto/
  index.html
  assets/
    css/
      style.css
    js/
      utils.js      - colour math, shared helpers
      data.js       - palette datasets
      generator.js  - generator logic and export
      explore.js    - explore page rendering and filtering
      app.js        - routing, keyboard shortcuts, init
```

## Deploy to GitHub Pages

1. Push the repo to GitHub
2. Go to Settings > Pages
3. Set source to `main` branch, root folder
4. Your site will be live at `https://<username>.github.io/<repo>/`

No build step required. Pure HTML, CSS, and vanilla JS.

## Local Development

```bash
# Any static server works, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080`.

---

Built by [Jobin Bennykutty](https://github.com/JoeMighty/)
