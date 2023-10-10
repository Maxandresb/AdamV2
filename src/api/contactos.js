import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';

export async function requestContactsPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "Permiso para leer contactos",
        message: "Necesitamos tu permiso para leer tus contactos",
        buttonNeutral: "Pregúntame luego",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Tienes permiso para leer contactos");
      console.log(Contacts);
      Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
            console.log("Permiso denegado");
        } else {
            console.log(Contacts);
        }
    })
    } else {
      console.log("Permiso para leer contactos denegado");
    }
    
    console.log('CONTACTOS: ', contacts); 
  } catch (err) {
    console.warn(err);
  }
}


