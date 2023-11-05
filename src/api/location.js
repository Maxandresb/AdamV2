import * as Location from 'expo-location';
const apiKeyOCD = process.env.EXPO_PUBLIC_OPENCAGEDATA_API_KEY;
const apiKeyGOOGLE = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;


const obtenerUbicacion = async (opcion) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return 'Permiso para acceder a la ubicación no concedido';
  }
  try {
    console.log('OBTENIENDO UBICACION')
    let location;
    try {
      let start = new Date().getTime();
      location = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }),
        new Promise((_, reject) => setTimeout(reject, 20000, 'Tiempo agotado al obtener la ubicación'))
      ]);
      let end = new Date().getTime();
      console.log("La llamada fue exitosa, la ubicación es: ", location);
      console.log("Tiempo de ejecución: ", end - start, "ms");
    } catch (error) {
    console.error("Ocurrió un error al obtener la ubicación: ", error);

    // Si falla expo-location, intenta con Google Geolocation API
    console.log('INTENTANDO OBTENER UBICACION CON GOOGLE GEOLOCATION API')

    location = await useGoogleGeolocationAPI();
    console.log('segunda opcion de obtencion de location: ', location)
    }

    let lat = location.coords.latitude;
    let lon = location.coords.longitude;

    try {
      console.log('REALIZANDO GEOCODIFICACION')
      let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=` + apiKeyOCD);
      let data = await response.json();

      let calle = data.results[0].components.road
      let pobla = data.results[0].components.neighbourhood
      let region = data.results[0].components.state
      let pais = data.results[0].components.country
      let comuna;
      if (data.results[0].components.town) {
        comuna = data.results[0].components.town
      } else {
        comuna = data.results[0].components.city
      }

      dir_completa = `calle: ${calle}, cercano al sector: ${pobla}, comuna:${comuna}, region: ${region}, pais: ${pais}`;

      console.log('ELIGIENDO TIPO DE RETORNO')

      if (opcion === 'direccion') {
        return dir_completa;
      } else if (opcion === 'comuna') {
        return { comuna: comuna, region: region };
      } else if (opcion === 'coordenadas') {
        return { lat: lat, lon: lon };
      } else {
        console.log('NO EXISTE ESE RETONO PARA LA FUNCION OBTENER UBICACION')
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

const useGoogleGeolocationAPI = async () => {
  try {
    const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=`+ apiKeyGOOGLE, {
      method: 'POST',
    });
    const data = await response.json();
    console.log('data ', data)
    const { location } = data;

    // Convertir la respuesta de Google a un formato similar al de expo-location
    return {
      coords: {
        latitude: location.lat,
        longitude: location.lng,
      },
    };
  } catch (error) {
    console.error('Error al obtener la ubicación:', error);
  }
};

export { obtenerUbicacion };