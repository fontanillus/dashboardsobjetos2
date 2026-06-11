// 1. VARIABLES
let autoplay = false;
let temporizadorId = null;
let currentIndex = 0;

const btnAgregar = document.querySelector('#agregar');
const btnModificar = document.querySelector('#modificar');
const btnEliminar = document.querySelector('#eliminar');
const btnMostrar = document.querySelector('#mostrar');

// 2. TEMPORIZADOR / AUTOPLAY
const temporizador = (callback, intervalo) => {
	return setInterval(callback, intervalo);
};

const detenerTemporizador = (id) => {
	clearInterval(id);
};

const setAutoplayState = (isPlaying) => {
	autoplay = isPlaying;
	const playShape = document.getElementById('playShape');
	const playShapeMobile = document.getElementById('playShapeMobileHeader');

	// Evita temporizadores duplicados al cambiar entre play/pausa.
	if (temporizadorId !== null) {
		detenerTemporizador(temporizadorId);
		temporizadorId = null;
	}

	if (autoplay) {
		if (playShape) {
			playShape.setAttribute('points', '12,10 20,10 20,22 12,22');
		}
		if (playShapeMobile) {
			playShapeMobile.setAttribute('points', '12,10 20,10 20,22 12,22');
		}

		temporizadorId = temporizador(() => {
			// Solo avanza si aún hay imágenes disponibles.
			if (images.length > 0) {
				currentIndex = (currentIndex + 1) % images.length;
				renderImage(currentIndex);
				renderSidebarList();
			}
		}, 3000);
	} else {
		if (playShape) {
			playShape.setAttribute('points', '13,10 25,16 13,22');
		}
		if (playShapeMobile) {
			playShapeMobile.setAttribute('points', '13,10 25,16 13,22');
		}
	}
};

// 3. RENDERIZAR IMAGEN Y SIDEBAR
const renderImage = (index) => {
	if (Array.isArray(images) && images.length > 0) {
		const img = images[index];
		document.getElementById('mainImage').src = img.foto;
		document.getElementById('imageTitle').textContent = img.title;
		document.getElementById('imageDesc').textContent = img.descripcion;

		const list = document.getElementById('caracteristicasList');
		list.innerHTML = '';
		img.caracteristicas.forEach((carac) => {
			const li = document.createElement('li');
			li.textContent = carac;
			list.appendChild(li);
		});

		document.getElementById('currentIndex').textContent = index + 1;
		document.getElementById('totalImages').textContent = images.length;
	} else {
		document.getElementById('mainImage').src = '';
		document.getElementById('imageTitle').textContent = 'Sin imágenes';
		document.getElementById('imageDesc').textContent = '';
		document.getElementById('caracteristicasList').innerHTML = '';
		document.getElementById('currentIndex').textContent = '0';
		document.getElementById('totalImages').textContent = '0';
	}
};

const renderSidebarList = () => {
	const sidebarList = document.getElementById('sidebarList');
	if (!sidebarList) {
		console.warn('No se encontró el elemento sidebarList');
	} else {
		// Reconstruye la lista para reflejar selección y cambios CRUD.
		sidebarList.innerHTML = '';

		if (!Array.isArray(images) || images.length === 0) {
			const li = document.createElement('li');
			li.textContent = 'No hay imágenes.';
			sidebarList.appendChild(li);
		} else {
			images.forEach((img, idx) => {
				const li = document.createElement('li');
				li.className = 'flex items-center gap-2 cursor-pointer hover:text-yellow-300 transition-colors p-1 rounded';

				if (idx === currentIndex) {
					li.classList.add('font-bold', 'text-yellow-300', 'bg-purple-900', 'shadow');
				}

				const thumb = document.createElement('img');
				thumb.src = img.foto;
				thumb.alt = img.title;
				thumb.className = 'w-10 h-10 object-cover rounded shadow-sm border border-purple-800';

				const span = document.createElement('span');
				span.textContent = img.title;

				li.appendChild(thumb);
				li.appendChild(span);

				li.addEventListener('click', () => {
					// Al pulsar una miniatura, muestra esa foto.
					currentIndex = idx;
					renderImage(currentIndex);
					renderSidebarList();

					// En móvil se cierra el menú tras seleccionar una imagen.
					if (window.innerWidth < 1024) {
						const sidebarMenu = document.getElementById('sidebarMenu');
						if (sidebarMenu) {
							sidebarMenu.classList.add('-translate-x-full');
						}
					}
				});

				sidebarList.appendChild(li);
			});
		}
	}
};

const refrescarGaleria = (nuevoIndice) => {
	if (images.length > 0) {
		// Conserva el índice válido tras navegar o editar elementos.
		if (typeof nuevoIndice === 'number' && nuevoIndice >= 0 && nuevoIndice < images.length) {
			currentIndex = nuevoIndice;
		} else {
			currentIndex = Math.min(currentIndex, images.length - 1);
		}
		renderImage(currentIndex);
		renderSidebarList();
	} else {
		renderImage(0);
		renderSidebarList();
	}
};

// 4. BUSCAR
const MENSAJE_NOMBRE_FOTO =
	'Introduce el nombre de la foto (como aparece en el menú lateral):';

const buscarFotoPorNombre = (titulo) => {
	let encontrado = false;
	let indice = -1;
	let i = 0;
	const elementos = images.length;

	// Devuelve -1 por estándar cuando no encuentra coincidencia.
	while (i < elementos && !encontrado) {
		if (titulo.toLowerCase() === images[i].title.toLowerCase()) {
			indice = i;
			encontrado = true;
		}
		i++;
	}

	return indice;
};

// 5. CRUD CON DIALOG
// CREATE, READ, UPDATE y DELETE usando <dialog>
// Antes usábamos prompt(), alert() y confirm().
// Ahora toda la interacción se realiza dentro de la página.

// CREATE
// Agrega una nueva foto a la galería.
function agregarFoto() {

	// Abrimos el formulario vacío.
	abrirFormularioFoto('Agregar nueva foto', null, (nuevaFoto) => {

		// Primero buscamos para evitar duplicados.
		const indice = buscarFotoPorNombre(nuevaFoto.title);

		// Si no existe, la creamos.
		if (indice === -1) {

			images.push(
				new Fotos(
					nuevaFoto.foto,
					nuevaFoto.title,
					nuevaFoto.descripcion,
					nuevaFoto.caracteristicas
				)
			);

			// Mostramos la nueva foto.
			refrescarGaleria(images.length - 1);

			abrirMensajeDialogo('Foto agregada correctamente.');

		} else {

			// Si ya existe, informamos al usuario.
			abrirMensajeDialogo('Foto ya disponible.');
		}
	});
}


// READ
// Busca una foto y la muestra en pantalla.
function mostrarFoto() {

	abrirBuscarDialogo('Mostrar / devolver foto', (tituloBuscado) => {

		// Buscamos la foto por su título.
		const indice = buscarFotoPorNombre(tituloBuscado);

		// Si existe, la mostramos.
		if (indice !== -1) {

			refrescarGaleria(indice);

			abrirMensajeDialogo('Foto encontrada y mostrada.');

		} else {

			// Si no existe, mostramos mensaje.
			abrirMensajeDialogo('No se puede mostrar: esta foto no está disponible.');
		}
	});
}


// UPDATE
// Modifica los datos de una foto existente.
function modificarFoto() {

	abrirBuscarDialogo('Modificar foto', (tituloBuscado) => {

		// Primero buscamos la foto.
		const indice = buscarFotoPorNombre(tituloBuscado);

		// Si existe, cargamos sus datos.
		if (indice !== -1) {

			const fotoActual = images[indice];

			abrirFormularioFoto('Modificar foto', fotoActual, (fotoModificada) => {

				// Comprobamos que el nuevo título no esté repetido.
				const indiceNuevoTitulo = buscarFotoPorNombre(fotoModificada.title);

				if (indiceNuevoTitulo === -1 || indiceNuevoTitulo === indice) {

					// Actualizamos los datos.
					fotoActual.title = fotoModificada.title;
					fotoActual.foto = fotoModificada.foto;
					fotoActual.descripcion = fotoModificada.descripcion;
					fotoActual.caracteristicas = fotoModificada.caracteristicas;

					// Refrescamos la galería.
					refrescarGaleria(indice);

					abrirMensajeDialogo('Foto modificada correctamente.');

				} else {

					// Ya existe otra foto con ese nombre.
					abrirMensajeDialogo('No se puede modificar: ya hay otra foto con ese título.');
				}
			});

		} else {

			// No encontramos la foto.
			abrirMensajeDialogo('No se puede modificar: esta foto no está disponible.');
		}
	});
}


// DELETE
// Elimina una foto de la galería.
function eliminarFoto() {

	abrirBuscarDialogo('Eliminar foto', (tituloBuscado) => {

		// Primero buscamos la foto.
		const indice = buscarFotoPorNombre(tituloBuscado);

		// Si existe, pedimos confirmación.
		if (indice !== -1) {

			abrirConfirmacionDialogo(

				`¿Seguro que quieres eliminar "${images[indice].title}"?`,

				() => {

					// Eliminamos la foto del array.
					images.splice(indice, 1);

					// Actualizamos la galería.
					refrescarGaleria(indice);

					abrirMensajeDialogo('Foto eliminada correctamente.');
				}
			);

		} else {

			// No existe la foto.
			abrirMensajeDialogo('No se puede eliminar: esta foto no está disponible.');
		}
	});
}
// 5. CRUD CON DIALOG
// Ventanas de diálogo para no usar prompt(), alert() ni confirm().

// Mensaje simple tipo alert()
const abrirMensajeDialogo = (mensaje) => {
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<div class="p-4 text-black">
			<p>${mensaje}</p>
			<button id="cerrarDialogo" class="mt-4 px-4 py-2 bg-purple-700 text-white rounded">
				Aceptar
			</button>
		</div>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	document.getElementById('cerrarDialogo').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// Confirmación tipo confirm()
const abrirConfirmacionDialogo = (mensaje, callbackAceptar) => {
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<div class="p-4 text-black">
			<p>${mensaje}</p>

			<div class="mt-4 flex gap-2">
				<button id="aceptarDialogo" class="px-4 py-2 bg-red-600 text-white rounded">Sí</button>
				<button id="cancelarDialogo" class="px-4 py-2 bg-gray-400 text-white rounded">No</button>
			</div>
		</div>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	document.getElementById('aceptarDialogo').addEventListener('click', () => {
		callbackAceptar();
		dialog.close();
		dialog.remove();
	});

	document.getElementById('cancelarDialogo').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// Formulario para agregar o modificar fotos
const abrirFormularioFoto = (tituloDialogo, fotoActual, callbackAceptar) => {
	const dialog = document.createElement('dialog');

	const titulo = fotoActual ? fotoActual.title : '';
	const ruta = fotoActual ? fotoActual.foto : '';
	const descripcion = fotoActual ? fotoActual.descripcion : '';
	const caracteristicas = fotoActual ? fotoActual.caracteristicas.join(', ') : '';

	dialog.innerHTML = `
		<form id="formDialogoFoto" class="p-4 text-black space-y-3">
			<h2 class="font-bold text-lg">${tituloDialogo}</h2>

			<input id="dialogTitulo" class="border p-2 w-full" placeholder="Título" value="${titulo}">
			<input id="dialogRuta" class="border p-2 w-full" placeholder="Ruta imagen" value="${ruta}">
			<input id="dialogDescripcion" class="border p-2 w-full" placeholder="Descripción" value="${descripcion}">
			<input id="dialogCaracteristicas" class="border p-2 w-full" placeholder="Características separadas por coma" value="${caracteristicas}">

			<div class="flex gap-2">
				<button type="submit" class="px-4 py-2 bg-purple-700 text-white rounded">Guardar</button>
				<button type="button" id="cancelarFormulario" class="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
			</div>
		</form>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	document.getElementById('formDialogoFoto').addEventListener('submit', (e) => {
		e.preventDefault();

		const nuevaFoto = {
			title: document.getElementById('dialogTitulo').value.trim(),
			foto: document.getElementById('dialogRuta').value.trim(),
			descripcion: document.getElementById('dialogDescripcion').value.trim(),
			caracteristicas: document.getElementById('dialogCaracteristicas').value
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item !== '')
		};

		if (nuevaFoto.title === '' || nuevaFoto.foto === '' || nuevaFoto.descripcion === '') {
			abrirMensajeDialogo('Título, ruta y descripción son obligatorios.');
		} else {
			if (nuevaFoto.caracteristicas.length === 0) {
				nuevaFoto.caracteristicas = ['Sin características'];
			}

			callbackAceptar(nuevaFoto);
			dialog.close();
			dialog.remove();
		}
	});

	document.getElementById('cancelarFormulario').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// Formulario pequeño para buscar por título
const abrirBuscarDialogo = (tituloDialogo, callbackAceptar) => {
	const dialog = document.createElement('dialog');

	dialog.innerHTML = `
		<form id="formBuscarFoto" class="p-4 text-black space-y-3">
			<h2 class="font-bold text-lg">${tituloDialogo}</h2>

			<p class="text-sm text-gray-600">
				Utiliza el mismo título que aparece en la lista lateral.
			</p>

			<input id="dialogBuscarTitulo" class="border p-2 w-full" placeholder="Título de la foto">

			<div class="flex gap-2">
				<button type="submit" class="px-4 py-2 bg-purple-700 text-white rounded">Buscar</button>
				<button type="button" id="cancelarBuscar" class="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
			</div>
		</form>
	`;

	document.body.appendChild(dialog);
	dialog.showModal();

	document.getElementById('formBuscarFoto').addEventListener('submit', (e) => {
		e.preventDefault();

		const titulo = document.getElementById('dialogBuscarTitulo').value.trim();

		if (titulo === '') {
			abrirMensajeDialogo('Debes escribir un título.');
		} else {
			callbackAceptar(titulo);
			dialog.close();
			dialog.remove();
		}
	});

	document.getElementById('cancelarBuscar').addEventListener('click', () => {
		dialog.close();
		dialog.remove();
	});
};


// CREATE
function agregarFoto() {
	abrirFormularioFoto('Agregar nueva foto', null, (nuevaFoto) => {
		const indice = buscarFotoPorNombre(nuevaFoto.title);

		if (indice === -1) {
			images.push(
				new Fotos(
					nuevaFoto.foto,
					nuevaFoto.title,
					nuevaFoto.descripcion,
					nuevaFoto.caracteristicas
				)
			);

			refrescarGaleria(images.length - 1);
			abrirMensajeDialogo('Foto agregada correctamente.');
		} else {
			abrirMensajeDialogo('Foto ya disponible.');
		}
	});
}


// READ
function mostrarFoto() {
	abrirBuscarDialogo('Mostrar foto', (tituloBuscado) => {
		const indice = buscarFotoPorNombre(tituloBuscado);

		if (indice !== -1) {
			refrescarGaleria(indice);
			abrirMensajeDialogo('Foto encontrada y mostrada.');
		} else {
			abrirMensajeDialogo('No existe una foto con ese título.');
		}
	});
}


// UPDATE
function modificarFoto() {
	abrirBuscarDialogo('Modificar foto', (tituloBuscado) => {
		const indice = buscarFotoPorNombre(tituloBuscado);

		if (indice !== -1) {
			const fotoActual = images[indice];

			abrirFormularioFoto('Modificar foto', fotoActual, (fotoModificada) => {
				const indiceNuevoTitulo = buscarFotoPorNombre(fotoModificada.title);

				if (indiceNuevoTitulo === -1 || indiceNuevoTitulo === indice) {
					fotoActual.title = fotoModificada.title;
					fotoActual.foto = fotoModificada.foto;
					fotoActual.descripcion = fotoModificada.descripcion;
					fotoActual.caracteristicas = fotoModificada.caracteristicas;

					refrescarGaleria(indice);
					abrirMensajeDialogo('Foto modificada correctamente.');
				} else {
					abrirMensajeDialogo('No se puede modificar: ese título ya existe.');
				}
			});
		} else {
			abrirMensajeDialogo('No existe una foto con ese título.');
		}
	});
}


// DELETE
function eliminarFoto() {
	abrirBuscarDialogo('Eliminar foto', (tituloBuscado) => {
		const indice = buscarFotoPorNombre(tituloBuscado);

		if (indice !== -1) {
			abrirConfirmacionDialogo(`¿Seguro que quieres eliminar "${images[indice].title}"?`, () => {
				images.splice(indice, 1);
				refrescarGaleria(indice);
				abrirMensajeDialogo('Foto eliminada correctamente.');
			});
		} else {
			abrirMensajeDialogo('No existe una foto con ese título.');
		}
	});
}
// 6. DOMCONTENTLOADED CON TODOS LOS EVENTOS
document.addEventListener('DOMContentLoaded', () => {
	const autoplayBtn = document.getElementById('autoplayBtn');
	const autoplayBtnMobile = document.getElementById('autoplayBtnMobileHeader');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const sidebarMenu = document.getElementById('sidebarMenu');
	const openSidebarBtn = document.getElementById('openSidebarBtn');
	const closeSidebarBtn = document.getElementById('closeSidebarBtn');

	// Pintado inicial al cargar la página.
	refrescarGaleria(currentIndex);

	if (btnAgregar) {
		btnAgregar.addEventListener('click', agregarFoto);
	}

	if (btnModificar) {
		btnModificar.addEventListener('click', modificarFoto);
	}

	if (btnEliminar) {
		btnEliminar.addEventListener('click', eliminarFoto);
	}

	if (btnMostrar) {
		btnMostrar.addEventListener('click', mostrarFoto);
	}

	if (autoplayBtn) {
		// Control de autoplay en desktop/tablet.
		autoplayBtn.addEventListener('click', () => {
			setAutoplayState(!autoplay);
		});
	}

	if (autoplayBtnMobile) {
		// Mismo control de autoplay en botón móvil.
		autoplayBtnMobile.addEventListener('click', () => {
			setAutoplayState(!autoplay);
		});
	}

	if (prevBtn) {
		prevBtn.addEventListener('click', () => {
			if (images.length > 0) {
				currentIndex = (currentIndex - 1 + images.length) % images.length;
				refrescarGaleria(currentIndex);
			} else {
				alert('No hay imágenes para navegar.');
			}
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			if (images.length > 0) {
				currentIndex = (currentIndex + 1) % images.length;
				refrescarGaleria(currentIndex);
			} else {
				alert('No hay imágenes para navegar.');
			}
		});
	}

	if (sidebarMenu && openSidebarBtn && closeSidebarBtn) {
		// Apertura manual del sidebar en móvil.
		openSidebarBtn.addEventListener('click', () => {
			sidebarMenu.classList.remove('-translate-x-full');
		});

		// Cierre manual del sidebar en móvil.
		closeSidebarBtn.addEventListener('click', () => {
			sidebarMenu.classList.add('-translate-x-full');
		});

		// Cierra al pulsar fuera del panel en pantallas pequeñas.
		document.addEventListener('click', (e) => {
			if (window.innerWidth < 1024 && !sidebarMenu.contains(e.target) && !openSidebarBtn.contains(e.target)) {
				sidebarMenu.classList.add('-translate-x-full');
			}
		});
	}
});