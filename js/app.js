// app.js
// Lógica de la aplicación: array, CRUD, DOM, diálogos y eventos.

// 1. ARRAY CON DATOS DE PRUEBA
const edificios = [
	new Edificio('Torre Azul', 5, 1500),
	new Edificio('Edificio Central', 3, 900),
	new Edificio('Naves Industriales', 1, 2200),
	new Edificio('Oficinas Norte', 4, 1200)
];

let indiceActual = 0;


// 2. ELEMENTOS DEL DOM
const btnAgregar = document.querySelector('#agregar');
const btnModificar = document.querySelector('#modificar');
const btnEliminar = document.querySelector('#eliminar');
const btnMostrar = document.querySelector('#mostrar');
const btnListar = document.querySelector('#listar');
const btnCosteTotal = document.querySelector('#costeTotal');

const listaEdificios = document.querySelector('#listaEdificios');
const nombreEdificio = document.querySelector('#nombreEdificio');
const datosEdificio = document.querySelector('#datosEdificio');
const plantasEdificio = document.querySelector('#plantasEdificio');
const superficieEdificio = document.querySelector('#superficieEdificio');
const costeEdificio = document.querySelector('#costeEdificio');
const resultadoLimpieza = document.querySelector('#resultadoLimpieza');


// 3. BUSCAR EDIFICIO
const buscarEdificio = (nombre) => {
	let encontrado = false;
	let indice = -1;
	let i = 0;

	while (i < edificios.length && !encontrado) {
		if (edificios[i].nombre.toLowerCase().trim() === nombre.toLowerCase().trim()) {
			indice = i;
			encontrado = true;
		}

		i++;
	}

	return indice;
};


// 4. MOSTRAR DATOS EN PANTALLA
const mostrarDatosEdificio = (indice) => {
	if (edificios.length > 0) {
		const edificio = edificios[indice];

		nombreEdificio.textContent = edificio.nombre;
		datosEdificio.textContent = `Datos del edificio ${edificio.nombre}.`;
		plantasEdificio.textContent = edificio.plantas;
		superficieEdificio.textContent = `${edificio.superficieActual} m²`;
		costeEdificio.textContent = `${edificio.costeMensual().toFixed(2)} €`;

		resultadoLimpieza.textContent =
			`Tiempo de limpieza diario: ${edificio.limpiar().toFixed(2)} minutos. Coste mensual estimado: ${edificio.costeMensual().toFixed(2)} €.`;

		indiceActual = indice;
	} else {
		nombreEdificio.textContent = 'Sin edificios';
		datosEdificio.textContent = 'No hay edificios gestionados.';
		plantasEdificio.textContent = '0';
		superficieEdificio.textContent = '0 m²';
		costeEdificio.textContent = '0 €';
		resultadoLimpieza.textContent = 'No hay datos de limpieza.';
	}
};


// 5. LISTAR EDIFICIOS
const listarEdificios = () => {
	listaEdificios.innerHTML = '';

	if (edificios.length === 0) {
		const li = document.createElement('li');
		li.textContent = 'No hay edificios.';
		listaEdificios.appendChild(li);
	} else {
		edificios.forEach((edificio, indice) => {
			const li = document.createElement('li');

			li.textContent = edificio.nombre;
			li.className = 'cursor-pointer rounded-lg bg-purple-800 p-3 text-white hover:bg-purple-700';

			if (indice === indiceActual) {
				li.classList.add('bg-yellow-400', 'text-slate-900', 'font-bold');
			}

			li.addEventListener('click', () => {
				mostrarDatosEdificio(indice);
				listarEdificios();
			});

			listaEdificios.appendChild(li);
		});
	}
};


// 6. MENSAJE CON DIALOG
const abrirMensajeDialogo = (mensaje) => {
	// Sustituye a alert().
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<div class="p-4 text-black space-y-3">
			<p>${mensaje}</p>

			<button id="cerrarDialogo" class="px-4 py-2 bg-purple-700 text-white rounded">
				Aceptar
			</button>
		</div>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	dialog.querySelector('#cerrarDialogo').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// 7. CONFIRMACIÓN CON DIALOG
const abrirConfirmacionDialogo = (mensaje, callbackAceptar) => {
	// Sustituye a confirm().
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<div class="p-4 text-black space-y-3">
			<p>${mensaje}</p>

			<div class="flex gap-2">
				<button id="aceptarDialogo" class="px-4 py-2 bg-red-600 text-white rounded">
					Sí
				</button>

				<button id="cancelarDialogo" class="px-4 py-2 bg-gray-400 text-white rounded">
					No
				</button>
			</div>
		</div>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	dialog.querySelector('#aceptarDialogo').addEventListener('click', () => {
		// Callback: ejecuta la acción si el usuario acepta.
		callbackAceptar();

		dialog.close();
		dialog.remove();
	});

	dialog.querySelector('#cancelarDialogo').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// 8. FORMULARIO PARA AGREGAR EDIFICIO
const abrirFormularioAgregar = () => {
	// Sustituye varios prompt().
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<form id="formAgregarEdificio" class="p-4 text-black space-y-3">
			<h2 class="font-bold text-lg">Agregar edificio</h2>

			<input id="nombreNuevo" class="border p-2 w-full" placeholder="Nombre del edificio">
			<input id="plantasNuevo" class="border p-2 w-full" type="number" placeholder="Número de plantas">
			<input id="superficieNuevo" class="border p-2 w-full" type="number" placeholder="Superficie en m²">

			<div class="flex gap-2">
				<button type="submit" class="px-4 py-2 bg-purple-700 text-white rounded">
					Guardar
				</button>

				<button type="button" id="cancelarAgregar" class="px-4 py-2 bg-gray-400 text-white rounded">
					Cancelar
				</button>
			</div>
		</form>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	dialog.querySelector('#formAgregarEdificio').addEventListener('submit', (e) => {
		// Evita que el formulario recargue la página.
		e.preventDefault();

		const nombre = dialog.querySelector('#nombreNuevo').value.trim();
		const plantas = Number(dialog.querySelector('#plantasNuevo').value);
		const superficie = Number(dialog.querySelector('#superficieNuevo').value);

		// Si algún dato está mal, no se crea el edificio.
		if (nombre === '' || plantas <= 0 || superficie <= 0) {
			abrirMensajeDialogo('Todos los datos son obligatorios y deben ser correctos.');
		} else {
			const indice = buscarEdificio(nombre);

			if (indice === -1) {
				// CREATE: crea un nuevo objeto y lo guarda en el array.
				edificios.push(new Edificio(nombre, plantas, superficie));

				mostrarDatosEdificio(edificios.length - 1);
				listarEdificios();

				abrirMensajeDialogo('Edificio agregado correctamente.');

				dialog.close();
				dialog.remove();
			} else {
				abrirMensajeDialogo('Este edificio ya está disponible.');
			}
		}
	});

	dialog.querySelector('#cancelarAgregar').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// 9. FORMULARIO PARA BUSCAR EDIFICIO
const abrirBuscarDialogo = (titulo, callback) => {
	// Diálogo reutilizable para buscar, modificar o eliminar.
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<form id="formBuscarEdificio" class="p-4 text-black space-y-3">
			<h2 class="font-bold text-lg">${titulo}</h2>

			<p class="text-sm text-gray-600">
				Utiliza el mismo nombre que aparece en la lista lateral.
			</p>

			<input id="nombreBuscado" class="border p-2 w-full" placeholder="Nombre del edificio">

			<div class="flex gap-2">
				<button type="submit" class="px-4 py-2 bg-purple-700 text-white rounded">
					Buscar
				</button>

				<button type="button" id="cancelarBuscar" class="px-4 py-2 bg-gray-400 text-white rounded">
					Cancelar
				</button>
			</div>
		</form>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	dialog.querySelector('#formBuscarEdificio').addEventListener('submit', (e) => {
		e.preventDefault();

		const nombre = dialog.querySelector('#nombreBuscado').value.trim();

		if (nombre === '') {
			abrirMensajeDialogo('Debes escribir un nombre.');
		} else {
			// El callback decide qué hacer con el nombre buscado.
			callback(nombre);

			dialog.close();
			dialog.remove();
		}
	});

	dialog.querySelector('#cancelarBuscar').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// 10. FORMULARIO PARA MODIFICAR SUPERFICIE
const abrirFormularioSuperficie = (edificio, callback) => {
	// UPDATE: modifica solo la superficie.
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<form id="formSuperficie" class="p-4 text-black space-y-3">
			<h2 class="font-bold text-lg">Modificar superficie</h2>

			<p>Edificio: <strong>${edificio.nombre}</strong></p>

			<input id="nuevaSuperficie" class="border p-2 w-full" type="number" value="${edificio.superficieActual}">

			<div class="flex gap-2">
				<button type="submit" class="px-4 py-2 bg-purple-700 text-white rounded">
					Guardar
				</button>

				<button type="button" id="cancelarSuperficie" class="px-4 py-2 bg-gray-400 text-white rounded">
					Cancelar
				</button>
			</div>
		</form>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	dialog.querySelector('#formSuperficie').addEventListener('submit', (e) => {
		e.preventDefault();

		const nuevaSuperficie = Number(dialog.querySelector('#nuevaSuperficie').value);

		if (nuevaSuperficie > 0) {
			// Devuelve la nueva superficie a la función principal.
			callback(nuevaSuperficie);

			dialog.close();
			dialog.remove();
		} else {
			abrirMensajeDialogo('La superficie debe ser mayor que 0.');
		}
	});

	dialog.querySelector('#cancelarSuperficie').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// 11. CRUD

// CREATE
const agregarEdificio = () => {
	abrirFormularioAgregar();
};


// READ
const mostrarEdificio = () => {
	abrirBuscarDialogo('Mostrar edificio', (nombre) => {
		const indice = buscarEdificio(nombre);

		if (indice !== -1) {
			mostrarDatosEdificio(indice);
			listarEdificios();
			abrirMensajeDialogo('Edificio encontrado.');
		} else {
			abrirMensajeDialogo('No existe un edificio con ese nombre.');
		}
	});
};


// UPDATE
const modificarEdificio = () => {
	abrirBuscarDialogo('Modificar superficie', (nombre) => {
		const indice = buscarEdificio(nombre);

		if (indice !== -1) {
			abrirFormularioSuperficie(edificios[indice], (nuevaSuperficie) => {
				edificios[indice].superficieActual = nuevaSuperficie;

				mostrarDatosEdificio(indice);
				listarEdificios();

				abrirMensajeDialogo('Superficie modificada correctamente.');
			});
		} else {
			abrirMensajeDialogo('No existe un edificio con ese nombre.');
		}
	});
};


// DELETE
const eliminarEdificio = () => {
	abrirBuscarDialogo('Eliminar edificio', (nombre) => {
		const indice = buscarEdificio(nombre);

		if (indice !== -1) {
			abrirConfirmacionDialogo(`¿Seguro que quieres eliminar "${edificios[indice].nombre}"?`, () => {
				edificios.splice(indice, 1);

				mostrarDatosEdificio(0);
				listarEdificios();

				abrirMensajeDialogo('Edificio eliminado correctamente.');
			});
		} else {
			abrirMensajeDialogo('No existe un edificio con ese nombre.');
		}
	});
};


// LISTAR
const listarTodosEdificios = () => {
	listarEdificios();
	abrirMensajeDialogo('Lista de edificios actualizada.');
};


// COSTE TOTAL
const calcularCosteTotal = () => {
	let total = 0;

	edificios.forEach((edificio) => {
		total += edificio.costeMensual();
	});

	abrirMensajeDialogo(`Coste mensual total de limpieza: ${total.toFixed(2)} €.`);
};


// 12. EVENTOS
btnAgregar.addEventListener('click', agregarEdificio);
btnModificar.addEventListener('click', modificarEdificio);
btnEliminar.addEventListener('click', eliminarEdificio);
btnMostrar.addEventListener('click', mostrarEdificio);
btnListar.addEventListener('click', listarTodosEdificios);
btnCosteTotal.addEventListener('click', calcularCosteTotal);


// 13. INICIO
mostrarDatosEdificio(indiceActual);
listarEdificios();
