//notificaciones.js
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import { Platform } from 'react-native';
import { guardarIdsNotificacionesSD, guardarFechaSD, contarRecordatorios } from '../api/sqlite';

//****************************** NOTIFICACIONES DE DOLENCIAS DIARIAS ************************
// Programa una notificación para los próximos 30 días
export async function generarNotificacionDolencias() {
  let idsNotificaciones = [];
  for (let i = 1; i <= 30; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(12);
    date.setMinutes(0);
    date.setSeconds(0);

    const trigger = date.getTime();
    try {
      let notification = await Notifications.scheduleNotificationAsync({
        content: {
          sound: 'default',
          title: '¿Tienes una nueva dolencia o malestar?',
          body: 'Toca aquí si deseas registrarla, esto ayuda a los profesionales de la salud a entender tu caso conocer tu evolucion',
          data: {
            navigateTo: 'agenda-dolencias',
            tipoNotificacion: 'dolencias',
          },
        },
        trigger,
      });
      idsNotificaciones.push(notification);
    } catch (error) {
      console.error('Error al programar notificación:', error);
    }
    // console.log('Notificacion creada exitosamente');
  }
  // await MostrarNotificacionesGuardadas()
  return idsNotificaciones;
}






//****************************** NOTIFICACIONES DE MEDICAMENTOS************************
// Función para programar las notificaciones de los medicamentos
function convertirAFormato24Horas(horarios) {
  console.log('horarios en convertirAFormato24Horas: ', horarios)
  try {
    const horariosTransformados = [];

    for (let horario of horarios) {
      //console.log('horario: ',horario);
      try {
        const [horaMinuto, ampm] = horario.split(" ");
        const [ap, mm] = ampm.split(".");
        const [hora, minutos] = horaMinuto.split(":");
        /*
        console.log('horaMinuto: ',horaMinuto);
        console.log('ampm: ',ampm);
        console.log('ap: ',ap);
        console.log('hora: ',hora);
        console.log('minutos: ',minutos);*/

        let horas24 = Number(hora);
        //console.log('hora: ',hora);
        if (ap.toLowerCase() === 'p' && horas24 < 12) {
          horas24 += 12;
          //console.log('pm horas24 < 12: ', horas24);
          const horaTransformada = `${horas24.toString().padStart(2, '0')}:${minutos}`;
          //console.log(`Horario ${horario} transformado a ${horaTransformada}`);
          horariosTransformados.push(horaTransformada);
        } else if (ap.toLowerCase() === 'p' && horas24 === 12) {
          //console.log('pm horas24 === 12: ', horas24);
          const horaTransformada = `${horas24.toString().padStart(2, '0')}:${minutos}`;
          //console.log(`Horario ${horario} transformado a ${horaTransformada}`);
          horariosTransformados.push(horaTransformada);
        } else if (ap.toLowerCase() === 'a' && horas24 === 12) {
          horas24 = 0;
          //console.log('am horas24 === 12: ', horas24);
          const horaTransformada = `${horas24.toString().padStart(2, '0')}:${minutos}`;
          //console.log(`Horario ${horario} transformado a ${horaTransformada}`);
          horariosTransformados.push(horaTransformada);
        } else if (ap.toLowerCase() === 'a' && horas24 < 12) {
          //console.log('am horas24 < 12: ', horas24);
          const horaTransformada = `${horas24.toString().padStart(2, '0')}:${minutos}`;
          //console.log(`Horario ${horario} transformado a ${horaTransformada}`);
          horariosTransformados.push(horaTransformada);
        } else {
          //console.log('HORA NO TRANSFORMADA');
          horariosTransformados.push('ERROR al transformar la hora');

        }
      } catch (error) {
        console.error(`Error al procesar el horario "${horario}": ${error.message}`);
        horariosTransformados.push(null);
      }
    }
    return horariosTransformados;
  } catch (error) {
    console.error('Error al convertir horarios:', error);
    return [];
  }
}

export function calcularSegundosHastaProximoHorario(horaCompleta) {
  let timezoneOffset = new Date().getTimezoneOffset();
  let ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - timezoneOffset);

  let [hora, minutos] = horaCompleta.split(":");
  let fechaHorario = new Date(Date.UTC(ahora.getUTCFullYear(), ahora.getUTCMonth(), ahora.getUTCDate(), Number(hora), Number(minutos), 0));

  if (fechaHorario < ahora) {
    console.log('HORA A PROGRAMAR YA PASO');
    fechaHorario.setUTCDate(fechaHorario.getUTCDate() + 1);
  }

  let diferenciaMiliSegundos = fechaHorario - ahora;
  let totalSegundos = diferenciaMiliSegundos / 1000;

  console.log(' horaCompleta: ', horaCompleta)
  console.log('=> segundos: ', totalSegundos)
  console.log('==> hora actual: ', ahora)
  console.log('===> horario a programar notificacion: ', fechaHorario)

  return totalSegundos;
};


async function programarNotificacionMedica(medicamento) {
  console.log('=> medicamento en programarNotificacionMedica: ', medicamento)

  // Verifica los permisos de notificación
  console.log(`\n\ ***** \n\ `);
  let permissions = await Notifications.getPermissionsAsync();
  console.log('Permisos de notificación: ', permissions);
  // Solicita permisos de notificación si aún no se han concedido
  if (!permissions.granted) {
    await Notifications.requestPermissionsAsync();
  }
  console.log(`\n\ ***** \n\ `);
  // Convierte los horarios a formato de 24 horas
  const horarios = medicamento.medicamento.horarios.split('  '); // Dividir por espacios para obtener la lista de horarios
  const horarios24 = convertirAFormato24Horas(horarios);
  console.log('horarios24: ', horarios24)
  console.log(`\n\ ***** \n\ `);

  let idsNotificaciones = [];
  for (let horario of horarios24) {
    // Configura el contenido de la notificación
    let content = {
      sound: true,
      title: `Recuerda tomar el medicamento ${medicamento.medicamento.medicamento}`,
      body: `La dosis es ${medicamento.medicamento.dosis} \n\ Los horarios en los que debes tomar este medicamento son: ${medicamento.medicamento.horarios} \n\ Haga clic en esta notificación para garantizar el correcto funcionamiento de la función. `,
      data: {
        navigateTo: 'medicamentos',
        tipoNotificacion: 'medicamento',
        horarioMedicamento: horario,
        idMedicamento: medicamento.medicamento.id
      }
    };
    //obtener hora local actual, hora del horario, seg a minutos
    let segundos = calcularSegundosHastaProximoHorario(horario)
    let trigger = {
      seconds: segundos,
      //repeats: true
    };
    try {
      // Programa la notificación para esta fecha
      let notification = await Notifications.scheduleNotificationAsync({ content, trigger });
      console.log('ID-NOTIFICATION CREADO DESDE LA FUNCION scheduleNotificationAsync:', notification)


      idsNotificaciones.push(notification);
    } catch (error) {
      console.error('Error al programar notificación:', error);
      idsNotificaciones.push('ERROR'); // marcador de error en las notificaciones
    }
  }
  console.log(`\n\ ***** \n\ `);
  // Verifica si las notificaciones se programaron correctamente
  await MostrarNotificacionesGuardadas()
  // Filtrar las notificaciones fallidas para mantener solo las exitosas
  idsNotificaciones = idsNotificaciones.filter(notification => notification !== null);
  return idsNotificaciones;
}
export { programarNotificacionMedica };



//****************************** NOTIFICACIONES DE RECORDATORIOS************************
export function calcularProximaFecha(dia, hora) {
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  let timezoneOffset = new Date().getTimezoneOffset();
  let ahora = new Date()

  let [horaRecordatorio, minutoRecordatorio] = hora.split(':').map(Number);
  let proximaFecha;

  dia = dia.toLowerCase();
  if (diasSemana.includes(dia)) {
    let indiceDia = diasSemana.indexOf(dia);
    let diasHastaProximo = (indiceDia - ahora.getDay() + 7) % 7;
    proximaFecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + diasHastaProximo, horaRecordatorio, minutoRecordatorio - timezoneOffset);
    return proximaFecha;
  } else {
    console.log(`VALOR INCORRECTO INGRESADO: ${dia}`);
  }
}



export async function MostrarNotificacionesGuardadas() {
  let scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`Notificaciones programadas: \n\ `, scheduledNotifications);
}

export async function scheduleRecordatorioNotification(recordatorio, idRecordatorio) {
  // Configura el canal de notificaciones para Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX, // Establece la importancia al máximo
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  // Configura el manejador de notificaciones
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  console.log('recordatorio: ', recordatorio)
  // Verifica los permisos de notificación
  let permissions = await Notifications.getPermissionsAsync();
  console.log('Permisos de notificación: ', permissions);

  // Solicita permisos de notificación si aún no se han concedido
  if (!permissions.granted) {
    await Notifications.requestPermissionsAsync();
  }

  // Desestructurando los datos del recordatorio
  const { Descripcion, Dias, Fecha, Hora, Titulo } = recordatorio;
  console.log('Descripcion, Dias, Fecha, Hora, Titulo: ', Descripcion, Dias, Fecha, Hora, Titulo)
  // recordatorio idNotificacion
  let idNot = 'vacio'
  let idRec = idRecordatorio
  let cantRecordatorios;
  if (idRec === 'vacio') {
    try {
      cantRecordatorios = await contarRecordatorios()
      console.log('cantidad de recordatorios: ', cantRecordatorios);
      idRec = cantRecordatorios + 1
    } catch (error) {
      console.log('error al contar los recordatorios');
    }

  }
  console.log('idNotificacion: ', idNot)
  console.log('idRecordatorio: ', idRec)

  // Comprobar si Dias es una cadena de texto y convertirlo en un array si es así
  let dias = typeof Dias === 'string' ? Dias.split(',') : Dias;
  console.log(dias)

  let notificacionesIds = [];
  // Programa una notificación para cada día
  for (let i = 0; i < dias.length; i++) {
    let proximaFecha;

    // Si Dias es 'Unico', usa la Fecha y Hora proporcionadas en el recordatorio
    if (dias[i] === 'Unico') {
      console.log('RECORDATORIO UNICO')
      // Convierte la fecha y hora a la zona horaria local
      let [year, month, day] = Fecha.split('-').map(Number);
      let [hour, minute] = Hora.split(':').map(Number);
      // Obtener diferencia de zona horaria en MINUTOS, no horas
      let timezoneOffset = new Date().getTimezoneOffset();
      console.log('timezoneOffset: ', timezoneOffset)
      // Restar minutos, no horas
      proximaFecha = new Date(year, month - 1, day, hour, minute - timezoneOffset);
      console.log('prox fec: ', proximaFecha)
    } else {
      console.log('RECORDATORIO REPETITIVO')
      console.log('DIA: ', dias[i]);
      // Calcula la próxima fecha que corresponde a este día de la semana
      proximaFecha = calcularProximaFecha(dias[i].trim(), Hora);
    }

    // Configura el contenido de la notificación
    let content = {
      sound: true,
      title: Titulo,
      body: Descripcion,
      data: {
        navigateTo: 'ADAM',
        tipoNotificacion: 'recordatorio',
        idRecordatorio: idRec,
        idNotificacion: idNot,
        diaRecordar: dias[i],
        horaRecordar: Hora,
      }

    };


    // Calcula la diferencia en segundos entre la próxima fecha y la fecha y hora actuales
    let segundos = calcularDiferenciaSegundos(proximaFecha);
    console.log('prox fecha: ', proximaFecha)
    console.log('segundos: ', segundos)

    // Configura el disparador de la notificación
    let trigger = {
      seconds: segundos,
    };

    // log cntent y trigger
    console.log('content: ', content)
    console.log('trigger: ', trigger)

    // Programa la notificación para esta fecha
    let notification = await Notifications.scheduleNotificationAsync({ content, trigger });

    console.log('ID-NOTIFICATION DESDE LA FUNCION:', notification)
    notificacionesIds.push(notification);
  }
  // Verifica si la notificación se programó correctamente
  await MostrarNotificacionesGuardadas()
  return notificacionesIds;
}

export function calcularDiferenciaSegundos(proximaFecha) {
  // Obtén la fecha y hora actuales
  let timezoneOffset = new Date().getTimezoneOffset();
  let ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - timezoneOffset);
  console.log('ahora: ', ahora)
  // diferencia en milisegundos
  let diferenciaMiliSegundos = proximaFecha - ahora;
  let diferenciaEnSegundos = diferenciaMiliSegundos / 1000;

  return diferenciaEnSegundos;

}

