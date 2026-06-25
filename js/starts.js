let images = [];
let todosPersonajes = [];

// Constantes de configuración: API, clave de localStorage y tamaño de página.
const URL_API = 'https://akabab.github.io/starwars-api/api/all.json';
const CLAVE_FAVORITOS = 'favoritosStarWars';
const PERSONAJES_POR_PAGINA = 10;

// Estado de la aplicación: vista actual, favoritos, búsqueda, carrusel y paginación.
let favoritos = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS)) || [];
let mostrandoFavoritos = false;
let terminoBusqueda = '';
let currentIndex = 0;
let autoplay = false;
let temporizadorId = null;
let paginaActual = 0;

const getElement = (id) => document.getElementById(id);

// Comprueba que la URL de imagen responde bien antes de mostrar el personaje.
const imagenDisponible = async (url) => {
	let disponible = false;

	if (url) {
		try {
			const respuesta = await fetch(url, { method: 'HEAD' });
			disponible = respuesta.ok;
		} catch (error) {
			console.warn('Imagen no disponible:', url, error);
		}
	}

	return disponible;
};

const guardarFavoritos = () => {
	localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
	console.log('Favoritos guardados:', favoritos);
};

// Aplica búsqueda y modo favoritos sobre la lista base sin volver a llamar a la API.
const aplicarFiltros = () => {
	const origen = mostrandoFavoritos ? favoritos : todosPersonajes;
	const busqueda = terminoBusqueda.trim().toLowerCase();

	images = busqueda === ''
		? [...origen]
		: origen.filter((personaje) => personaje.title.toLowerCase().includes(busqueda));

	paginaActual = 0;
	currentIndex = 0;
	refreshGallery();
};

const buscarPersonaje = (valor) => {
	terminoBusqueda = valor;
	aplicarFiltros();
};

// Al cambiar de vista se limpia el buscador para volver a mostrar la lista completa.
const mostrarFavoritos = () => {
	mostrandoFavoritos = true;
	terminoBusqueda = '';

	const searchInput = getElement('searchInput');

	if (searchInput) {
		searchInput.value = '';
	}

	aplicarFiltros();
};

const mostrarTodos = () => {
	mostrandoFavoritos = false;
	terminoBusqueda = '';

	const searchInput = getElement('searchInput');

	if (searchInput) {
		searchInput.value = '';
	}

	aplicarFiltros();
};

const agregarFavorito = () => {
	const personajeActual = images[currentIndex];

	if (personajeActual) {
		const existe = favoritos.some((favorito) => favorito.title === personajeActual.title);

		if (existe) {
			console.log('Este personaje ya está en favoritos:', personajeActual.title);
		} else {
			favoritos.push(personajeActual);
			guardarFavoritos();
			console.log('Favorito añadido:', personajeActual.title);
		}
	}
};

// Carga la API, filtra personajes con imagen válida y usa desestructuración para crear objetos Start.
const cargarPersonajes = async () => {
	try {
		const respuesta = await fetch(URL_API);
		const datos = await respuesta.json();
		const personajesComprobados = await Promise.all(
			datos.map(async (personaje) => {
				return {
					personaje,
					tieneImagen: await imagenDisponible(personaje.image)
				};
			})
		);

		todosPersonajes = personajesComprobados
			.filter(({ tieneImagen }) => tieneImagen)
			.map(({ personaje }) => {
				const {
					name,
					homeworld,
					species,
					gender,
					height,
					mass,
					hairColor,
					eyeColor,
					image
				} = personaje;

				// Nota de estudio: los ternarios permiten traducir valores concretos al crear el objeto.
				return new Start(
					image,
					name,
					`${name} es un personaje del universo Star Wars procedente de ${homeworld || 'un planeta desconocido'}.`,
					[
						`Planeta: ${homeworld || 'Desconocido'}`,
						`Especie: ${
							species === 'human'
								? 'Humano'
								: species === 'droid'
									? 'Droide'
									: species || 'Desconocida'
						}`,
						`Género: ${
							gender === 'male'
								? 'Masculino'
								: gender === 'female'
									? 'Femenino'
									: gender === 'hermaphrodite'
										? 'Hermafrodita'
										: gender === 'none'
											? 'Sin género'
											: gender === 'n/a'
												? 'No aplicable'
												: 'Desconocido'
						}`,
						`Altura: ${height || 'Desconocida'}`,
						`Peso: ${mass || 'Desconocido'}`,
						`Color de pelo: ${
							hairColor === 'black'
								? 'Negro'
								: hairColor === 'brown'
									? 'Marrón'
									: hairColor === 'blond'
										? 'Rubio'
										: hairColor || 'Desconocido'
						}`,
						`Color de ojos: ${
							eyeColor === 'blue'
								? 'Azul'
								: eyeColor === 'brown'
									? 'Marrón'
									: eyeColor === 'yellow'
										? 'Amarillo'
										: eyeColor || 'Desconocido'
						}`
					]
				);
			});

		images = [...todosPersonajes];

		console.log('--- AUDITORÍA API STAR WARS ---');
		console.log('Total personajes recibidos:', datos.length);
		console.log('Total personajes cargados en galería:', images.length);
		console.log('Personajes descartados sin foto cargable:', datos.length - images.length);
		console.log('Primer personaje:', images[0] ? images[0].toString() : 'Sin personajes');
		console.log('Favoritos actuales:', favoritos);
		console.log('Fecha de carga:', new Date().toLocaleString());
		console.log('--------------------------------');

		currentIndex = 0;
		paginaActual = 0;
		refreshGallery();
	} catch (error) {
		console.error('Error al cargar la API:', error);
	}
};

const setPlayIcon = () => {
	const points = autoplay ? '12,10 20,10 20,22 12,22' : '13,10 25,16 13,22';
	const playShape = getElement('playShape');
	const playShapeMobile = getElement('playShapeMobileHeader');

	if (playShape) {
		playShape.setAttribute('points', points);
	}

	if (playShapeMobile) {
		playShapeMobile.setAttribute('points', points);
	}
};

// Pinta en la ficha central el personaje seleccionado.
const renderImage = (index) => {
	const mainImage = getElement('mainImage');
	const imageTitle = getElement('imageTitle');
	const imageDesc = getElement('imageDesc');
	const caracteristicasList = getElement('caracteristicasList');
	const currentIndexElement = getElement('currentIndex');
	const totalImagesElement = getElement('totalImages');

	if (mainImage && imageTitle && imageDesc && caracteristicasList && currentIndexElement && totalImagesElement) {
		if (images.length === 0) {
			mainImage.removeAttribute('src');
			imageTitle.textContent = 'Sin personajes';
			imageDesc.textContent = mostrandoFavoritos
				? 'No hay favoritos que coincidan con la búsqueda.'
				: 'No hay personajes que coincidan con la búsqueda.';
			caracteristicasList.innerHTML = '';
			currentIndexElement.textContent = '0';
			totalImagesElement.textContent = '0';
		} else {
			const img = images[index];
			mainImage.src = img.foto;
			mainImage.alt = img.title;
			imageTitle.textContent = img.title;
			// Nota de estudio: se ajusta solo el texto visible; la descripcion original no se modifica.
			const descripcionVisible = img.descripcion.replace(/procedente de ([a-záéíóúñ])/i, (coincidencia, letra) => {
				return `procedente de ${letra.toUpperCase()}`;
			});
			imageDesc.textContent = descripcionVisible;
			caracteristicasList.innerHTML = '';

			img.caracteristicas.forEach((caracteristica) => {
				const li = document.createElement('li');
				let textoCaracteristica = caracteristica;

				// Nota de estudio: Tailwind permite cambiar solo la apariencia sin modificar el dato original de la API.
				if (caracteristica.startsWith('Planeta:')) {
					li.classList.add('capitalize');
				}

				// Nota de estudio: aplicamos capitalizacion visual tambien a la especie sin tocar el dato original.
				if (caracteristica.startsWith('Especie:')) {
					li.classList.add('capitalize');
				}

				// Nota de estudio: tambien capitalizamos visualmente los colores que vienen de la API.
				if (caracteristica.startsWith('Color de pelo:') || caracteristica.startsWith('Color de ojos:')) {
					li.classList.add('capitalize');
				}

				// Nota de estudio: aqui traducimos solo el texto que se muestra, sin alterar el array original.
				// Las frases largas van antes que las palabras sueltas para evitar traducciones a medias.
				if (textoCaracteristica.startsWith('Color de pelo:') || textoCaracteristica.startsWith('Color de ojos:')) {
					textoCaracteristica = textoCaracteristica
						.replaceAll('later graying', 'después encanecido')
						.replaceAll('later grising', 'después encanecido')
						.replaceAll('later gray', 'después gris')
						.replaceAll('later white', 'después blanco')
						.replaceAll('later none', 'después sin pelo')
						.replaceAll('blue', 'azul')
						.replaceAll('brown', 'marrón')
						.replaceAll('black', 'negro')
						.replaceAll('yellow', 'amarillo')
						.replaceAll('green', 'verde')
						.replaceAll('red', 'rojo')
						.replaceAll('orange', 'naranja')
						.replaceAll('white', 'blanco')
						.replaceAll('grey', 'gris')
						.replaceAll('gray', 'gris')
						.replaceAll('blond', 'rubio')
						.replaceAll('none', 'sin pelo')
						.replaceAll('n/a', 'no aplicable');
				}

				li.textContent = textoCaracteristica;
				caracteristicasList.appendChild(li);
			});

			currentIndexElement.textContent = index + 1;
			totalImagesElement.textContent = images.length;
		}
	}
};

// Pinta solo el grupo visible en el sidebar para no mostrar todos los personajes a la vez.
const renderSidebarList = () => {
	const sidebarList = getElement('sidebarList');

	if (sidebarList) {
		sidebarList.innerHTML = '';

		if (images.length === 0) {
			const item = document.createElement('li');
			item.className = 'rounded-lg bg-white/10 p-3 text-sm text-blue-100';
			item.textContent = mostrandoFavoritos ? 'No hay favoritos.' : 'No hay personajes.';
			sidebarList.appendChild(item);
		} else {
			const inicio = paginaActual * PERSONAJES_POR_PAGINA;
			const fin = inicio + PERSONAJES_POR_PAGINA;
			const personajesPagina = images.slice(inicio, fin);

			personajesPagina.forEach((img, index) => {
				const indexReal = inicio + index;
				const item = document.createElement('li');
				item.className = 'flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-white/10 hover:text-yellow-300';

				if (indexReal === currentIndex) {
					item.classList.add('bg-white/10', 'font-bold', 'text-yellow-300');
				}

				const thumb = document.createElement('img');
				thumb.src = img.foto;
				thumb.alt = img.title;
				thumb.className = 'h-10 w-10 shrink-0 rounded-lg object-cover shadow-sm';

				const name = document.createElement('span');
				name.className = 'truncate';
				name.textContent = `${indexReal + 1}. ${img.title}`;

				item.appendChild(thumb);
				item.appendChild(name);
				item.addEventListener('click', () => {
					currentIndex = indexReal;
					refreshGallery();
					closeMobileSidebar();
				});

				sidebarList.appendChild(item);
			});
		}

		actualizarGrupo();
	}
};

// Actualiza el texto del grupo actual en la paginación lateral.
const actualizarGrupo = () => {
	const groupInfo = getElement('groupInfo');

	if (groupInfo) {
		const totalPaginas = Math.max(Math.ceil(images.length / PERSONAJES_POR_PAGINA), 1);
		groupInfo.textContent = `Grupo ${paginaActual + 1} / ${totalPaginas}`;
	}
};

// Miniaturas ocultas en el HTML; se deja preparado por si se quieren mostrar después.
const renderThumbnails = () => {
	const thumbnails = getElement('thumbnails');

	if (!thumbnails) {
		return;
	}

	thumbnails.innerHTML = '';

	images.forEach((img, index) => {
		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'aspect-square overflow-hidden rounded-md border-2 border-transparent bg-white shadow-sm transition hover:scale-105';

		if (index === currentIndex) {
			button.classList.add('border-yellow-400', 'ring-2', 'ring-yellow-200');
		}

		const thumb = document.createElement('img');
		thumb.src = img.foto;
		thumb.alt = img.title;
		thumb.className = 'h-full w-full object-cover';

		button.appendChild(thumb);
		button.addEventListener('click', () => {
			currentIndex = index;
			refreshGallery();
		});

		thumbnails.appendChild(button);
	});
};

// Refresca todas las zonas dependientes del personaje actual.
const refreshGallery = () => {
	renderImage(currentIndex);
	renderSidebarList();
	renderThumbnails();
};

// Navegación por personajes: también sincroniza la página lateral.
const goToPrevious = () => {
	if (images.length === 0) {
		return;
	}

	currentIndex = (currentIndex - 1 + images.length) % images.length;
	paginaActual = Math.floor(currentIndex / PERSONAJES_POR_PAGINA);
	refreshGallery();
};

const goToNext = () => {
	if (images.length === 0) {
		return;
	}

	currentIndex = (currentIndex + 1) % images.length;
	paginaActual = Math.floor(currentIndex / PERSONAJES_POR_PAGINA);
	refreshGallery();
};

const grupoAnterior = () => {
	if (paginaActual > 0) {
		paginaActual--;
		currentIndex = paginaActual * PERSONAJES_POR_PAGINA;
		refreshGallery();
	}
};

const grupoSiguiente = () => {
	const totalPaginas = Math.ceil(images.length / PERSONAJES_POR_PAGINA);

	if (paginaActual < totalPaginas - 1) {
		paginaActual++;
		currentIndex = paginaActual * PERSONAJES_POR_PAGINA;
		refreshGallery();
	}
};

// Control del autoplay usando setInterval y guardando el id para poder detenerlo.
const setAutoplayState = (isPlaying) => {
	autoplay = isPlaying;

	if (temporizadorId !== null) {
		clearInterval(temporizadorId);
		temporizadorId = null;
	}

	if (autoplay) {
		temporizadorId = setInterval(goToNext, 3000);
	}

	setPlayIcon();
};

// En móvil el sidebar se oculta después de seleccionar o cerrar.
const closeMobileSidebar = () => {
	const sidebarMenu = getElement('sidebarMenu');

	if (sidebarMenu && window.innerWidth < 1024) {
		sidebarMenu.classList.add('-translate-x-full');
	}
};

// Punto de entrada: conecta botones, buscador y carga inicial de datos.
document.addEventListener('DOMContentLoaded', () => {
	const autoplayBtn = getElement('autoplayBtn');
	const autoplayBtnMobile = getElement('autoplayBtnMobileHeader');
	const prevBtn = getElement('prevBtn');
	const nextBtn = getElement('nextBtn');
	const favoriteBtn = getElement('favoriteBtn');
	const prevGroupBtn = getElement('prevGroupBtn');
	const nextGroupBtn = getElement('nextGroupBtn');
	const searchInput = getElement('searchInput');
	const showFavoritesBtn = getElement('showFavoritesBtn');
	const showAllBtn = getElement('showAllBtn');
	const sidebarMenu = getElement('sidebarMenu');
	const openSidebarBtn = getElement('openSidebarBtn');
	const closeSidebarBtn = getElement('closeSidebarBtn');

	cargarPersonajes();

	if (autoplayBtn) {
		autoplayBtn.addEventListener('click', () => setAutoplayState(!autoplay));
	}

	if (autoplayBtnMobile) {
		autoplayBtnMobile.addEventListener('click', () => setAutoplayState(!autoplay));
	}

	if (prevBtn) {
		prevBtn.addEventListener('click', goToPrevious);
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', goToNext);
	}

	if (favoriteBtn) {
		favoriteBtn.addEventListener('click', agregarFavorito);
	}

	if (prevGroupBtn) {
		prevGroupBtn.addEventListener('click', grupoAnterior);
	}

	if (nextGroupBtn) {
		nextGroupBtn.addEventListener('click', grupoSiguiente);
	}

	if (searchInput) {
		searchInput.addEventListener('input', (event) => buscarPersonaje(event.target.value));
	}

	if (showFavoritesBtn) {
		showFavoritesBtn.addEventListener('click', mostrarFavoritos);
	}

	if (showAllBtn) {
		showAllBtn.addEventListener('click', mostrarTodos);
	}

	if (sidebarMenu && openSidebarBtn && closeSidebarBtn) {
		openSidebarBtn.addEventListener('click', () => {
			sidebarMenu.classList.remove('-translate-x-full');
		});

		closeSidebarBtn.addEventListener('click', closeMobileSidebar);

		document.addEventListener('click', (event) => {
			if (window.innerWidth >= 1024) {
				return;
			}

			if (!sidebarMenu.contains(event.target) && !openSidebarBtn.contains(event.target)) {
				closeMobileSidebar();
			}
		});
	}
});
