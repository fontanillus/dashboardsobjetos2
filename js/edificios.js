class Edificio {

	// Propiedades privadas: solo se pueden usar dentro de esta clase.
	#nombre;
	#plantas;

	// Constructor: crea un edificio nuevo con nombre, plantas y superficie.
	constructor(nombre, plantas, superficie) {
		this.#nombre = nombre;
		this.#plantas = plantas;
		this.superficie = superficie;
	}

	// GETTERS: permiten consultar valores privados desde fuera.
	get nombre() {
		return this.#nombre;
	}

	get plantas() {
		return this.#plantas;
	}

	// Getter para consultar la superficie actual.
	get superficieActual() {
		return this.superficie;
	}

	// Setter: cambia la superficie solo si el nuevo valor es positivo.
	set superficieActual(nuevaSuperficie) {
		if (nuevaSuperficie > 0) {
			this.superficie = nuevaSuperficie;
		}
	}

	// Calcula los minutos necesarios para limpiar el edificio.
	limpiar() {

		// Cada 5 m² suman 1 minuto de limpieza.
		const tiempoSuperficie = this.superficie / 5;

		// Cada planta extra suma medio minuto.
		const tiempoPlantas = (this.#plantas - 1) * 0.5;

		return tiempoSuperficie + tiempoPlantas;
	}

	// Calcula el coste mensual usando el tiempo diario de limpieza.
	costeMensual() {

		const costeDiario = this.limpiar();

		return costeDiario * 30;
	}

	// Devuelve un texto resumen con todos los datos del edificio.
	toString() {

		return `
			Edificio: ${this.#nombre}
			Plantas: ${this.#plantas}
			Superficie: ${this.superficie} m²
			Tiempo limpieza: ${this.limpiar()} min
			Coste mensual: ${this.costeMensual()} €
		`;
	}
}
