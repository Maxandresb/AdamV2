

import axios from 'axios';
import { obtenerUbicacion } from "./location";
const apiKey_weather= process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export const obtenerClima = async (opcion, args) => {
  
  locacion= args.Locacion
  console.log( 'locacion ' + locacion)  
    
  
  if (locacion ===undefined || locacion =='hoy' || locacion =='ayer' || locacion =='mañana' || locacion =='No definido' || locacion =='NULL'){
    coordenadas= await obtenerUbicacion(opcion);
    console.log(coordenadas) 
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordenadas.lat}&lon=${coordenadas.lon}&appid=${apiKey_weather}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
  }
  else{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locacion}&appid=${apiKey_weather}`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        console.log(data)
        return data;
      } catch (error) {
        console.log(error);
      }
  }
  
};