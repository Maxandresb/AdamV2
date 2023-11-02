//notificaciones.js
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import { Platform } from 'react-native';

// Configura el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configura el canal de notificaciones para Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX, // Establece la importancia al máximo
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

function calcularProximaFecha(dia, hora) {
  if (dia.includes('Unico')) {
    // Obtén la fecha y hora actuales
    let ahora = new Date();

    // Crea un nuevo objeto Date con la fecha actual y la hora del recordatorio
    let proximaFecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), hora.split(':')[0], hora.split(':')[1]);

    // Si la hora del recordatorio ya pasó, configura la próxima fecha para la misma fecha pero a la siguiente semana
    if (ahora > proximaFecha) {
      proximaFecha.setDate(proximaFecha.getDate() + 7);
    }

    return proximaFecha;
  } else {
    // Array de los días de la semana en minúsculas
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    // Convierte el día de la semana a minúsculas
    dia = dia.toLowerCase();

    // Obtiene el índice del día de la semana
    let indiceDia = diasSemana.indexOf(dia);

    let timezoneOffset = new Date().getTimezoneOffset();
    // Crea un nuevo objeto Date para la fecha actual
    let fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() - timezoneOffset);

    // Calcula cuántos días faltan hasta el próximo día deseado
    let diasHastaProximo = (indiceDia - fecha.getDay() + 7) % 7;

    // Añade ese número de días a la fecha actual
    fecha.setDate(fecha.getDate() + diasHastaProximo);

    // Configura la hora de la fecha a la hora del recordatorio
    fecha.setHours(hora.split(':')[0], hora.split(':')[1], 0, 0);

    return fecha;
  }
}
export { calcularProximaFecha };


async function scheduleRecordatorioNotification(recordatorio) {

  // Verifica los permisos de notificación
  let permissions = await Notifications.getPermissionsAsync();
  console.log('Permisos de notificación: ', permissions);

  // Solicita permisos de notificación si aún no se han concedido
  if (!permissions.granted) {
    await Notifications.requestPermissionsAsync();
  }

  // Desestructurando los datos del recordatorio
  const { Descripcion, Dias, Fecha, Hora, Titulo } = recordatorio;
  console.log('Dias: ', Dias)
  console.log('Fecha: ', Fecha)
  console.log('Hora: ', Hora)


  // Comprobar si Dias es una cadena de texto y convertirlo en un array si es así
  let dias = typeof Dias === 'string' ? [Dias] : Dias;

  // Programa una notificación para cada día
  for (let i = 0; i < dias.length; i++) {
    let proximaFecha;

    // Si Dias es 'Unico', usa la Fecha y Hora proporcionadas en el recordatorio
    if (dias[i] === 'Unico') {
      console.log('UNICOO')
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
      // Calcula la próxima fecha que corresponde a este día de la semana
      proximaFecha = calcularProximaFecha(dias[i], Hora);
    }

    // Configura el contenido de la notificación
    let content = {
      sound: 'default',
      title: Titulo,
      body: Descripcion,
      data: { data: 'aun en trabajo' },
    };

    // Obtén la fecha y hora actuales
    let timezoneOffset = new Date().getTimezoneOffset();
    let ahora =  new Date()
    ahora.setMinutes(ahora.getMinutes() - timezoneOffset);
    // Calcula la diferencia en milisegundos entre la próxima fecha y la fecha y hora actuales
    // valueOf() devuelve el tiempo en milisegundos pero relativo a la zona horaria local, en lugar de getTime()
    let diferencia = proximaFecha.valueOf() - ahora.valueOf();
    // Convierte la diferencia a segundos
    let segundos = diferencia / 1000;
    // Configura el disparador de la notificación
    let trigger = {
      seconds: segundos,
      repeats: dias[i] !== 'Unico' // Repite solo si el día no es 'Unico'
    };

    console.log('prox fecha: ', proximaFecha)
    console.log('ahora: ', ahora)
    console.log(' proximaFecha: ', proximaFecha)
    console.log('ahora.valueOf(): ', ahora.valueOf())
    console.log(' proximaFecha.valueOf(): ', proximaFecha.valueOf())
    console.log('diferencia: ', diferencia)
    console.log('segundos: ', segundos)

    // Programa la notificación para esta fecha
    await Notifications.scheduleNotificationAsync({ content, trigger });
    // Verifica si la notificación se programó correctamente
    let scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Notificaciones programadas: ', scheduledNotifications);
  }
}

export { scheduleRecordatorioNotification };


// Añade un escuchador para las respuestas a las notificaciones
Notifications.addNotificationResponseReceivedListener(async response => {
  // Obtiene los datos de la notificación
  let data = response.notification.request.content.data;

  // Comprueba si el día es 'unico'
  if (data.dias[0] !== 'Unico') {
    // Si no es 'unico', recalcula la próxima fecha para ese recordatorio y programa una nueva notificación para esa fecha
    let proximaFecha = calcularProximaFecha(data.dias);
    // Reprograma la notificación para la próxima fecha
    await Notifications.scheduleNotificationAsync({
      content: {
        sound: 'default',
        title: data.Titulo,
        body: data.Descripcion,
        data: { data: 'aun en trabajo' },
      },
      trigger: proximaFecha,
    });
  }
});




