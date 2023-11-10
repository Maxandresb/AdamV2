// import { Linking } from 'react-native';
import * as Linking from 'expo-linking'
import { obtenerUbicacion } from "./location";
// Define la función para realizar una llamada
export function realizarLlamada(phoneNumber) {
  
  Linking.openURL(`tel://${phoneNumber}`).catch((error) => console.log('Ocurrió un error al intentar realizar la llamada', error))

}




export async function enviarMensaje(phoneNumber) {
  // Solicita permiso para acceder a la ubicación
  

  // Obtiene la ubicación actual
  let ubicacion = await obtenerUbicacion('coordenadas')
  console.log(ubicacion)
  let latitude = ubicacion.lat;
  let longitude = ubicacion.lon;
//+56947008152
  // Formatea la ubicación como un enlace de Google Maps
  let mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  //let mapLink = Linking.makeUrl('map', {lat: latitude, lng: longitude});
  console.log(mapLink)
   //Abre whatsapp con el enlace de la ubicación
  let whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(`Esta es mi ubicacion actual, me encuentro en una emergencia: ${mapLink}`)}`;
  console.log(whatsappURL)
  Linking.openURL(whatsappURL).then((data) => {
    console.log('Whatsapp abierto');
  }).catch((err) => {
    console.log(err);
    alert('Asegúrate de que whatsapp esté instalado en tu dispositivo');
  });
}
