import * as SQLite from 'expo-sqlite';
import { initDB } from './sqlite';


let db = SQLite.openDatabase('adamdb.db');

export async function buscarEnDB(columna, valor) {
  //initDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      console.log('BUSCANDO EN LA BD')
      tx.executeSql(
        `SELECT * FROM centrosMedicos WHERE ${columna} = ?;`,
        [valor],
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log('Datos encontrados');
            resolve(rows);
          } else {
            console.log('No se encontraron datos.');
            resolve([]);
          }
        },
        (_, error) => {
          console.log('Error al buscar datos:', error);
          reject(error);
        }
      );
    });
  });
}
