let projects = [];
let activeRow = null;
let isResizing = false;

// ── LOAD & INIT ──────────────────────────────────────────────
fetch('Data.json')
  .then(r => r.json())
  .then(data => {
    buildFilters(data.temas);
    buildProjects(data.proyectos);
    bindResize();
  })
  .catch(err => console.error('Error cargando data.json:', err));

// ── FILTERS ─────────────────────────────────────────────────
function buildFilters(temas) {
  const bar = document.getElementById('filters-bar');

  const label = document.createElement('span');
  label.className = 'filter-label';
  label.textContent = 'Tema —';
  bar.appendChild(label);

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.textContent = 'Todos';
  allBtn.onclick = () => filterRows('all', allBtn);
  bar.appendChild(allBtn);

  temas.forEach(tema => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tema.label;
    btn.dataset.id = tema.id;
    btn.onclick = () => filterRows(tema.id, btn);
    bar.appendChild(btn);
  });
}

// ── PROJECTS ────────────────────────────────────────────────
function buildProjects(proyectos) {
  projects = proyectos;
  const wrap = document.getElementById('projects-wrap');
  const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

  proyectos.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'project-row';
    row.dataset.temas = (p.temas || []).join(' ');
    row.onclick = () => openViewer(row, idx);

    const tagsHTML = p.tecnologias && p.tecnologias.length
      ? `<div class="proj-tags">${p.tecnologias.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
      : '';

    const fechaHTML = p.fecha
      ? `<span class="proj-date">${p.fecha}</span>`
      : '';

    row.innerHTML = `
      <div class="proj-num">${romans[idx] || idx + 1}</div>
      <div class="proj-body">
        <div class="proj-title">${p.titulo}</div>
        <div class="proj-desc">${p.descripcion}</div>
        ${tagsHTML}
      </div>
      <div class="proj-meta">
        ${fechaHTML}
        <button class="read-btn" onclick="openViewer(this.closest('.project-row'), ${idx}); event.stopPropagation();">Abrir →</button>
        <a class="read-btn repo-btn" href="${p.url_github}" target="_blank" rel="noopener" onclick="event.stopPropagation();">Repositorio →</a>
      </div>
    `;

    wrap.appendChild(row);
  });

  wrap.appendChild(document.getElementById('viewer-panel'));
}

// ── VIEWER ──────────────────────────────────────────────────
function openViewer(row, idx) {
  const panel = document.getElementById('viewer-panel');
  const frame = document.getElementById('notebook-frame');

  if (activeRow === row && panel.classList.contains('open')) {
    closeViewer(); return;
  }
  if (activeRow) activeRow.classList.remove('active');
  activeRow = row;
  row.classList.add('active');

  row.after(panel);

  const p = projects[idx];
  document.getElementById('viewer-title').textContent = p.url_file.split('/').pop();
  const base = window.location.origin + window.location.pathname.replace(/\/$/, '');
frame.src = base + '/' + p.url_file;

  panel.classList.add('open');
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

function closeViewer() {
  const panel = document.getElementById('viewer-panel');
  panel.classList.remove('open');
  if (activeRow) { activeRow.classList.remove('active'); activeRow = null; }
  document.getElementById('notebook-frame').src = 'about:blank';
}

// ── FILTER ──────────────────────────────────────────────────
function filterRows(tag, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-row').forEach(row => {
    const temas = row.dataset.temas || '';
    row.style.display = (tag === 'all' || temas.split(' ').includes(tag)) ? '' : 'none';
  });
  closeViewer();
}

// ── RESIZE ──────────────────────────────────────────────────
function bindResize() {
  document.querySelector('.viewer-resize').addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!isResizing) return;
    const wrap = document.getElementById('iframe-wrap');
    const h = Math.max(300, Math.min(1200, e.clientY - wrap.getBoundingClientRect().top));
    wrap.querySelector('iframe').style.height = h + 'px';
  });
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.userSelect = '';
  });
}
