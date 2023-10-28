import * as Location from 'expo-location'; // Importa la API de ubicación de Expo
const apiKey = process.env.EXPO_PUBLIC_OPENCAGEDATA_API_KEY; // Tu clave de API para Opencage Geocoder

export async function obtenerUbicacion(opcion) {
  let { status } = await Location.requestForegroundPermissionsAsync(); // Solicita permisos para acceder a la ubicación en primer plano
  if (status !== 'granted') {
    return 'Permiso para acceder a la ubicación no concedido'; // Si los permisos no son concedidos, retorna un mensaje
  }
  try {
    console.log('OBTENIENDO UBICACION')
    try {
      let start = new Date().getTime();
      let location = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }),
        new Promise((_, reject) => setTimeout(reject, 10000, 'Tiempo agotado al obtener la ubicación'))
      ]);
      let end = new Date().getTime();
      console.log("La llamada fue exitosa, la ubicación es: ", location); // Imprime la ubicación en la consola
      console.log("Tiempo de ejecución: ", end - start, "ms");

      // Obtén la latitud y longitud de la ubicación
      let lat = location.coords.latitude;
      let lon = location.coords.longitude;
      try {
        console.log('REALIZANDO GEOCODIFICACION')
        // Realiza una solicitud a la API de Opencage Geocoder para obtener la dirección
        let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=` + apiKey);
        let data = await response.json();
        let calle = data.results[0].components.road
        let pobla = data.results[0].components.neighbourhood
        let comuna = data.results[0].components.town
        let region = data.results[0].components.state
        let pais = data.results[0].components.country

        dir_completa = `calle: ${calle}, cercano al sector: ${pobla}, comuna:${comuna}, region: ${region}, pais: ${pais}`;

        console.log('ELIGIENDO TIPO DE RETORNO')
        if (opcion === 'direccion') {
          return dir_completa;
        } else if (opcion === 'comuna') {
          return { comuna: comuna, region: region };
        } else {
          console.log('NO EXISTE ESE RETONO PARA LA FUNCION OBTENER UBICACION')
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error("Ocurrió un error al obtener la ubicación: ", error); // Si ocurre un error al obtener la ubicación, imprime el error en la consola
    }

  } catch (error) {
    console.error(error);
  }

}
