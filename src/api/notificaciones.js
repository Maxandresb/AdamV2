import * as Notifications from 'expo-notifications';
import { useEffect } from "react";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
export async function scheduleRecordatorioNotification(recordatorio) {
    let data = recordatorio;
    var fecha = data.Fecha.split('-');
    var hora= data.Hora.split(':');
    var year = fecha[0]; 
    var month= fecha[1];
    var day = fecha[2];
    var hour= hora[0];
    var minute= hora[1]
    let trigger =  Date(year,month,day,hour,minute)//.toLocaleTimeString('en-US', {timeZone:'America/Santiago',})   //toLocaleDateString('en-US', {timeZone:'America/Santiago',}).
    console.log(trigger)
    console.log(`${year}  : ${month} : ${day}  : ${hour} : ${minute}`)
    await Notifications.scheduleNotificationAsync({
      content: {
        sound:'default',
        title: data.Titulo,
        body: 'programada para el miercoles ',//data.Descripcion,
        data: { data: 'aun en trabajo' },
      },
     trigger: {seconds: parseInt(data.SegundosHasta)},
    //  trigger:{
      
    //   weekday:4,

    //   hour:19,
    //   minute:49,
    //   repeats:true,
    //  }
    });
  }