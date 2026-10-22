/* =========================================================
   GSite — quintas.js
   Base de Datos centralizada de Quintas y Espacios (La Laguna).
   Aquí se agregan, editan y consultan todas las quintas del sistema.
   ========================================================= */

/* ---------------- FOTOGRAFÍAS REALES (DEMO OPTIMIZADAS) ---------------- */
const gardenImgs = [
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
];
const elegantImgs = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
];
const rusticImgs = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
];
const luxuryImgs = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"
];
const familyImgs = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
];
const haciendaImgs = [
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80"
];
const palmasImgs = [
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
];
const nogalesImgs = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
];
const oasisImgs = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
];
const campestreImgs = [
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
];
const herraduraImgs = [
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=800&q=80"
];
const solariumImgs = [
  "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
];

/* ---------------- LISTADO DE QUINTAS (CATÁLOGO CENTRAL) ---------------- */
const quintas = [
  {
    id: 1,
    username: "naranjos",
    name: "Quinta Los Naranjos",
    host: "Familia Ramírez",
    phone: "8712345678",
    location: "Lerdo, Durango",
    reference: "a 6 min del Periférico",
    price: 4500,
    capacity: 50,
    hours: 12,
    rating: 4.9,
    reviewCount: 38,
    tag: "Popular",
    cats: ["alberca", "asador", "techada", "jardin"],
    chips: [["pool", "Alberca"], ["outdoor_grill", "Asador"]],
    description: "Amplio jardín con alberca cristalina, palapa techada y camastros. Ideal para cumpleaños, carnes asadas y eventos familiares con sol durante todo el día.",
    images: gardenImgs,
    features: [
      ["pool", "Alberca", "Con chapoteadero"],
      ["roofing", "Palapa techada", "90 m²"],
      ["park", "Jardín empastado", "300 m²"],
      ["shield", "Circuito cerrado", "Vigilancia 24/7"],
      ["speaker", "Sonido incluido", ""],
      ["local_parking", "Estacionamiento", ""],
      ["outdoor_grill", "Asador", ""],
      ["wc", "Baños dobles", ""]
    ]
  },
  {
    id: 2,
    username: "esperanza",
    name: "Villa Esperanza",
    host: "Anfitriona Lucía Torres",
    phone: "8713456789",
    location: "Gómez Palacio, Dgo.",
    reference: "zona residencial",
    price: 6200,
    capacity: 40,
    hours: 10,
    rating: 4.8,
    reviewCount: 52,
    tag: "Nueva",
    cats: ["salon", "techada"],
    chips: [["ac_unit", "A/C 20T"], ["restaurant", "Cocina equipada"]],
    description: "Salón techado y climatizado con aire acondicionado de 20 toneladas, terraza exterior y cocina equipada. Perfecta para celebraciones formales.",
    images: elegantImgs,
    features: [
      ["ac_unit", "Salón con A/C", "20 toneladas"],
      ["deck", "Terraza cubierta", "60 m²"],
      ["restaurant", "Cocina equipada", "Completa"],
      ["local_parking", "Estacionamiento", "Techado y amplio"],
      ["headset_mic", "Área de DJ", ""],
      ["park", "Jardín", ""]
    ]
  },
  {
    id: 3,
    username: "mirador",
    name: "Rancho El Mirador",
    host: "Familia Delgado",
    phone: "8714567890",
    location: "Torreón, Coahuila",
    reference: "zona rural, a 15 min del Periférico",
    price: 5800,
    capacity: 30,
    hours: 8,
    rating: 4.7,
    reviewCount: 24,
    tag: "",
    cats: ["rustico", "fogatero"],
    chips: [["fireplace", "Fogatero"], ["child_care", "Juegos infantiles"]],
    description: "Espacio rústico rodeado de naturaleza con fogatero de piedra para la noche y área infantil. El ambiente campirano perfecto para desconectar.",
    images: rusticImgs,
    features: [
      ["landscape", "Terreno campirano", "1,500 m²"],
      ["fireplace", "Fogatero", "De piedra"],
      ["child_care", "Área de juegos", "Con corral"],
      ["shield", "Circuito cerrado", ""],
      ["local_parking", "Estacionamiento", ""],
      ["wc", "Baños", ""]
    ]
  },
  {
    id: 4,
    username: "cristal",
    name: "Salón Cristal",
    host: "Grupo Cristal Eventos",
    phone: "8715678901",
    location: "Lerdo, Durango",
    reference: "a 5 min de la Plaza Principal",
    price: 7500,
    capacity: 50,
    hours: 12,
    rating: 5.0,
    reviewCount: 71,
    tag: "Destacado",
    cats: ["salon", "techada"],
    chips: [["meeting_room", "Salón A/C"], ["local_bar", "Barra incluida"]],
    description: "Salón de eventos de lujo con candiles elegantes, pista de baile y servicio de barra. El lugar de gala para XV años, bautizos y graduaciones.",
    images: luxuryImgs,
    features: [
      ["ac_unit", "Salón climatizado", "25 toneladas"],
      ["celebration", "Pista de baile", "Iluminada"],
      ["local_bar", "Barra de bebidas", "Incluida"],
      ["local_parking", "Valet parking", ""],
      ["speaker", "Sonido profesional", ""]
    ]
  },
  {
    id: 5,
    username: "bugambilias",
    name: "Quinta Bugambilias",
    host: "Anfitriona Marisol Peña",
    phone: "8716789012",
    location: "Ciudad Lerdo, Dgo.",
    reference: "colonia familiar",
    price: 3900,
    capacity: 20,
    hours: 8,
    rating: 4.6,
    reviewCount: 19,
    tag: "",
    cats: ["alberca", "asador", "jardin"],
    chips: [["pool", "Alberca familiar"], ["outdoor_grill", "Asadores"]],
    description: "Patio acogedor con alberca familiar, flores de bugambilia y zona techada con asador de ladrillo. Económica y perfecta para reuniones de domingo.",
    images: familyImgs,
    features: [
      ["pool", "Alberca infantil", "Con chapoteadero"],
      ["roofing", "Palapa chica", "40 m²"],
      ["park", "Jardín", "200 m²"],
      ["outdoor_grill", "Asadores", "Techados"],
      ["local_parking", "Estacionamiento", ""],
      ["wc", "Baños", ""]
    ]
  },
  {
    id: 6,
    username: "santafe",
    name: "Hacienda Santa Fe",
    host: "Familia Santa Fe",
    phone: "8717890123",
    location: "Durango, Dgo.",
    reference: "zona de haciendas históricas",
    price: 8900,
    capacity: 50,
    hours: 15,
    rating: 4.9,
    reviewCount: 45,
    tag: "Premium",
    cats: ["jardin", "salon"],
    chips: [["yard", "Jardines 2,000m²"], ["roofing", "Salón principal"]],
    description: "Hacienda histórica restaurada con cantera, arcos coloniales y más de 2,000 m² de jardines empastados para macro-eventos inolvidables.",
    images: haciendaImgs,
    features: [
      ["account_balance", "Arquitectura histórica", "Cantera, siglo XIX"],
      ["deck", "Terraza panorámica", "150 m²"],
      ["park", "Jardines", "2,000 m²"],
      ["meeting_room", "Salón principal", "Con candiles"],
      ["local_parking", "Estacionamiento VIP", ""]
    ]
  },
  {
    id: 7,
    username: "palmas",
    name: "Quinta Las Palmas",
    host: "Lic. Fernando Garza",
    phone: "8711452390",
    location: "Torreón, Coahuila",
    reference: "Zona Senderos, fácil acceso por autopista",
    price: 5200,
    capacity: 60,
    hours: 10,
    rating: 4.95,
    reviewCount: 41,
    tag: "Popular",
    cats: ["alberca", "asador", "techada", "jardin"],
    chips: [["pool", "Alberca c/ Cascada"], ["outdoor_grill", "Parrilla Inox"]],
    description: "Espectacular alberca con muro llorón de cascada, palapa moderna con barra de bar, pantalla y asador de acero inoxidable. Excelente ubicación en la zona norte de Torreón.",
    images: palmasImgs,
    features: [
      ["pool", "Alberca con cascada", "Muro llorón con luz"],
      ["roofing", "Palapa de concreto", "80 m²"],
      ["outdoor_grill", "Asador de acero", "Parrilla y quemador"],
      ["local_bar", "Barra lounge", "Con periqueras"],
      ["local_parking", "Estacionamiento privado", "10 autos"],
      ["wc", "Baños dobles", "Con vestidor"]
    ]
  },
  {
    id: 8,
    username: "nogales",
    name: "Terraza Los Nogales",
    host: "Ing. Guillermo Valdés",
    phone: "8712567843",
    location: "Gómez Palacio, Dgo.",
    reference: "Campestre Gómez Palacio, a 3 min de Blvd. Miguel Alemán",
    price: 6800,
    capacity: 80,
    hours: 12,
    rating: 4.88,
    reviewCount: 33,
    tag: "Exclusiva",
    cats: ["jardin", "alberca", "asador", "techada"],
    chips: [["yard", "Nogales centenarios"], ["outdoor_grill", "Asador argentino"]],
    description: "Amplio jardín bajo la sombra fresca de nogales centenarios. Cuenta con alberca semi-olímpica, asador argentino con manivela y mobiliario lounge exterior.",
    images: nogalesImgs,
    features: [
      ["yard", "Sombra natural", "Nogales frondosos"],
      ["pool", "Alberca semi-olímpica", "Iluminación nocturna"],
      ["outdoor_grill", "Asador tipo argentino", "Elevador con manivela"],
      ["kitchen", "Cocina de preparación", "Con hielera de 200L"],
      ["wifi", "WiFi de alta velocidad", ""],
      ["local_parking", "Estacionamiento interior", ""]
    ]
  },
  {
    id: 9,
    username: "oasis",
    name: "Quinta El Oasis Boutique",
    host: "Sofía & Alejandro Morales",
    phone: "8713894512",
    location: "Torreón, Coahuila",
    reference: "Zona Viñedos, circuito privado",
    price: 6400,
    capacity: 45,
    hours: 9,
    rating: 4.92,
    reviewCount: 29,
    tag: "Moderna",
    cats: ["alberca", "techada", "asador"],
    chips: [["pool", "Alberca templada"], ["meeting_room", "Sala Lounge"]],
    description: "Diseño contemporáneo estilo boutique en Viñedos. Alberca templada con jacuzzi integrado, terraza climatizada, asador Weber de gas y carbón y sonido ambiental.",
    images: oasisImgs,
    features: [
      ["pool", "Alberca templada", "Con jacuzzi integrado"],
      ["deck", "Pérgola bioclimática", "Con abanicos"],
      ["outdoor_grill", "Asador Weber", "Gas y carbón"],
      ["speaker", "Sonido ambiental", "Bluetooth integrado"],
      ["shield", "Privada residencial", "Caseta de vigilancia"]
    ]
  },
  {
    id: 10,
    username: "campestre",
    name: "Rincón Campestre",
    host: "Familia Campuzano",
    phone: "8714901234",
    location: "Lerdo, Durango",
    reference: "Villa Juárez, por carretera a Monterrey",
    price: 4200,
    capacity: 50,
    hours: 12,
    rating: 4.75,
    reviewCount: 22,
    tag: "Económica",
    cats: ["alberca", "jardin", "asador", "rustico"],
    chips: [["pool", "Alberca y chapoteadero"], ["celebration", "Brincolín"]],
    description: "Ambiente campirano tranquilo y familiar en Lerdo. Alberca con chapoteadero separado para niños pequeños, brincolín inflable incluido y asador de ladrillo refractario.",
    images: campestreImgs,
    features: [
      ["pool", "Alberca con chapoteadero", "Especial para niños"],
      ["celebration", "Brincolín acuático", "Incluido sin costo"],
      ["sports_volleyball", "Cancha de voleibol", "Empastada"],
      ["outdoor_grill", "Asador de ladrillo", "Techado con palapa"],
      ["park", "Área de piñata", "Con argolla instalada"]
    ]
  },
  {
    id: 11,
    username: "herradura",
    name: "Rancho La Herradura",
    host: "Don Javier Salcedo",
    phone: "8715123456",
    location: "Torreón, Coahuila",
    reference: "Ejido La Concha, a 8 min del periférico",
    price: 5500,
    capacity: 70,
    hours: 11,
    rating: 4.82,
    reviewCount: 37,
    tag: "",
    cats: ["rustico", "fogatero", "asador", "jardin"],
    chips: [["fireplace", "Fogatero de piedra"], ["outdoor_grill", "Horno y ataúd"]],
    description: "Estilo colonial campestre amplio. Cuenta con fogatero para fogatas nocturnas bajo las estrellas, horno de leña, ataúd para cabrito o lechón y explanada para música norteña o banda.",
    images: herraduraImgs,
    features: [
      ["fireplace", "Fogatero central", "Bancas de madera"],
      ["outdoor_grill", "Ataúd para lechón", "Y horno de leña"],
      ["stage", "Explanada de baile", "Apta para grupos en vivo"],
      ["park", "Jardín arbolado", "800 m²"],
      ["local_parking", "Estacionamiento amplio", "Hasta 20 autos"]
    ]
  },
  {
    id: 12,
    username: "solarium",
    name: "Villa Solarium",
    host: "Beatriz Mendoza",
    phone: "8716234567",
    location: "Gómez Palacio, Dgo.",
    reference: "Colonia Chapala, acceso pavimentado rápido",
    price: 3400,
    capacity: 30,
    hours: 8,
    rating: 4.70,
    reviewCount: 16,
    tag: "Económica",
    cats: ["alberca", "asador", "techada"],
    chips: [["pool", "Alberca LED"], ["ac_unit", "A/C en cocina"]],
    description: "La opción más accesible y cómoda para reuniones íntimas de hasta 30 personas. Alberca con iluminación LED nocturna de colores, cocineta climatizada y barra techada.",
    images: solariumImgs,
    features: [
      ["pool", "Alberca con luz LED", "Multicolor sumergible"],
      ["kitchen", "Cocineta climatizada", "Refrigerador y fregadero"],
      ["roofing", "Barra techada", "Con hielera de concreto"],
      ["outdoor_grill", "Asador con chimenea", ""],
      ["wc", "Baño completo", "Con regadera"]
    ]
  }

  /* =======================================================================
     PLANTILLA: COPIA Y PEGA ESTE BLOQUE AL FINAL PARA AGREGAR OTRA QUINTA
     =======================================================================
  ,
  {
    id: 13,                                   // Siguiente número consecutivo
    username: "nuevasenda",                    // Usuario único para el login del anfitrión
    name: "Quinta Nueva Senda",               // Nombre comercial de la quinta
    host: "Familia Gómez",                    // Nombre del propietario o anfitrión
    phone: "8711234567",                      // Teléfono para recibir WhatsApp tras la reserva
    location: "Torreón, Coahuila",            // Ciudad: "Torreón", "Gómez Palacio", "Lerdo" o "Durango"
    reference: "a 5 min del TSM",             // Punto de referencia rápido
    price: 4800,                              // Precio total en MXN por evento
    capacity: 60,                             // Capacidad máxima de personas
    hours: 10,                                // Duración del turno en horas
    rating: 5.0,                              // Calificación inicial (ej. 4.9)
    reviewCount: 1,                           // Cantidad inicial de opiniones
    tag: "Nueva",                             // "Popular", "Destacado", "Nueva", "Económica" o ""
    cats: ["alberca", "asador", "jardin"],    // Categorías para los filtros del buscador
    chips: [["pool", "Alberca"], ["outdoor_grill", "Asador"]], // 2 etiquetas principales
    description: "Descripción atractiva destacando los puntos fuertes de la quinta...",
    images: gardenImgs,                       // Arreglo de 3 a 5 fotos
    features: [                               // Lista de amenidades detalladas: [icono_material, titulo, detalle]
      ["pool", "Alberca privada", "Con chapoteadero"],
      ["roofing", "Palapa techada", "80 m²"],
      ["outdoor_grill", "Asador de acero", "Techado"],
      ["local_parking", "Estacionamiento", "6 autos"]
    ]
  }
  ======================================================================= */
];

/* ---------------- CATEGORÍAS DISPONIBLES ---------------- */
const categories = [
  {key:"todas",    label:"Todas las quintas",     icon:"auto_awesome"},
  {key:"alberca",  label:"Alberca",               icon:"pool"},
  {key:"asador",   label:"Asador & Grill",        icon:"outdoor_grill"},
  {key:"techada",  label:"Climatizada / Techada", icon:"ac_unit"},
  {key:"salon",    label:"Salón cerrado",         icon:"meeting_room"},
  {key:"jardin",   label:"Jardines",              icon:"yard"},
  {key:"rustico",  label:"Rústico",               icon:"landscape"},
  {key:"fogatero", label:"Fogatero nocturno",     icon:"fireplace"}
];

/* ---------------- SERVICIOS ADICIONALES (ADDONS) ---------------- */
var AVAILABLE_ADDONS = window.AVAILABLE_ADDONS || [
  { id: "hielo", name: "Pack Hielo & Carbón", price: 350, icon: "ac_unit", desc: "2 bolsas de hielo + 2 bolsas de carbón de mezquite listas al llegar" },
  { id: "sonido", name: "Bocina JBL & Micrófono", price: 450, icon: "speaker", desc: "Sonido Bluetooth potente con micrófono inalámbrico para karaoke/música" },
  { id: "mobiliario", name: "Mobiliario Adicional", price: 600, icon: "chair", desc: "2 tablones adicionales con 20 sillas y manteles limpios" },
  { id: "inflable", name: "Brincolín Inflable Acuático", price: 850, icon: "celebration", desc: "Inflable instalado y desinfectado para niños durante todo el evento" }
];
window.AVAILABLE_ADDONS = AVAILABLE_ADDONS;

/* ---------------- ALMACENAMIENTO DE RESERVAS (STORAGE) ---------------- */
const DEMO_RESERVAS_SEED = [
  {
    id: "seed_1",
    quintaId: 1,
    quintaNombre: "Quinta Los Naranjos",
    fecha: "2026-10-24",
    horaEntrada: "12:00",
    horaSalida: "12:00 AM (+1 día)",
    horasRenta: 12,
    capacidad: 50,
    invitados: 40,
    total: 4850,
    anticipo: 485,
    restoEnPuerta: 4365,
    addons: ["Pack Hielo & Carbón"],
    estado: "confirmada",
    clienteNombre: "Carlos Morales",
    clienteTelefono: "8712345678",
    creadaEn: new Date().toISOString()
  },
  {
    id: "seed_2",
    quintaId: 1,
    quintaNombre: "Quinta Los Naranjos",
    fecha: "2026-10-31",
    horaEntrada: "13:00",
    horaSalida: "1:00 AM (+1 día)",
    horasRenta: 12,
    capacidad: 50,
    invitados: 50,
    total: 5100,
    anticipo: 510,
    restoEnPuerta: 4590,
    addons: ["Bocina JBL & Micrófono"],
    estado: "confirmada",
    clienteNombre: "Valeria Gómez",
    clienteTelefono: "8719876543",
    creadaEn: new Date().toISOString()
  },
  {
    id: "seed_7",
    quintaId: 7,
    quintaNombre: "Quinta Las Palmas",
    fecha: "2026-10-25",
    horaEntrada: "14:00",
    horaSalida: "12:00 AM",
    horasRenta: 10,
    capacidad: 60,
    invitados: 45,
    total: 5200,
    anticipo: 520,
    restoEnPuerta: 4680,
    addons: [],
    estado: "confirmada",
    clienteNombre: "Roberto Garza",
    clienteTelefono: "8719998877",
    creadaEn: new Date().toISOString()
  }
];

const Storage = {
  getLocalReservas() {
    try {
      const data = localStorage.getItem("gsite_reservas");
      if (!data) {
        localStorage.setItem("gsite_reservas", JSON.stringify(DEMO_RESERVAS_SEED));
        return DEMO_RESERVAS_SEED;
      }
      return JSON.parse(data);
    } catch {
      return DEMO_RESERVAS_SEED;
    }
  },
  saveLocalReserva(reserva) {
    const list = this.getLocalReservas();
    list.push(reserva);
    localStorage.setItem("gsite_reservas", JSON.stringify(list));
    return reserva;
  },
  async getBookedQuintaIds(fecha) {
    const booked = new Set();
    const local = this.getLocalReservas();
    local.forEach(r => {
      if (r.fecha === fecha && r.estado !== "cancelada") booked.add(r.quintaId);
    });
    return booked;
  },
  async getBookedDatesForQuinta(quintaId) {
    const set = new Set();
    const local = this.getLocalReservas();
    local.forEach(r => {
      if (r.quintaId === quintaId && r.estado !== "cancelada") set.add(r.fecha);
    });
    return set;
  }
};

/* ---------------- AYUDANTES COMUNES ---------------- */
var money = window.money || ((n) => "$" + Number(n).toLocaleString("es-MX"));
var moneyMXN = window.moneyMXN || ((n) => money(n) + " MXN");
var $ = window.$ || ((id) => document.getElementById(id));
window.money = money;
window.moneyMXN = moneyMXN;
window.$ = $;
