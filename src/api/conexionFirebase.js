import * as firebase from 'firebase';

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

const configuracionFirebase = {
    apiKey: apiKey, // Aquí debes poner tu clave de API de Firebase
    authDomain: "adam-bd-ayuda.firebaseapp.com", // Esto se compone de tu ID de proyecto seguido de 'firebaseapp.com'
    databaseURL: "https://adam-bd-ayuda-default-rtdb.firebaseio.com", // Esto se compone de 'https://' seguido de tu ID de proyecto, '-default-rtdb.firebaseio.com'
    projectId: "adam-bd-ayuda", // Este es el ID de tu proyecto
    storageBucket: "adam-bd-ayuda.appspot.com", // Esto se compone de tu ID de proyecto seguido de 'appspot.com'
    messagingSenderId: "859635940932", // Aquí debes poner tu ID de remitente de mensajería de Firebase
    appId: "1:859635940932:android:94460d0c061ab328680611" // Este es el ID de tu aplicación
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(configuracionFirebase);
}

// Obtener una referencia a la base de datos
const db = firebase.database();

// Función para guardar los datos del usuario
export function guardarDatosUsuario(usuarioId, nombreUsuario, estadoAyuda, nombreFamiliar, numeroFamiliar) {
    db.ref('usuarios/' + usuarioId).set({
        nombre: nombreUsuario,
        estadoAyuda: estadoAyuda,
        nombreFamiliar: nombreFamiliar,
        numeroFamiliar: numeroFamiliar,
    }, error => {
        if (error) {
            // El registro de datos falló
            console.error("Error al guardar los datos del usuario: ", error);
        } else {
            // Los datos se guardaron correctamente
            console.log("Datos del usuario guardados correctamente.");
        }
    });
}

// Función para leer los datos del usuario
export function leerDatosUsuario(usuarioId) {
    db.ref('usuarios/' + usuarioId).once('value').then((snapshot) => {
        const usuario = snapshot.val();
        // Aquí puedes manejar los datos del usuario
    }).catch(error => {
        // Error al leer los datos
        console.error("Error al leer los datos del usuario: ", error);
    });
}

// Función para registrar un evento de ayuda
export function registrarEventoAyuda(usuarioId) {
    const referencia = db.ref('eventosAyuda/' + usuarioId);
    const evento = {
        timestamp: Date.now(),
        usuarioId: usuarioId,
    };
    referencia.set(evento, error => {
        if (error) {
            // El registro del evento falló
            console.error("Error al registrar el evento de ayuda: ", error);
        } else {
            // El evento se registró correctamente
            console.log("Evento de ayuda registrado correctamente.");
        }
    });
}

// Función para escuchar eventos de ayuda
export function escucharEventosAyuda() {
    const referencia = db.ref('eventosAyuda');
    referencia.on('value', (snapshot) => {
        const eventosAyuda = snapshot.val();
        // Aquí puedes manejar los eventos de ayuda
    }, error => {
        // Error al escuchar los eventos
        console.error("Error al escuchar los eventos de ayuda: ", error);
    });
}
