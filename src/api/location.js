import * as Location from 'expo-location';
const apiKey = process.env.EXPO_PUBLIC_OPENCAGEDATA_API_KEY;

export async function obtenerUbicacion(opcion) {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return 'Permiso para acceder a la ubicación no concedido';
  }
  
  let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest,});
  console.log('location: ', location)
  
  // Obtén la latitud y longitud de la ubicación
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;

  // Realiza una solicitud a la API de Opencage Geocoder para obtener la dirección
  let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=`+ apiKey);
  let data = await response.json();
  console.log('DATA UBIC: ', data.results[0])
  let calle = data.results[0].components.road
  let pobla = data.results[0].components.neighbourhood
  let comuna = data.results[0].components.town
  let region = data.results[0].components.state
  let pais = data.results[0].components.country

  dir_completa= `calle: ${calle}, sector: ${pobla}, comuna:${comuna}, region: ${region}, pais: ${pais}`;

  if (opcion === 'direccion'){
    return dir_completa;
  }else if (opcion === 'comuna'){
    return comuna;
  }else{
    console.log('NO EXISTE ESE RETONO PARA LA FUNCION OBTENER UBICACION')
  }
}
