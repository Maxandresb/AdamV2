//mensajeMessageBird.js
import { numContactoEmergencia } from '../api/sqlite';

const apiKey = process.env.EXPO_PUBLIC_MESSAGEBIRD;
var messagebird = require('messagebird')(apiKey);

export async function enviarAlertaSMS(mensaje) {
  try {
    const numero = await numContactoEmergencia();
    var params = {
      'originator': 'MessageBird',
      'recipients': [
        numero
      ],
      'body': mensaje
    };

    messagebird.messages.create(params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      console.log(response);
    });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
}
