//ayudaNocturna.js
import * as TaskManager from 'expo-task-manager';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import { isWithinInterval, setHours, setMinutes } from 'date-fns';
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('adamdb.db');

const TAREA_SEGUNDO_PLANO = 'TAREA_SEGUNDO_PLANO';
let ultimoValorAcelerometro = null;
const UMBRAL_CAMBIO = 0.2; // Define el umbral de cambio

// Definir la tarea en segundo plano
TaskManager.defineTask(TAREA_SEGUNDO_PLANO, ({ data, error }) => {
    if (error) {
        // Error al recibir los datos del acelerómetro
        console.error("Error en la tarea en segundo plano: ", error);
        return;
    }
    if (data) {
        const { acceleration } = data;
        //console.log('Datos del acelerómetro recibidos: ', acceleration);
    }
});

let subscription = null;

export async function EstadoSeguimiento() {
    try {
        const resultado = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT SeguimientoNocturno FROM Configuracion WHERE id = ?', [1], (tx, results) => {
                    let estado = results.rows.length > 0 ? results.rows.item(0).SeguimientoNocturno : '0';
                    console.log('Estado del seguimiento nocturno obtenido de la base de datos: ', estado);
                    resolve(estado === '1');
                }, (error) => {
                    reject(error);
                });
            });
        });

        if (resultado) {
            console.log('El seguimiento nocturno está activo.');
            Accelerometer.setUpdateInterval(1000); // Actualiza los datos cada 1 segundo
            subscription = Accelerometer.addListener(async (accelerometerData) => {
                await manejarDatosAcelerometro(accelerometerData);
            });
        } else {
            console.log('El seguimiento nocturno está inactivo.');
            if (subscription) {
                subscription.remove();
            }
        }

        return resultado;
    } catch (error) {
        console.log('estado de seguimiento nocturno no definido aun en ayuda: ' + error);
    }
}

// Calcula la magnitud del vector de aceleración
function calcularMagnitud({ x, y, z }) {
    return Math.sqrt(x * x + y * y + z * z);
}

let notificacionEnviada = false;
let notificacionTimer = null;

// Función para manejar los datos del acelerómetro
async function manejarDatosAcelerometro(accelerometerData) {
    //console.log('Inicio de manejarDatosAcelerometro');
    //console.log('Datos del acelerómetro recibidos: ', accelerometerData);

    // Comprobar si estamos dentro del intervalo de tiempo
    const ahora = new Date();
    //console.log('Hora actual: ', ahora);
    let inicioIntervalo = setHours(setMinutes(new Date(), 0), 23); // 11 PM
    let finIntervalo = setHours(setMinutes(new Date(), 0), 8); // 8 AM
    //console.log('Intervalo de tiempo: ', inicioIntervalo, ' - ', finIntervalo);

    // Ajustar inicioIntervalo y finIntervalo de acuerdo a la hora actual
    if (ahora.getHours() >= 23) {
        // Si la hora actual es después de las 11 PM, ajusta inicioIntervalo al día actual y finIntervalo al día siguiente
        inicioIntervalo = setHours(setMinutes(new Date(), 0), 23);
        finIntervalo = setHours(setMinutes(new Date(), 0), 8);
        finIntervalo.setDate(finIntervalo.getDate() + 1);
    } else if (ahora.getHours() < 8) {
        // Si la hora actual es antes de las 8 AM, ajusta inicioIntervalo y finIntervalo al día anterior
        inicioIntervalo = setHours(setMinutes(new Date(), 0), 23);
        inicioIntervalo.setDate(inicioIntervalo.getDate() - 1);
        finIntervalo = setHours(setMinutes(new Date(), 0), 8);
    } else {
        // Si la hora actual es entre las 8 AM y las 11 PM, ajusta inicioIntervalo al día anterior y finIntervalo al día actual
        inicioIntervalo = setHours(setMinutes(new Date(), 0), 23);
        inicioIntervalo.setDate(inicioIntervalo.getDate() - 1);
        finIntervalo = setHours(setMinutes(new Date(), 0), 8);
    }


    if (isWithinInterval(ahora, { start: inicioIntervalo, end: finIntervalo })) {
        //console.log('Dentro del intervalo de tiempo.');

        // Comprobar si los datos del acelerómetro indican un cambio significativo
        if (ultimoValorAcelerometro) {
            const magnitudActual = calcularMagnitud(accelerometerData);
            const magnitudAnterior = calcularMagnitud(ultimoValorAcelerometro);
            const cambio = Math.abs(magnitudActual - magnitudAnterior);
            //console.log('Cambio en los datos del acelerómetro: ', cambio);

            if (cambio > UMBRAL_CAMBIO) {
                // Verificar si ya se envió una notificación
                if (notificacionEnviada) {
                    // Si ya se envió una notificación, no hacer nada
                    return;
                }
                // Si no se ha enviado una notificación, enviarla y actualizar el estado
                notificacionEnviada = true;

                // Configurar temporizador para cambiar notificacionEnviada a false después de 5 minutos
                notificacionTimer = setTimeout(() => {
                    notificacionEnviada = false;
                    notificacionTimer = null; // Limpiar el temporizador
                    console.log('Estado de notificacionEnviada restablecido a false.');
                }, 5 * 60 * 1000); // 5 minutos en milisegundos

                console.log('Cambio detectado en los datos del acelerómetro.');

                // Si los datos indican un cambio, envía una notificación al usuario
                const notificacion = {
                    title: '¿Estás bien?',
                    body: 'Hemos detectado un cambio en tu actividad. ¿Necesitas ayuda?',
                    data: { navigateTo: 'seguimiento-nocturno' },
                };
                console.log('Enviando notificación: ', notificacion);
                try {
                    await Notifications.scheduleNotificationAsync({
                        content: notificacion,
                        trigger: null,
                    });
                } catch (error) {
                    console.log('Error al programar la notificación: ', error);
                }
            }
        }
    }
    ultimoValorAcelerometro = accelerometerData;
    //console.log('Actualización del último valor del acelerómetro: ', ultimoValorAcelerometro);
    //console.log('Fin de manejarDatosAcelerometro');
}


