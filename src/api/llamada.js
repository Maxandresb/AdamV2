import { Linking } from 'react-native';

// Define la función para realizar una llamada
export function realizarLlamada(phoneNumber) {
  // Verifica si el dispositivo puede abrir URLs con el esquema 'tel'
  Linking.canOpenURL(`tel:${phoneNumber}`)
    .then((supported) => {
      if (!supported) {
        console.log('No se puede realizar la llamada: ' + phoneNumber);
      } else {
        // Abre la URL para realizar la llamada
        return Linking.openURL(`tel:${phoneNumber}`);
      }
    })
    .catch((error) => console.log('Ocurrió un error al intentar realizar la llamada', error));
}