// --- VARIABLES GLOBALES DE ESTADO ---
let operacionActual = null; // Guardará 1, 2, 3 o 4
let posicionLibro = -1; // Inicializamos la posición del Libro que se esté trabajando

// --- MAPEO DEL DOM ---
const btnAgregar = document.getElementById('btn-agregar');
const btnModificar = document.getElementById('btn-modificar');
const btnEliminar = document.getElementById('btn-eliminar');
const btnMostrar = document.getElementById('btn-mostrar');

const estadoOperacion = document.getElementById('estado-operacion');
const formLibro = document.getElementById('form-libro');
const inputIsbn = document.getElementById('isbn');
const fieldsetCampos = document.getElementById('campos-libro');
const accionesFormulario = document.getElementById('acciones-formulario');
const btnCancelarForm = document.getElementById('btn-cancelar');
const btnConfirmarForm = document.getElementById('btn-confirmar');

// Elementos del dialog modal definido en isbn.html.
const dialogInformativo = document.getElementById('dialog-informativo');


// FUNCIONES

const mostrarAviso = (titulo, mensaje) => {
  document.getElementById('info-titulo').textContent = titulo;
  document.getElementById('info-mensaje').textContent = mensaje;
  dialogInformativo.showModal();
};

// Activa o bloquea campos segun la operacion seleccionada.
const gestionarPermisosCampos = (operacion) => {
  const campos = document.querySelectorAll('#campos-libro input');

  // Si la operación es 3 o 4, bloqueamos el fieldset entero
  if (operacion >= 3) {
    fieldsetCampos.disabled = true;
  } else {
    // Si la operación es 1 o 2, el fieldset debe estar abierto
    fieldsetCampos.disabled = false;

    // Aplicamos la lógica para configurar cada input individualmente
    campos.forEach(input => {
      const infoAtr = input.getAttribute('data-info');

      // Para los modos de escritura (1 y 2)
      if (infoAtr !== 'modificable' && operacion === 2) {
        input.disabled = true;  // Bloquea los campos fijos solo en la opción 2
      } else {
        input.disabled = false; // Abre el resto (Opción 1 completa y modificables de la Opción 2)
      }
    }); // fin de forEach
  }
};

//-----------------------------------------------------

const resetearFormulario = () => {
  formLibro.reset();
  fieldsetCampos.disabled = true;
  inputIsbn.disabled = true;
  accionesFormulario.classList.add('hidden');
  estadoOperacion.textContent = "Selecciona una operación en el menú superior";
};
btnCancelarForm.addEventListener('click', resetearFormulario);

//-----------------------------------------------------

const buscarLibroPorIsbn = (isbnValue) => {
  // posiciónLibro es una variable Global en este caso para poder usarla más
  // cómodamente entre varias funciones

  let encontrado = false;
	let indice = -1; 
	let i = 0;
	let elementos = baseDatosLibros.length; // número de elementos en el array
	
	while (i < elementos && !encontrado) {
		if (isbnValue === baseDatosLibros[i].getIsbn()) {
			indice = i;
			encontrado = true;
		}
	  i++;
  }

	posicionLibro = indice;

  console.log(`buscarLibroPorIsbn(${isbnValue})`, 'posicionLibro', posicionLibro);
  if (posicionLibro >= 0) {
    mostrarAviso('Libro encontrado', 'Presiona OK para mostrarlo en pantalla');
  } else {
    if (operacionActual > 1) {
      mostrarAviso('Libro no encontrado', 'No se puede realizar la operación');
    }
  }
};

//-----------------------------------------------------

const mostrarLibroEnFormulario = () => {
  const libro = baseDatosLibros[posicionLibro];

  // Métodos estándar universales (con paréntesis)
  document.getElementById('titulo').value = libro.getTitulo();
  document.getElementById('autor').value = libro.getAutor();
  document.getElementById('stock').value = libro.getStock();
  document.getElementById('precio').value = libro.getPrecio();

};

const guardarLibroEnFormulario = () => {
  let isbn = document.getElementById('isbn').value;
  let titulo = document.getElementById('titulo').value;
  let autor = document.getElementById('autor').value;
  let stock = parseInt(document.getElementById('stock').value);
  let precio = parseFloat(document.getElementById('precio').value);

  const nuevoLibro = new Libro(isbn, titulo, autor, stock, precio);
  baseDatosLibros.push(nuevoLibro);
  console.clear();
  console.table(baseDatosLibros);
  mostrarAviso("Éxito", "El libro ha sido registrado correctamente.");

};

const modificarLibroEnFormulario = () => {
    const libro = baseDatosLibros[posicionLibro];
    let stock = parseInt(document.getElementById('stock').value);
    let precio = parseFloat(document.getElementById('precio').value);
    libro.actualizarStockYPrecio(stock, precio);
    console.clear();
    console.log(baseDatosLibros[posicionLibro]);
    mostrarAviso("Éxito", "Se han actualizado los datos de Stock y Precio.");
};

const eliminarLibroEnFormulario = () => {
    baseDatosLibros.splice(posicionLibro,1);
    mostrarAviso("Éxito", "Se ha eliminado el libro.");
};

const gestionarInputISBN = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Evitamos submits prematuros del navegador

    const isbnValue = inputIsbn.value.trim();
    if (isbnValue !== '') {
        // Ejecuta la función buscar que devuelve la posición o -1
        buscarLibroPorIsbn(isbnValue);
        if (posicionLibro >= 0) {
          mostrarLibroEnFormulario();
        }

        if (operacionActual === 1 && posicionLibro < 0) {
            gestionarPermisosCampos(1);
            // Hacemos visible la sección de los botones Aceptar / Cancelar del formulario
            accionesFormulario.classList.remove('hidden');
        } else {
          gestionarPermisosCampos(operacionActual);
          accionesFormulario.classList.remove('hidden');
        }
    } // (isbnValue !== '')    
  } // (e.key === 'Enter')
};

inputIsbn.addEventListener('keydown', gestionarInputISBN);

//-----------------------------------------------------

const agregar = () => {
  operacionActual = 1;
  resetearFormulario(); // Limpia la pantalla por completo
  inputIsbn.disabled = false; // Permite que el usuario escriba el ISBN
  inputIsbn.focus();
  estadoOperacion.textContent = "MODO: 1. AGREGAR LIBRO";
  btnConfirmarForm.textContent = "Guardar Libro";
};
btnAgregar.addEventListener('click', agregar);

//-----------------------------------------------------

const modificar = () => {
  operacionActual = 2;
  resetearFormulario(); // Limpia la pantalla por completo
  inputIsbn.disabled = false; // Permite que el usuario escriba el ISBN
  inputIsbn.focus();
  estadoOperacion.textContent = "MODO: 2. MODIFICANDO STOCK Y PRECIO";
  btnConfirmarForm.textContent = "Guardar Cambios";
};
btnModificar.addEventListener('click', modificar);

//-----------------------------------------------------

const eliminar = () => {
  operacionActual = 3;
  resetearFormulario(); // Limpia la pantalla por completo
  inputIsbn.disabled = false; // Permite que el usuario escriba el ISBN
  inputIsbn.focus();
  estadoOperacion.textContent = "MODO: 3. ELIMINAR LIBRO. Presione el botón ACEPTAR para Eliminarlo";
  btnConfirmarForm.textContent = "Eliminar Libro";
};
btnEliminar.addEventListener('click', eliminar);

//-----------------------------------------------------
const mostrar = () => {
  operacionActual = 4;
  resetearFormulario(); // Limpia la pantalla por completo
  inputIsbn.disabled = false; // Permite que el usuario escriba el ISBN
  inputIsbn.focus();
  estadoOperacion.textContent = "MODO: 4. INFORMACIÓN DEL LIBRO";
  btnConfirmarForm.textContent = "Aceptar";
};
btnMostrar.addEventListener('click', mostrar);

//-----------------------------------------------------

const procesarEnvio = (e) => {
  e.preventDefault();

  switch (operacionActual) {
    case 1: guardarLibroEnFormulario(); break;
    case 2: modificarLibroEnFormulario(); break;
    case 3: eliminarLibroEnFormulario(); break;
    case 4: mostrarLibroEnFormulario(); break;
  }

  resetearFormulario();
};
formLibro.addEventListener('submit', procesarEnvio);

//-------------------------------------------------------



