import Papa from 'papaparse';

// Leer datos del archivo CSV
async function leerCSV(region) {
  try {
    const regiones = {
      Antofagasta: '../assets/files/Antofagasta.csv',
      Araucanía: '../assets/files/Araucania.csv',
      Arica: '../assets/files/AricaParinacota.csv',
      Atacama: '../assets/files/Atacama.csv',
      Aysén: '../assets/files/Aysen.csv',
      Biobío: '../assets/files/Biobio.csv',
      Coquimbo: '../assets/files/Coquimbo.csv',
      Lagos: '../assets/files/LosLagos.csv',
      Ríos: '../assets/files/LosRios.csv',
      Magallanes: '../assets/files/Magallanes.csv',
      Maule: '../assets/files/Maule.csv',
      Metropolitana: '../assets/files/Metropolitana.csv',
      Ñuble: '../assets/files/Nuble.csv',
      OHiggins: '../assets/files/OHiggins.csv',
      Tarapaca: '../assets/files/Tarapaca.csv',
      Valparaiso: '../assets/files/Valparaiso.csv'
    };

    let archivo = '';
    const regionWords = region.split(' ');

    for (let word of regionWords) {
      console.log('SELECCIONANDO CENTROS MEDICOS DE TU REGION')
      if (regiones[word]) {
        archivo = regiones[word];
        console.log('CONCIDENCIA ENCONTRADA')
        console.log('ARCHIVO: ',archivo)
        break;
      }
    }

    if (!archivo) {
      throw new Error('No se encontró un archivo para la región especificada');
    }

    const response = await fetch(archivo);
    const text = await response.text();

    return new Promise((resolve, reject) => {
      console.log('LEYENDO DATOS')
      Papa.parse(text, {
        header: true,
        complete: function(results) {
          console.log('Datos analizados:', results.data); // Registro adicional
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

export async function buscarEnCSV(columna, comuna, region) {
  try {
    let datos = await leerCSV(region);
    let filasCoincidentes = [];

    // Buscar en los datos
    for (let fila of datos) {
      console.log('BUSCANDO EN CSV')
      if (fila[columna] === comuna) {
        filasCoincidentes.push(fila); // Guardar la fila en la variable
        console.log('CONCIDENCIA ENCONTRADA')
      }
    }

    console.log(filasCoincidentes); // Imprimir todas las filas que cumplen la condición
    return filasCoincidentes
  } catch (err) {
    console.error(err);
  }
}
