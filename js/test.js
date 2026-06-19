// Clase de estudio: sirve como plantilla para crear cada pregunta del test.
class Pregunta {
    constructor(texto, opcion1, opcion2, opcion3, opcion4, correcta, justificacion, puntos = 1) {
        this.texto = texto;
        this.opcion1 = opcion1;
        this.opcion2 = opcion2;
        this.opcion3 = opcion3;
        this.opcion4 = opcion4;
        // La respuesta correcta se guarda como índice: 0 = A, 1 = B, 2 = C, 3 = D.
        this.correcta = correcta;
        // Aquí se guarda la opción marcada por el alumno.
        this.opcionSeleccionada = null;
        this.puntos = puntos;
        this.puntosAsignados = 0;
        this.justificacion = justificacion;
    }

    // Getter: permite usar pregunta.opciones como si fuera una propiedad.
    get opciones() {
        return [this.opcion1, this.opcion2, this.opcion3, this.opcion4];
    }

    // Compara la opción marcada con la correcta y asigna puntos.
    verificar() {
        this.puntosAsignados = this.opcionSeleccionada === this.correcta ? this.puntos : 0;
        return this.puntosAsignados === this.puntos;
    }

    // Al recuperar JSON del Session Storage hay que reconstruir objetos Pregunta.
    static desdeObjeto(objeto) {
        const pregunta = new Pregunta(
            objeto.texto,
            objeto.opcion1,
            objeto.opcion2,
            objeto.opcion3,
            objeto.opcion4,
            objeto.correcta,
            objeto.justificacion,
            objeto.puntos
        );

        pregunta.opcionSeleccionada = objeto.opcionSeleccionada ?? null;
        pregunta.puntosAsignados = objeto.puntosAsignados ?? 0;
        return pregunta;
    }
}

const preguntasIniciales = [
    // Formato: texto, opción A, opción B, opción C, opción D, respuesta correcta.
    new Pregunta("¿Qué método se utiliza para guardar datos en LocalStorage?", "getItem()", "setItem()", "saveItem()", "store()", 1, "setItem() guarda un par clave-valor dentro de LocalStorage."),
    new Pregunta("¿Qué devuelve typeof []?", "array", "list", "object", "undefined", 2, "En JavaScript los arrays son objetos, por eso typeof [] devuelve object."),
    new Pregunta("¿Qué palabra clave permite declarar una variable cuyo valor puede cambiar?", "const", "static", "let", "final", 2, "let declara variables que pueden cambiar de valor durante la ejecución."),
    new Pregunta("¿Qué método convierte un objeto en texto JSON?", "JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()", 1, "JSON.stringify() transforma objetos o arrays en cadenas JSON."),
    new Pregunta("¿Qué evento se dispara al hacer clic sobre un botón?", "submit", "hover", "click", "change", 2, "El evento click se ejecuta cuando el usuario pulsa un elemento."),
    new Pregunta("¿Qué método permite seleccionar un elemento por su id?", "querySelectorAll()", "getElementsByClassName()", "getElementById()", "getNode()", 2, "getElementById() busca un único elemento usando su atributo id."),
    new Pregunta("¿Qué estructura se ejecuta al menos una vez?", "while", "for", "if", "do...while", 3, "do...while ejecuta primero el bloque y después comprueba la condición."),
    new Pregunta("¿Qué operador compara valor y tipo?", "=", "==", "===", "!=", 2, "El operador === exige que coincidan el valor y el tipo de dato."),
    new Pregunta("¿Qué método elimina el último elemento de un array?", "shift()", "pop()", "remove()", "delete()", 1, "pop() elimina y devuelve el último elemento de un array."),
    new Pregunta("¿Qué significa DOM?", "Data Object Method", "Document Object Model", "Dynamic Object Manager", "Document Output Method", 1, "DOM significa Document Object Model y representa la página como objetos."),
    new Pregunta("¿Qué método añade un elemento al final de un array?", "add()", "insert()", "push()", "append()", 2, "push() inserta uno o varios elementos al final de un array."),
    new Pregunta("¿Qué devuelve Math.floor(4.8)?", "5", "4.8", "4", "Error", 2, "Math.floor() redondea hacia abajo, por eso 4.8 se convierte en 4."),
    new Pregunta("¿Qué propiedad permite cambiar el contenido HTML de un elemento?", "textContent", "value", "innerHTML", "className", 2, "innerHTML permite leer o escribir contenido HTML dentro de un elemento."),
    new Pregunta("¿Qué método convierte texto JSON en objeto JavaScript?", "JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()", 1, "JSON.parse() interpreta una cadena JSON y la convierte en objeto JavaScript."),
    new Pregunta("¿Qué método elimina elementos duplicados de un array usando Set?", "[...new Set(array)]", "array.unique()", "Set.remove()", "array.clear()", 0, "new Set(array) crea una colección sin duplicados y el spread la convierte otra vez en array."),
    new Pregunta("¿Qué hace el operador spread (...)?", "Duplica variables", "Expande elementos iterables", "Elimina elementos duplicados", "Convierte arrays en objetos", 1, "El spread expande elementos de arrays, strings u otros iterables."),
    new Pregunta("¿Qué estructura es más adecuada cuando conocemos el número de repeticiones?", "if", "while", "switch", "for", 3, "for es ideal cuando se conoce cuántas veces se repetirá el bucle."),
    new Pregunta("¿Qué método se usa para asociar un evento a un elemento?", "addEventListener()", "attachEvent()", "eventListener()", "addEvent()", 0, "addEventListener() registra una función para responder a un evento."),
    new Pregunta("¿Qué palabra clave se utiliza para crear una clase?", "object", "prototype", "constructor", "class", 3, "class define una plantilla para crear objetos con propiedades y métodos."),
    new Pregunta("¿Qué es un getter?", "Un método para modificar datos", "Un método para leer datos", "Una variable privada", "Un constructor", 1, "Un getter permite leer un valor mediante una propiedad calculada o controlada.")
];

const CLAVE_PREGUNTAS = "preguntasTestJavaScript";
const CLAVE_INDICE = "indiceTestJavaScript";
const CLAVE_FINALIZADO = "testJavaScriptFinalizado";
const CLAVE_TEMA = "temaTestJavaScript";

// Referencias a elementos del HTML para leer botones y pintar contenido.
const formTest = document.getElementById("form-test");
const tituloPregunta = document.getElementById("titulo-pregunta");
const contador = document.getElementById("contador");
const barraProgreso = document.getElementById("barra-progreso");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");
const btnAnterior = document.getElementById("anterior");
const btnSiguiente = document.getElementById("siguiente");
const btnVerificar = document.getElementById("verificar");
const btnReiniciar = document.getElementById("reiniciar");
const btnTema = document.getElementById("btnTema");
const modalJustificacion = document.getElementById("modal-justificacion");
const modalTitulo = document.getElementById("modal-titulo");
const modalTexto = document.getElementById("modal-texto");
const btnCerrarModal = document.getElementById("cerrar-modal");

let preguntas = cargarPreguntas();
let preguntaActual = cargarIndice();
let testFinalizado = sessionStorage.getItem(CLAVE_FINALIZADO) === "true";

function aplicarTemaGuardado() {
    const tema = localStorage.getItem(CLAVE_TEMA) || "oscuro";
    const esOscuro = tema === "oscuro";

    document.documentElement.classList.toggle("dark", esOscuro);
    btnTema.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
}

function cambiarTema() {
    const temaActual = localStorage.getItem(CLAVE_TEMA) || "oscuro";
    const temaNuevo = temaActual === "claro" ? "oscuro" : "claro";
    localStorage.setItem(CLAVE_TEMA, temaNuevo);
    aplicarTemaGuardado();
}

// Session Storage solo guarda texto, por eso convertimos el array a JSON.
function guardarPreguntas() {
    sessionStorage.setItem(CLAVE_PREGUNTAS, JSON.stringify(preguntas));
}

// Carga el array guardado o crea uno nuevo si no existe.
function cargarPreguntas() {
    const preguntasGuardadas = sessionStorage.getItem(CLAVE_PREGUNTAS);

    if (!preguntasGuardadas) {
        sessionStorage.setItem(CLAVE_PREGUNTAS, JSON.stringify(preguntasIniciales));
        return preguntasIniciales;
    }

    try {
        const datos = JSON.parse(preguntasGuardadas);

        if (!Array.isArray(datos) || datos.length !== preguntasIniciales.length) {
            sessionStorage.setItem(CLAVE_PREGUNTAS, JSON.stringify(preguntasIniciales));
            return preguntasIniciales;
        }

        return datos.map((pregunta) => Pregunta.desdeObjeto(pregunta));
    } catch {
        sessionStorage.setItem(CLAVE_PREGUNTAS, JSON.stringify(preguntasIniciales));
        return preguntasIniciales;
    }
}

// Guarda y recupera el número de la pregunta actual.
function cargarIndice() {
    const indiceGuardado = Number(sessionStorage.getItem(CLAVE_INDICE));

    if (Number.isNaN(indiceGuardado)) {
        return 0;
    }

    return Math.min(indiceGuardado, preguntas.length - 1);
}

function guardarIndice() {
    sessionStorage.setItem(CLAVE_INDICE, String(preguntaActual));
}

function calcularPuntuacion() {
    return preguntas.reduce((total, pregunta) => total + pregunta.puntosAsignados, 0);
}

// Actualiza la tarjeta lateral de resultado.
function pintarResultado() {
    resultado.textContent = `Puntuación: ${calcularPuntuacion()} de ${preguntas.length}`;
}

// Dibuja en pantalla una sola pregunta con sus 4 opciones.
function pintarPregunta() {
    if (testFinalizado) {
        pintarRevisionFinal();
        return;
    }

    const pregunta = preguntas[preguntaActual];
    const respondidas = preguntas.filter((item) => item.opcionSeleccionada !== null).length;
    const porcentaje = (respondidas / preguntas.length) * 100;

    tituloPregunta.textContent = `Pregunta ${preguntaActual + 1}`;
    contador.textContent = `${respondidas} de ${preguntas.length} preguntas respondidas`;
    barraProgreso.style.width = `${porcentaje}%`;
    estado.textContent = pregunta.opcionSeleccionada === null ? "Sin responder" : "Respondida";
    btnAnterior.disabled = preguntaActual === 0;
    btnSiguiente.disabled = false;
    btnVerificar.disabled = false;
    btnSiguiente.textContent = preguntaActual === preguntas.length - 1 ? "Finalizar" : "Siguiente";
    pintarResultado();

    formTest.innerHTML = `
        <fieldset>
            <legend class="mb-5 text-xl font-bold text-blue-950 dark:text-blue-100">${pregunta.texto}</legend>
            <div class="space-y-3">
                ${pregunta.opciones.map((opcion, indice) => `
                    <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-purple-400 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-300 dark:hover:bg-slate-700">
                        <input type="radio" name="respuesta" value="${indice}" class="mt-1 h-4 w-4 accent-purple-800"
                            ${pregunta.opcionSeleccionada === indice ? "checked" : ""}>
                        <span class="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">${opcion}</span>
                    </label>
                `).join("")}
            </div>
        </fieldset>
    `;
}

// Verifica la pregunta actual, asigna puntos y muestra el modal explicativo.
function verificarPregunta() {
    const pregunta = preguntas[preguntaActual];
    const seleccionada = document.querySelector("input[name='respuesta']:checked");

    if (!seleccionada) {
        pregunta.opcionSeleccionada = null;
        pregunta.puntosAsignados = 0;
        guardarPreguntas();
        abrirModal("Pregunta sin responder", `Debes marcar una opción. ${pregunta.justificacion}`);
        pintarPregunta();
        return;
    }

    pregunta.opcionSeleccionada = Number(seleccionada.value);
    const esCorrecta = pregunta.verificar();
    guardarPreguntas();
    pintarPregunta();

    abrirModal(
        esCorrecta ? "Respuesta correcta" : "Respuesta incorrecta",
        `${pregunta.justificacion} Puntos asignados: ${pregunta.puntosAsignados} de ${pregunta.puntos}.`
    );
}

// Abre el dialog HTML con el resultado de la verificación.
function abrirModal(titulo, texto) {
    modalTitulo.textContent = titulo;
    modalTexto.textContent = texto;
    modalJustificacion.showModal();
}

// Finaliza el test y obliga a pintar lo guardado en Session Storage.
function finalizarTest() {
    preguntas.forEach((pregunta) => {
        pregunta.verificar();
    });
    guardarPreguntas();
    testFinalizado = true;
    sessionStorage.setItem(CLAVE_FINALIZADO, "true");
    pintarRevisionFinal();
}

// Lee el array desde Session Storage y muestra todas las preguntas corregidas.
function pintarRevisionFinal() {
    const preguntasGuardadas = JSON.parse(sessionStorage.getItem(CLAVE_PREGUNTAS) || "[]");
    const preguntasSesion = preguntasGuardadas.map((pregunta) => Pregunta.desdeObjeto(pregunta));
    const respondidas = preguntasSesion.filter((pregunta) => pregunta.opcionSeleccionada !== null).length;
    const porcentaje = (respondidas / preguntasSesion.length) * 100;

    tituloPregunta.textContent = "Contenido del Session Storage";
    contador.textContent = `${respondidas} de ${preguntasSesion.length} preguntas respondidas`;
    barraProgreso.style.width = `${porcentaje}%`;
    estado.textContent = "Finalizado";
    btnAnterior.disabled = true;
    btnSiguiente.disabled = true;
    btnVerificar.disabled = true;
    btnSiguiente.textContent = "Finalizar";
    resultado.textContent = `Puntuación: ${preguntasSesion.reduce((total, pregunta) => total + pregunta.puntosAsignados, 0)} de ${preguntasSesion.length}`;

    formTest.innerHTML = `
        <div class="max-h-[65vh] space-y-4 overflow-y-auto pr-2">
            ${preguntasSesion.map((pregunta, indicePregunta) => {
        const respuestaAlumno = pregunta.opcionSeleccionada;
        const acierto = respuestaAlumno === pregunta.correcta;

        return `
            <section class="rounded-xl border ${acierto ? "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-950" : "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-950"} p-4 shadow-sm">
                <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 class="text-lg font-bold text-blue-950 dark:text-blue-100">Pregunta ${indicePregunta + 1}. ${pregunta.texto}</h3>
                    <span class="w-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${acierto ? "bg-green-200 text-green-900 dark:bg-green-300 dark:text-green-950" : "bg-red-200 text-red-900 dark:bg-red-300 dark:text-red-950"}">
                        ${acierto ? "Correcta" : "Incorrecta"}
                    </span>
                </div>

                <div class="space-y-2">
                    ${pregunta.opciones.map((opcion, indiceOpcion) => {
                        const esCorrecta = indiceOpcion === pregunta.correcta;
                        const esAlumno = indiceOpcion === respuestaAlumno;
                        let clases = "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
                        let etiqueta = "";

                        if (esCorrecta) {
                            clases = "border-green-500 bg-green-100 text-green-950 dark:border-green-400 dark:bg-green-900 dark:text-green-50";
                            etiqueta = "Respuesta correcta";
                        }

                        if (esAlumno && !esCorrecta) {
                            clases = "border-red-500 bg-red-100 text-red-950 dark:border-red-400 dark:bg-red-900 dark:text-red-50";
                            etiqueta = "Respuesta del alumno";
                        }

                        if (esAlumno && esCorrecta) {
                            etiqueta = "Respuesta del alumno y correcta";
                        }

                        return `
                            <div class="flex flex-col gap-1 rounded-xl border p-3 text-sm font-semibold shadow-sm ${clases}">
                                <span>${opcion}</span>
                                ${etiqueta ? `<span class="text-xs font-bold uppercase">${etiqueta}</span>` : ""}
                            </div>
                        `;
                    }).join("")}
                </div>

                <p class="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-950 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-100">
                    Justificación: ${pregunta.justificacion}
                </p>
                <p class="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Puntos asignados: ${pregunta.puntosAsignados} de ${pregunta.puntos}
                </p>
            </section>
        `;
    }).join("")}
        </div>
    `;
}

// Cada cambio de radio button modifica el objeto Pregunta y se guarda.
formTest.addEventListener("change", () => {
    const seleccionada = document.querySelector("input[name='respuesta']:checked");

    preguntas[preguntaActual].opcionSeleccionada = seleccionada ? Number(seleccionada.value) : null;
    preguntas[preguntaActual].puntosAsignados = 0;
    guardarPreguntas();
    pintarPregunta();
});

// Navegación entre preguntas.
btnAnterior.addEventListener("click", () => {
    if (preguntaActual > 0) {
        preguntaActual--;
        guardarIndice();
        pintarPregunta();
    }
});

btnSiguiente.addEventListener("click", () => {
    if (preguntaActual < preguntas.length - 1) {
        preguntaActual++;
        guardarIndice();
        pintarPregunta();
        return;
    }

    finalizarTest();
});

btnVerificar.addEventListener("click", verificarPregunta);

// Reiniciar limpia Session Storage y vuelve al estado inicial.
btnReiniciar.addEventListener("click", () => {
    sessionStorage.removeItem(CLAVE_PREGUNTAS);
    sessionStorage.removeItem(CLAVE_INDICE);
    sessionStorage.removeItem(CLAVE_FINALIZADO);
    preguntas = cargarPreguntas();
    preguntaActual = 0;
    testFinalizado = false;
    pintarPregunta();
});

btnCerrarModal.addEventListener("click", () => {
    modalJustificacion.close();
});

if (btnTema) {
    btnTema.addEventListener("click", cambiarTema);
}

aplicarTemaGuardado();
pintarPregunta();
