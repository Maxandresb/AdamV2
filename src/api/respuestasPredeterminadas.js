import { nombreContactoEmergencia, nombreUsuario } from "../api/sqlite"

export function seleccionarRespuestaRecordatorio(args) {
  args = JSON.parse(args);
  let partes = args.Fecha.split('-');
  args.Fecha = `${partes[2]}-${partes[1]}-${partes[0]}`;
  let respuestas = [];
  if (args.Dias === 'Unico') {
    respuestas = [
      `¡Perfecto! He configurado un recordatorio para el ${args.Fecha} a las ${args.Hora} para que no olvides '${args.Titulo}'. Te avisaré mediante una notificación cuando llegue el momento.`,
      `¡Hecho! No te preocupes, te recordaré '${args.Titulo}' el ${args.Fecha} a las ${args.Hora} mediante una notificación.`,
      `¡Listo! Te recordaré '${args.Titulo}' el ${args.Fecha} a las ${args.Hora} con una notificación. ¡No te preocupes, estaré aquí para recordártelo!`,
      `¡Genial! He programado un recordatorio para el ${args.Fecha} a las ${args.Hora}. Te recordaré '${args.Titulo}' mediante una notificación cuando llegue el momento.`,
      `¡Está todo listo! Te recordaré '${args.Titulo}' el ${args.Fecha} a las ${args.Hora} con una notificación. ¡Puedes contar conmigo!`
    ];
  } else {
    respuestas = [
      `¡Perfecto! He configurado un recordatorio para que suene ${args.Dias} a las ${args.Hora} para que no olvides '${args.Titulo}'. Te avisaré cada vez mediante una notificación.`,
      `¡Hecho! No te preocupes, te recordaré '${args.Titulo}' ${args.Dias} a las ${args.Hora} con una notificación.`,
      `¡Listo! Te recordaré '${args.Titulo}' ${args.Dias} a las ${args.Hora} mediante una notificación. ¡No te preocupes, estaré aquí para recordártelo!`,
      `¡Genial! He programado un recordatorio para ${args.Dias} a las ${args.Hora}. Te recordaré '${args.Titulo}' cada vez con una notificación.`,
      `¡Está todo listo! Te recordaré '${args.Titulo}' ${args.Dias} a las ${args.Hora} mediante una notificación. ¡Puedes contar conmigo!`
    ];
  }
  return respuestas[Math.floor(Math.random() * respuestas.length)];
}

function obtenerFechaHora() {
  var fecha = new Date();
  var dia = String(fecha.getDate()).padStart(2, '0');
  var mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
  var anio = fecha.getFullYear();
  var hora = String(fecha.getHours()).padStart(2, '0');
  var minuto = String(fecha.getMinutes()).padStart(2, '0');
  return dia + '-' + mes + '-' + anio + ' ' + hora + ':' + minuto;
}


export function respuestaSNNoResponde() {
  let nombreUser = nombreUsuario()
  let nombreCE = nombreContactoEmergencia()
  let fechaHora = obtenerFechaHora()

  let respuestas = [
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: He detectado movimiento insual en el dispositivo del usuario ${nombreUser} con fecha y hora ${fechaHora}. Esta persona te ha añadido como su contacto de emergencia. Enviamos una notificacion al usuario pero no responde, por lo que podria necesitar ayuda. Por favor verifica que se encuentre bien.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: Se ha detectado actividad inusual en el dispositivo registrado a nombre de ${nombreUser} en la fecha y hora ${fechaHora}. Esta persona te ha designado como su contacto de emergencia. Se ha intentado contactar al usuario sin éxito, lo que sugiere que podría requerir asistencia. Por favor, verifique el estado de ${nombreUser}.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: Se ha registrado un comportamiento inusual en el dispositivo vinculado a ${nombreUser} en la fecha y hora ${fechaHora}. ${nombreUser} ha añadido a sus contactos de emergencia, entre los que te encuentras, para situaciones como esta. Nuestros intentos de comunicación con ${nombreUser} no han tenido éxito, lo que podría indicar una posible necesidad de ayuda. Te pedimos que verifiques el estado de ${nombreUser} cuando sea posible.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: He detectado un patrón inusual en el dispositivo asociado a ${nombreUser} en la fecha y hora ${fechaHora}. Este individuo te ha designado como su contacto de emergencia para situaciones como esta. A pesar de nuestros intentos, no hemos logrado establecer contacto con ${nombreUser}, lo que podría sugerir que requiere asistencia. Te solicitamos verificar el estado actual de ${nombreUser} para comprobar que este todo bien.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: Se ha detectado una actividad fuera de lo común en el dispositivo asociado al usuario ${nombreUser} en la fecha y hora ${fechaHora}. ${nombreUser} te ha marcado como su contactos de emergencia,  para situaciones de este tipo. Desafortunadamente, nuestros intentos de contacto con ${nombreUser} no han tenido respuesta, lo que sugiere que podría necesitar asistencia. Por favor, verifica la situación de ${nombreUser} si te es posible.`,    
  ];
  return respuestas[Math.floor(Math.random() * respuestas.length)];
}

export function respuestaSNAyuda() {
  let nombreUser = nombreUsuario()
  let nombreCE = nombreContactoEmergencia()
  let fechaHora = obtenerFechaHora()

  let respuestas = [
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: ${nombreUser} te señaló como contacto de emergencia. En este momento, a ${fechaHora}, necesita ayuda. Por favor, verifica su estado y bríndale asistencia si es necesario.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}:  ${nombreUser} te mencionó como su contacto de emergencia. Actualmente, a ${fechaHora}, requiere ayuda. Asegúrate de revisar su situación y proporcionar la asistencia requerida.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: ${nombreUser} te designó como su contacto de emergencia. En este momento, a ${fechaHora}, está solicitando ayuda. Te pido que verifiques su estado y, si es necesario, ofrécerle asistencia.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: ${nombreUser} te indicó como contacto de emergencia. El día de hoy, ${fechaHora}, necesita ayuda. Por favor, verifica su estado y bríndale la asistencia que pueda requerir.`,
    `Hola, este es un mensaje generado automaticamente por el asistente ADAM para ${nombreCE}: ${nombreUser} te ha identificado como su contacto de emergencia. En este momento, siendo ${fechaHora}, se encuentra necesitando ayuda. Por favor confirma su estado y proporcionale la ayuda necesaria si es preciso.`,    
  ];
  return respuestas[Math.floor(Math.random() * respuestas.length)];
}