// Modelo para guardar los datos que necesita la galería de cada personaje.
class Start {
	#foto;
	#title;
	#descripcion;
	#caracteristicas;

	constructor(foto, title, descripcion, caracteristicas) {
		this.#foto = foto;
		this.#title = title;
		this.#descripcion = descripcion;
		this.#caracteristicas = caracteristicas;
	}

	//permiten leer campos privados sin acceder directamente a ellos.
	get foto() {
		return this.#foto;
	}

	get title() {
		return this.#title;
	}

	get descripcion() {
		return this.#descripcion;
	}

	get caracteristicas() {
		return this.#caracteristicas;
	}

	//toString() define cómo se representa el objeto cuando lo mostramos como texto.
	toString() {
		return `${this.#title} - ${this.#descripcion}`;
	}

	//toJSON() evita que localStorage guarde un objeto vacío al usar campos privados.
	toJSON() {
		return {
			foto: this.#foto,
			title: this.#title,
			descripcion: this.#descripcion,
			caracteristicas: this.#caracteristicas
		};
	}
}
