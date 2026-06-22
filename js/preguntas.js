const preguntasIniciales = [
    // Formato: texto, opcion A, opcion B, opcion C, opcion D, respuesta correcta.
    new Pregunta("¿Qué método se utiliza para guardar datos en LocalStorage?", "getItem()", "setItem()", "saveItem()", "store()", 1, "setItem() guarda un par clave-valor dentro de LocalStorage."),
    new Pregunta("¿Qué devuelve typeof []?", "array", "list", "object", "undefined", 2, "En JavaScript los arrays son objetos, por eso typeof [] devuelve object."),
    new Pregunta("¿Qué palabra clave permite declarar una variable cuyo valor puede cambiar?", "const", "static", "let", "final", 2, "let declara variables que pueden cambiar de valor durante la ejecución."),
    new Pregunta("¿Qué método convierte un objeto en texto JSON?", "JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()", 1, "JSON.stringify() transforma objetos o arrays en cadenas JSON."),
    new Pregunta("¿Qué evento se dispara al hacer clic sobre un botón?", "submit", "hover", "click", "change", 2, "El evento click se ejecuta cuando el usuario pulsa un elemento."),
    new Pregunta("¿Qué método permite seleccionar un elemento por su id?", "querySelectorAll()", "getElementsByClassName()", "getElementById()", "getNode()", 2, "getElementById() busca un único elemento usando su atributo id."),
    new Pregunta("¿Qué estructura se ejecuta al menos una vez?", "while", "for", "if", "do...while", 3, "do...while ejecuta primero el bloque y después comprueba la condición."),
    new Pregunta("¿Qué operador compara valor y tipo?", "=", "==", "===", "!=", 2, "El operador === exige que coincidan el valor y el tipo de dato."),
    new Pregunta("¿Qué método elimina el último elemento de un array?", "shift()", "pop()", "remove()", "delete()", 1, "pop() elimina y devuelve el último elemento de un array."),
    new Pregunta("¿Qué significa DOM?", "Data Object Method", "Document Object Model", "Dynamic Object Manager", "Document Output Method", 1, "DOM significa Document Object Model y representa la página como objetos."),
    new Pregunta("¿Qué método añade un elemento al final de un array?", "add()", "insert()", "push()", "append()", 2, "push() inserta uno o varios elementos al final de un array."),
    new Pregunta("¿Qué devuelve Math.floor(4.8)?", "5", "4.8", "4", "Error", 2, "Math.floor() redondea hacia abajo, por eso 4.8 se convierte en 4."),
    new Pregunta("¿Qué propiedad permite cambiar el contenido HTML de un elemento?", "textContent", "value", "innerHTML", "className", 2, "innerHTML permite leer o escribir contenido HTML dentro de un elemento."),
    new Pregunta("¿Qué método convierte texto JSON en objeto JavaScript?", "JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()", 1, "JSON.parse() interpreta una cadena JSON y la convierte en objeto JavaScript."),
    new Pregunta("¿Qué método elimina elementos duplicados de un array usando Set?", "[...new Set(array)]", "array.unique()", "Set.remove()", "array.clear()", 0, "new Set(array) crea una colección sin duplicados y el spread la convierte otra vez en array."),
    new Pregunta("¿Qué hace el operador spread (...)?", "Duplica variables", "Expande elementos iterables", "Elimina elementos duplicados", "Convierte arrays en objetos", 1, "El spread expande elementos de arrays, strings u otros iterables."),
    new Pregunta("¿Qué estructura es más adecuada cuando conocemos el número de repeticiones?", "if", "while", "switch", "for", 3, "for es ideal cuando se conoce cuántas veces se repetirá el bucle."),
    new Pregunta("¿Qué método se usa para asociar un evento a un elemento?", "addEventListener()", "attachEvent()", "eventListener()", "addEvent()", 0, "addEventListener() registra una función para responder a un evento."),
    new Pregunta("¿Qué palabra clave se utiliza para crear una clase?", "object", "prototype", "constructor", "class", 3, "class define una plantilla para crear objetos con propiedades y métodos."),
    new Pregunta("¿Qué es un getter?", "Un método para modificar datos", "Un método para leer datos", "Una variable privada", "Un constructor", 1, "Un getter permite leer un valor mediante una propiedad calculada o controlada.")
];
