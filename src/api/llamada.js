// import { Linking } from 'react-native';
import * as Linking from 'expo-linking'
// Define la función para realizar una llamada
export function realizarLlamada(phoneNumber) {
  
  Linking.openURL(`tel://${phoneNumber}`).catch((error) => console.log('Ocurrió un error al intentar realizar la llamada', error))

}




