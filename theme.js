// ── THEME TOGGLE ─────────────────────────────────────────────
// Persiste la preferencia del usuario en localStorage

const root = document.documentElement;
const iconEl  = document.getElementById('toggle-icon');
const labelEl = document.getElementById('toggle-label');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    iconEl.textContent  = '○';
    labelEl.textContent = 'Claro';
  } else {
    iconEl.textContent  = '☽';
    labelEl.textContent = 'Oscuro';
  }
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next    = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('portfolio-theme', next);
  applyTheme(next);
}

// Aplicar preferencia guardada al cargar
(function () {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved) {
    applyTheme(saved);
  }
})();