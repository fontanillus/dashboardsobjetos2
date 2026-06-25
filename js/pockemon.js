// Referencias del HTML que usamos varias veces.
const DETALLE_CONTENEDOR = document.getElementById('detalle-pokemon');
const BTN_PREV = document.getElementById('anterior');
const BTN_NEXT = document.getElementById('siguiente');
const LISTA = document.getElementById("lista-pokemons");
const ENC_LISTA = document.getElementById("enc-lista");
const ESTADO_INICIAL = document.getElementById("estado-inicial");

// Variables para controlar la paginacion de la PokeAPI.
let urlSiguiente = 'https://pokeapi.co/api/v2/pokemon';
let urlAnterior = null;
let contador = 0;
let inicio = true;
let numeroPokemones = 0;

// Pinta en el aside la pagina actual de pokemons.
const mostrarDatos = (resultado) => {
  LISTA.innerHTML = "";
  ENC_LISTA.innerText = `Pokemons ${contador + 1} al ${contador + 20}`;

  urlAnterior = resultado.previous;
  urlSiguiente = resultado.next;

  // Acumulamos HTML en una variable y luego lo pintamos de una vez.
  let htmlAside = "";
  let pokemons = resultado.results;

  // La primera carga guarda el total de pokemons que informa la API.
  if (inicio) {
    numeroPokemones = resultado.count;
    inicio = false;
  }
  console.log(resultado);

  for (const valor of pokemons) {
    // data-info guarda la URL de detalle para leerla luego desde el click.
    htmlAside += `<p class="mb-1 block cursor-pointer rounded-lg px-2 py-1.5 text-blue-100 transition-colors hover:bg-white/10 hover:text-yellow-300 focus:bg-white/10 sm:mb-2 sm:px-3 sm:py-2" data-info="${valor.url}">
    ${contador + 1}. ${valor.name}
    </p>`;
    contador++;
  }

  console.log(contador);
  // Pintamos toda la lista al final para evitar tocar el DOM en cada vuelta.
  LISTA.innerHTML = htmlAside;
}

// Busca el detalle completo de un pokemon usando su URL individual.
const buscarDetallePokemon = async (url) => {
  try {
    // fetch devuelve una respuesta; .json() convierte el cuerpo en objeto JS.
    const respuesta = await fetch(url);
    const pokemon = await respuesta.json();

    console.info(pokemon);

    // Extraemos solo la informacion que necesitamos mostrar/guardar.
    const nombre = pokemon.name.toUpperCase();
    const imagen = pokemon.sprites.other['official-artwork'].front_default;
    const tipos = pokemon.types.map(t => t.type.name).join(', ');
    const id = pokemon.id;

    // El boton lleva data-* para poder guardar estos datos en localStorage.
    DETALLE_CONTENEDOR.innerHTML = `
      <div class="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <figure class="flex h-[420px] max-h-[52vh] items-center justify-center overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
          <img src="${imagen}" alt="${nombre}" class="h-full w-full object-contain drop-shadow-xl">
        </figure>

        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow">
          <span class="rounded-full bg-yellow-400 px-3 py-1 text-xs font-extrabold text-slate-900 shadow">#${id}</span>
          <h2 class="mt-3 text-3xl font-extrabold text-blue-950">${nombre}</h2>
          <p class="mt-4 rounded-lg bg-purple-950 px-3 py-2 text-sm font-semibold text-blue-100 shadow">
            <strong class="text-yellow-300">Tipos:</strong> ${tipos}
          </p>
          <button id="btn-favorito" type="button" data-id="${id}" data-nombre="${pokemon.name}" data-imagen="${imagen}" data-tipos="${tipos}" class="mt-4 rounded-lg bg-yellow-400 px-4 py-2 text-xs font-semibold uppercase text-slate-900 shadow-md transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-200 sm:text-sm">
            Anadir a Favoritos
          </button>
        </section>
      </div>
    `;

    // Ocultamos el mensaje inicial y mostramos la ficha generada.
    ESTADO_INICIAL?.classList.add('hidden');
    DETALLE_CONTENEDOR.classList.remove('hidden');

  } catch (error) {
    console.error("Error al obtener el detalle del Pokemon:", error);
  }
}

const leerUrlPokemon = (e) => {
  // Delegacion de eventos: escuchamos la lista aunque sus items sean dinamicos.
  const elementoClicado = e.target.closest('[data-info]');

  if (elementoClicado) {
    // dataset.info lee el valor de data-info del elemento clicado.
    const urlPokemon = elementoClicado.dataset.info;
    console.log(`Has clicado un Pokemon. Su URL es: ${urlPokemon}`);
    buscarDetallePokemon(urlPokemon);
  }
}

LISTA.addEventListener('click', leerUrlPokemon);

const guardarPokemonFavorito = (botonFavorito) => {
  // ORDEN: esta funcion debe existir antes de que el click intente usarla.
  // Aqui solo se define; se ejecuta mas tarde, cuando pulses el boton.

  // dataset lee los data-* del boton creado en el detalle.
  const pokemonFavorito = {
    id: botonFavorito.dataset.id,
    nombre: botonFavorito.dataset.nombre,
    imagen: botonFavorito.dataset.imagen,
    tipos: botonFavorito.dataset.tipos
  };

  // La clave incluye el id para no mezclar un pokemon con otro.
  const claveLocalStorage = `pokemon-favorito-${pokemonFavorito.id}`;

  // localStorage solo guarda texto: por eso convertimos el objeto a JSON.
  // Para leerlo despues se usara JSON.parse(localStorage.getItem(clave)).
  localStorage.setItem(claveLocalStorage, JSON.stringify(pokemonFavorito));

  // Feedback visual para confirmar al usuario que se guardo.
  botonFavorito.innerText = "Guardado en Favoritos";
  botonFavorito.classList.remove("bg-yellow-400", "hover:bg-yellow-300");
  botonFavorito.classList.add("bg-green-400", "hover:bg-green-300");
}

const leerBotonFavorito = (e) => {
  // El boton se crea despues del fetch, por eso usamos delegacion en el contenedor.
  const botonFavorito = e.target.closest("#btn-favorito");

  if (botonFavorito) {
    guardarPokemonFavorito(botonFavorito);
  }
}

// ORDEN: conectamos el evento despues de definir las funciones que va a llamar.
DETALLE_CONTENEDOR.addEventListener("click", leerBotonFavorito);

const cargarDatos = async (url) => {
  inicio = false;

  try {
    // Esta peticion trae una pagina de pokemons, no el detalle individual.
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    mostrarDatos(resultado);

  } catch (error) {
    console.error("Hubo un problema al cargar los datos:", error);
  }
}

const paginaSiguiente = () => {
  // Avanza usando la URL next que llega desde la API.
  if (contador == 0) {
    urlSiguiente = 'https://pokeapi.co/api/v2/pokemon';
  }
  cargarDatos(urlSiguiente);
}
BTN_NEXT.addEventListener("click", paginaSiguiente);

const paginaAnterior = () => {
  // Retrocede el contador porque mostrarDatos vuelve a sumar 20.
  contador -= 40;
  contador = Math.max(contador, 0);
  if (contador == 0) {
    urlSiguiente = 'https://pokeapi.co/api/v2/pokemon';
    cargarDatos(urlSiguiente);
  } else {
    cargarDatos(urlAnterior);
  }
}
BTN_PREV.addEventListener("click", paginaAnterior);

// Carga inicial: pedimos la primera pagina al abrir la app.
cargarDatos(urlSiguiente);

// ORDEN: esta funcion debe definirse antes de llamar auditarLocalStorage().
const auditarLocalStorage = () => {
  console.log("AUDITORIA POKEMON FAVORITOS");

  // localStorage.length recorre todas las claves guardadas en el navegador.
  for (let i = 0; i < localStorage.length; i++) {

    // key(i) obtiene el nombre de cada clave segun su posicion.
    const clave = localStorage.key(i);

    // startsWith filtra solo las claves de favoritos creadas por esta app.
    if (clave.startsWith("pokemon-favorito-")) {

      // getItem(clave) obtiene el valor asociado a esa clave.
      const valor = localStorage.getItem(clave);

      console.log(`Clave: ${clave}`);
      console.log(`Valor: ${valor}`);
      console.log("----------------");
    }
  }
}

auditarLocalStorage();
