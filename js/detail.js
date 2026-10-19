/* =========================================================
   GSite — detail.js
   Vista de detalles + Sticky Bottom Bar + Drawer de reserva
   con diseño original de alta conversión (Stitch Tokens),
   mapa OpenStreetMap interactivo, galería adaptable,
   calendario visual, servicios adicionales (Addons),
   pasarela de cobro del 10% de anticipo y Pase Digital.
   ========================================================= */

const ANTICIPO_PCT = 0.10; // 10% de comisión GSite para apartar fecha

/* Reglas y coordenadas por municipio en La Laguna */
const CITY_RULES = {
  gomez: {
    city: "Gómez Palacio",
    lat: 25.5717,
    lng: -103.4936,
    rules: [
      ["schedule", "Horario límite de desalojo", "12:00 AM"],
      ["volume_up", "Música y sonido", "Volumen moderado permitido hasta las 11:00 PM"],
      ["celebration", "Pirotecnia", "No permitida"]
    ]
  },
  torreon: {
    city: "Torreón",
    lat: 25.5428,
    lng: -103.4068,
    rules: [
      ["schedule", "Horario límite de desalojo", "11:00 PM entre semana, 12:00 AM fines de semana"],
      ["volume_up", "Música y sonido", "Grupo en vivo o sonido hasta las 10:30 PM"],
      ["celebration", "Pirotecnia", "No permitida"]
    ]
  },
  lerdo: {
    city: "Lerdo",
    lat: 25.5432,
    lng: -103.5307,
    rules: [
      ["schedule", "Horario límite de desalojo", "11:30 PM (recomendación de Protección Civil local)"],
      ["volume_up", "Música y sonido", "Banda o música en vivo con volumen moderado hasta las 10:30 PM"],
      ["celebration", "Pirotecnia", "No permitida dentro del predio"]
    ]
  },
  durango: {
    city: "Durango",
    lat: 24.0277,
    lng: -104.6532,
    rules: [
      ["schedule", "Horario límite de desalojo", "11:30 PM"],
      ["volume_up", "Música y sonido", "Música en vivo con moderación hasta las 10:30 PM"],
      ["celebration", "Pirotecnia", "Estrictamente prohibida"]
    ]
  }
};

function getLocalRules(location) {
  const l = (location || "").toLowerCase();
  if (l.includes("gómez") || l.includes("gomez")) return CITY_RULES.gomez;
  if (l.includes("torre")) return CITY_RULES.torreon;
  if (l.includes("lerdo")) return CITY_RULES.lerdo;
  if (l.includes("durango")) return CITY_RULES.durango;
  return CITY_RULES.lerdo;
}

/* ---------------- SERVICIOS ADICIONALES (ADDONS) ---------------- */
var AVAILABLE_ADDONS = window.AVAILABLE_ADDONS || [
  { id: "hielo", name: "Pack Hielo & Carbón", price: 350, icon: "ac_unit", desc: "2 bolsas de hielo + 2 bolsas de carbón de mezquite listas al llegar" },
  { id: "sonido", name: "Bocina JBL & Micrófono", price: 450, icon: "speaker", desc: "Sonido Bluetooth potente con micrófono inalámbrico para karaoke/música" },
  { id: "mobiliario", name: "Mobiliario Adicional", price: 600, icon: "chair", desc: "2 tablones adicionales con 20 sillas y manteles limpios" },
  { id: "inflable", name: "Brincolín Inflable Acuático", price: 850, icon: "celebration", desc: "Inflable instalado y desinfectado para niños durante todo el evento" }
];

let selectedAddons = new Set();
let currentQuinta = null;
let currentQuintaId = 1;
let bookedDates = new Set();
let calCursor = new Date();
let selectedDate = "";
let drawerGuests = 20;
let lbIndex = 0;
let drawerDatePicker = null;
let lastReservation = null;
let selectedPayMethod = "card";
let pendingReservationData = null;

/* ---------------- RENDER DETALLES DE LA QUINTA ---------------- */
function renderDetail(q) {
  if (!q) return;
  currentQuinta = q;
  currentQuintaId = q.id;

  document.title = `${q.name} | GSite`;

  // Breadcrumbs con clases originales
  const city = (q.location || "").split(",")[0].trim();
  if ($("dCrumbs")) {
    $("dCrumbs").style.display = "flex";
    $("dCrumbs").innerHTML = `
      <a href="index.html">Inicio</a><span class="sep">/</span>
      <a href="index.html">Quintas</a><span class="sep">/</span>
      <span>${city}</span><span class="sep">/</span>
      <span class="cur">${q.name}</span>`;
  }

  // Título
  if ($("dTitle")) $("dTitle").textContent = q.name;

  // Meta cabecera con clases originales .tagpill y .meta-item
  if ($("dMeta")) {
    $("dMeta").innerHTML = `
      ${q.tag ? `<span class="tagpill green"><span class="ms fill">workspace_premium</span>${q.tag}</span>` : ""}
      <span class="tagpill dark"><span class="ms fill">verified</span>Verificada GSite</span>
      <span class="meta-item rating"><span class="ms fill">star</span>${Number(q.rating).toFixed(2)} <span class="link">${q.reviewCount} reseñas</span></span>
      <span class="meta-item"><span class="ms">location_on</span>${q.location}${q.reference ? ` · ${q.reference}` : ""}</span>
      <span class="meta-item"><span class="ms">groups</span>Hasta ${q.capacity} personas · Turno de ${q.hours} h</span>`;
  }

  // Galería de fotos interactiva con .g-tile y .g-chip
  renderGallery(q);

  // Ficha del Anfitrión con .host-row, .host-av, .host-chips y .tiles
  renderHostCard(q);

  // Descripción
  if ($("dAbout")) $("dAbout").textContent = q.description;

  // Amenidades con clases originales .amen
  const amen = q.features || [["pool", "Alberca privada", "Con chapoteadero"], ["outdoor_grill", "Asador", "Parrilla"], ["roofing", "Palapa techada", "Sombra"]];
  if ($("amenCount")) $("amenCount").textContent = `${amen.length} amenidades`;
  if ($("dAmenities")) {
    $("dAmenities").innerHTML = amen.map(a => `
      <div class="amen">
        <span class="ms">${a[0]}</span>
        <div>
          <strong>${a[1]}</strong>
          ${a[2] ? `<small>${a[2]}</small>` : ""}
        </div>
      </div>`).join("");
  }

  // Ubicación, mapa OpenStreetMap y reglas
  renderLocation(q);

  // Sticky Bar con clases originales
  if ($("sbPrice")) $("sbPrice").textContent = moneyMXN(q.price);
  if ($("sbSub")) $("sbSub").textContent = `/ turno de ${q.hours} horas`;
  if ($("sbRating")) $("sbRating").innerHTML = `<span class="ms fill" style="color:var(--star); font-size:14px;">star</span>${Number(q.rating).toFixed(2)} · ${q.reviewCount} reseñas`;
  if ($("sbDeposit")) $("sbDeposit").innerHTML = `<span class="ms" style="font-size:14px;">savings</span>Aparta con 10% (${moneyMXN(Math.round(q.price * ANTICIPO_PCT))})`;
  if ($("drawerSub")) $("drawerSub").textContent = `${q.name} · Renta diurna exclusiva`;

  // Inicializar fechas y drawer
  selectedDate = "";
  bookedDates = new Set();
  const now = new Date();
  calCursor = new Date(now.getFullYear(), now.getMonth(), 1);

  loadBookedDates(q.id);
  renderAddons();
  updateCta();
}

/* ---------------- GALERÍA DE FOTOS ---------------- */
function renderGallery(q) {
  const imgs = q.images;
  const side = imgs.slice(1, 5);
  const chip = (q.chips && q.chips[0]) ? q.chips[0] : ["pool", "Alberca"];
  const g = $("dGallery");
  if (!g) return;

  g.className = "gallery" + (imgs.length === 1 ? " single" : "");
  g.innerHTML = `
    <button class="g-tile" type="button" onclick="openLightbox(0)" aria-label="Ver foto principal">
      <img src="${imgs[0]}" alt="${q.name}">
      <span class="g-chip"><span class="ms">${chip[0]}</span><span>${chip[1]}</span></span>
    </button>
    ${side.length ? `<div class="g-side ${side.length >= 3 ? "cols-2" : ""}">
      ${side.map((s, i) => `<button class="g-tile" type="button" onclick="openLightbox(${i + 1})" aria-label="Ver foto ${i + 2}"><img src="${s}" alt="${q.name} foto ${i + 2}" loading="lazy"></button>`).join("")}
    </div>` : ""}`;

  g.scrollLeft = 0;
  if ($("gCounter")) $("gCounter").textContent = `1 / ${imgs.length}`;
  if ($("gAllLabel")) $("gAllLabel").textContent = `Ver las ${imgs.length} fotos`;

  g.onscroll = () => {
    const i = Math.round(g.scrollLeft / Math.max(g.clientWidth, 1));
    if ($("gCounter")) $("gCounter").textContent = `${Math.min(i + 1, imgs.length)} / ${imgs.length}`;
  };
}

/* ---------------- TARJETA DEL ANFITRIÓN ---------------- */
function renderHostCard(q) {
  const clean = q.host.replace(/^(Anfitri[oó]na?|Familia|Grupo|Ing\.|Lic\.|Don|Doña)\s+/i, "");
  const initial = clean.charAt(0).toUpperCase() || "A";

  if ($("dHostCard")) {
    $("dHostCard").innerHTML = `
      <div class="host-row">
        <div class="host-id">
          <div class="host-av">${initial}<span class="vb"><span class="ms fill">verified</span></span></div>
          <div>
            <h3>${q.host}</h3>
            <p>Anfitrión verificado en La Laguna · Respuesta rápida</p>
          </div>
        </div>
        <div class="host-chips">
          <span class="host-chip"><span class="ms">bolt</span>Responde en ~15 min</span>
          <span class="host-chip"><span class="ms">verified_user</span>Identidad validada</span>
        </div>
      </div>
      <div class="tiles">
        <div class="tile">
          <span class="ms">event_available</span>
          <div>
            <h4>Fecha bloqueada al instante</h4>
            <p>Nadie más puede apartar tu día una vez completado el pago.</p>
          </div>
        </div>
        <div class="tile">
          <span class="ms">savings</span>
          <div>
            <h4>Aparta con 10%</h4>
            <p>Anticipo de ${moneyMXN(Math.round(q.price * ANTICIPO_PCT))} y liquidas el resto en efectivo al llegar.</p>
          </div>
        </div>
        <div class="tile">
          <span class="ms">schedule</span>
          <div>
            <h4>Turno de ${q.hours} horas</h4>
            <p>Elige tu hora de entrada; calculamos la salida de forma automática.</p>
          </div>
        </div>
      </div>`;
  }
}

/* ---------------- UBICACIÓN Y REGLAS ---------------- */
function renderLocation(q) {
  const info = getLocalRules(q.location);
  if ($("dLocSub")) $("dLocSub").textContent = `${q.location} · ${q.reference || "Zona de fácil acceso"}`;
  if ($("dMapLink")) $("dMapLink").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q.name + " " + q.location)}`;

  if ($("dMap")) {
    $("dMap").innerHTML = `<iframe loading="lazy" title="Ubicación aproximada de ${q.name}" src="https://www.openstreetmap.org/export/embed.html?bbox=${info.lng - 0.08}%2C${info.lat - 0.06}%2C${info.lng + 0.08}%2C${info.lat + 0.06}&layer=mapnik&marker=${info.lat}%2C${info.lng}"></iframe>`;
  }

  if ($("dLocTiles")) {
    $("dLocTiles").innerHTML = `
      <div class="tile"><span class="ms">location_city</span><div><h4>${q.location}</h4><p>Ubicación residencial en La Laguna</p></div></div>
      <div class="tile"><span class="ms">pin_drop</span><div><h4>Referencia</h4><p>${cap1(q.reference || "Acceso rápido")}</p></div></div>
      <div class="tile"><span class="ms">groups</span><div><h4>Hasta ${q.capacity} personas</h4><p>Capacidad máxima autorizada</p></div></div>`;
  }

  if ($("rulesCity")) $("rulesCity").textContent = info.city;
  const base = [["schedule", `Turno de ${q.hours} horas`, "Eliges tu hora de entrada y la salida se calcula automáticamente para cumplir con el reglamento."]];
  if ($("dRules")) {
    $("dRules").innerHTML = base.concat(info.rules).map(r => `
      <div class="rule"><div class="ic"><span class="ms">${r[0]}</span></div><div><h4>${r[1]}</h4><p>${r[2]}</p></div></div>`).join("");
  }
}

/* ---------------- CALENDARIO VISUAL DE DISPONIBILIDAD ---------------- */
async function loadBookedDates(quintaId) {
  bookedDates = await Storage.getBookedDatesForQuinta(quintaId);
  initFlatpickr();
  renderCalendar();
}

function initFlatpickr() {
  if (typeof flatpickr === "undefined") return;
  if (drawerDatePicker) drawerDatePicker.destroy();

  drawerDatePicker = flatpickr("#eventDate", {
    locale: "es",
    minDate: "today",
    dateFormat: "Y-m-d",
    disable: Array.from(bookedDates),
    onChange: function(dates, str) {
      onDrawerDate(str);
    }
  });

  const calInline = document.querySelector(".cal-inline");
  if (calInline && drawerDatePicker) {
    calInline.onclick = () => drawerDatePicker.open();
  }
}

function renderCalendar() {
  const grid = $("calGrid"), title = $("calTitle");
  if (!grid || !title) return;

  const y = calCursor.getFullYear(), m = calCursor.getMonth();
  title.textContent = cap1(calCursor.toLocaleDateString("es-MX", { month: "long", year: "numeric" }));

  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // lunes primero
  const total = new Date(y, m + 1, 0).getDate();
  const today = toISO(new Date());

  let html = "";
  for (let i = 0; i < offset; i++) html += `<span></span>`;

  for (let d = 1; d <= total; d++) {
    const iso = `${y}-${pad2(m + 1)}-${pad2(d)}`;
    const past = iso < today;
    const booked = bookedDates.has(iso);
    const sel = iso === selectedDate;
    const cls = ["cal-day", past ? "past" : "", booked ? "booked" : "", sel ? "selected" : ""].join(" ").replace(/\s+/g, " ").trim();

    html += `<button type="button" class="${cls}" data-date="${iso}" ${past || booked ? "disabled" : ""} ${booked ? 'title="Fecha ya ocupada"' : 'title="Disponible para apartar"'}>${d}</button>`;
  }

  grid.innerHTML = html;

  const now = new Date();
  if ($("calPrev")) {
    $("calPrev").disabled = (y === now.getFullYear() && m <= now.getMonth()) || y < now.getFullYear();
  }
}

function calMove(delta) {
  calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + delta, 1);
  renderCalendar();
}

// Delegación de clics en los días del calendario
if ($("calGrid")) {
  $("calGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".cal-day");
    if (!btn || btn.disabled) return;
    const dStr = btn.dataset.date;
    selectedDate = dStr;
    onDrawerDate(dStr);
    openDrawer();
  });
}

function updateCta() {
  if ($("sbCtaLabel")) {
    $("sbCtaLabel").textContent = selectedDate
      ? "Apartar para el " + new Date(selectedDate + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" })
      : "Iniciar reserva";
  }
}

/* ---------------- DRAWER DE RESERVA ---------------- */
function openDrawer() {
  if (!currentQuinta) return;
  const overlay = $("drawerOverlay"), dr = $("drawer");
  if (!overlay || !dr) return;

  document.body.classList.add("no-scroll");
  overlay.classList.add("open");
  dr.classList.add("open");
  dr.setAttribute("aria-hidden", "false");

  if (!selectedDate) {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const suggestStr = toISO(today);
    if (!bookedDates.has(suggestStr)) {
      onDrawerDate(suggestStr);
    }
  }

  if ($("drawerSub")) $("drawerSub").textContent = `${currentQuinta.name} · ${currentQuinta.location}`;
  updateSummary();
}

function closeDrawer() {
  const overlay = $("drawerOverlay"), dr = $("drawer");
  if (overlay) overlay.classList.remove("open");
  if (dr) {
    dr.classList.remove("open");
    dr.setAttribute("aria-hidden", "true");
  }

  const passMod = $("passModal");
  const payMod = $("paymentModal");
  const hasOtherModal = (passMod && passMod.classList.contains("open")) || (payMod && payMod.classList.contains("open"));
  if (!hasOtherModal) {
    document.body.classList.remove("no-scroll");
  }
}

/* ---------------- SERVICIOS ADICIONALES (ADDONS) ---------------- */
function renderAddons() {
  const listEl = $("addonsList");
  if (!listEl) return;
  listEl.innerHTML = AVAILABLE_ADDONS.map(a => `
    <div class="addon-item ${selectedAddons.has(a.id) ? "selected" : ""}" onclick="toggleAddon('${a.id}')">
      <div class="addon-info">
        <span class="ms">${a.icon}</span>
        <div>
          <strong>${a.name}</strong>
          <small>${a.desc}</small>
        </div>
      </div>
      <span class="addon-price">+${moneyMXN(a.price)}</span>
    </div>`).join("");
}

function toggleAddon(id) {
  if (selectedAddons.has(id)) selectedAddons.delete(id);
  else selectedAddons.add(id);
  renderAddons();
  updateSummary();
}

function adjustDrawerGuests(delta) {
  if (!currentQuinta) return;
  drawerGuests = Math.max(5, Math.min(currentQuinta.capacity, drawerGuests + delta));
  if ($("gNum")) $("gNum").textContent = drawerGuests;
  updateSummary();
}

function onDrawerDate(dStr) {
  selectedDate = dStr || "";
  const lbl = $("dDateLabel"), badge = $("dDateBadge");
  if (selectedDate) {
    if (lbl) lbl.textContent = formatLongDate(selectedDate);
    if (badge) {
      badge.textContent = "Disponible";
      badge.classList.remove("muted");
    }
  } else {
    if (lbl) lbl.textContent = "Elige una fecha";
    if (badge) {
      badge.textContent = "Sin fecha";
      badge.classList.add("muted");
    }
  }
  if ($("eventDate")) $("eventDate").value = selectedDate;
  renderCalendar();
  updateSummary();
  updateCta();
}

function getExitDateTime() {
  const dateVal = selectedDate || ($("eventDate") ? $("eventDate").value : "");
  const timeVal = $("checkinTime") ? $("checkinTime").value : "";
  if (!dateVal || !timeVal || !currentQuinta) return null;
  const entry = new Date(dateVal + "T" + timeVal + ":00");
  const exit = new Date(entry.getTime() + currentQuinta.hours * 3600 * 1000);
  return { entry, exit };
}

function updateSummary() {
  if (!currentQuinta) return;

  const range = getExitDateTime();
  const noteEl = $("scheduleNote");
  const exitEl = $("exitTime");

  if (!range) {
    if (exitEl) exitEl.textContent = "—";
    if (noteEl) noteEl.classList.remove("show");
  } else {
    const { entry, exit } = range;
    const crossesDay = exit.getDate() !== entry.getDate() || exit.getMonth() !== entry.getMonth();
    if (exitEl) exitEl.textContent = formatTime(exit) + (crossesDay ? " (+1 día)" : "");
    if (noteEl) {
      noteEl.innerHTML = `Entras el <strong>${formatDate(selectedDate)}</strong> a las <strong>${formatTime(entry)}</strong> y sales a las <strong>${formatTime(exit)}</strong>${crossesDay ? " del día siguiente" : ""} (${currentQuinta.hours} horas).`;
      noteEl.classList.add("show");
    }
  }

  // Totales
  let extrasTotal = 0;
  selectedAddons.forEach(id => {
    const ad = AVAILABLE_ADDONS.find(x => x.id === id);
    if (ad) extrasTotal += ad.price;
  });

  const grandTotal = currentQuinta.price + extrasTotal;
  const anticipo = Math.round(grandTotal * ANTICIPO_PCT);
  const restoEnPuerta = grandTotal - anticipo;

  if ($("sRenta")) $("sRenta").textContent = moneyMXN(currentQuinta.price);
  if ($("sExtrasRow")) {
    $("sExtrasRow").style.display = extrasTotal > 0 ? "flex" : "none";
    $("sExtras").textContent = moneyMXN(extrasTotal);
  }
  if ($("sGuests")) $("sGuests").textContent = `${drawerGuests} personas`;
  if ($("sAnticipo")) $("sAnticipo").textContent = moneyMXN(anticipo);
  if ($("sResto")) $("sResto").textContent = moneyMXN(restoEnPuerta);
  if ($("sTotal")) $("sTotal").textContent = moneyMXN(grandTotal);

  if ($("reserveNote")) $("reserveNote").textContent = `Aparta hoy con ${money(anticipo)} (10%) · Resto de ${money(restoEnPuerta)} al llegar`;
}

if ($("checkinTime")) {
  $("checkinTime").addEventListener("change", updateSummary);
}

/* =========================================================
   PASO 1: CONTINUAR AL PAGO (VALIDACIÓN DEL FORMULARIO)
   ========================================================= */
function handleReserve() {
  const errorEl = $("errorMsg");
  const range = getExitDateTime();
  const clientName = $("clientName") ? $("clientName").value.trim() : "";
  const clientPhone = $("clientPhone") ? $("clientPhone").value.trim() : "";

  if (!range) {
    if (errorEl) {
      errorEl.textContent = "Por favor selecciona la fecha del evento y la hora de entrada.";
      errorEl.classList.add("show");
    }
    return;
  }

  if (!clientName || !clientPhone) {
    if (errorEl) {
      errorEl.textContent = "Escribe tu nombre completo y teléfono celular de 10 dígitos.";
      errorEl.classList.add("show");
    }
    return;
  }

  if (errorEl) errorEl.classList.remove("show");

  let extrasTotal = 0;
  const addonsListNames = [];
  selectedAddons.forEach(id => {
    const ad = AVAILABLE_ADDONS.find(x => x.id === id);
    if (ad) {
      extrasTotal += ad.price;
      addonsListNames.push(ad.name);
    }
  });

  const grandTotal = currentQuinta.price + extrasTotal;
  const anticipo = Math.round(grandTotal * ANTICIPO_PCT);
  const restoEnPuerta = grandTotal - anticipo;
  const { entry, exit } = range;
  const crossesDay = exit.getDate() !== entry.getDate() || exit.getMonth() !== entry.getMonth();

  pendingReservationData = {
    id: `res_${currentQuinta.id}_${selectedDate}`,
    quintaId: currentQuinta.id,
    quintaNombre: currentQuinta.name,
    quintaUbicacion: currentQuinta.location,
    fecha: selectedDate,
    horaEntrada: formatTime(entry),
    horaSalida: formatTime(exit) + (crossesDay ? " (+1 día)" : ""),
    horasRenta: currentQuinta.hours,
    capacidad: currentQuinta.capacity,
    invitados: drawerGuests,
    total: grandTotal,
    anticipo: anticipo,
    restoEnPuerta: restoEnPuerta,
    addons: addonsListNames,
    clienteNombre: clientName,
    clienteTelefono: clientPhone,
    creadaEn: new Date().toISOString()
  };

  openPaymentModal(pendingReservationData);
}

/* =========================================================
   PASO 2: PASARELA DE PAGO EN LÍNEA (MODAL DE CHECKOUT)
   ========================================================= */
function openPaymentModal(data) {
  if (!data) return;
  const payModal = $("paymentModal");
  if (!payModal) return;

  if ($("payQuintaName")) $("payQuintaName").textContent = data.quintaNombre;
  if ($("payEventDate")) $("payEventDate").textContent = formatLongDate(data.fecha);
  if ($("payGrandTotal")) $("payGrandTotal").textContent = moneyMXN(data.total);
  if ($("payDepositAmount")) $("payDepositAmount").textContent = moneyMXN(data.anticipo);
  if ($("payRemainderAmount")) $("payRemainderAmount").textContent = moneyMXN(data.restoEnPuerta);
  if ($("btnSubmitPaymentText")) $("btnSubmitPaymentText").textContent = `Pagar ${moneyMXN(data.anticipo)} y Bloquear Fecha`;

  if ($("payErrorMsg")) $("payErrorMsg").classList.remove("show");

  document.body.classList.add("no-scroll");
  payModal.classList.add("open");
}

function closePaymentModal() {
  const payModal = $("paymentModal");
  if (payModal) payModal.classList.remove("open");
  const dr = $("drawer");
  if (!dr || !dr.classList.contains("open")) {
    document.body.classList.remove("no-scroll");
  }
}

function selectPayMethod(method) {
  selectedPayMethod = method;
  const mCard = $("methodCard"), mMP = $("methodMP");
  const fCard = $("payFormCard"), fMP = $("payFormMP");

  if (method === "card") {
    if (mCard) mCard.classList.add("active");
    if (mMP) mMP.classList.remove("active");
    if (fCard) fCard.style.display = "flex";
    if (fMP) fMP.style.display = "none";
    if ($("btnSubmitPaymentText")) $("btnSubmitPaymentText").textContent = `Pagar con Tarjeta (${moneyMXN(pendingReservationData?.anticipo || 450)})`;
  } else {
    if (mCard) mCard.classList.remove("active");
    if (mMP) mMP.classList.add("active");
    if (fCard) fCard.style.display = "none";
    if (fMP) fMP.style.display = "block";
    if ($("btnSubmitPaymentText")) $("btnSubmitPaymentText").textContent = `Pagar con Mercado Pago (${moneyMXN(pendingReservationData?.anticipo || 450)})`;
  }
}

/* Formateo automático de tarjeta */
if ($("cardNumber")) {
  $("cardNumber").addEventListener("input", function(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
  });
}
if ($("cardExp")) {
  $("cardExp").addEventListener("input", function(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) e.target.value = v.slice(0, 2) + "/" + v.slice(2);
    else e.target.value = v;
  });
}

async function submitPayment() {
  if (!pendingReservationData) return;
  const errEl = $("payErrorMsg");
  const submitBtn = $("btnSubmitPayment");

  if (selectedPayMethod === "card") {
    const num = ($("cardNumber")?.value || "").replace(/\s/g, "");
    const exp = ($("cardExp")?.value || "");
    const cvv = ($("cardCvv")?.value || "");

    if (num.length < 15) {
      if (errEl) { errEl.textContent = "Ingresa un número de tarjeta válido de 16 dígitos."; errEl.classList.add("show"); }
      return;
    }
    if (exp.length < 5 || !exp.includes("/")) {
      if (errEl) { errEl.textContent = "Ingresa la fecha de vencimiento (MM/AA)."; errEl.classList.add("show"); }
      return;
    }
    if (cvv.length < 3) {
      if (errEl) { errEl.textContent = "Ingresa el código CVV de seguridad (3 o 4 dígitos)."; errEl.classList.add("show"); }
      return;
    }
  }

  if (errEl) errEl.classList.remove("show");

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="ms" style="animation:spin 1s linear infinite;">sync</span><span>Procesando pago seguro...</span>`;
  }

  await new Promise(r => setTimeout(r, 1400));

  const transaccionId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
  const finalReserva = {
    ...pendingReservationData,
    estado: "confirmada",
    pagoEstado: "anticipo_pagado",
    metodoPago: selectedPayMethod === "card" ? "Tarjeta Débito/Crédito" : "Mercado Pago México",
    transaccionId: transaccionId
  };

  Storage.saveLocalReserva(finalReserva);
  lastReservation = finalReserva;

  bookedDates.add(finalReserva.fecha);
  if (drawerDatePicker) drawerDatePicker.set("disable", Array.from(bookedDates));
  renderCalendar();

  closePaymentModal();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span class="ms">lock</span><span>Pagar anticipo y confirmar</span>`;
  }

  showSuccessView(`
    <div><span>Quinta</span><strong>${finalReserva.quintaNombre}</strong></div>
    <div><span>Fecha del evento</span><strong>${formatDate(finalReserva.fecha)}</strong></div>
    <div><span>Horario reservado</span><strong>${finalReserva.horaEntrada} a ${finalReserva.horaSalida}</strong></div>
    <div><span>Invitados</span><strong>${finalReserva.invitados} personas</strong></div>
    ${finalReserva.addons.length ? `<div><span>Extras incluidos</span><strong>${finalReserva.addons.join(", ")}</strong></div>` : ""}
    <div style="border-top:1px dashed var(--surface-variant); padding-top:6px; margin-top:6px;"><span>Anticipo cobrado en línea (10%)</span><strong style="color:var(--primary); font-size:15px;">${moneyMXN(finalReserva.anticipo)} (Aprobado)</strong></div>
    <div><span>Folio de transacción</span><strong style="font-family:monospace; font-size:13px;">${transaccionId}</strong></div>
    <div style="background:rgba(16,185,129,.1); padding:8px 10px; border-radius:var(--r-lg); margin-top:6px;"><span>Saldo a liquidar al anfitrión al llegar</span><strong style="color:#047857; font-size:15px; display:block;">${moneyMXN(finalReserva.restoEnPuerta)} en efectivo o SPEI</strong></div>
  `);

  const waMsg = encodeURIComponent(`¡Hola! Acabo de apartar ${finalReserva.quintaNombre} en GSite para el ${formatDate(finalReserva.fecha)} (${finalReserva.horaEntrada} a ${finalReserva.horaSalida}). Anticipo del 10% pagado (${moneyMXN(finalReserva.anticipo)}). Folio: ${transaccionId}. Mi nombre es ${finalReserva.clienteNombre}.`);
  if ($("btnWhatsappSuccess")) {
    $("btnWhatsappSuccess").href = `https://wa.me/52${currentQuinta.phone}?text=${waMsg}`;
  }
}

function showSuccessView(html) {
  if ($("drawerFormView")) $("drawerFormView").classList.add("hidden");
  if ($("successSummary")) $("successSummary").innerHTML = html;
  if ($("drawerSuccess")) $("drawerSuccess").classList.add("show");
  if ($("reserveLabel")) $("reserveLabel").textContent = "Entendido";
  if ($("reserveIcon")) $("reserveIcon").classList.add("hidden");
  if ($("reserveBtn")) $("reserveBtn").onclick = () => closeDrawer();
  if ($("reserveNote")) $("reserveNote").classList.add("hidden");
  if ($("drawerTitle")) $("drawerTitle").textContent = "¡Reserva Confirmada!";
  if ($("drawerBody")) $("drawerBody").scrollTop = 0;
}

/* =========================================================
   PASO 3: PASE DIGITAL DE ACCESO
   ========================================================= */
function openDigitalPass() {
  if (!lastReservation) {
    const list = Storage.getLocalReservas();
    lastReservation = list[list.length - 1];
  }
  if (!lastReservation) {
    alert("No hay una reserva confirmada reciente para mostrar.");
    return;
  }

  const r = lastReservation;
  const q = quintas.find(x => x.id === r.quintaId) || currentQuinta;
  const passMod = $("passModal");
  if (!passMod) return;

  $("passContent").innerHTML = `
    <div class="pass-ticket">
      <div class="pass-header">
        <div>
          <div class="pass-title">${r.quintaNombre}</div>
          <p style="font-size:12px; opacity:.85; margin-top:2px;"><span class="ms" style="font-size:14px; vertical-align:middle;">location_on</span> ${q.location}</p>
        </div>
        <span class="pass-tag">Anticipo 10% Pagado</span>
      </div>
      <div class="pass-grid">
        <div class="pass-item"><label>Titular</label><strong>${r.clienteNombre}</strong></div>
        <div class="pass-item"><label>Teléfono</label><strong>${r.clienteTelefono}</strong></div>
        <div class="pass-item"><label>Fecha</label><strong>${formatDate(r.fecha)}</strong></div>
        <div class="pass-item"><label>Horario</label><strong>${r.horaEntrada} a ${r.horaSalida}</strong></div>
        <div class="pass-item"><label>Invitados</label><strong>${r.invitados} personas</strong></div>
        <div class="pass-item"><label>Anticipo Pagado</label><strong style="color:#6ffbbe">${moneyMXN(r.anticipo)}</strong></div>
        <div class="pass-item" style="grid-column:1/-1; background:rgba(0,0,0,.2); padding:8px 12px; border-radius:8px;">
          <label style="color:#a7f3d0">Saldo a liquidar al anfitrión al recibir la quinta</label>
          <strong style="font-size:17px; color:#fff">${moneyMXN(r.restoEnPuerta)} en efectivo o SPEI</strong>
        </div>
      </div>
      <div class="pass-qr-box">
        <div class="qr-graphic">
          GSITE PASS<br>
          <strong style="font-size:14px; color:#10b981;">${r.transaccionId || "CONF-2026"}</strong><br>
          ACCESO VÁLIDO
        </div>
        <p style="font-size:11.5px; color:#475569; margin:0;">Muestra este código al llegar a la quinta para validar tu entrada con el anfitrión.</p>
      </div>
      <div class="pass-collect-note">
        <strong>Garantía de Acceso GSite:</strong> Tu fecha está 100% blindada. El anfitrión tiene registrado tu evento en su portal.
      </div>
    </div>`;

  document.body.classList.add("no-scroll");
  passMod.classList.add("open");
}

function closeDigitalPass() {
  const passMod = $("passModal");
  if (passMod) passMod.classList.remove("open");
  const dr = $("drawer");
  if (!dr || !dr.classList.contains("open")) {
    document.body.classList.remove("no-scroll");
  }
}

/* ---------------- LIGHTBOX DE FOTOGRAFÍAS ---------------- */
function openLightbox(idx) {
  if (!currentQuinta || !currentQuinta.images.length) return;
  lbIndex = idx;
  const lb = $("lightbox"), img = $("lbImg"), count = $("lbCount");
  if (!lb || !img) return;

  img.src = currentQuinta.images[lbIndex];
  if (count) count.textContent = `${lbIndex + 1} / ${currentQuinta.images.length}`;
  document.body.classList.add("no-scroll");
  lb.classList.add("open");
}

function closeLightbox() {
  const lb = $("lightbox");
  if (lb) lb.classList.remove("open");
  const dr = $("drawer");
  if (!dr || !dr.classList.contains("open")) {
    document.body.classList.remove("no-scroll");
  }
}

function navLightbox(delta) {
  if (!currentQuinta) return;
  lbIndex = (lbIndex + delta + currentQuinta.images.length) % currentQuinta.images.length;
  const img = $("lbImg"), count = $("lbCount");
  if (img) img.src = currentQuinta.images[lbIndex];
  if (count) count.textContent = `${lbIndex + 1} / ${currentQuinta.images.length}`;
}

/* ---------------- AYUDANTES COMUNES ---------------- */
function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}
function formatLongDate(dateStr) {
  const s = new Date(dateStr + "T00:00:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function formatTime(date) {
  return date.toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit", hour12: true });
}
const pad2 = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const cap1 = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

function shareQuinta() {
  if (navigator.share) {
    navigator.share({ title: currentQuinta?.name, text: "Mira esta quinta en GSite", url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    const lbl = $("shareLabel");
    if (lbl) {
      lbl.textContent = "¡Enlace copiado!";
      setTimeout(() => lbl.textContent = "Compartir", 2000);
    }
  }
}

function toggleDetailFav() {
  const icon = $("dFavIcon"), txt = $("dFavText");
  if (!icon || !txt) return;
  const isFav = icon.classList.toggle("fill");
  txt.textContent = isFav ? "Guardado" : "Guardar";
}

/* ---------------- AYUDANTES GLOBALES Y AUTO-INICIALIZACIÓN ---------------- */
var money = window.money || ((n) => "$" + Number(n).toLocaleString("es-MX"));
var moneyMXN = window.moneyMXN || ((n) => money(n) + " MXN");
var $ = window.$ || ((id) => document.getElementById(id));
window.money = money;
window.moneyMXN = moneyMXN;
window.$ = $;

function initDetailView() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id") || "1", 10);
    const qList = (typeof quintas !== "undefined" && Array.isArray(quintas)) ? quintas : [];
    const q = qList.find(x => x.id === id) || qList[0];
    if (q) {
      renderDetail(q);
    } else {
      console.warn("No se encontró la quinta con ID:", id);
    }
  } catch (err) {
    console.error("Error en initDetailView:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDetailView);
} else {
  initDetailView();
}
