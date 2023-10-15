import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('adamdb.db');

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
});


db.transaction(tx => {
  db.transaction(tx => {
    tx.executeSql(
    `CREATE TABLE IF NOT EXISTS recordatorios (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        Titulo TEXT, 
        Fecha TEXT, 
        Hora TEXT, 
        Descripcion TEXT, 
        Estado INTEGER 
        
    );`,
    [],
    (_, { rows }) => console.log('Tabla creada:', rows),
    (_, error) => console.log('Error al crear la tabla:', error)
    );

});


db.transaction(tx => {
  tx.executeSql(
    "INSERT OR IGNORE INTO Recordatorios (id, Titulo, Fecha, Hora, Descripcion, Estado) VALUES ('1','Hora Medica', '2023-10-16','08:30','Ir al medico en conce','0'),('2','Hora Medica', '2023-10-17','08:30','Ir al medico en conce','0'),('3','Hora Medica', '2023-10-18','08:30','Ir al medico en conce','0'),('4','Hora Medica', '2023-10-16','09:40','Ir al medico en conce','0');",
    //['1','Hora Medica', '2023-10-16','08:30','Ir al medico en conce','0'],
    null,
    (_, { rows }) => console.log('Datos insertados:', rows),
    (_, error) => console.log('Error al insertar datos:', error)
  );
 
});




})};


export function addRecordatorio(recordatorio){
  let data = recordatorio

  db.transaction(tx => {
    tx.executeSql(
      "INSERT OR IGNORE INTO Recordatorios ( Titulo, Fecha, Hora, Descripcion, Estado) VALUES (?,?, ?,?,?);",
      [data.Titulo,data.Fecha, data.Hora,data.Descripcion,'0'],
      
      (_, { rows }) => console.log('Datos insertados:', rows),
      (_, error) => console.log('Error al insertar datos:', error)
    );
   
  });
}

export function mostarDB() {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM Recordatorios', [], (_, { rows }) => {
      console.log(JSON.stringify(rows));
    });

  })};
