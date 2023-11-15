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