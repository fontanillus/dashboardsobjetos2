const config = {
  tema: "oscuro",
  // El idioma no viene aquí
};

// ESCRIBE TU DESTRUCTURACIÓN AQUÍ 👇

// Destructuracion de objetos con valor por defecto:
// Usamos llaves {} porque "config" es un objeto.
// tema existe dentro del objeto, por eso toma el valor "oscuro".
// idioma no existe dentro del objeto.
// Al escribir idioma = "es", le damos un valor por defecto.
// Si idioma no viene en config, JavaScript usa "es".
const { tema, idioma = "es" } = config;

console.log(tema, idioma); // Debe mostrar por consola: oscuro es
