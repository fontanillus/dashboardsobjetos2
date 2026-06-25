// Referencias del HTML que usamos varias veces.
const DETALLE_CONTENEDOR = document.getElementById('detalle-personaje-dragonball');
const BTN_PREV = document.getElementById('anterior');
const BTN_NEXT = document.getElementById('siguiente');
const LISTA = document.getElementById("lista-personajes-dragonball");
const ENC_LISTA = document.getElementById("enc-lista");
const ESTADO_INICIAL = document.getElementById("estado-inicial");

// Endpoint publico de Dragon Ball API.
const API_BASE = "https://dragonball-api.com/api/characters";
const PERSONAJES_POR_PAGINA = 10;

// Variables para controlar la paginacion de Dragon Ball API.
let paginaActual = 1;
let totalPaginas = 1;
let contador = 0;

// Construye la URL de lista para una pagina concreta.
const crearUrlListaPersonajes = (pagina) => {
  return `${API_BASE}?page=${pagina}&limit=${PERSONAJES_POR_PAGINA}`;
}

// Construye la URL del detalle de un personaje por id.
const crearUrlDetallePersonaje = (id) => {
  return `${API_BASE}/${id}`;
}

// Pinta en el aside la pagina actual de personajes Dragon Ball.
const mostrarDatos = (resultado) => {
  LISTA.innerHTML = "";

  paginaActual = resultado.meta.currentPage;
  totalPaginas = resultado.meta.totalPages;
  contador = (paginaActual - 1) * PERSONAJES_POR_PAGINA;

  const personajes = resultado.items;
  const inicio = contador + 1;
  const fin = contador + personajes.length;
  ENC_LISTA.innerText = `Personajes ${inicio} al ${fin}`;

  // Acumulamos HTML en una variable y luego lo pintamos de una vez.
  let htmlAside = "";

  console.log(resultado);

  for (const valor of personajes) {
    contador++;

    // data-id guarda el id del personaje para pedir su detalle al hacer click.
    htmlAside += `<p class="mb-1 block cursor-pointer rounded-lg px-2 py-1.5 text-blue-100 transition-colors hover:bg-white/10 hover:text-yellow-300 focus:bg-white/10 sm:mb-2 sm:px-3 sm:py-2" data-id="${valor.id}">
    ${contador}. ${valor.name}
    </p>`;
  }

  // Pintamos toda la lista al final para evitar tocar el DOM en cada vuelta.
  LISTA.innerHTML = htmlAside;
}

// Busca el detalle completo de un personaje Dragon Ball usando su id.
const buscarDetallePersonaje = async (id) => {
  try {
    // fetch devuelve una respuesta; .json() convierte el cuerpo en objeto JS.
    const respuesta = await fetch(crearUrlDetallePersonaje(id));
    const personaje = await respuesta.json();

    console.info(personaje);

    // Extraemos solo la informacion que necesitamos mostrar/guardar.
    const idPersonaje = personaje.id;
    const nombre = personaje.name;
    const imagen = personaje.image || "";
    const raza = personaje.race || "Sin raza";
    const ki = personaje.ki || "Sin ki";
    const afiliacion = personaje.affiliation || "Sin afiliacion";

    // El boton lleva data-* para poder guardar estos datos en localStorage.
    DETALLE_CONTENEDOR.innerHTML = `
      <div class="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <figure class="flex h-[420px] max-h-[52vh] items-center justify-center overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
          ${imagen ? `<img src="${imagen}" alt="${nombre}" class="h-full w-full object-contain drop-shadow-xl">` : `<p class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow">Sin imagen disponible</p>`}
        </figure>

        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <span class="rounded-full bg-yellow-400 px-3 py-1 text-xs font-extrabold text-slate-900 shadow">#${idPersonaje}</span>
          <h2 class="mt-3 text-3xl font-extrabold text-blue-950">${nombre}</h2>
          <div class="mt-4 grid gap-2 text-sm">
            <p class="rounded-lg bg-purple-950 px-3 py-2 font-semibold text-blue-100 shadow"><strong class="text-yellow-300">Raza:</strong> ${raza}</p>
            <p class="rounded-lg bg-blue-950 px-3 py-2 font-semibold text-blue-100 shadow"><strong class="text-yellow-300">Ki:</strong> ${ki}</p>
            <p class="rounded-lg bg-purple-950 px-3 py-2 font-semibold text-blue-100 shadow"><strong class="text-yellow-300">Afiliacion:</strong> ${afiliacion}</p>
          </div>
          <button id="btn-favorito-dragonball" type="button" data-id="${idPersonaje}" data-nombre="${nombre}" data-imagen="${imagen}" data-raza="${raza}" data-ki="${ki}" data-afiliacion="${afiliacion}" class="mt-4 rounded-lg bg-yellow-400 px-4 py-2 text-xs font-semibold uppercase text-slate-900 shadow-md transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 sm:text-sm">
            Anadir a Favoritos
          </button>
        </section>
      </div>
    `;

    // Ocultamos el mensaje inicial y mostramos la ficha generada.
    ESTADO_INICIAL?.classList.add('hidden');
    DETALLE_CONTENEDOR.classList.remove('hidden');

  } catch (error) {
    console.error("Error al obtener el detalle del personaje Dragon Ball:", error);
  }
}

const leerIdPersonaje = (e) => {
  // Delegacion de eventos: escuchamos la lista aunque sus items sean dinamicos.
  const elementoClicado = e.target.closest('[data-id]');

  if (elementoClicado) {
    // dataset.id lee el valor de data-id del elemento clicado.
    const idPersonaje = elementoClicado.dataset.id;
    console.log(`Has clicado un personaje Dragon Ball. Su id es: ${idPersonaje}`);
    buscarDetallePersonaje(idPersonaje);
  }
}

LISTA.addEventListener('click', leerIdPersonaje);

const guardarPersonajeFavorito = (botonFavorito) => {
  // dataset lee los data-* del boton creado en el detalle.
  const personajeFavorito = {
    id: botonFavorito.dataset.id,
    nombre: botonFavorito.dataset.nombre,
    imagen: botonFavorito.dataset.imagen,
    raza: botonFavorito.dataset.raza,
    ki: botonFavorito.dataset.ki,
    afiliacion: botonFavorito.dataset.afiliacion
  };

  // La clave incluye el id para no mezclar un personaje con otro.
  const claveLocalStorage = `dragonball-favorito-${personajeFavorito.id}`;

  // localStorage solo guarda texto: por eso convertimos el objeto a JSON.
  localStorage.setItem(claveLocalStorage, JSON.stringify(personajeFavorito));

  // Feedback visual para confirmar al usuario que se guardo.
  botonFavorito.innerText = "Guardado en Favoritos";
  botonFavorito.classList.remove("bg-yellow-400", "hover:bg-yellow-300");
  botonFavorito.classList.add("bg-green-400", "hover:bg-green-300");
}

const leerBotonFavorito = (e) => {
  // El boton se crea despues del fetch, por eso usamos delegacion en el contenedor.
  const botonFavorito = e.target.closest("#btn-favorito-dragonball");

  if (botonFavorito) {
    guardarPersonajeFavorito(botonFavorito);
  }
}

DETALLE_CONTENEDOR.addEventListener("click", leerBotonFavorito);

const cargarDatos = async (pagina) => {
  try {
    // Esta peticion trae una pagina de personajes, no el detalle individual.
    const respuesta = await fetch(crearUrlListaPersonajes(pagina));
    const resultado = await respuesta.json();
    mostrarDatos(resultado);

  } catch (error) {
    console.error("Hubo un problema al cargar los personajes Dragon Ball:", error);
  }
}

const paginaSiguiente = () => {
  // Avanza una pagina si la API informa que existe.
  if (paginaActual < totalPaginas) {
    cargarDatos(paginaActual + 1);
  }
}
BTN_NEXT.addEventListener("click", paginaSiguiente);

const paginaAnterior = () => {
  // Retrocede una pagina sin bajar de la primera.
  if (paginaActual > 1) {
    cargarDatos(paginaActual - 1);
  }
}
BTN_PREV.addEventListener("click", paginaAnterior);

// Carga inicial: pedimos la primera pagina al abrir la app.
cargarDatos(paginaActual);

const auditarLocalStorage = () => {
  console.log("AUDITORIA PERSONAJES DRAGON BALL FAVORITOS");

  // localStorage.length recorre todas las claves guardadas en el navegador.
  for (let i = 0; i < localStorage.length; i++) {

    // key(i) obtiene el nombre de cada clave segun su posicion.
    const clave = localStorage.key(i);

    // startsWith filtra solo las claves de favoritos creadas por esta app.
    if (clave.startsWith("dragonball-favorito-")) {

      // getItem(clave) obtiene el valor asociado a esa clave.
      const valor = localStorage.getItem(clave);

      console.log(`Clave: ${clave}`);
      console.log(`Valor: ${valor}`);
      console.log("----------------");
    }
  }
}

auditarLocalStorage();
