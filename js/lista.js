// Array principal: guarda objetos, no strings.
// Cada objeto tiene esta forma:
// { producto: "PAN", cantidad: 2, precio: 1.50 }
let carrito = [];
const CLAVE_CARRITO = "listaComprasCarrito";

// NOTA RAPIDA SOBRE BUSQUEDAS EN ARRAYS DE OBJETOS:
// - find(): devuelve el primer objeto que cumple la condicion.
// - filter(): devuelve todos los objetos que cumplen la condicion.
// - findIndex(): devuelve la posicion del primer objeto que cumple la condicion.

// Referencias a los elementos del HTML que se usan en el código.
const INPUT = document.getElementById("producto-input");
const INPUT_CANTIDAD = document.getElementById("cantidad-input");
const INPUT_PRECIO = document.getElementById("precio-input");
const LISTA = document.getElementById("lista-compras");
const PRODUCTOS = document.getElementById("num-prod");
const MENSAJE = document.getElementById("mensaje");
const INPUT_POSICION = document.getElementById("inputPosicion");
const BOTON_AGREGAR = document.getElementById("btnAgregar");
const BOTON_ELIMINAR = document.getElementById("btnEliminar");
const BOTON_VACIAR = document.getElementById("btnVaciar");
const BOTON_TOTAL = document.getElementById("btnTotal");

// Convierte un numero a texto con formato monetario europeo.
function formatearEuros(valor) {
  return "€" + valor.toFixed(2);
}

// Nota de estudio sobre LocalStorage:
// localStorage solo guarda texto. Por eso convertimos el array de objetos a JSON
// con JSON.stringify al guardar, y lo recuperamos con JSON.parse al cargar.
function guardarCarritoEnLocalStorage() {
  if (carrito.length === 0) {
    localStorage.removeItem(CLAVE_CARRITO);
    return;
  }

  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

  if (!carritoGuardado) {
    return [];
  }

  try {
    const datos = JSON.parse(carritoGuardado);

    if (!Array.isArray(datos)) {
      localStorage.removeItem(CLAVE_CARRITO);
      return [];
    }

    return datos.filter(function (item) {
      return (
        item &&
        typeof item.producto === "string" &&
        Number.isInteger(item.cantidad) &&
        Number.isFinite(item.precio)
      );
    });
  } catch {
    localStorage.removeItem(CLAVE_CARRITO);
    return [];
  }
}

// Redibuja la lista visual completa leyendo el array carrito.
// Se llama cada vez que el array cambia para mantener la UI sincronizada.
function renderizarLista() {
  LISTA.innerHTML = "";

  // forEach recorre el array y crea un <li> por cada producto con su precio.
  carrito.forEach(function (item, indice) {
    const elemento = document.createElement("li");
    elemento.id = String(indice);
    const posicionVisible = indice + 1;
    elemento.textContent =
      posicionVisible +
      ". " +
      item.producto +
      " | Cantidad: " +
      item.cantidad +
      " | Precio estimado: " +
      formatearEuros(item.precio) +
      " | Subtotal: " +
      formatearEuros(item.precio * item.cantidad);
    elemento.className = "rounded-xl border border-purple-200/25 bg-purple-900/35 px-3 py-2 font-semibold text-white shadow-sm";
    LISTA.appendChild(elemento);
  });

  // Actualiza el contador de productos mostrado en el resumen.
  PRODUCTOS.textContent = String(carrito.length);
}

function agregar() {
  // trim() quita espacios, toUpperCase() evita duplicados por mayúsculas/minúsculas.
  const producto = INPUT.value.trim().toUpperCase();
  const cantidad = INPUT_CANTIDAD ? Number(INPUT_CANTIDAD.value) : 0;
  const entradaPrecio = INPUT_PRECIO ? INPUT_PRECIO.value.trim().replace(",", ".") : "";
  const precio = Number(entradaPrecio);

  // Nota de estudio:
  // Como carrito guarda objetos, no podemos buscar duplicados con indexOf("PAN").
  // Usamos findIndex para revisar la propiedad producto dentro de cada objeto.
  // Si devuelve -1, no existe; si devuelve 0 o mas, el producto ya esta en la lista.
  const posicionExistente = carrito.findIndex(function (item) {
    return item.producto === producto;
  });

  // Validacion: el nombre del producto no puede ir vacio.
  if (producto === "") {
    MENSAJE.textContent = "Escribe algo primero.";
    INPUT.focus();
    return;
  }

  // Validacion para estudio:
  // Number.isInteger comprueba que la cantidad sea un numero entero.
  // No aceptamos 0, negativos ni decimales porque hablamos de unidades a comprar.
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    MENSAJE.textContent = "Debes indicar una cantidad valida mayor que 0.";
    if (INPUT_CANTIDAD) {
      INPUT_CANTIDAD.focus();
    }
    return;
  }

  // Validacion: solo aceptamos precios numericos mayores que 0.
  if (!Number.isFinite(precio) || precio <= 0) {
    MENSAJE.textContent = "Debes indicar un precio valido mayor que 0.";
    if (INPUT_PRECIO) {
      INPUT_PRECIO.focus();
    }
    return;
  }

  // Si findIndex encontro una posicion, no anadimos el producto repetido.
  if (posicionExistente !== -1) {
    MENSAJE.textContent = "Producto ya anadido a la lista.";
    INPUT.focus();
    return;
  }

  // push() añade un objeto con producto y precio al final del array.
  // Nota de estudio:
  // El array carrito guarda objetos, no strings.
  // Asi cada producto mantiene juntos sus datos relacionados.
  carrito.push({
    producto: producto,
    cantidad: cantidad,
    precio: precio
  });
  guardarCarritoEnLocalStorage();
  renderizarLista();
  MENSAJE.textContent =
    "Ultimo producto agregado: " +
    producto +
    " x" +
    cantidad +
    " (" +
    formatearEuros(precio) +
    " cada uno)";
  INPUT.value = "";
  if (INPUT_CANTIDAD) {
    INPUT_CANTIDAD.value = "";
  }
  if (INPUT_PRECIO) {
    INPUT_PRECIO.value = "";
  }
  INPUT.focus();
}

function eliminarPorPosicion() {
  // Si no hay elementos, no hay nada que eliminar.
  if (carrito.length === 0) {
    MENSAJE.textContent = "El carrito ya esta vacio.";
    if (INPUT_POSICION) {
      INPUT_POSICION.value = "";
    }
    return;
  }

  const entrada = INPUT_POSICION ? INPUT_POSICION.value.trim() : "";

  // El usuario ve posiciones desde 1, pero el array empieza en 0.
  const posicionUsuario = Number(entrada);
  const esEntero = Number.isInteger(posicionUsuario);

  if (!esEntero || posicionUsuario < 1 || posicionUsuario > carrito.length) {
    MENSAJE.textContent = "Debes indicar una posicion valida entre 1 y " + carrito.length + ".";
    if (INPUT_POSICION) {
      INPUT_POSICION.focus();
    }
    return;
  }

  // Convertimos la posición del usuario (1..n) al índice del array (0..n-1).
  const posicionArray = posicionUsuario - 1;
  const itemEliminado = carrito[posicionArray];

  // slice + concat construyen un nuevo array sin el elemento eliminado
  // (equivale a splice pero sin mutar el array original directamente).
  carrito = carrito.slice(0, posicionArray).concat(carrito.slice(posicionArray + 1));
  guardarCarritoEnLocalStorage();
  renderizarLista();
  MENSAJE.textContent =
    "Producto eliminado: " +
    itemEliminado.producto +
    " x" +
    itemEliminado.cantidad +
    " (" +
    formatearEuros(itemEliminado.precio) +
    " cada uno).";
  if (INPUT_POSICION) {
    INPUT_POSICION.value = "";
    INPUT_POSICION.focus();
  }
}

function vaciarCarrito() {
  // Evita hacer trabajo innecesario cuando ya esta vacio.
  if (carrito.length === 0) {
    localStorage.removeItem(CLAVE_CARRITO);
    INPUT.value = "";
    if (INPUT_CANTIDAD) {
      INPUT_CANTIDAD.value = "";
    }
    if (INPUT_PRECIO) {
      INPUT_PRECIO.value = "";
    }
    MENSAJE.textContent = "El carrito ya esta vacio.";
    INPUT.focus();
    return;
  }

  // Resetea el array asignándolo vacío: todos los productos desaparecen.
  carrito = [];
  localStorage.removeItem(CLAVE_CARRITO);
  renderizarLista();
  INPUT.value = "";
  if (INPUT_CANTIDAD) {
    INPUT_CANTIDAD.value = "";
  }
  if (INPUT_PRECIO) {
    INPUT_PRECIO.value = "";
  }
  if (INPUT_POSICION) {
    INPUT_POSICION.value = "";
  }
  MENSAJE.textContent = "El carrito se ha vaciado.";
  INPUT.focus();
}

function totalCompras() {
  // El total solo tiene sentido cuando hay productos cargados.
  if (carrito.length === 0) {
    MENSAJE.textContent = "No hay productos para calcular el estimado.";
    return;
  }

  let total = 0;

  // Nota de estudio:
  // Como cada objeto tiene cantidad y precio, el subtotal se calcula multiplicando.
  // Ejemplo: 3 panes x 1.20 EUR = 3.60 EUR.
  for (const item of carrito) {
    total += item.precio * item.cantidad;
  }

  MENSAJE.textContent = "Importe estimado: " + formatearEuros(total);
}

// Enlazamos cada boton con su accion principal.
if (BOTON_AGREGAR) {
  BOTON_AGREGAR.addEventListener("click", agregar);
}

if (BOTON_ELIMINAR) {
  BOTON_ELIMINAR.addEventListener("click", eliminarPorPosicion);
}

if (BOTON_VACIAR) {
  BOTON_VACIAR.addEventListener("click", vaciarCarrito);
}

if (BOTON_TOTAL) {
  BOTON_TOTAL.addEventListener("click", totalCompras);
}

// Atajos de teclado con Enter para acelerar el flujo.
if (INPUT) {
  INPUT.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      agregar();
    }
  });
}

if (INPUT_POSICION) {
  INPUT_POSICION.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      eliminarPorPosicion();
    }
  });
}

if (INPUT_PRECIO) {
  INPUT_PRECIO.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      agregar();
    }
  });
}

if (INPUT_CANTIDAD) {
  INPUT_CANTIDAD.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
      agregar();
    }
  });
}

// Al cargar la pagina, recuperamos lo guardado antes de pintar la lista.
carrito = cargarCarritoDesdeLocalStorage();

// Render inicial al cargar la pagina.
renderizarLista();
