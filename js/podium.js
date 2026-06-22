const corredores = ["Ana", "Luis", "María", "Pedro", "Sofía"];

// ESCRIBE TU DESTRUCTURACIÓN AQUÍ 👇

// Destructuracion de arrays:
// Usamos corchetes [] porque "corredores" es un array.
// Los valores se extraen por posicion, de izquierda a derecha.
// oro recibe el primer valor: "Ana".
// plata recibe el segundo valor: "Luis".
// bronce recibe el tercer valor: "María".
// Los valores restantes, "Pedro" y "Sofia", no se guardan en ninguna variable.
const [oro, plata, bronce] = corredores;

console.log(oro, plata, bronce); // Debe mostrar por consola: Ana Luis María
