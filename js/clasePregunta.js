// Plantilla para crear cada pregunta del test.
class Pregunta {
    constructor(texto, opcion1, opcion2, opcion3, opcion4, correcta, justificacion, puntos = 1) {
        this.texto = texto;
        this.opcion1 = opcion1;
        this.opcion2 = opcion2;
        this.opcion3 = opcion3;
        this.opcion4 = opcion4;
        // La respuesta correcta se guarda como indice: 0 = A, 1 = B, 2 = C, 3 = D.
        this.correcta = correcta;
        this.opcionSeleccionada = null;
        this.puntos = puntos;
        this.puntosAsignados = 0;
        this.justificacion = justificacion;
    }

    get opciones() {
        return [this.opcion1, this.opcion2, this.opcion3, this.opcion4];
    }

    verificar() {
        this.puntosAsignados = this.opcionSeleccionada === this.correcta ? this.puntos : 0;
        return this.puntosAsignados === this.puntos;
    }

    static desdeObjeto(objeto) {
        const pregunta = new Pregunta(
            objeto.texto,
            objeto.opcion1,
            objeto.opcion2,
            objeto.opcion3,
            objeto.opcion4,
            objeto.correcta,
            objeto.justificacion,
            objeto.puntos
        );

        pregunta.opcionSeleccionada = objeto.opcionSeleccionada ?? null;
        pregunta.puntosAsignados = objeto.puntosAsignados ?? 0;
        return pregunta;
    }
}
