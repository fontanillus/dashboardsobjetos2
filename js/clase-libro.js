// Clase modelo: define la estructura y acciones basicas de cada libro.
class Libro {
  constructor(isbn, titulo, autor, stock, precio) {
    this.isbn = isbn;
    this.titulo = titulo;
    this.autor = autor;
    this.stock = stock;
    this.precio = precio;
  }

  // Getters: permiten leer los datos sin acceder directamente a las propiedades.
  getIsbn() {
    return this.isbn;
  }

  getTitulo() {
    return this.titulo;
  }

  getAutor() {
    return this.autor;
  }

  getStock() {
    return this.stock;
  }

  getPrecio() {
    return this.precio;
  }

  // En modificar solo cambian stock y precio; titulo, autor e ISBN quedan fijos.
  actualizarStockYPrecio(stock, precio) {
    this.stock = stock;
    this.precio = precio;
  }
}
