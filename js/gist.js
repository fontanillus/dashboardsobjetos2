// Clase que representa cada Gist guardado en la aplicacion.
class Gist {
  constructor(idInterno, usuario, idGithub, lenguaje, descripcion) {
    this.idInterno = idInterno;
    this.usuario = usuario;
    this.idGithub = idGithub;
    this.lenguaje = lenguaje;
    this.descripcion = descripcion;
  }

  // Construye la direccion publica del Gist.
  generarEnlace() {
    return `https://gist.github.com/${this.usuario}/${this.idGithub}`;
  }

  // Construye el codigo necesario para insertar el Gist en una pagina web.
  generarScript() {
    return `<script src="https://gist.github.com/${this.usuario}/${this.idGithub}.js"></script>`;
  }

  // Devuelve juntos los atributos y los resultados de los otros metodos.
  toString() {
    return `ID interno: ${this.idInterno}
Usuario: ${this.usuario}
ID GitHub: ${this.idGithub}
Lenguaje: ${this.lenguaje}
Descripción: ${this.descripcion}

Enlace:
${this.generarEnlace()}

Script embed:
${this.generarScript()}`;
  }
}

// Array de objetos sobre el que se realizan las operaciones CRUD.
const snippets = [
  new Gist(
    1,
    "fontanillus",
    "c8962c4a99f25c85a0702868cc21cae2",
    "html",
    "Componente HTML de una fábula con moraleja"
  )
];

// Guarda la operacion seleccionada: 1 agregar, 2 modificar, 3 eliminar y 4 mostrar.
let operacionActual = 0;

// Elementos de la interfaz que se utilizaran desde JavaScript.
const btnAgregar = document.querySelector("#btn-agregar");
const btnModificar = document.querySelector("#btn-modificar");
const btnEliminar = document.querySelector("#btn-eliminar");
const btnMostrar = document.querySelector("#btn-mostrar");
const btnCancelar = document.querySelector("#btn-cancelar");

const formGist = document.querySelector("#form-gist");
const estadoOperacion = document.querySelector("#estado-operacion");
const camposGist = document.querySelector("#campos-gist");
const accionesFormulario = document.querySelector("#acciones-formulario");

const idInterno = document.querySelector("#idInterno");
const usuario = document.querySelector("#usuario");
const idGithub = document.querySelector("#idGithub");
const lenguaje = document.querySelector("#lenguaje");
const descripcion = document.querySelector("#descripcion");

const listaSnippets = document.querySelector("#lista-snippets");
const totalSnippets = document.querySelector("#total-snippets");
const resultadoGist = document.querySelector("#resultado-gist");

const dialogInformativo = document.querySelector("#dialog-informativo");
const infoTitulo = document.querySelector("#info-titulo");
const infoMensaje = document.querySelector("#info-mensaje");

// Muestra mensajes al usuario mediante el dialogo modal del HTML.
const mostrarDialogo = (titulo, mensaje) => {
  infoTitulo.textContent = titulo;
  infoMensaje.textContent = mensaje;
  dialogInformativo.showModal();
};

const limpiarFormulario = () => {
  formGist.reset();
};

// Prepara y habilita los campos necesarios para cada operacion.
const activarFormulario = (operacion) => {
  operacionActual = operacion;
  accionesFormulario.classList.remove("hidden");

  idInterno.disabled = false;
  camposGist.disabled = false;

  if (operacion === 1) {
    estadoOperacion.textContent = "Operación AGREGAR: introduce los datos del nuevo gist";
  } else if (operacion === 2) {
    estadoOperacion.textContent = "Operación MODIFICAR: escribe el ID interno y los nuevos datos";
  } else if (operacion === 3) {
    estadoOperacion.textContent = "Operación ELIMINAR: escribe el ID interno del gist";
    camposGist.disabled = true;
  } else if (operacion === 4) {
    estadoOperacion.textContent = "Operación MOSTRAR: escribe el ID interno del gist";
    camposGist.disabled = true;
  }
};

const cancelarOperacion = () => {
  operacionActual = 0;
  limpiarFormulario();

  idInterno.disabled = true;
  camposGist.disabled = true;
  accionesFormulario.classList.add("hidden");

  estadoOperacion.textContent = "Selecciona una operación en el menú superior para comenzar";
};

// Busca por idInterno. Devuelve su indice o -1 si no existe.
function buscar(elemento, array) {
  let encontrado = false;
  let indice = -1;
  let i = 0;
  const elementos = array.length;

  while (i < elementos && !encontrado) {
    if (elemento === array[i].idInterno) {
      indice = i;
      encontrado = true;
    }

    i++;
  }

  return indice;
}

// pintarGist es una funcion con nombre que se pasa al forEach.
// Se ejecuta una vez por cada objeto Gist del array snippets.
// Asi evitamos usar una funcion anonima dentro del forEach.
const pintarGist = (gist) => {
  listaSnippets.innerHTML += `
    <article class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
      <h3 class="font-bold text-blue-950">${gist.descripcion}</h3>
      <p class="mt-1 text-slate-600">ID interno: ${gist.idInterno}</p>
      <p class="text-slate-600">Usuario: ${gist.usuario}</p>
      <p class="text-slate-600">Lenguaje: ${gist.lenguaje}</p>
      <a href="${gist.generarEnlace()}" target="_blank"
        class="mt-2 inline-block font-semibold text-purple-800 hover:underline">
        Ver gist
      </a>
    </article>
  `;
};

// Actualiza en pantalla la lista completa del array snippets.
const renderizarSnippets = () => {
  listaSnippets.innerHTML = "";
  totalSnippets.textContent = `${snippets.length} gists`;

  if (snippets.length === 0) {
    listaSnippets.innerHTML = `
      <p class="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
        Todavía no hay gists en el array de snippets.
      </p>
    `;
  } else {
    snippets.forEach(pintarGist);
  }
};

// CREATE: crea un objeto Gist y lo agrega al array.
const agregarGist = () => {
  const id = Number(idInterno.value);
  const indice = buscar(id, snippets);

  if (indice !== -1) {
    mostrarDialogo("ID repetido", "Ya existe un gist con este ID interno.");
  } else {
    // El metodo trim() devuelve una cadena sin los espacios en blanco
    // del principio y del final. Se usa para guardar datos limpios.
    // Evita guardar datos como " js " o " ritadelatorre ".
    const nuevoGist = new Gist(
      id,
      usuario.value.trim(),
      idGithub.value.trim(),
      lenguaje.value.trim(),
      descripcion.value.trim()
    );

    snippets.push(nuevoGist);
    resultadoGist.textContent = nuevoGist.toString();
    mostrarDialogo("Gist agregado", "El gist se ha añadido correctamente.");
    renderizarSnippets();
    cancelarOperacion();
  }
};

// UPDATE: localiza un Gist y cambia sus datos.
const modificarGist = () => {
  const id = Number(idInterno.value);
  const indice = buscar(id, snippets);

  if (indice === -1) {
    mostrarDialogo("No encontrado", "No existe ningún gist con este ID interno.");
  } else {
    const gist = snippets[indice];

    // Antes de guardar los cambios se limpian los espacios sobrantes.
    // Asi se mantienen los datos consistentes dentro del array.
    gist.usuario = usuario.value.trim();
    gist.idGithub = idGithub.value.trim();
    gist.lenguaje = lenguaje.value.trim();
    gist.descripcion = descripcion.value.trim();

    resultadoGist.textContent = gist.toString();
    mostrarDialogo("Gist modificado", "El gist se ha modificado correctamente.");
    renderizarSnippets();
    cancelarOperacion();
  }
};

// DELETE: elimina del array el Gist localizado.
const eliminarGist = () => {
  const id = Number(idInterno.value);
  const indice = buscar(id, snippets);

  if (indice === -1) {
    mostrarDialogo("No encontrado", "No existe ningún gist con este ID interno.");
  } else {
    const eliminado = snippets.splice(indice, 1)[0];

    resultadoGist.textContent = eliminado.toString();
    mostrarDialogo("Gist eliminado", "El gist se ha eliminado correctamente.");
    renderizarSnippets();
    cancelarOperacion();
  }
};

// READ: muestra los datos y metodos del Gist localizado.
const mostrarGist = () => {
  const id = Number(idInterno.value);
  const indice = buscar(id, snippets);

  if (indice === -1) {
    mostrarDialogo("No encontrado", "No existe ningún gist con este ID interno.");
  } else {
    const gist = snippets[indice];

    resultadoGist.textContent = gist.toString();
    mostrarDialogo("Gist encontrado", "El gist se muestra en la zona de resultado.");
    cancelarOperacion();
  }
};

// Comprueba que los campos necesarios tengan contenido.
const validarFormulario = () => {
  let valido = true;

  if (idInterno.value === "") {
    valido = false;
  }

  // trim() permite considerar vacio un campo que solo contiene espacios.
  if (
    (operacionActual === 1 || operacionActual === 2) &&
    (
      usuario.value.trim() === "" ||
      idGithub.value.trim() === "" ||
      lenguaje.value.trim() === "" ||
      descripcion.value.trim() === ""
    )
  ) {
    valido = false;
  }

  return valido;
};

// Ejecuta la funcion correspondiente al enviar el formulario.
const gestionarFormulario = (event) => {
  event.preventDefault();

  if (!validarFormulario()) {
    mostrarDialogo("Datos incompletos", "Revisa los campos obligatorios.");
  } else if (operacionActual === 1) {
    agregarGist();
  } else if (operacionActual === 2) {
    modificarGist();
  } else if (operacionActual === 3) {
    eliminarGist();
  } else if (operacionActual === 4) {
    mostrarGist();
  }
};

// Funciones con nombre para preparar cada operacion del formulario.
const prepararAgregar = () => {
  activarFormulario(1);
};

const prepararModificar = () => {
  activarFormulario(2);
};

const prepararEliminar = () => {
  activarFormulario(3);
};

const prepararMostrar = () => {
  activarFormulario(4);
};

// Funcion principal de la aplicacion.
// Se ejecuta una sola vez al iniciar el programa.
// Su objetivo es organizar la inicializacion de eventos y procesos.
const main = () => {
  btnAgregar.addEventListener("click", prepararAgregar);
  btnModificar.addEventListener("click", prepararModificar);
  btnEliminar.addEventListener("click", prepararEliminar);
  btnMostrar.addEventListener("click", prepararMostrar);
  btnCancelar.addEventListener("click", cancelarOperacion);

  formGist.addEventListener("submit", gestionarFormulario);

  // Primera representacion de los datos al cargar la pagina.
  renderizarSnippets();
};

// Punto de entrada de la aplicacion.
// Llama a la funcion principal para arrancar el programa.
main();
