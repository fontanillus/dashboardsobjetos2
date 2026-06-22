const vacante = {
  title: "Frontend Dev",
  salary: 45000,
  remote: true
};

// ESCRIBE TU DESTRUCTURACIÓN AQUÍ 👇

// Destructuracion de objetos con alias:
// Usamos llaves {} porque "vacante" es un objeto.
// La API usa nombres en ingles: title y salary.
// Con title: titulo extraemos title, pero la variable nueva se llama titulo.
// Con salary: salario extraemos salary, pero la variable nueva se llama salario.
// remote existe en el objeto, pero no lo necesitamos en este ejercicio.
const { title: titulo, salary: salario } = vacante;

console.log(titulo, salario); // Debe mostrar por consola: Frontend Dev 45000
