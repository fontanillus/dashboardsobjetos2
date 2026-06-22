const cliente = {
  id: "CLI-992",
  nombre: "Laura",
  direccion: {
    ciudad: "Barcelona",
    codigoPostal: "08001",
    pais: "España"
  }
};

// ESCRIBE TU DESTRUCTURACIÓN AQUÍ 👇
// Destructuracion de objetos anidados:
// Usamos llaves {} porque "cliente" es un objeto.
// Extraemos nombre directamente desde cliente.
// Para acceder a ciudad y pais, entramos dentro del objeto direccion.
// El resultado son tres variables: nombre, ciudad y pais.
// codigoPostal existe, pero no se extrae porque no lo pide el ejercicio.
const { nombre, direccion: { ciudad, pais } } = cliente;

console.log(nombre, ciudad, pais); // Debe mostrar por consola: Laura Barcelona España
