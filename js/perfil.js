// Objeto con los datos de un usuario.
// Un objeto guarda datos en formato propiedad: valor.
const usuario = {
  nombre: "Carlos",
  edad: 28,
  pais: "Espa\u00f1a",
  profesion: "Desarrollador"
};

// Destructuracion de objetos:
// Usamos llaves {} porque "usuario" es un objeto.
// Los nombres dentro de las llaves deben coincidir con las propiedades del objeto.
// En este caso se crean tres variables: nombre, edad y pais.
// Si fuera un array, usariamos corchetes [].
const { nombre, edad, pais } = usuario;

// Mostramos las variables en la consola del navegador.
// Debe mostrar: Carlos 28 Espana, con la n correcta de Espana.
console.log(nombre, edad, pais);
