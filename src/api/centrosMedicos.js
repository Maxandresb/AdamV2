import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

// Leer datos del archivo CSV
async function leerCSV() {
  try {
    const archivo = `${FileSystem.documentDirectory}assets/files/centros_salud_chile.csv`;
    const data = await FileSystem.readAsStringAsync(archivo);
    return new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        complete: function(results) {
          resolve(results.data);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
}

// Buscar en el CSV
export async function buscarEnCSV(columna, comuna) {
    try {
      let datos = await leerCSV();
      let filasCoincidentes = [];
  
      // Buscar en los datos
      for (let fila of datos) {
        if (fila[columna] === comuna) {
          filasCoincidentes.push(fila); // Guardar la fila en la variable
        }
      }
  
      console.log(filasCoincidentes); // Imprimir todas las filas que cumplen la condición
      return filasCoincidentes
    } catch (err) {
      console.error(err);
    }
  }
  
