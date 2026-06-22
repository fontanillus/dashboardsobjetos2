const producto = {
  id: "PROD-10",
  precio: 29.99,
  nombre: "Teclado Mec\u00e1nico",
  marca: "Logitech",
  stock: 15
};

// Destructuracion de objetos con REST:
// Extraemos id y precio en variables independientes.
// El operador ...detalles recoge todas las propiedades restantes.
const { id, precio, ...detalles } = producto;

function mostrarResultadoOperadorRest() {
  console.log("Resultado del operador rest:");
  console.log(id, precio); // Debe mostrar por consola: PROD-10 29.99
  console.log(detalles); // Debe mostrar: { nombre: 'Teclado Mecánico', marca: 'Logitech', stock: 15 }
}

mostrarResultadoOperadorRest();
