// Temporizador.js

let temporizadorAlerta = null;

export function iniciarTemporizador(funcionAlerta, tiempoEspera) {
    temporizadorAlerta = setTimeout(() => {
        funcionAlerta();
    }, tiempoEspera);
}

export function detenerTemporizador() {
    clearTimeout(temporizadorAlerta);
}
