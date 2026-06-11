// --- SIMULACION DE BASE DE DATOS ---
// Array inicial de objetos Libro; aqui se guardan, modifican y eliminan datos en memoria.
const baseDatosLibros = [
  new Libro("978-0307474728", "Cien años de soledad","Gabriel García Márquez", 15, 19.99),
  new Libro("978-0399589430", "Breves respuestas a las grandes preguntas", "Stephen Hawking", 8, 14.50)
];

// Muestra la tabla inicial en consola para comprobar que los objetos se han creado.
console.table(baseDatosLibros);
