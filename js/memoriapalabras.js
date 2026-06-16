// Mapeo del DOM: guardamos en constantes los elementos HTML que vamos a usar.
const BTN_JUGAR = document.getElementById("jugar");
const BTN_COMPROBAR = document.getElementById("comprobar");
const BTN_REINICIAR = document.getElementById("reiniciar");

const RESPUESTA = document.getElementById("respuesta");
const RESULTADO = document.getElementById("resultado");
const CANTIDAD_PALABRAS = document.getElementById("cantPalabras");
const PALABRAS = document.getElementById("palabras");

// Banco de palabras del que se seleccionan elementos al azar para cada partida.
const BANCO_PALABRAS = [
    "luna",
    "casa",
    "rio",
    "flor",
    "libro",
    "mesa",
    "sol",
    "nube",
    "tren",
    "llave",
    "playa",
    "bosque",
    "reloj",
    "silla",
    "puerta",
    "camino",
    "ventana",
    "musica",
    "papel",
    "jardin",
    "coche",
    "barco",
    "avion",
    "zapato",
    "camisa",
    "perro",
    "gato",
    "pez",
    "arbol",
    "montana",
    "ciudad",
    "pueblo",
    "calle",
    "plaza",
    "escuela",
    "lapiz",
    "cuaderno",
    "botella",
    "vaso",
    "cuchara",
    "manzana",
    "pan",
    "queso",
    "leche",
    "cafe",
    "telefono",
    "pantalla",
    "teclado",
    "raton",
    "maleta"
];

// Clases Tailwind reutilizadas al crear elementos desde JavaScript.
const CLASE_PALABRA =
    "m-1 inline-flex h-16 min-w-24 items-center justify-center rounded-xl border border-red-600 bg-white px-3 text-2xl font-bold text-slate-900 shadow-lg";
const CLASE_INPUT =
    "m-1 h-16 w-32 rounded-xl border border-blue-600 bg-white px-2 text-center text-xl font-bold text-slate-900 shadow-lg focus:border-purple-700 focus:ring-2 focus:ring-purple-500";

// secuencia guarda las palabras correctas. cantidad indica cuantas palabras hay en la partida.
const secuencia = [];
let cantidad = 0;

// Guardamos el setTimeout para poder cancelarlo al reiniciar.
let temporizador = null;

// Devuelve una palabra aleatoria del banco de palabras.
function generarPalabraAleatoria() {
    const indice = Math.floor(Math.random() * BANCO_PALABRAS.length);
    return BANCO_PALABRAS[indice];
}

// Compara cada input escrito por el usuario con la palabra de la misma posicion en secuencia.
function comprobar() {
    let aciertos = 0;

    for (let i = 0; i < cantidad; i++) {
        const input = document.getElementById(`palabra${i}`);
        const entrada = input.value.trim().toLowerCase();

        // Si coincide, se suma un acierto y se marca en verde; si falla, se marca en rojo.
        if (entrada === secuencia[i]) {
            aciertos++;
            input.classList.add("border-green-600", "bg-green-50");
        } else {
            input.classList.add("border-red-600", "bg-red-50");
        }

        input.disabled = true;
    }

    RESULTADO.innerText = `Aciertos: ${aciertos} de ${secuencia.length}`;
    PALABRAS.style.display = "block";
    BTN_COMPROBAR.disabled = true;
    BTN_JUGAR.disabled = true;
}

// Crea los campos donde el usuario debe escribir la secuencia memorizada.
function mostrarInputsUsuario() {
    RESPUESTA.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = `palabra${i}`;
        input.className = CLASE_INPUT;
        input.placeholder = "?";
        input.setAttribute("aria-label", `Palabra ${i + 1}`);
        RESPUESTA.appendChild(input);
    }

    const primerInput = document.getElementById("palabra0");
    if (primerInput) {
        primerInput.focus();
    }

    BTN_COMPROBAR.disabled = false;
    RESULTADO.innerText = "Escribe la secuencia y pulsa Comprobar.";
}

// Inicia una partida: genera palabras aleatorias, las muestra y las oculta pasados 5 segundos.
function crearSecuencia() {
    nuevoJuego(false);
    cantidad = parseInt(CANTIDAD_PALABRAS.value, 10);
    PALABRAS.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
        const palabra = generarPalabraAleatoria();
        secuencia.push(palabra);

        const valor = document.createElement("span");
        valor.className = CLASE_PALABRA;
        valor.innerText = palabra;
        PALABRAS.appendChild(valor);
    }

    BTN_JUGAR.disabled = true;
    CANTIDAD_PALABRAS.disabled = true;
    RESULTADO.innerText = "Memoriza las palabras antes de que desaparezcan.";

    // setTimeout espera 5000 ms antes de ocultar las palabras y pedir la respuesta.
    temporizador = setTimeout(() => {
        PALABRAS.style.display = "none";
        mostrarInputsUsuario();
    }, 6000);
}

// Devuelve la pagina al estado inicial. Se reutiliza al reiniciar y antes de crear una nueva secuencia.
function nuevoJuego(restaurarMensaje = true) {
    clearTimeout(temporizador);
    secuencia.length = 0;
    cantidad = 0;

    PALABRAS.innerHTML = restaurarMensaje
        ? '<p class="text-sm font-semibold text-slate-500">Pulsa Comenzar para ver la secuencia.</p>'
        : "";
    PALABRAS.style.display = "block";
    RESPUESTA.innerHTML = "";
    RESULTADO.innerText = "";

    BTN_COMPROBAR.disabled = true;
    BTN_JUGAR.disabled = false;
    CANTIDAD_PALABRAS.disabled = false;
}

// Eventos: conectan los botones del HTML con las funciones del juego.
BTN_COMPROBAR.addEventListener("click", comprobar);
BTN_JUGAR.addEventListener("click", crearSecuencia);
BTN_REINICIAR.addEventListener("click", () => nuevoJuego());
