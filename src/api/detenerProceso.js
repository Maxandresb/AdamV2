// archivo cancelToken.js
import axios from 'axios';

let source = axios.CancelToken.source();

export function ObtenerCancelToken() {
    return source.token;
}

export function CancelarLlamada(message) {
    source.cancel(message);
    source = axios.CancelToken.source(); // Crear una nueva instancia para la próxima solicitud
}
