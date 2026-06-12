/* ============================================================
   WEEPFLIX – app.js
   Lógica completa: auth, catálogo, mi lista, búsqueda, modal
   ============================================================ */

// ── CATÁLOGO DE PELÍCULAS ────────────────────────────────────────────────────

const FILMS = [
  { id:1,  t:"El Origen",                y:2010, g:"Acción",    e:"🌀", r:8.8, badge:"Popular",  d:"Un ladrón roba secretos a través de sueños compartidos y recibe la misión de plantar una idea en la mente de un CEO." },
  { id:2,  t:"Interstellar",             y:2014, g:"Sci-Fi",    e:"🚀", r:8.6, badge:"Estreno",  d:"Un equipo de exploradores viaja por un agujero de gusano para asegurar la supervivencia de la humanidad." },
  { id:3,  t:"Avengers: Endgame",        y:2019, g:"Acción",    e:"⚡", r:8.4, badge:"Popular",  d:"Los Vengadores se reúnen para revertir las acciones de Thanos y restaurar el universo." },
  { id:4,  t:"Spider-Man: No Way Home",  y:2021, g:"Acción",    e:"🕷️", r:8.3, badge:null,       d:"Peter Parker pide un hechizo a Doctor Strange que desata villanos de otros universos." },
  { id:5,  t:"Top Gun: Maverick",        y:2022, g:"Acción",    e:"✈️", r:8.2, badge:"Estreno",  d:"Después de 30 años, Pete Mitchell regresa para entrenar a una nueva generación de pilotos de élite." },
  { id:6,  t:"Mad Max: Fury Road",       y:2015, g:"Acción",    e:"🔥", r:8.1, badge:null,       d:"En un mundo postapocalíptico, Max y una rebelde escapan de un tirano a bordo de un camión blindado." },
  { id:7,  t:"John Wick",                y:2014, g:"Acción",    e:"🔫", r:7.4, badge:null,       d:"Un ex asesino busca venganza tras la muerte de su perro, último recuerdo de su esposa." },
  { id:8,  t:"Get Out",                  y:2017, g:"Terror",    e:"😱", r:7.7, badge:"Popular",  d:"Un joven visita a los padres de su novia y descubre una perturbadora conspiración racial." },
  { id:9,  t:"It",                       y:2017, g:"Terror",    e:"🤡", r:7.3, badge:null,       d:"Un grupo de niños enfrenta sus miedos cuando son aterrorizados por un payaso demoníaco." },
  { id:10, t:"A Quiet Place",            y:2018, g:"Terror",    e:"🤫", r:7.5, badge:null,       d:"Una familia sobrevive en un mundo donde criaturas ciegas cazan por el sonido." },
  { id:11, t:"Hereditary",               y:2018, g:"Terror",    e:"👁️", r:7.3, badge:null,       d:"Tras la muerte de la abuela, una familia descubre oscuros secretos que los atormentan." },
  { id:12, t:"The Conjuring",            y:2013, g:"Terror",    e:"👻", r:7.5, badge:"Clásico",  d:"Los investigadores paranormales Warren ayudan a una familia aterrorizada en su granja." },
  { id:13, t:"The Hangover",             y:2009, g:"Comedia",   e:"🎰", r:7.7, badge:"Clásico",  d:"Un grupo pierde al novio en Las Vegas durante una despedida de soltero y debe encontrarlo." },
  { id:14, t:"Superbad",                 y:2007, g:"Comedia",   e:"🍕", r:7.6, badge:null,       d:"Dos amigos intentan conseguir alcohol para una fiesta antes de graduarse con resultados caóticos." },
  { id:15, t:"Game Night",               y:2018, g:"Comedia",   e:"🎲", r:7.0, badge:null,       d:"Una noche de juegos se vuelve un misterio real cuando el hermano de uno es secuestrado." },
  { id:16, t:"Interstellar 2",           y:2024, g:"Sci-Fi",    e:"🌌", r:8.0, badge:"Nuevo",    d:"Una nueva misión espacial lleva a los astronautas más allá de los límites del universo conocido." },
  { id:17, t:"Dune: Parte Dos",          y:2024, g:"Sci-Fi",    e:"🏜️", r:8.5, badge:"Estreno",  d:"Paul Atreides se une a los Fremen y emprende un camino de venganza contra los que destruyeron a su familia." },
  { id:18, t:"El León Rey",              y:1994, g:"Animación", e:"🦁", r:8.5, badge:"Clásico",  d:"El joven Simba debe reclamar su reino tras la traición de su malvado tío Scar." },
  { id:19, t:"Spider-Man: Miles Morales",y:2023, g:"Animación", e:"🕸️", r:8.7, badge:"Popular",  d:"Miles Morales viaja a través del multiverso y encuentra otros Spider-Man de distintas dimensiones." },
  { id:20, t:"Parasite",                 y:2019, g:"Drama",     e:"🏚️", r:8.5, badge:"Ganadora", d:"Una familia pobre se infiltra en la vida de una familia adinerada con consecuencias inesperadas." },
  { id:21, t:"1917",                     y:2019, g:"Drama",     e:"🎖️", r:8.3, badge:null,       d:"Dos soldados cruzan líneas enemigas en una carrera contra el tiempo para salvar a 1600 hombres." },
  { id:22, t:"Oppenheimer",              y:2023, g:"Drama",     e:"💣", r:8.6, badge:"Estreno",  d:"La historia del científico que lideró el proyecto Manhattan y creó la primera bomba atómica." },
];

// ── ESTADO ──────────────────────────────────────────────────────────────────

let currentUser = null;
let myList      = [];

// ── STORAGE ─────────────────────────────────────────────────────────────────

function getUsers()           { return JSON.parse(localStorage.getItem('wf_users') || '[]'); }
function saveUsers(u)         { localStorage.setItem('wf_users', JSON.stringify(u)); }
function getMyList(email)     { return JSON.parse(localStorage.getItem('wf_list_' + email) || '[]'); }
function saveMyList(e, list)  { localStorage.setItem('wf_list_' + e, JSON.stringify(list)); }

// ── TOAST ────────────────────────────────────────────────────────────────────

function toast(msg, type = 'info') {
  const bg = {
    success: 'linear-gradient(135deg,#e50914,#b0060f)',
    error:   'linear-gradient(135deg,#ff4444,#cc0000)',
    info:    'linear-gradient(135deg,#333,#555)',
    warning: 'linear-gradient(135deg,#f39c12,#e67e22)'
  };
  Toastify({
    text: msg,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
      background: bg[type] || bg.info,
      borderRadius: '10px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.95rem',
      fontWeight: '600',
      padding: '14px 26px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
    }
  }).showToast();
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

function togglePw(id, btn) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.textContent = input.type === 'password' ? 'MOSTRAR' : 'OCULTAR';
}

function switchPanel(p) {
  document.querySelectorAll('.form-panel').forEach(x => x.classList.remove('active'));
  document.getElementById('panel-' + p).classList.add('active');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('wf_session');
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('l-email').value = '';
  document.getElementById('l-pass').value  = '';
  toast('👋 Sesión cerrada', 'info');
}

function loginUser(email, pass) {
  return getUsers().find(u => u.email === email && u.pass === pass) || null;
}

function registerUser(name, email, pass) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return false;
  users.push({ name, email, pass });
  saveUsers(users);
  return true;
}

function startApp(user) {
  currentUser = user;
  myList = getMyList(user.email);
  localStorage.setItem('wf_session', JSON.stringify(user));
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('user-name').textContent = user.name.split(' ')[0];
  showSection('home');
}

// Formulario login
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass  = document.getElementById('l-pass').value;
  const user  = loginUser(email, pass);
  if (!user) { toast('❌ Correo o contraseña incorrectos', 'error'); return; }
  toast(`🎬 ¡Bienvenido, ${user.name.split(' ')[0]}!`, 'success');
  startApp(user);
});

// Formulario registro
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim().toLowerCase();
  const pass  = document.getElementById('r-pass').value;
  const conf  = document.getElementById('r-conf').value;
  if (pass !== conf)    { toast('❌ Las contraseñas no coinciden', 'error'); return; }
  if (pass.length < 6)  { toast('❌ Mínimo 6 caracteres', 'error'); return; }
  if (!registerUser(name, email, pass)) { toast('❌ Ese correo ya está registrado', 'error'); return; }
  toast('✅ ¡Cuenta creada! Iniciando sesión...', 'success');
  startApp({ name, email, pass });
});

// ── NAVEGACIÓN ───────────────────────────────────────────────────────────────

function showSection(id) {
  document.querySelectorAll('.section-view').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-sec="${id}"]`);
  if (btn) btn.classList.add('active');
  if (id === 'home')    renderHome();
  if (id === 'catalog') renderCatalog();
  if (id === 'mylist')  renderMyList();
}

// ── RENDER TARJETAS ──────────────────────────────────────────────────────────

function filmCard(f) {
  const inList = myList.includes(f.id);
  return `
    <div class="movie-card" onclick="openModal(${f.id})">
      <div class="movie-thumb">
        ${f.e}
        ${f.badge ? `<span class="movie-badge">${f.badge}</span>` : ''}
      </div>
      <div class="movie-info">
        <h3>${f.t}</h3>
        <div class="meta">${f.y} · ${f.g}</div>
        <div class="rating">⭐ ${f.r}</div>
        <div class="movie-actions">
          <button class="btn-watch"
            onclick="event.stopPropagation(); toast('▶ Reproduciendo ${f.t} (demo)', 'info')">
            ▶ Ver
          </button>
          <button class="btn-info2"
            onclick="event.stopPropagation(); toggleList(${f.id})">
            ${inList ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>`;
}

function renderHome() {
  const featured = FILMS.filter(f => ['Popular','Estreno','Ganadora'].includes(f.badge)).slice(0, 8);
  document.getElementById('home-featured').innerHTML = featured.map(filmCard).join('');
}

function renderCatalog() {
  const genre = document.getElementById('f-genre').value;
  const sort  = document.getElementById('f-sort').value;
  let films = [...FILMS];
  if (genre) films = films.filter(f => f.g === genre);
  if (sort === 'rating') films.sort((a, b) => b.r - a.r);
  else if (sort === 'year') films.sort((a, b) => b.y - a.y);
  else films.sort((a, b) => a.t.localeCompare(b.t));

  document.getElementById('catalog-grid').innerHTML = films.length
    ? films.map(filmCard).join('')
    : `<div class="no-results"><span>🎬</span><p>No hay películas en este género aún.</p></div>`;
}

function renderMyList() {
  const films = FILMS.filter(f => myList.includes(f.id));
  document.getElementById('mylist-grid').innerHTML = films.length
    ? films.map(filmCard).join('')
    : `<div class="mi-lista-empty"><span>❤️</span><p>Tu lista está vacía.<br>Agrega películas con el botón 🤍</p></div>`;
}

function filterCat(genre) {
  document.getElementById('f-genre').value = genre;
  showSection('catalog');
}

// ── MI LISTA ─────────────────────────────────────────────────────────────────

function toggleList(id) {
  const idx  = myList.indexOf(id);
  const film = FILMS.find(f => f.id === id);
  if (idx === -1) {
    myList.push(id);
    toast(`❤️ "${film.t}" agregada a tu lista`, 'success');
  } else {
    myList.splice(idx, 1);
    toast(`🗑️ "${film.t}" eliminada de tu lista`, 'info');
  }
  saveMyList(currentUser.email, myList);

  // Re-render sección activa
  if (document.getElementById('sec-home').classList.contains('active'))    renderHome();
  if (document.getElementById('sec-catalog').classList.contains('active')) renderCatalog();
  if (document.getElementById('sec-mylist').classList.contains('active'))  renderMyList();

  // Actualizar botón del modal si está abierto
  if (document.getElementById('modal-bg').classList.contains('open')) {
    document.getElementById('m-list-btn').textContent =
      myList.includes(id) ? '❤️ En mi lista' : '🤍 Agregar a mi lista';
  }
}

// ── MODAL ────────────────────────────────────────────────────────────────────

function openModal(id) {
  const f = FILMS.find(x => x.id === id);
  if (!f) return;
  document.getElementById('m-thumb').textContent   = f.e;
  document.getElementById('m-title').textContent   = f.t;
  document.getElementById('m-year').textContent    = f.y;
  document.getElementById('m-genre').textContent   = f.g;
  document.getElementById('m-rating').textContent  = '⭐ ' + f.r;
  document.getElementById('m-desc').textContent    = f.d;

  const lb = document.getElementById('m-list-btn');
  lb.textContent = myList.includes(id) ? '❤️ En mi lista' : '🤍 Agregar a mi lista';
  lb.onclick = () => toggleList(id);

  document.getElementById('modal-bg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
  document.body.style.overflow = '';
}

// ── BÚSQUEDA ─────────────────────────────────────────────────────────────────

function doSearch() {
  const q    = document.getElementById('search-input').value.trim().toLowerCase();
  const drop = document.getElementById('search-drop');
  if (!q) { drop.classList.remove('open'); return; }

  const res = FILMS.filter(f =>
    f.t.toLowerCase().includes(q) || f.g.toLowerCase().includes(q)
  ).slice(0, 6);

  drop.innerHTML = res.length
    ? res.map(f => `
        <div class="search-item" onclick="
          openModal(${f.id});
          document.getElementById('search-drop').classList.remove('open');
          document.getElementById('search-input').value='';
        ">
          <span class="si-emoji">${f.e}</span>
          <div class="si-info">
            <h4>${f.t}</h4>
            <p>${f.g} · ${f.y}</p>
          </div>
        </div>`).join('')
    : `<div class="search-item">
        <div class="si-info"><h4 style="color:var(--gris)">Sin resultados</h4></div>
       </div>`;

  drop.classList.add('open');
}

// Cerrar buscador al hacer clic fuera
document.addEventListener('click', e => {
  if (!document.querySelector('.search-wrap').contains(e.target))
    document.getElementById('search-drop').classList.remove('open');
});

// ── CONTACTO ─────────────────────────────────────────────────────────────────

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  toast('✅ ¡Mensaje enviado! Te responderemos pronto.', 'success');
  e.target.reset();
});

// ── TECLADO ──────────────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('wf_session');
  if (saved) {
    const u = JSON.parse(saved);
    if (loginUser(u.email, u.pass)) startApp(u);
  }
});
