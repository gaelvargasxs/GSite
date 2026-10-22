/* =========================================================
   GSite — app.js (Lógica del Marketplace / index.html)
   Consume los datos de js/quintas.js
   Maneja filtros interactivos, buscador de fechas y catálogo.
   ========================================================= */

/* ---------------- ESTADO DEL CATÁLOGO ---------------- */
let currentQuinta = null;
let lastFocus = null;
let searchDatePicker = null;

// Filtros avanzados del modal
let filterPriceMax = 12000;
let filterCity = "todas";
let filterMinCap = 0;
let filterAmenity = new Set();

/* ---------------- AUTOCOMPLETADOR DE UBICACIÓN ---------------- */
const POPULAR_LOCATIONS = [
  { name: "Lerdo, Durango", query: "Lerdo", sub: "Villa Juárez, Centro y alrededores", icon: "location_city" },
  { name: "Torreón, Coahuila", query: "Torreón", sub: "Senderos, Viñedos, La Concha", icon: "location_city" },
  { name: "Gómez Palacio, Dgo.", query: "Gómez Palacio", sub: "Campestre, Chapala, Zona Centro", icon: "location_city" },
  { name: "Durango, Dgo.", query: "Durango", sub: "Zona de haciendas históricas", icon: "location_city" },
  { name: "Todas las ubicaciones", query: "", sub: "Ver quintas en toda La Laguna", icon: "travel_explore" }
];

function normalizeText(s){
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function initLocationAutocomplete(){
  const input = $("searchLocation");
  const dropdown = $("locDropdown");
  const field = $("locField");
  if (!input || !dropdown) return;

  function renderDropdown(filterText){
    const q = normalizeText(filterText);
    let items = [];

    if (!q){
      items = POPULAR_LOCATIONS;
    } else {
      // Filtrar ciudades base
      const matchedBase = POPULAR_LOCATIONS.filter(item => {
        if (!item.query) return false;
        return normalizeText(item.name).includes(q) || normalizeText(item.sub).includes(q);
      });

      // Filtrar también por referencias o nombres de quintas
      const matchedZones = [];
      if (typeof quintas !== "undefined" && Array.isArray(quintas)) {
        quintas.forEach(item => {
          const locNorm = normalizeText(item.location);
          const refNorm = normalizeText(item.reference);
          const nameNorm = normalizeText(item.name);
          if (refNorm.includes(q) || nameNorm.includes(q)) {
            const cityName = item.location.split(",")[0].trim();
            matchedZones.push({
              name: item.reference ? `${item.reference} (${cityName})` : item.name,
              query: item.reference || item.name,
              sub: item.name,
              icon: "pin_drop"
            });
          }
        });
      }

      items = [...matchedBase, ...matchedZones.slice(0, 3)];
    }

    if (items.length === 0){
      dropdown.innerHTML = `
        <div class="loc-empty">
          <span class="ms" style="font-size:24px; color:var(--outline); display:block; margin-bottom:4px;">search_off</span>
          No encontramos quintas en "<strong>${filterText}</strong>"<br>
          <small>Prueba con Lerdo, Torreón, Gómez Palacio o Durango.</small>
        </div>`;
      dropdown.classList.add("open");
      return;
    }

    dropdown.innerHTML = `
      <div class="loc-dropdown-title">${q ? "Sugerencias de búsqueda" : "Ubicaciones populares en La Laguna"}</div>
      ${items.map(item => `
        <button class="loc-item" type="button" data-query="${item.query}" data-label="${item.name}">
          <div class="loc-item-icon"><span class="ms">${item.icon}</span></div>
          <div class="loc-item-text">
            <strong>${item.name}</strong>
            <small>${item.sub}</small>
          </div>
        </button>
      `).join("")}
    `;
    dropdown.classList.add("open");
  }

  // Abrir al enfocar o hacer clic
  input.addEventListener("focus", () => renderDropdown(input.value));
  input.addEventListener("click", (e) => {
    e.stopPropagation();
    renderDropdown(input.value);
  });

  // Filtrar conforme se escribe
  input.addEventListener("input", () => {
    renderDropdown(input.value);
    renderCatalog();
  });

  // Seleccionar sugerencia
  dropdown.addEventListener("click", (e) => {
    const btn = e.target.closest(".loc-item");
    if (!btn) return;
    const query = btn.dataset.query;
    input.value = query;
    dropdown.classList.remove("open");
    renderCatalog();
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (field && !field.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

  // Teclas: Escape para cerrar, Enter para buscar
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdown.classList.remove("open");
    } else if (e.key === "Enter") {
      dropdown.classList.remove("open");
      applyFilters(true);
    }
  });
}

function applyFilters(shouldScroll){
  renderCatalog();
  if (shouldScroll) $("resultados").scrollIntoView({behavior:"smooth", block:"start"});
}

function clearFilters(){
  if ($("searchLocation")) $("searchLocation").value = "";
  if (searchDatePicker) searchDatePicker.clear();
  resetAdvancedFilters();
}

function activeFilterCount(){
  let n = 0;
  if ($("searchLocation") && $("searchLocation").value.trim()) n++;
  if ($("searchDate") && $("searchDate").value) n++;
  if (filterPriceMax < 12000) n++;
  if (filterCity !== "todas") n++;
  if (filterMinCap > 0) n++;
  if (filterAmenity.size > 0) n += filterAmenity.size;
  return n;
}

function updateFilterUI(){
  const n = activeFilterCount();
  if ($("clearFiltersBtn")) $("clearFiltersBtn").classList.toggle("show", n > 0);
  const badge = $("filterCount");
  if (badge) {
    badge.textContent = n;
    badge.classList.toggle("show", n > 0);
  }
}

/* ---------------- MODAL DE FILTROS AVANZADOS ---------------- */
function openFilterModal(){
  const m = $("filterModal");
  if (m) m.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeFilterModal(){
  const m = $("filterModal");
  if (m) m.classList.remove("open");
  document.body.classList.remove("no-scroll");
  document.body.style.overflow = "";
}

function onPriceSlider(val){
  filterPriceMax = parseInt(val, 10);
  $("filterPriceLabel").textContent = "Hasta " + moneyMXN(filterPriceMax);
}

function toggleCityFilter(city, btn){
  filterCity = city;
  document.querySelectorAll("#cityChips .f-chip").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

function setCapFilter(cap, btn){
  filterMinCap = cap;
  btn.parentElement.querySelectorAll(".f-chip").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

function toggleAmenityFilter(cat, btn){
  if (filterAmenity.has(cat)) {
    filterAmenity.delete(cat);
    btn.classList.remove("selected");
  } else {
    filterAmenity.add(cat);
    btn.classList.add("selected");
  }
}

function applyAdvancedFilters(){
  closeFilterModal();
  renderCatalog();
  const res = $("resultados");
  if (res) res.scrollIntoView({behavior:"smooth", block:"start"});
}

function resetAdvancedFilters(){
  filterPriceMax = 12000;
  filterCity = "todas";
  filterMinCap = 0;
  filterAmenity.clear();
  if ($("filterPriceRange")) {
    $("filterPriceRange").value = 12000;
    $("filterPriceLabel").textContent = "Hasta $12,000 MXN";
  }
  document.querySelectorAll("#cityChips .f-chip").forEach((b, i) => b.classList.toggle("selected", i === 0));
  document.querySelectorAll(".filter-chips-grid .f-chip").forEach((b, i) => {
    if (b.dataset.cap === "0") b.classList.add("selected");
    else if (b.dataset.cap) b.classList.remove("selected");
  });
  document.querySelectorAll("#amenityFilterChips .f-chip").forEach(b => b.classList.remove("selected"));
  applyAdvancedFilters();
}

/* ---------------- FILTRADO Y ORDENAMIENTO ---------------- */
function getFilteredQuintas(){
  const rawLoc = $("searchLocation") ? $("searchLocation").value : "";
  const loc = normalizeText(rawLoc);
  return quintas.filter(q => {
    if (loc) {
      const matchLoc = normalizeText(q.location).includes(loc);
      const matchName = normalizeText(q.name).includes(loc);
      const matchRef = normalizeText(q.reference).includes(loc);
      if (!matchLoc && !matchName && !matchRef) return false;
    }
    if (q.price > filterPriceMax) return false;
    if (filterMinCap && q.capacity < filterMinCap) return false;
    if (filterCity !== "todas" && !normalizeText(q.location).includes(normalizeText(filterCity))) return false;
    if (filterAmenity.size > 0) {
      for (let am of filterAmenity) {
        if (!q.cats.includes(am)) return false;
      }
    }
    return true;
  });
}

function sortQuintas(list){
  const s = $("sortSelect") ? $("sortSelect").value : "relevancia";
  const l = [...list];
  if (s === "rating") l.sort((a,b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  else if (s === "precio") l.sort((a,b) => a.price - b.price);
  else if (s === "capacidad") l.sort((a,b) => b.capacity - a.capacity);
  else l.sort((a,b) => b.reviewCount - a.reviewCount);
  return l;
}

/* ---------------- RENDER DEL CATÁLOGO ---------------- */
async function renderCatalog(){
  updateFilterUI();
  const grid = $("catalogGrid");
  if (!grid) return;

  const searchDate = $("searchDate") ? $("searchDate").value : "";
  let bookedQuintaIds = new Set();

  if (searchDate){
    grid.innerHTML = `<div class="empty-state">Buscando disponibilidad para ${searchDate}...</div>`;
    bookedQuintaIds = await Storage.getBookedQuintaIds(searchDate);
  }

  const list = sortQuintas(getFilteredQuintas().filter(q => !bookedQuintaIds.has(q.id)));
  if ($("countBadge")) $("countBadge").textContent = `${list.length} ${list.length === 1 ? "disponible" : "disponibles"}`;

  if (list.length === 0){
    grid.innerHTML = `<div class="empty-state">No encontramos quintas disponibles con esos filtros. Prueba otra fecha o borra los filtros.</div>`;
    return;
  }

  grid.innerHTML = list.map(q => `
    <article class="card" onclick="openDetail(${q.id}, event)">
      <div class="card-media">
        <img id="cardImg-${q.id}" src="${q.images[0]}" alt="${q.name}" data-index="0" loading="lazy">
        ${q.images.length > 1 ? `
          <button class="card-nav prev" type="button" aria-label="Anterior" onclick="navCard(event, ${q.id}, -1)"><span class="ms">chevron_left</span></button>
          <button class="card-nav next" type="button" aria-label="Siguiente" onclick="navCard(event, ${q.id}, 1)"><span class="ms">chevron_right</span></button>
          <div class="card-dots">${q.images.map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`).join("")}</div>` : ""}
        <div class="card-badges">
          ${q.tag ? `<span class="badge"><span class="ms fill">workspace_premium</span>${q.tag}</span>` : ""}
        </div>
        <div class="card-turno"><span class="ms">wb_sunny</span><span>Turno de ${q.hours} horas</span></div>
      </div>
      <div class="card-body">
        <div>
          <div class="card-top">
            <h3 class="card-name">${q.name}</h3>
            <div class="card-rating"><span class="ms fill">star</span><span>${q.rating.toFixed(2)}</span><small>(${q.reviewCount})</small></div>
          </div>
          <p class="card-loc"><span class="ms">location_on</span>${q.location} • Capacidad máx. ${q.capacity} personas</p>
          <div class="amen-chips">
            ${q.chips.map(c => `<span class="amen-chip"><span class="ms">${c[0]}</span>${c[1]}</span>`).join("")}
          </div>
        </div>
        <div class="card-foot">
          <div>
            <div class="price"><strong>${money(q.price)}</strong><span>MXN / evento</span></div>
            <span class="card-note"><span class="ms">verified</span>Aparta con ${money(Math.round(q.price * 0.10))} (10%) · Resto al llegar</span>
          </div>
          <button class="btn-detail" type="button" onclick="openDetail(${q.id}, event)">Ver espacio</button>
        </div>
      </div>
    </article>`).join("");

  observeCards();
  initCardSwipes();
}

let cardObserver = null;
function observeCards(){
  const cards = document.querySelectorAll("#catalogGrid .card");
  if (!cards.length) return;

  if (!("IntersectionObserver" in window)) {
    cards.forEach(c => c.classList.add("revealed"));
    return;
  }

  if (cardObserver) {
    cardObserver.disconnect();
  }

  cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add("revealed");
        observer.unobserve(card);
      }
    });
  }, {
    root: null,
    rootMargin: "0px 0px -15px 0px",
    threshold: 0.04
  });

  const isMobile = window.innerWidth < 640;
  cards.forEach((card, index) => {
    // Escalonado suave y visible tanto en móvil como en desktop
    const delay = isMobile ? Math.min((index % 4) * 80, 240) : (index % 3) * 70;
    card.style.transitionDelay = `${delay}ms`;
    cardObserver.observe(card);
  });
}

let lastCardSwipe = 0;

function navCard(e, qId, dir){
  if (e && e.stopPropagation) e.stopPropagation();
  const q = quintas.find(x => x.id === qId);
  if (!q || !q.images || q.images.length <= 1) return;
  const img = $("cardImg-" + qId);
  if (!img) return;

  let idx = parseInt(img.dataset.index, 10) + dir;
  if (idx < 0) idx = q.images.length - 1;
  if (idx >= q.images.length) idx = 0;
  img.dataset.index = idx;

  // Animación de deslizamiento suave entre fotos
  img.classList.remove("slide-left", "slide-right");
  void img.offsetWidth; // Forzar reflow para reiniciar animación
  img.classList.add(dir > 0 ? "slide-left" : "slide-right");
  img.src = q.images[idx];

  // Pre-cargar la siguiente foto para que deslice al instante
  const nextIdx = (idx + 1) % q.images.length;
  if (q.images[nextIdx]) {
    const pre = new Image();
    pre.src = q.images[nextIdx];
  }

  // Dots
  const dots = img.parentElement.querySelectorAll(".card-dots .dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function initCardSwipes() {
  const cards = document.querySelectorAll("#catalogGrid .card");
  cards.forEach(card => {
    const media = card.querySelector(".card-media");
    if (!media || media._swipeInitialized) return;
    media._swipeInitialized = true;

    const img = media.querySelector("img[id^='cardImg-']");
    if (!img) return;
    const qId = parseInt(img.id.replace("cardImg-", ""), 10);
    if (!qId) return;

    let startX = 0;
    let startY = 0;
    let isTracking = false;
    let startTime = 0;

    media.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isTracking = true;
    }, { passive: true });

    media.addEventListener("touchend", (e) => {
      if (!isTracking) return;
      isTracking = false;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const diffX = touch.clientX - startX;
      const diffY = touch.clientY - startY;
      const elapsed = Date.now() - startTime;

      // Swipe válido si es horizontal (más de 30px y supera el desplazamiento vertical)
      if (Math.abs(diffX) >= 30 && Math.abs(diffX) > Math.abs(diffY) * 1.15 && elapsed < 700) {
        lastCardSwipe = Date.now();
        if (diffX < 0) {
          // Deslizó hacia la izquierda -> Siguiente foto
          navCard(null, qId, 1);
        } else {
          // Deslizó hacia la derecha -> Foto anterior
          navCard(null, qId, -1);
        }
      }
    }, { passive: true });

    // Bloquear el click residual que el navegador dispara tras el gesto de arrastre
    media.addEventListener("click", (e) => {
      if (Date.now() - lastCardSwipe < 450) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });
}

function openDetail(id, e){
  if (Date.now() - lastCardSwipe < 450) {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }
  window.location.href = `quinta.html?id=${id}`;
}

/* ---------------- INICIALIZACIÓN ---------------- */
function initMarketplace() {
  const gridEl = $("catalogGrid");
  if (!gridEl) {
    document.body.style.overflow = "";
    return;
  }

  document.body.style.overflow = "";

  if (typeof flatpickr !== "undefined" && $("searchDate")) {
    searchDatePicker = flatpickr("#searchDate", {
      locale: "es", minDate: "today", dateFormat: "Y-m-d",
      altInput: true, altFormat: "D j M Y", allowInput: false,
      onChange: () => updateFilterUI()
    });
  }

  if ($("dateField") && searchDatePicker) {
    $("dateField").addEventListener("click", () => searchDatePicker.open());
  }

  initLocationAutocomplete();
  renderCatalog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMarketplace);
} else {
  initMarketplace();
}
