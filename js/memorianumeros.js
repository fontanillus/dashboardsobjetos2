// Mapeo del DOM: guardamos en constantes los elementos HTML que vamos a usar.
const BTN_JUGAR = document.getElementById("jugar");
const BTN_COMPROBAR = document.getElementById("comprobar");
const BTN_REINICIAR = document.getElementById("reiniciar");

const RESPUESTA = document.getElementById("respuesta");
const RESULTADO = document.getElementById("resultado");
const CANTIDAD_NUMEROS = document.getElementById("cantNumeros");
const NUMEROS = document.getElementById("numeros");

// Clases Tailwind reutilizadas al crear elementos desde JavaScript.
const CLASE_NUMERO =
    "m-1 inline-flex h-16 min-w-16 items-center justify-center rounded-xl border border-red-600 bg-white px-3 text-3xl font-bold text-slate-900 shadow-lg";
const CLASE_INPUT =
    "m-1 h-16 w-20 rounded-xl border border-blue-600 bg-white px-2 text-center text-3xl font-bold text-slate-900 shadow-lg focus:border-purple-700 focus:ring-2 focus:ring-purple-500";

// secuencia guarda los numeros correctos. cantidad indica cuantos numeros hay en la partida.
const secuencia = [];
let cantidad = 0;

// Guardamos el setTimeout para poder cancelarlo al reiniciar.
let temporizador = null;

// Compara cada input escrito por el usuario con el numero de la misma posicion en secuencia.
function comprobar() {
    let aciertos = 0;

    for (let i = 0; i < cantidad; i++) {
        const input = document.getElementById(`num${i}`);
        const entrada = parseInt(input.value, 10);

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
    NUMEROS.style.display = "block";
    BTN_COMPROBAR.disabled = true;
    BTN_JUGAR.disabled = true;
}

// Crea los campos donde el usuario debe escribir la secuencia memorizada.
function mostrarInputsUsuario() {
    RESPUESTA.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.id = `num${i}`;
        input.className = CLASE_INPUT;
        input.placeholder = "?";
        input.setAttribute("aria-label", `Numero ${i + 1}`);
        RESPUESTA.appendChild(input);
    }

    const primerInput = document.getElementById("num0");
    if (primerInput) {
        primerInput.focus();
    }

    BTN_COMPROBAR.disabled = false;
    RESULTADO.innerText = "Escribe la secuencia y pulsa Comprobar.";
}

// Inicia una partida: genera numeros aleatorios, los muestra y los oculta pasados 5 segundos.
function crearSecuencia() {
    nuevoJuego(false);
    cantidad = parseInt(CANTIDAD_NUMEROS.value, 10);
    NUMEROS.innerHTML = "";

    for (let i = 0; i < cantidad; i++) {
        // Math.random() genera un decimal entre 0 y 1; con Math.floor lo convertimos a entero.
        const num = Math.floor(Math.random() * 501);
        secuencia.push(num);

        const valor = document.createElement("span");
        valor.className = CLASE_NUMERO;
        valor.innerText = num;
        NUMEROS.appendChild(valor);
    }

    BTN_JUGAR.disabled = true;
    CANTIDAD_NUMEROS.disabled = true;
    RESULTADO.innerText = "Memoriza los numeros antes de que desaparezcan.";

    // setTimeout espera 6000 ms antes de ocultar los numeros y pedir la respuesta.
    temporizador = setTimeout(() => {
        NUMEROS.style.display = "none";
        mostrarInputsUsuario();
    }, 6000);
}

// Devuelve la pagina al estado inicial. Se reutiliza al reiniciar y antes de crear una nueva secuencia.
function nuevoJuego(restaurarMensaje = true) {
    clearTimeout(temporizador);
    secuencia.length = 0;
    cantidad = 0;

    NUMEROS.innerHTML = restaurarMensaje
        ? '<p class="text-sm font-semibold text-slate-500">Pulsa Comenzar para ver la secuencia.</p>'
        : "";
    NUMEROS.style.display = "block";
    RESPUESTA.innerHTML = "";
    RESULTADO.innerText = "";

    BTN_COMPROBAR.disabled = true;
    BTN_JUGAR.disabled = false;
    CANTIDAD_NUMEROS.disabled = false;
}

// Eventos: conectan los botones del HTML con las funciones del juego.
BTN_COMPROBAR.addEventListener("click", comprobar);
BTN_JUGAR.addEventListener("click", crearSecuencia);
BTN_REINICIAR.addEventListener("click", () => nuevoJuego());
