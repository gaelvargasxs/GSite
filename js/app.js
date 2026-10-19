/* =========================================================
   GSite — app.js (Lógica del Marketplace / index.html)
   Consume los datos de js/quintas.js
   Maneja filtros interactivos, buscador de fechas y catálogo.
   ========================================================= */

/* ---------------- ESTADO DEL CATÁLOGO ---------------- */
let currentQuinta = null;
let favorites = new Set();
let activeCategory = "todas";
let guests = 0; // 0 = cualquiera
let lastFocus = null;
let searchDatePicker = null;

// Filtros avanzados del modal
let filterPriceMax = 12000;
let filterCity = "todas";
let filterMinCap = 0;
let filterAmenity = new Set();

/* ---------------- BARRA DE CATEGORÍAS ---------------- */
function renderCategoryBar(){
  const bar = $("categoryBar");
  if (!bar) return;
  bar.innerHTML = categories.map(c => `
    <button class="chip ${c.key === activeCategory ? "active" : ""}" type="button" onclick="setCategory('${c.key}')">
      <span class="ms">${c.icon}</span><span>${c.label}</span>
    </button>`).join("");
}

function setCategory(key){
  activeCategory = key;
  renderCategoryBar();
  renderCatalog();
}

/* ---------------- BUSCADOR & CONTADOR DE INVITADOS ---------------- */
function adjustGuests(delta){
  if (guests === 0) guests = delta > 0 ? 10 : 0;
  else {
    guests += delta;
    if (guests < 10) guests = 0;
    if (guests > 250) guests = 250;
  }
  const gc = $("guestCount"), gu = $("guestUnit");
  if (guests === 0){
    gc.textContent = "Cualquiera";
    gu.classList.add("hidden");
  } else {
    gc.textContent = guests + "+";
    gu.classList.remove("hidden");
  }
  updateFilterUI();
  renderCatalog();
}

function applyFilters(shouldScroll){
  renderCatalog();
  if (shouldScroll) $("resultados").scrollIntoView({behavior:"smooth", block:"start"});
}

function clearFilters(){
  $("searchLocation").value = "";
  if (searchDatePicker) searchDatePicker.clear();
  guests = 0;
  $("guestCount").textContent = "Cualquiera";
  $("guestUnit").classList.add("hidden");
  activeCategory = "todas";
  filterPriceMax = 12000;
  filterCity = "todas";
  filterMinCap = 0;
  filterAmenity.clear();
  renderCategoryBar();
  renderCatalog();
}

function activeFilterCount(){
  let n = 0;
  if ($("searchLocation") && $("searchLocation").value.trim()) n++;
  if ($("searchDate") && $("searchDate").value) n++;
  if (guests) n++;
  if (activeCategory !== "todas") n++;
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
  $("resultados").scrollIntoView({behavior:"smooth", block:"start"});
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
  document.querySelectorAll("#amenityFilterChips .f-chip").forEach(b => b.classList.remove("selected"));
  applyAdvancedFilters();
}

/* ---------------- FILTRADO Y ORDENAMIENTO ---------------- */
function getFilteredQuintas(){
  const loc = $("searchLocation") ? $("searchLocation").value.trim().toLowerCase() : "";
  return quintas.filter(q => {
    if (activeCategory !== "todas" && !q.cats.includes(activeCategory)) return false;
    if (loc && !q.location.toLowerCase().includes(loc) && !q.name.toLowerCase().includes(loc)) return false;
    if (guests && q.capacity < guests) return false;
    if (q.price > filterPriceMax) return false;
    if (filterMinCap && q.capacity < filterMinCap) return false;
    if (filterCity !== "todas" && !q.location.toLowerCase().includes(filterCity)) return false;
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

/* ---------------- FAVORITOS ---------------- */
function toggleFavorite(id, evt){
  if (evt) evt.stopPropagation();
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(b => {
    const on = favorites.has(id);
    b.classList.toggle("active", on);
    b.querySelector(".ms").classList.toggle("fill", on);
  });
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
    <article class="card" onclick="openDetail(${q.id})">
      <div class="card-media">
        <img id="cardImg-${q.id}" src="${q.images[0]}" alt="${q.name}" data-index="0" loading="lazy">
        ${q.images.length > 1 ? `
          <button class="card-nav prev" type="button" aria-label="Anterior" onclick="navCard(event, ${q.id}, -1)"><span class="ms">chevron_left</span></button>
          <button class="card-nav next" type="button" aria-label="Siguiente" onclick="navCard(event, ${q.id}, 1)"><span class="ms">chevron_right</span></button>
          <div class="card-dots">${q.images.map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`).join("")}</div>` : ""}
        <div class="card-badges">
          ${q.tag ? `<span class="badge"><span class="ms fill">workspace_premium</span>${q.tag}</span>` : ""}
          <span class="badge solid">Aparta con ${money(Math.round(q.price * 0.10))} (10%)</span>
        </div>
        <button class="fav-btn ${favorites.has(q.id) ? "active" : ""}" data-id="${q.id}" type="button" aria-label="Guardar en favoritos" onclick="toggleFavorite(${q.id}, event)">
          <span class="ms ${favorites.has(q.id) ? "fill" : ""}">favorite</span>
        </button>
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
            <span class="card-note"><span class="ms">verified</span>Aparta con 10% · Resto al llegar</span>
          </div>
          <button class="btn-detail" type="button" onclick="openDetail(${q.id})">Ver espacio</button>
        </div>
      </div>
    </article>`).join("");
}

function navCard(e, qId, dir){
  if (e) e.stopPropagation();
  const q = quintas.find(x => x.id === qId);
  if (!q) return;
  const img = $("cardImg-" + qId);
  let idx = parseInt(img.dataset.index, 10) + dir;
  if (idx < 0) idx = q.images.length - 1;
  if (idx >= q.images.length) idx = 0;
  img.dataset.index = idx;
  img.src = q.images[idx];

  // Dots
  const dots = img.parentElement.querySelectorAll(".card-dots .dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function openDetail(id){
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

  const locInput = $("searchLocation");
  if (locInput) {
    locInput.addEventListener("keydown", (e) => { if (e.key === "Enter") applyFilters(true); });
  }

  if ($("categoryBar")) renderCategoryBar();
  renderCatalog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMarketplace);
} else {
  initMarketplace();
}
