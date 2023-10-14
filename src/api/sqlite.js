import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('adamdb.db');

export function initDB() {
    db.transaction(tx => {
        tx.executeSql(
        `CREATE TABLE IF NOT EXISTS centrosMedicos (
            id INTEGER PRIMARY KEY NOT NULL, 
            NombreOficial TEXT, 
            Region TEXT, 
            Comuna TEXT, 
            Via TEXT, 
            Numero INTEGER, 
            Direccion TEXT, 
            Telefono TEXT, 
            TieneServicioDeUrgencia TEXT, 
            TipoDeUrgencia TEXT, 
            TipoDeSAPU TEXT
        );`,
        [],
        (_, { rows }) => console.log('Tabla creada:', rows),
        (_, error) => console.log('Error al crear la tabla:', error)
        );
    db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO centrosMedicos (NombreOficial, Region, Comuna, Via, Numero, Direccion, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['Posta de Salud Rural Talcamávida', 'Biobío', 'Hualqui', 'Calle', 'S/N', 'Colo Colo', '412777063', 'NO', 'No Aplica', 'No Aplica'],
          (_, { rows }) => console.log('Datos insertados:', rows),
          (_, error) => console.log('Error al insertar datos:', error)
        );
        tx.executeSql(
          "INSERT INTO centrosMedicos (NombreOficial, Region, Comuna, Via, Numero, Direccion, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['Posta de Salud Rural Quilacoya', 'Biobío', 'Hualqui', 'Calle', 'S/N', 'La Puntilla', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          (_, { rows }) => console.log('Datos insertados:', rows),
          (_, error) => console.log('Error al insertar datos:', error)
        );
    });
})};

export function mostarDB() {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM myTable', [], (_, { rows }) => {
      console.log(JSON.stringify(rows));
    });

  })};
