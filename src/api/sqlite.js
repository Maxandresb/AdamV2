import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('adamdb.db');

export async function guardarHistoriarChats(id, fecha_hora, function_name, prompt, respuesta, usuario_rut){
    //Guardar en historial de chats
    db.transaction(tx => {
        tx.executeSql(
          "INSERT INTO Historial (id ,fecha_hora, funcion, input, output, usuario_rut) values (?, ?, ?, ?, ?, ?)",
          [id, fecha_hora, function_name, prompt, respuesta, usuario_rut],
          (_, { rows }) => console.log('CHAT GUARDADO EN HISTORIAL'),
          (_, error) => console.log('Error', error)
        );
    });
};

export function mostarDB(tabla) {
  db.transaction(tx => {
    tx.executeSql(`SELECT * FROM ${tabla}`, [], (_, { rows }) => {
      console.log(JSON.stringify(rows));
    });
  }
)};

export function initDB() {
    // tablas: Usuario Alergias Medicamentos Limitaciones Contacto Historial centrosMedicos   

    // eliminar tabla
    //db.transaction(tx => {
    //    tx.executeSql('DROP TABLE Usuario', [], (_, { rows }) => {
    //        console.log('Tabla eliminada');
    //    });
    //});    

    //eliminar contenido de una tabla
    //db.transaction(tx => {
    //  tx.executeSql('DELETE FROM Historial', [], (_, { rows }) => {
    //    console.log('Registros eliminados');
    //  });
    //});

    db.transaction(tx => {
      // Crear tabla Usuario
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Usuario (
          rut TEXT PRIMARY KEY NOT NULL,
          pnombre TEXT,
          snombre TEXT,
          papellido TEXT,
          sapellido TEXT,
          alias TEXT,
          genero TEXT,
          tipo_sangre TEXT,
          fecha_nacimiento TEXT,
          alergias TEXT,
          cronico TEXT,
          donante TEXT
        );`
        ,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla Usuario:', error)
      );
    
      // Crear tabla Alergias
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Alergias (
          id TEXT PRIMARY KEY NOT NULL,
          tipo TEXT,
          alergeno TEXT,
          usuario_rut INTEGER,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla Alergias:', error)
      );
    
      // Crear tabla Limitaciones
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Limitaciones (
          id TEXT PRIMARY KEY NOT NULL,
          tipo TEXT,
          severidad TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla Limitaciones:', error)        
      );
    
      // Crear tabla Medicamentos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Medicamentos (
          id TEXT PRIMARY KEY NOT NULL,
          medicamento TEXT,
          dosis TEXT,
          periodicidad TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla Medicamentos:', error)
      );
    
      // Crear tabla Historial
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Historial (
          id TEXT PRIMARY KEY NOT NULL,
          fecha_hora TEXT,
          funcion TEXT, 
          input TEXT,
          output TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla Historial:', error)
      );
    
      // Crear tabla Contacto
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Contacto (
          id TEXT PRIMARY KEY NOT NULL,
          alias TEXT,
          numero TEXT,
          nombre TEXT,
          apellido TEXT,
          relacion TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla Contacto:', error)
      );

      // Crear tabla centros medicos
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS centrosMedicos (
          id TEXT PRIMARY KEY NOT NULL, 
          NombreOficial TEXT, 
          Region TEXT, 
          Comuna TEXT, 
          Via TEXT, 
          Numero TEXT, 
          Calle TEXT, 
          Telefono TEXT, 
          TieneServicioDeUrgencia TEXT, 
          TipoDeUrgencia TEXT, 
          TipoDeSAPU TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
        [],
        () =>{}, 
        (_, error) => console.log('Error al crear la tabla centrosMedicos:', error)
        );

    db.transaction(tx => {
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['1','Posta de Salud Rural Casa de Piedra', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Sector Casa de Piedra', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['2','Posta de Salud Rural Alto Quilantahue', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Sector Alto Quilantahue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['3','Posta de Salud Rural Primer Agua', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Sector Primer Agua', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['4','Posta de Salud Rural Loncotripai', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Sector Loncotripai', '412726220', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['5','Posta de Salud Rural Isla Mocha', 'Biobío', 'Lebu', 'Calle', 'S/N', 'Sector Isla Mocha', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['6','Centro de Salud Familiar Isabel Jiménez', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Atahualpa', '412721172', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['7','SUR Isabel Jiménez', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Atahualpa', '412721172', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['8','Centro Comunitario de Salud Familiar Quidico', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Aldea de Quidico', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['9','Posta de Salud Rural Mahuilque Bajo', 'Biobío', 'Contulmo', 'Calle', 'S/N', 'Sector Mahuilque Bajo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['10','Posta de Salud Rural Los Huapes de Aillahuampi', 'Biobío', 'Contulmo', 'Calle', 'S/N', 'Sector Los Huapes de Aillahuampi', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['11','Posta de Salud Rural Ranquilhue', 'Biobío', 'Tirúa', 'Calle', 'S/N', 'Sector Ranquilhue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['12','Posta de Salud Rural Huillinco', 'Biobío', 'Contulmo', 'Calle', 'S/N', 'Sector Huillinco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['13','Posta de Salud Rural Ralco Lepoy', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Ralco Lepoy', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['14','Centro Comunitario de Salud Familiar Antiquina', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Ruta P70 R, Sector Antiquina', '413279421', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['15','Posta de Salud Rural Malla Palmucho', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Malla Palmucho', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['16','Hospital de Contulmo', 'Biobío', 'Contulmo', 'Calle', '1075', 'Las Araucarias', '412724150', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['17','Posta de Salud Rural Pocuno', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Sector Pocuno', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['18','Anexo Sociosanitario Contulmo', 'Biobío', 'Contulmo', 'Calle', 'S/N', 'Las Araucarias s/n, comuna de Contulmo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['19','Posta de Salud Rural Huentelolén', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Sector Huentelolén', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['20','Centro Comunitario de Salud Familiar Elicura', 'Biobío', 'Contulmo', 'Calle', 'S/N', 'Los Peumos, Sector Calebu', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['21','Posta de Salud Rural El Cisne', 'Biobío', 'Mulchén', 'Calle', 'S/N', 'Sector El Cisne', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['22','Posta de Salud Rural Lloncao', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Caserío de Lloncao', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['23','Centro de Salud Familiar Ralco', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Domingo Salvo', '432374151', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['24','SUR Ralco', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Domingo Salvo', '432374151', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['25','Posta de Salud Rural Callaqui', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Callaqui', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['26','Posta de Salud Rural Pitril', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Caserío Los Canelos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['27','Posta de Salud Rural Cayucupil', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Sector Cayucupil', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['28','Posta de Salud Rural Pangueco (Cañete)', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Sector Pangueco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['29','Posta de Salud Rural Pangue', 'Biobío', 'Los Álamos', 'Calle', 'S/N', 'Sector Pague', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['30','Posta de Salud Rural Alhuelemu', 'Biobío', 'Mulchén', 'Calle', 'S/N', 'Sector Alhuelemu', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['31','Laboratorio Clínico Bio-Test', 'Biobío', 'Cañete', 'Calle', '156-A', 'Lautaro', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['32','COSAM Cañete', 'Biobío', 'Cañete', 'Calle', '464', 'Saavedra', '412612894', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['33','Posta de Salud Rural Piñiquihue', 'Biobío', 'Quilaco', 'Calle', 'S/N', 'Sector Piñiquihue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['34','Policlínico Asociación Chilena de Seguridad AChS Cañete', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Acceso Norte', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['35','Hospital Intercultural Kallvu Llanka (Cañete)', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Ruta P-60-R, Esquina Ruta P-520. Entrada Norte', '412724100', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['36','Posta de Salud Rural Mañihual', 'Biobío', 'Mulchén', 'Calle', 'S/N', 'Sector Mañihual', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['37','Posta de Salud Rural Loncopangue', 'Biobío', 'Quilaco', 'Calle', 'S/N', 'Caserío de Loncopangue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['38','Posta de Salud Rural Ranquilco', 'Biobío', 'Los Álamos', 'Calle', 'S/N', 'Sector Ranquilco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['39','Posta de Salud Rural Santa Adriana', 'Biobío', 'Mulchén', 'Calle', 'S/N', 'Sector Santa Adriana', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['40','Posta de Salud Rural Butalelbum', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Butalelbum', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['41','Posta de Salud Rural Llenquehue', 'Biobío', 'Cañete', 'Calle', 'S/N', 'Caserío de Llenquehue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['42','Centro Comunitario de Salud Familiar Villa La Granja', 'Biobío', 'Mulchén', 'Calle', '823', 'El Hualle, Villa La Granja', '432332252 - Red Minsal 432252', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['43','Hospital de Mulchén', 'Biobío', 'Mulchén', 'Calle', '455', 'Villagra', '432332282', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['44','Centro de Diálisis Los Ángeles Sucursal Mulchén', 'Biobío', 'Mulchén', 'Calle', '310', 'Amunategui', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['45','Posta de Salud Rural Cauñicú', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Cauñicú', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['46','Posta de Salud Rural Rucalhue', 'Biobío', 'Quilaco', 'Calle', 'S/N', 'Caserío de Ricalhue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['47','Posta de Salud Rural Malla Malla', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Malla Malla', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['48','Centro Comunitario de Salud Familiar Mulchén', 'Biobío', 'Mulchén', 'Calle', '1541', 'Fresia', '432333240', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['49','Posta de Salud Rural Trapa Trapa', 'Biobío', 'Alto Biobío', 'Calle', 'S/N', 'Sector Trapa Trapa', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['50','Consultorio General Rural Quilaco', 'Biobío', 'Quilaco', 'Calle', 'S/N', 'Colón Sin Número', '432633614', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['51','SUR Quilaco', 'Biobío', 'Quilaco', 'Calle', 'S/N', 'Colón Sin Número', '432633614', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['52','Posta de Salud Rural Campamento', 'Biobío', 'Quilaco', 'Calle', 'S/N', 'Caserío de Campamento', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['53','Posta de Salud Rural Pehuén', 'Biobío', 'Lebu', 'Calle', 'S/N', 'Aldea de Pehuén', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['54','Posta de Salud Rural Antihuala', 'Biobío', 'Los Álamos', 'Calle', 'S/N', 'Pueblo de Antihuala', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['55','Centro Comunitario de Salud Familiar Santa Bárbara', 'Biobío', 'Santa Bárbara', 'Calle', '218', 'Rosas', '432333500', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['56','Clínica Dental Móvil Triple. Pat. NW6995 (Santa Bárbara)', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Salamanca', '432581203', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['57','Hospital Comunitario de Santa Bárbara', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Salamanca', '432332770', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['58','Posta de Salud Rural Los Junquillos', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Sector Los Junquillos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['59','Posta de Salud Rural Santa Rosa (Lebu)', 'Biobío', 'Lebu', 'Calle', 'S/N', 'Pueblo de Santa Rosa', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['60','Posta de Salud Rural Los Boldos', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Sector Los Boldos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['61','Posta de Salud Rural El Huachi', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Sector El Huachi', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['62','Posta de Salud Rural Rapelco', 'Biobío', 'Mulchén', 'Calle', 'S/N', 'Sector Rapelco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['63','Posta de Salud Rural Tres Pinos', 'Biobío', 'Los Álamos', 'Calle', 'S/N', 'Sector Tres Pinos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['64','Posta de Salud Rural Rihue', 'Biobío', 'Negrete', 'Calle', 'S/N', 'Caserío Rihue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['65','Centro de Salud Familiar Los Álamos', 'Biobío', 'Los Álamos', 'Calle', '835', 'Pedro Eyheramendy', '412723640', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['66','SAR Los Álamos', 'Biobío', 'Los Álamos', 'Calle', '600', 'Pedro Eyheramendy', '412533201', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['67','Centro Comunitario de Salud Familiar Los Álamos', 'Biobío', 'Los Álamos', 'Avenida', '823', 'Diego Portales', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['68','Hospital de Lebu', 'Biobío', 'Lebu', 'Calle', '54', 'Dr. Octavio Orellana Fuentes', '412724500', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['69','COSAM Lebu', 'Biobío', 'Lebu', 'Calle', '365', 'Saavedra', '412512922', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['70','Clínica Dental Móvil Triple. Pat. VP5666 (Lebu)', 'Biobío', 'Lebu', 'Calle', '302', 'Carrera', '412724372', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['71','Clínica Dental Móvil Simple. Pat. VP5664 (Lebu)', 'Biobío', 'Lebu', 'Calle', '302', 'Carrera', '412724372', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['72','Clínica Dental Móvil Simple. Pat. DDKB17 (Lebu)', 'Biobío', 'Lebu', 'Calle', '302', 'Carrera', '412724372', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['73','Unidad de Salud Funcionario S.S Arauco', 'Biobío', 'Lebu', 'Calle', '302', 'Carrera', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['74','Actividades gestionadas por la Dirección del Servicio para apoyo de la Red (S.S de Arauco)', 'Biobío', 'Lebu', 'Calle', '302', 'Carrera', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['75','PRAIS (S.S Arauco)', 'Biobío', 'Lebu', 'Calle', '302', 'Carrera', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['76','Centro de Salud Familiar Lebu Norte', 'Biobío', 'Lebu', 'Calle', 'S/N', 'Ignacio Carrera Pinto', '412511527', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['77','Posta de Salud Rural San Carlos', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Pueblo San Carlos de Purén', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['78','Centro de Salud Familiar Yanequén', 'Biobío', 'Negrete', 'Calle', 'S/N', 'Ignacio Carrera Pinto', '432551422', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['79','SUR Negrete', 'Biobío', 'Negrete', 'Calle', 'S/N', 'Ignacio Carrera Pinto', '432551422', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['80','Posta de Salud Rural Tierras Libres', 'Biobío', 'Mulchén', 'Calle', 'S/N', 'Sector Tierras Libres', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['81','Posta de Salud Rural Llano Blanco', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Llano Blanco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['82','Posta de Salud Rural Villucura', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Caserío de Villicura', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['83','Posta de Salud Rural Coigue', 'Biobío', 'Negrete', 'Calle', 'S/N', 'Pueblo de Coihue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['84','Posta de Salud Rural Mesamávida (Los Ángeles)', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Mesamávida', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['85','Posta de Salud Rural Choroico (Nacimiento)', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Sector Choroico', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['86','Posta de Salud Rural El Castillo', 'Biobío', 'Santa Bárbara', 'Calle', 'S/N', 'Sector El Castillo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['87','Posta de Salud Rural Río Pardo', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Sector Río Prado', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['88','Hospital Comunitario y Familiar de Nacimiento', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Julio Hemmelmann', '432332970', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['89','Policlínico AChS Subregional Nacimiento', 'Biobío', 'Nacimiento', 'Calle', '915', 'El Palque', '432511447', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['90','Centro Comunitario de Salud Familiar Lautaro', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Octavio Jara Wolf', '432333280', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['91','Centro Comunitario de Salud Familiar Julio Hemmelmann', 'Biobío', 'Nacimiento', 'Calle', '209', 'Los Cipreses', '432333260', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['92','SAR Entre Ríos', 'Biobío', 'Los Ángeles', 'Avenida', '2201', 'Oriente', '432333543', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['93','Centro de Salud Familiar Entre Ríos', 'Biobío', 'Los Ángeles', 'Avenida', '2201', 'Oriente', '432333543', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['94','Centro Comunitario de Salud Familiar Villa Los Ríos', 'Biobío', 'Los Ángeles', 'Pasaje', '2109', 'Cali, Villa Los Ríos', '432333710', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['95','Centro Comunitario de Salud Familiar Los Carrera', 'Biobío', 'Los Ángeles', 'Calle', '1302', 'Los Carreras', '432333700', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['96','Posta de Salud Rural Cañicura', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Sector Cañicura', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['97','Posta de Salud Rural Carrizal', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Sector Carrizal', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['98','Centro de Salud Familiar Paillihue', 'Biobío', 'Los Ángeles', 'Calle', '437', 'Juan Guzmán', '800500805', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['99','SAPU Paillihue', 'Biobío', 'Los Ángeles', 'Calle', '1302', 'Los Carrera', '432333700', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['100','Centro Comunitario de Salud Familiar El Peral', 'Biobío', 'Los Ángeles', 'Avenida', '565', 'El Peral, Lote 1-A, El Peral', '432333660 - 432333661', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['101','Servicio Médico Legal Los Ángeles', 'Biobío', 'Los Ángeles', 'Avenida', '1465', 'Las Industrias', '(43)341646 - 341926', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['102','Centro de Salud Familiar Eleuterio Ramírez', 'Biobío', 'Curanilahue', 'Pasaje', 'S/N', 'Cuatro', '412691358', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['103','SAPU Eleuterio Ramírez', 'Biobío', 'Curanilahue', 'Pasaje', 'S/N', 'Cuatro', '412416290', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['104','Clínica Adventista', 'Biobío', 'Los Ángeles', 'Calle', '456', 'Manuel Rodríguez', '432314056', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['105','SAPU 2 Septiembre', 'Biobío', 'Los Ángeles', 'Calle', '605', 'Max Jara', '432333742', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['106','Centro de Salud Familiar 2 Septiembre', 'Biobío', 'Los Ángeles', 'Calle', '605', 'Max Jara', '800500804', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['107','Unidad de Salud Funcionario S.S Bíobío', 'Biobío', 'Los Ángeles', 'Avenida', '147', 'Ricardo Vicuña', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['108','PRAIS (S.S Bíobío)', 'Biobío', 'Los Ángeles', 'Avenida', '147', 'Ricardo Vicuña', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['109','Laboratorio Clínico San Pedro', 'Biobío', 'Curanilahue', 'Calle', '770', 'Los Leones', '412494939', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['110','Actividades gestionadas por la Dirección del Servicio para apoyo de la Red (S.S de Bíobío)', 'Biobío', 'Los Ángeles', 'Avenida', '147', 'Ricardo Vicuña', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['111','Diálisis Nueva Vida S.p.A.', 'Biobío', 'Los Ángeles', 'Calle', '177', 'Bernardo O´Higgins', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['112','COSAM Curanilahue', 'Biobío', 'Curanilahue', 'Avenida', '216', 'Ramón de Zamora', '412693959', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['113','Hospital Provincial Dr. Rafael Avaría (Curanilahue)', 'Biobío', 'Curanilahue', 'Avenida', '111', "Bernardo O'Higgins", '412725480', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['114','Complejo Asistencial Dr. Víctor Ríos Ruiz (Los Ángeles)', 'Biobío', 'Los Ángeles', 'Avenida', '147', 'Ricardo Vicuña', '432336000', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['115','Policlínico AChS Los ángeles', 'Biobío', 'Los Ángeles', 'Avenida', '252', 'Ricardo', '432401701', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['116','Vacunatorio Buena Salud', 'Biobío', 'Los Ángeles', 'Calle', '300', 'Valdivia', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['117','MegaSalud S.A. Centro Médico y Dental Los Ángeles', 'Biobío', 'Los Ángeles', 'Calle', '615', 'Lautaro', '432311338', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['118','Laboratorio Clínico Central Kojchen y Compañía Limitada', 'Biobío', 'Los Ángeles', 'Calle', '357', 'Mendoza', '432323507', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['119','Centro de Salud Familiar Quilleco', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Bascur', '432611010', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['120','SUR Quilleco', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Bascur', '432611010', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['121','Centro Comunitario de Salud Familiar Las Azaleas', 'Biobío', 'Los Ángeles', 'Avenida', 'S/N', 'Las Azaleas', '432333720', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['122','Centro Odontológico Uno Salud Dental Los Ángeles', 'Biobío', 'Los Ángeles', 'Calle', '485', 'Valdivia, Local 1', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['123','Centro Comunitario de Salud Familiar Los Pioneros', 'Biobío', 'Los Ángeles', 'Avenida', 'S/N', 'Estanislao Anguita', '432333730', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['124','Centro de Salud Familiar Nuevo Horizonte', 'Biobío', 'Los Ángeles', 'Calle', '2360', 'Aguas Calientes', '432333221', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['125','Laboratorio Clínico Cordillera', 'Biobío', 'Los Ángeles', 'Calle', '581', 'Genaro Reyes', '432210280', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['126','SAPU Nuevo Horizonte', 'Biobío', 'Los Ángeles', 'Calle', '2360', 'Aguas Calientes', '432333220', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['127','Clínica Los Andes', 'Biobío', 'Los Ángeles', 'Calle', '581', 'Dr. Genaro Reyes', '432210201', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['128','Centro de Dialisis Los Angeles', 'Biobío', 'Los Ángeles', 'Calle', '560', 'Ercilla', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['129','Posta de Salud Rural Virquenco', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Aldea Virquenco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['130','Centro de Salud Familiar Santa Fe', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', "O'Higgins", '432391006', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['131','SUR Santa Fe', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', "O'Higgins", '432391006', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['132','Policlínico ACHS Curanilahue', 'Biobío', 'Curanilahue', 'Calle', 'S/N', 'La Colcha', '412691644', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['133','SAR Norte', 'Biobío', 'Los Ángeles', 'Avenida', '810', 'Los Ángeles', '432332206', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['134','Centro de Salud Familiar Norte de Los Ángeles', 'Biobío', 'Los Ángeles', 'Calle', '810', 'Los Ángeles', '432332200', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['135','Hospital Mutual de Seguridad CChC Los Ángeles', 'Biobío', 'Los Ángeles', 'Calle', '850', 'Mendoza', '432322177', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['136','Centro Comunitario de Salud Familiar Galvarino', 'Biobío', 'Los Ángeles', 'Calle', '198', 'Argentina', '432630686', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['137','Centro de Salud Familiar Nororiente de Los Ángeles', 'Biobío', 'Los Ángeles', 'Calle', '1558', 'Morse', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['138','SAPU Nororiente', 'Biobío', 'Los Ángeles', 'Pasaje', '1585', 'Morse', '432971740', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['139','Posta de Salud Rural Dollinco (Nacimiento)', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Sector Dollinco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['140','Posta de Salud Rural Chacayal Sur', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Aldea Chacayal', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['141','Posta de Salud Rural Tinajón', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Sector Tinajón', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['142','Posta de Salud Rural Chacayal Norte', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Aldea de Chacayal', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['143','Posta de Salud Rural Quiapo', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Sector Quiapo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['144','Posta de Salud Rural San Roque', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Sector San Roque', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['145','Posta de Salud Rural Los Robles (Los Ángeles)', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Los Robles', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['146','Posta de Salud Rural Culenco', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Sector Culenco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['147','Centro de Salud Familiar Canteras Villa Mercedes', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Diego Portales', '432373848', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['148','SUR Canteras Villa Mercedes', 'Biobío', 'Quilleco', 'Calle', 'S/N', 'Diego Portales', '432373848', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['149','Posta de Salud Rural Millantú', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Pueblo de Millantú', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['150','Posta de Salud Rural La Generala', 'Biobío', 'Santa Juana', 'Calle', 'S/N', 'Sector La Generala', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['151','Posta de Salud Rural San Gerardo', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector San Gerardo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['152','Posta de Salud Rural Millapoa', 'Biobío', 'Nacimiento', 'Calle', 'S/N', 'Sector Millapoa', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['153','Posta de Salud Rural San José de Colico', 'Biobío', 'Curanilahue', 'Calle', 'S/N', 'Aldea San José de Colico', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['154','Posta de Salud Rural Alborada', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Alborada', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['155','Posta de Salud Rural Los Canelos (Antuco)', 'Biobío', 'Antuco', 'Calle', 'S/N', 'Caserío Los Canelos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['156','Posta de Salud Rural Yani', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Aldea de Yani', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['157','Posta de Salud Rural Santa Elena (Laja)', 'Biobío', 'Laja', 'Calle', 'S/N', 'Caserío de Santa Elena', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['158','Posta de Salud Rural El Durazno ( Los Ángeles)', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector El Durazno', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['159','Centro de Salud Familiar Antuco', 'Biobío', 'Antuco', 'Calle', 'S/N', 'Arturo Prat', '432621002', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['160','SUR Antuco', 'Biobío', 'Antuco', 'Calle', 'S/N', 'Arturo Prat', '432621002', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['161','Posta de Salud Rural Chacay (Santa Juana)', 'Biobío', 'Santa Juana', 'Calle', 'S/N', 'Sector Chacay', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['162','Posta de Salud Rural Ramadillas', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Aldea de Ramadillas', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['163','Posta de Salud Rural Las Puentes', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Caserío Las Puentes', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['164','Posta de Salud Rural Dicahue', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Dicahue', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['165','Consultorio General Rural Tucapel', 'Biobío', 'Tucapel', 'Calle', 'S/N', 'Pueblo de Tucapel', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['166','Posta de Salud Rural La Colonia', 'Biobío', 'Laja', 'Calle', 'S/N', 'Caserío de La Colonia', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['167','Posta de Salud Rural Polcura', 'Biobío', 'Tucapel', 'Calle', 'S/N', 'Aldea de Polcura', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['168','Posta de Salud Rural Torre Dorada', 'Biobío', 'Santa Juana', 'Calle', 'S/N', 'Sector Torre Dorada', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['169','Policlínico AChS Laja', 'Biobío', 'Laja', 'Calle', '55', 'Balmaceda', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['170','Centro Comunitario de Salud Familiar Laja', 'Biobío', 'Laja', 'Calle', 'S/N', 'Los Laureles', '432530174', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['171','Posta de Salud Rural Purgatorio', 'Biobío', 'Santa Juana', 'Calle', 'S/N', 'Sector Purgatorio', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['172','Posta de Salud Rural Colico Alto', 'Biobío', 'Santa Juana', 'Calle', 'S/N', 'Sector Colico Alto', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['173','Posta de Salud Rural Los Troncos', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Aldea Los Troncos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['174','Posta de Salud Rural Trupán', 'Biobío', 'Tucapel', 'Calle', 'S/N', 'Aldea de Trupán', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['175','Hospital Comunitario de Laja', 'Biobío', 'Laja', 'Avenida', '800', 'Los Ríos', '432332634', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['176','Centro de Salud Familiar Dr. Carlos Echeverría Véjar', 'Biobío', 'San Rosendo', 'Calle', '95', 'Baquedano', '432332053', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['177','SUR San Rosendo', 'Biobío', 'San Rosendo', 'Calle', '95', 'Baquedano', '432332053', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['178','SUR Carampangue', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Vicente Millan', 'Pendiente', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['179','Centro de Salud Familiar Carampangue', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Vicente Millán', '412571991', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['180','Posta de Salud Rural Los Molinos', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Los Molinos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['181','COSAM de Arauco', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Caupolicán', '412725824', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['182','Hospital San Vicente de Arauco', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Caupolicán', '412725820', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['183','Centro de Diálisis y Especialidades Médicas Arauco Ltda.', 'Biobío', 'Arauco', 'Calle', '25', 'Los Duraznos, Radiata', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['184','Posta de Salud Rural Puente Perales', 'Biobío', 'Laja', 'Calle', 'S/N', 'Caserío de Puente Perales', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['185','Posta de Salud Rural Tanahuillín', 'Biobío', 'Santa Juana', 'Calle', 'S/N', 'Sector Tanahuillín', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['186','Clínica Dental Móvil Triple. Pat. UW9511 (Huepil)', 'Biobío', 'Tucapel', 'Calle', '233', '44969', '432332613', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['187','Hospital Comunitario Dr. Roberto Muñoz Urrutia de Huépil', 'Biobío', 'Tucapel', 'Calle', '233', '44969', '432332613', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['188','Centro de Salud Familiar Tubul', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Aldea de Tubul', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['189','SUR Tubul', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Aldea de Tubul', 'Pendiente', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['190','Posta de Salud Rural Salto del Laja', 'Biobío', 'Los Ángeles', 'Calle', 'S/N', 'Sector Salto del Laja', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['191','Posta de Salud Rural Turquía', 'Biobío', 'San Rosendo', 'Calle', 'S/N', 'Caserío de Turquía', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['192','Posta de Salud Rural La Aguada', 'Biobío', 'Yumbel', 'Calle', 'S/N', 'Aldea de La Aguada', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['193','Policlínico Asociación Chilena de Seguridad AChS Arauco', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Los Horcones', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['194','Posta de Salud Rural Rucamanqui', 'Biobío', 'Tucapel', 'Calle', 'S/N', 'Sector Rucamanqui', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['195','Posta de Salud Rural Chillancito', 'Biobío', 'Cabrero', 'Calle', 'S/N', 'Caserío Chillancito', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['196','Posta de Salud Rural Río Claro', 'Biobío', 'Yumbel', 'Calle', 'S/N', 'Aldea de Río Claro', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['197','Posta de Salud Rural Llico (Arauco)', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Aldea de Llico', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['198','Hospital Clorinda Avello (Santa Juana)', 'Biobío', 'Santa Juana', 'Calle', '900', 'Lautaro', '412721050', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['199','Centro de Salud Familiar Laraquete', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Calle 2', '412571006', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['200','SUR Laraquete', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Calle 2', '412571006', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['201','Posta de Salud Rural Talcamávida', 'Biobío', 'Hualqui', 'Calle', 'S/N', 'Colo Colo', '412777063', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['202','Posta de Salud Rural Punta Lavapié', 'Biobío', 'Arauco', 'Calle', 'S/N', 'Aldea Punta Lavapié', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['203','Centro de Salud Familiar Yumbel Estación', 'Biobío', 'Yumbel', 'Calle', '275', 'La Concepción', '432332045', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['204','SUR Yumbel Estación', 'Biobío', 'Yumbel', 'Calle', '275', 'La Concepción', '432332045', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['205','Posta de Salud Rural Rere', 'Biobío', 'Yumbel', 'Calle', 'S/N', 'Aldea de Rere', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['206','Centro Comunitario de Salud Familiar Colcura', 'Biobío', 'Lota', 'Calle', 'S/N', 'Brasilia', '413986063', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['207','Posta de Salud Rural Charrúa', 'Biobío', 'Cabrero', 'Calle', 'S/N', 'Aldea de Charrúa', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['208','Hospital Comunitario de Yumbel', 'Biobío', 'Yumbel', 'Calle', '251', 'Castellón', '432332350', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['209','Clínica Dental Móvil Triple. Pat. NW6996 (Yumbel)', 'Biobío', 'Yumbel', 'Calle', '251', 'Castellón', '432332350', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['210','Centro de Salud Familiar Dr. Sergio Lagos Olave (ex Nº 4 Lota Bajo)', 'Biobío', 'Lota', 'Calle', '454', 'Matta', '800500817', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['211','Hospital de Lota', 'Biobío', 'Lota', 'Calle', '702', 'Carrera', '412411249', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['212','COSAM Comunitaria Lota', 'Biobío', 'Lota', 'Calle', '192', 'Alessandri', '412879142', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['213','Centro de Salud Familiar Monteaguila', 'Biobío', 'Cabrero', 'Calle', 'S/N', 'Caupolicán', '432411346', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['214','SUR Monteaguila', 'Biobío', 'Cabrero', 'Calle', 'S/N', 'Caupolicán', '432411346', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['215','Clínica de Diálisis Diasermed', 'Biobío', 'Concepción', 'Calle', '377', 'Carlos Cousiño', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['216','SAR Dr. Juan Cartes Arias', 'Biobío', 'Lota', 'Calle', '1141', 'Baldomero Lillo', '41-2876643', 'SI', 'Urgencia Ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['217','Centro de Salud Familiar Dr. Juan Cartes Arias', 'Biobío', 'Lota', 'Calle', 'S/N', 'Carlos Cousiño', '412876643', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['218','Posta de Salud Rural Quilacoya', 'Biobío', 'Hualqui', 'Calle', 'S/N', 'La Puntilla', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['219','Centro Comunitario de Salud Familiar Puerto Sur Isla Sta. María', 'Biobío', 'Coronel', 'Calle', 'S/N', 'Ignacio Carrera Pinto', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['220','Policlínico AChS Cabrero', 'Biobío', 'Cabrero', 'Calle', '60', 'Oriente', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['221','Centro de Salud Familiar Lautaro Cáceres Ramos', 'Biobío', 'Cabrero', 'Calle', '360', 'Tucapel', '552411012', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['222','SAR Cabrero', 'Biobío', 'Cabrero', 'Calle', '360', 'Tucapel', '432333646', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['223','Centro Comunitario de Salud Familiar Cabrero', 'Biobío', 'Cabrero', 'Calle', '977', 'Membrillar', '432333490', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['224','Posta de Salud Rural Colicheo', 'Biobío', 'Cabrero', 'Calle', 'S/N', 'Caserío de Colicheo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['225','Laboratorio Clínico Biomec', 'Biobío', 'Cabrero', 'Calle', '700', 'General Cruz', '432419041', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['226','Centro Vacunatorio Coronel', 'Biobío', 'Coronel', 'Calle', '243', 'Lautaro', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['227','Hospital San José (Coronel)', 'Biobío', 'Coronel', 'Calle', '702', 'Lautaro', '412413306', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['228','COSAM de Coronel', 'Biobío', 'Coronel', 'Calle', '131', 'Cochrane', '412496069', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['229','Clínica de Atención Ambulatoria Mutual de Seguridad Coronel', 'Biobío', 'Coronel', 'Calle', '401', 'Lautaro', '(41) 2711472', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['230','Policlínico de la Asociación Chilena de Seguridad Coronel', 'Biobío', 'Coronel', 'Calle', '299', 'Los Carrera', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['231','SAPU Yobilo', 'Biobío', 'Coronel', 'Calle', '750', 'Leoncio Medel', '412711485', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['232','Centro de Salud Familiar Yobilo', 'Biobío', 'Coronel', 'Calle', '750', 'Santos Leoncio Medel', '722723800', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['233','Posta de Salud Rural Patagual', 'Biobío', 'Coronel', 'Calle', 'S/N', 'Sector Patagual', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['234','Centro de Salud Familiar Carlos Pinto Fierro', 'Biobío', 'Coronel', 'Calle', 'S/N', 'Manuel Montt', '412719829', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['235','SAPU Lagunillas', 'Biobío', 'Coronel', 'Calle', '2428', 'Los Álamos', '412715071', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Largo'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['236','Centro de Salud Familiar Lagunillas', 'Biobío', 'Coronel', 'Calle', '2428', 'Los Álamos', '800500814', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['237','Posta de Salud Rural Tomeco', 'Biobío', 'Yumbel', 'Calle', 'S/N', 'Caserío de Tromeco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['238','Centro Comunitario de Salud Familiar Lagunillas', 'Biobío', 'Coronel', 'Calle', 'S/N', 'Los Raulíes', '412726232', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['239','Posta de Salud Rural Puerto Norte Isla Sta. María', 'Biobío', 'Coronel', 'Calle', 'S/N', 'Isla Sta. María sector Norte', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['240','Centro de Salud Familiar Hualqui', 'Biobío', 'Hualqui', 'Calle', '690', 'Bulnes', '412780069', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['241','SAPU Hualqui', 'Biobío', 'Hualqui', 'Calle', '690', 'Bulnes', '412780444', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['242','Centro Comunitario de Salud Familiar Hualqui', 'Biobío', 'Hualqui', 'Calle', '117', 'Gabriela Mistral', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['243','Servicios Clínicos Neuropsiquiátricos y Geriátricos R y G Limitada', 'Biobío', 'Concepción', 'Calle', '5500', 'La Araucana', '412312786', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['244','Centro Comunitario de Salud Familiar Escuadrón', 'Biobío', 'Coronel', 'Calle', 'S/N', 'Calle 2', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['245','SAPU Leonera', 'Biobío', 'Chiguayante', 'Calle', 'S/N', 'Manuel Rodríguez', '412356815', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['246','Centro de Salud Familiar La Leonera', 'Biobío', 'Chiguayante', 'Calle', 'S/N', 'Manuel Rodríguez', '800500808', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['247','Posta de Salud Rural Canchillas', 'Biobío', 'Yumbel', 'Calle', 'S/N', 'Sector Canchillas, 18 Km. de Yumbel', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['248','Posta de Salud Rural Quinel', 'Biobío', 'Cabrero', 'Calle', 'S/N', 'Sector Quinel', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['249','Centro de Salud Familiar Pinares', 'Biobío', 'Chiguayante', 'Calle', '1259', 'La Marina', '412337194', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['250','SAR Chiguayante', 'Biobío', 'Chiguayante', 'Calle', '511', 'Chiguay', '3279510-3279511', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['251','SAPU Dental Chiguayante', 'Biobío', 'Chiguayante', 'Calle', '511', 'Chiguay', '3279510/3279511', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Largo'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['252','Centro de Salud Familiar Chiguayante', 'Biobío', 'Chiguayante', 'Calle', 'S/N', 'Chiguay', '800500807', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['253','Posta de Salud Rural Cancha Los Monteros', 'Biobío', 'Florida', 'Calle', 'S/N', 'Sector Cancha Los Monteros', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['254','Laboratorio Clínico Labotem', 'Biobío', 'Chiguayante', 'Calle', '429', 'Manuel Rodríguez', '412978302', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['255','Centro Comunitario de Salud Familiar Copiulemu', 'Biobío', 'Florida', 'Calle', 'S/N', 'Aldea de Copiulemu Bélgica', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['256','SAPU Loma Colorada', 'Biobío', 'San Pedro de la Paz', 'Calle', '7145', 'Los Castaños', '412392134', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['257','Centro de Salud Familiar Lomas Coloradas', 'Biobío', 'San Pedro de la Paz', 'Calle', 'S/N', 'Los Castaños', '412390120', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['258','Centro Comunitario de Salud Familiar Chaimávida', 'Biobío', 'Concepción', 'Pasaje', '1', 'Kilometro 23 Ruta Concepción- Cabrero, sector Chaimávida', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['259','Centro de Salud Familiar San Pedro de La Costa', 'Biobío', 'San Pedro de la Paz', 'Calle', '3145', 'Fresia', '422398508', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['260','Servicios Médicos CIDIAL Ltda.', 'Biobío', 'Concepción', 'Calle', '98', 'Junge, Pedro de Valdivia', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['261','Clínica de la Mujer Sanatorio Alemán', 'Biobío', 'Concepción', 'Avenida', '801', 'Pedro de Valdivia', '412796207', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['262','Centro Odontológico Uno Salud Dental San Pedro de la Paz', 'Biobío', 'San Pedro de la Paz', 'Calle', '1117', 'Michimalonco', '227634497', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['263','Vacunatorio San Pedro SpA', 'Biobío', 'San Pedro de la Paz', 'Calle', '198', 'Pedro Lira, Sector Los Canelos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['264','Centro Comunitario de Salud Familiar Boca Sur', 'Biobío', 'San Pedro de la Paz', 'Calle', '194', 'Nueva 1', '412726241', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['265','Instituto Teletón Concepción', 'Biobío', 'San Pedro de la Paz', 'Calle', '1656', 'Los Acacios', '412209300', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['266','Centro de Salud Familiar Pedro de Valdivia', 'Biobío', 'Concepción', 'Calle', 'S/N', 'Arrau Méndez', '800500812', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['267','Centro de Salud Familiar Boca Sur', 'Biobío', 'San Pedro de la Paz', 'Calle', '457', '2° Transversal', '800500818', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['268','SAR Boca Sur', 'Biobío', 'San Pedro de la Paz', 'Calle', '417', '44969', '2505220', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['269','Vacunatorio Endodent', 'Biobío', 'San Pedro de la Paz', 'Calle', '1055', 'Pedro Aguirre Cerda', '412466400', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['270','Centro de Salud Familiar San Pedro de La Paz Candelaria', 'Biobío', 'San Pedro de la Paz', 'Calle', '165', 'Diagonal Bíobío', '800500819', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['271','SAPU Dental San Pedro de La Paz', 'Biobío', 'San Pedro de la Paz', 'Calle', '165', 'Diagonal Bíobío', '413279431', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Largo'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['272','SAR San Pedro', 'Biobío', 'San Pedro de la Paz', 'Calle', '165', 'Diagonal Bíobío', '413279431', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['273','Servicios Médicos Medinefro Ltda.', 'Biobío', 'Concepción', 'Calle', '217', 'Cochrane', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['274','Laboratorio Clínico Diagnomed', 'Biobío', 'Concepción', 'Avenida', '39', "O'Higgins Poniente", '412888243', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['275','Centro Médico Medisan', 'Biobío', 'Concepción', 'Calle', '255', 'Cochrane', '41288 8103', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['276','Centro de Vacunación y Servcio de Enfermería SpA', 'Biobío', 'Concepción', 'Calle', '255', 'Cochrane, Piso 2', '413364927', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['277','Vacunatorio El Salvador', 'Biobío', 'Concepción', 'Calle', '532', 'Chacabuco', '412246595', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['278','Centro de Salud Familiar Villa Nonguén (Organizaciones sin fines de lucro y ONG)', 'Biobío', 'Concepción', 'Calle', '1397', 'Río Loa', '412723450', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['279','Centro de Referencia de Salud Municipal', 'Biobío', 'Concepción', 'Calle', '278', 'San Martin 262 - 246', '2449920-2449910', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['280','Laboratorio Clínico Lincoyán', 'Biobío', 'Concepción', 'Calle', '252', 'Lincoyán', '412225181', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['281','Unidad de Salud Funcionario S.S Concepción', 'Biobío', 'Concepción', 'Calle', '345', 'Rengo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['282','PRAIS (S.S Concepción)', 'Biobío', 'Concepción', 'Calle', '345', 'Rengo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['283','Laboratorio Clínico Seres Ltda.', 'Biobío', 'Concepción', 'Calle', '472', 'San Martín', '412220915', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['284','Laboratorio Clínico Dr. Fructuoso Biel y Cia Ltda.', 'Biobío', 'Concepción', 'Calle', '76', 'Castellon', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['285','Laboratorio Clínico Bionet S.A. - Concepción', 'Biobío', 'Concepción', 'Calle', '230', 'Caupolicán', '412520712', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['286','Centro Odontológico Uno Salud Dental Concepción', 'Biobío', 'Concepción', 'Calle', '635', 'Lord Cochrane, Local 106', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['287','Vacunatorio Concepción', 'Biobío', 'Concepción', 'Calle', '215', 'Aníbal Pinto, Of. 406 Box 3', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['288','Actividades gestionadas por la Dirección del Servicio para apoyo de la Red (S.S de Concepción)', 'Biobío', 'Concepción', 'Calle', '345', 'Rengo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['289','Laboratorio Clínico MACROLAB', 'Biobío', 'Concepción', 'Calle', '235-B', 'Colo Colo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['290','Centro de Salud Familiar Juan Soto Fernández', 'Biobío', 'Concepción', 'Calle', '393', 'Desiderio Sanhueza', '800500809', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['291',"Centro de Salud Familiar O'Higgins", 'Biobío', 'Concepción', 'Calle', '534', 'Salas', '800500811', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['292',"SAPU CESFAM O'HIGGINS", 'Biobío', 'Concepción', 'Calle', '538', 'Salas', '412449301', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['293','SAPU Juan Soto Fernández', 'Biobío', 'Concepción', 'Avenida', '850', 'Zañartu', '412449736', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['294','Vacunatorio Seres', 'Biobío', 'Concepción', 'Calle', '143', 'Tucapel', '412514001', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['295','Vacunatorio Israel', 'Biobío', 'Concepción', 'Calle', '548', 'Salas, Piso 3', '412747293', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['296','Centro Médico Kenal', 'Biobío', 'Concepción', 'Calle', '301', 'Barros Arana', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['297','Laboratorio Clínico Hasiles', 'Biobío', 'Concepción', 'Calle', '510', 'Angol', '412290940', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['298','Laboratorio de Especialidades Medicas EMSA S.A', 'Biobío', 'Concepción', 'Calle', '116', 'Ongolmo', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['299','Laboratorio Clínico Tecnimed Ltda.', 'Biobío', 'Concepción', 'Calle', '357', 'Colo Colo', '412628800', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['300','Vacunatorio Biovax SpA', 'Biobío', 'Concepción', 'Calle', '920', 'San Martín', '412108244', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['301','Centro Médico Inmunomédica', 'Biobío', 'Concepción', 'Calle', '912', 'San Martín', '412466340', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['302','Laboratorio Clínico C.D.S', 'Biobío', 'Concepción', 'Calle', '940', 'San Martín', '412629700', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['303','Centro Comunitario de Salud Familiar Boca Sur Viejo', 'Biobío', 'San Pedro de la Paz', 'Calle', '1800', 'Central', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['304','Laboratorio Clínico Inmunomedica Ltda.', 'Biobío', 'Concepción', 'Calle', '316', 'Castellón', '412108650', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['305','Kiñewen Ltda.', 'Biobío', 'Concepción', 'Calle', '174', 'Ongolmo', '412227979', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['306','Laboratorio Clínico Diagonal', 'Biobío', 'Concepción', 'Calle', '174', 'Ongolmo', '412237704', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['307','Laboratorio Clínico Dr. Gustavo Torrejón Sanhueza y Cía. Ltda.', 'Biobío', 'Concepción', 'Calle', '286', 'Tucapel', '412227896', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['308','Centro Odontológico Uno Salud Dental Concepción Dos', 'Biobío', 'Concepción', 'Calle', '820', 'Freire', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['309','Dispositivo Modular de Salud Hospital Guillermo Grant Benavente', 'Biobío', 'Concepción', 'Pendiente', 'S/N', 'Estacionamiento de Facultad de Odontología de la Universidad de Concepción', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['310','Centro Médico Radiológico Concepción Ltda.', 'Biobío', 'Concepción', 'Calle', '1213', 'San Martín', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['311','Hospital Clínico Regional Dr. Guillermo Grant Benavente (Concepción)', 'Biobío', 'Concepción', 'Calle', '1436', 'San Martín', '412417588', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['312','Centro Médico Integramédica Bio Bio', 'Biobío', 'Concepción', 'Calle', '301', 'Los Carrera', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['313','Hospital Traumatológico (Concepción)', 'Biobío', 'Concepción', 'Calle', '1580', 'San Martín', '412412003', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['314','Centro de Especialidades de Medicina Transfusional', 'Biobío', 'Concepción', 'Calle', '1111', 'Barros Arana', '422721950', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['315','Centro y Médico Dental VIII Zona de Carabineros (Del Bíobío)', 'Biobío', 'Concepción', 'Calle', '1224', 'Barros Arana', '412141480', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['316','Laboratorio Clínico Castellón', 'Biobío', 'Concepción', 'Avenida', '1448', 'Bernardo O´higgins', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['317','Vacunatorio Vaxsur SpA 1', 'Biobío', 'Concepción', 'Calle', '358', 'Lautaro', '9956604722', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['318','Hospital San Agustín de Florida', 'Biobío', 'Florida', 'Calle', '1114', 'Sargento Aldea, Florida Alto', '412721550', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['319','Centro Médico COALIVI', 'Biobío', 'Concepción', 'Calle', '706', 'Las Heras (esquina Anival Pinto)', '412125342', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['320','MegaSalud S.A. Centro Médico y Dental Concepción', 'Biobío', 'Concepción', 'Calle', '1445', 'Freire', '412925000', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['321','Departamento de Salud Estudiantil Universidad del Bíobío Campus Concepción', 'Biobío', 'Concepción', 'Avenida', '1202', 'Collao', '412731297', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['322','Centro de Salud Familiar Víctor Manuel Fernández', 'Biobío', 'Concepción', 'Calle', '2120', 'Maipú', '412721350', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['323','Centro Clínico Militar Concepción', 'Biobío', 'Concepción', 'Calle', '210', 'General Novoa', '412311678', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['324','SAR Víctor Manuel Fernández', 'Biobío', 'Concepción', 'Avenida', '406', 'Juan Bosco', '412724103', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['325','Hospital Clínico del Sur S.A.', 'Biobío', 'Concepción', 'Calle', '36', 'Cardenio Avello', '412128122', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['326','Policlínico Agencia Concepción de la Asociación Chilena de Seguridad', 'Biobío', 'Concepción', 'Calle', '70', 'Cardenio Avello', '412448630', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['327','SAR Tucapel', 'Biobío', 'Concepción', 'Calle', '1059', 'Ejército', '412449483', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['328','Centro de Salud Familiar Lorenzo Arenas', 'Biobío', 'Concepción', 'Calle', '50', 'Carlos Oliver', '800500810', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['329','Centro de Salud Familiar Tucapel', 'Biobío', 'Concepción', 'Calle', '1060', 'Juan de Dios Rivera', '800500813', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['330','SAPU Lorenzo Arenas', 'Biobío', 'Concepción', 'Calle', '50', 'Carlos Oliver', '412449502', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['331','Servicio Médico Legal Concepción', 'Biobío', 'Concepción', 'Calle', '4018', 'Camino a Penco, a un costado de la cárcel El Manzano', '(41)2290634', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['332','Centro Diurno para Personas con Demencia', 'Biobío', 'Hualpén', 'Calle', '9920', 'Colón, Sector Cerro Verde', '412329490', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['333','Hospital de Centro de Cumplimiento Penitenciario Biobío', 'Biobío', 'Concepción', 'Calle', '450', 'Camino a Penco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['334','Centro Penitenciario', 'Biobío', 'Concepción', 'Calle', '460', 'Camino a Penco', '412388610', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['335','Centro Comunitario de Salud Familiar Rene Schneider', 'Biobío', 'Hualpén', 'Calle', '150', 'Puerto Saavedra', '412478257', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['336','Clínica Andes Salud Concepción', 'Biobío', 'Hualpén', 'Avenida', '2047', 'Presidente Jorge Alesandri Rodríguez', '412666000', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['337','Vacunatorio Clínica Universitaria de Concepción', 'Biobío', 'Hualpén', 'Avenida', '2047', 'Presidente Jorge Alesandri Rodríguez, Piso 3', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['338','Centro Comunitario de Salud Familiar Leocán Portus Govinden', 'Biobío', 'Hualpén', 'Calle', '980', 'Atenas', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['339','COSAM Hualpén', 'Biobío', 'Hualpén', 'Calle', '8710', 'Diego Double Urrutia', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['340','SAPU Talcahuano Sur', 'Biobío', 'Hualpén', 'Calle', '632', 'Postdam', '412783909', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['341','Centro de Salud Familiar Talcahuano Sur', 'Biobío', 'Hualpén', 'Calle', '632', 'Postdam', '412783909', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['342','Clínica de Atención Ambulatoria Mutual de Seguridad CChC Hualpén', 'Biobío', 'Hualpén', 'Calle', '8720', 'Autopista Concepción Talcahuano', '722727300', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['343','Centro Comunitario de Salud Familiar Llafkelen', 'Biobío', 'Hualpén', 'Calle', '8535', 'Calbuco', '412430055', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['344','Centro de Salud Familiar Santa Sabina', 'Biobío', 'Concepción', 'Calle', '1948', 'Pedro Meriño', '412723790', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['345','SAPU Santa Sabina', 'Biobío', 'Concepción', 'Calle', '1820', 'Carlos Henríquez', '412449816', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['346','SAPU La Floresta', 'Biobío', 'Hualpén', 'Calle', '3851', 'Bremen', '412261385', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['347','Centro de Salud Familiar La Floresta', 'Biobío', 'Hualpén', 'Calle', '2598', 'Calle 3', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['348','Centro Comunitario de Salud Familiar España', 'Biobío', 'Hualpén', 'Calle', '3851', 'Bremen', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['349','Centro Integramédica del Trébol', 'Biobío', 'Talcahuano', 'Calle', '3177', 'Mall Plaza del Trébol', '412403102', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['350','Centro Comunitario de Salud Familiar Parque Central', 'Biobío', 'Hualpén', 'Avenida', '7431', 'Santa María', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['351','Hospital Instituto de Seguridad del Trabajo Talcahuano', 'Biobío', 'Talcahuano', 'Avenida', '3430', 'Colón', '412585232', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['352','Centro de Salud Familiar Hualpencillo', 'Biobío', 'Hualpén', 'Calle', '2845', 'Bulgaria', '800500828', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['353','SAR Hualpencillo', 'Biobío', 'Hualpén', 'Calle', '2845', 'Bulgaria', '412410808', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['354','SAPU Dental Hualpén', 'Biobío', 'Hualpén', 'Calle', '285', 'Bulgaria', '412410808', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['355','Centro Comunitario de Salud Familiar 8 de Mayo', 'Biobío', 'Talcahuano', 'Calle', '7370', 'Aisén', '412413891', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['356','Centro Comunitario de Salud Familiar Esmeralda', 'Biobío', 'Talcahuano', 'Calle', '590', 'San Miguel', '412412581', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['357','Centro Comunitario de Salud Familiar Cosmito', 'Biobío', 'Penco', 'Calle', 'S/N', 'Villa Cosmito', '412414740', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['358','Clínica Bio Bio', 'Biobío', 'Talcahuano', 'Avenida', '3515', 'Jorge Alessandri', '412734370', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['359','Posta de Salud Rural Manco', 'Biobío', 'Florida', 'Calle', 'S/N', 'Sector Manco', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['360','Posta de Salud Rural Roa', 'Biobío', 'Florida', 'Calle', 'S/N', 'Sector Roa', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['361','Centro de Salud Familiar Paulina Avendaño Pereda', 'Biobío', 'Talcahuano', 'Calle', 'S/N', 'Carlos Dittborn', '412723894', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['362','SAPU Paulina Avendaño Pereda', 'Biobío', 'Talcahuano', 'Calle', '4100', 'Carlos Dittborn', '412412581', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['363','Laboratorio Clínico YUEN', 'Biobío', 'Talcahuano', 'Calle', '133', 'Alto Horno', '412585728', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['364','Centro de Salud Familiar Alcalde Leocán Portus', 'Biobío', 'Talcahuano', 'Calle', '2645', 'Manuel Barros Borgoño', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['365','SAPU Alcalde Leocán Portus', 'Biobío', 'Talcahuano', 'Calle', '2645', 'Manuel Barros Borgoño', '412597373', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['366','Centro Comunitario de Salud Familiar Los Forjadores', 'Biobío', 'Penco', 'Calle', 'S/N', 'Diego Portales', '412726260', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['367','SAR Penco', 'Biobío', 'Penco', 'Calle', '573', 'Maipu', '413279520', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['368','Centro Odontológico Uno Salud Dental Talcahuano', 'Biobío', 'Talcahuano', 'Avenida', '3236', 'Cristóbal Colón, Oficina E', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['369','Policlínico de la Asociación Chilena de Seguridad Talcahuano', 'Biobío', 'Talcahuano', 'Avenida', '3138', 'Colón', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['370','Hospital Las Higueras (Talcahuano)', 'Biobío', 'Talcahuano', 'Calle', '777', 'Alto Horno', '412687000', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['371','Unidad de Salud Funcionario S.S Talcahuano', 'Biobío', 'Talcahuano', 'Calle', '86', 'Thompson', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['372','PRAIS (S.S Talcahuano)', 'Biobío', 'Talcahuano', 'Calle', '86', 'Thompson', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['373','Centro de Salud Familiar Penco', 'Biobío', 'Penco', 'Calle', '654', "O'Higgins", '412261375', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['374','Laboratorio Clínico ITAMED', 'Biobío', 'Penco', 'Calle', '298', 'Yerbas Buenas', '413185917', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['375','Centro Comunitario de Salud Familiar Libertad Gaete', 'Biobío', 'Talcahuano', 'Calle', '509', 'Isla San Ambrosio', '412543320', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['376','Centro de Salud Familiar San Vicente', 'Biobío', 'Talcahuano', 'Calle', '360', 'Brasil', '412723350', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['377','SAR San Vicente', 'Biobío', 'Talcahuano', 'Calle', '360', 'Brasil', '412558143', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['378','Centro Comunitario de Salud Familiar Los Lobos la Gloria', 'Biobío', 'Talcahuano', 'Calle', '1960', 'Los Lobos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['379','Actividades gestionadas por la Dirección del Servicio para apoyo de la Red (S.S de Talcahuano)', 'Biobío', 'Talcahuano', 'Calle', '86', 'Thompson', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['380','Hospital Penco Lirquén', 'Biobío', 'Penco', 'Calle', 'S/N', 'Camino a Tomé', '412724800', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['381','Centro de Salud Familiar Lirquén', 'Biobío', 'Penco', 'Calle', 'S/N', 'Camino a Tomé', '412688321', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['382','SAPU Los Cerros', 'Biobío', 'Talcahuano', 'Calle', 'S/N', 'El Galgo', '412723508', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Largo'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['383','Centro de Salud Familiar Los Cerros', 'Biobío', 'Talcahuano', 'Calle', 'S/N', 'Nueva Los Lobos', '412723504', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['384','SAR Los Cerros', 'Biobío', 'Talcahuano', 'Calle', '1260', 'San Vicente', '41-2723504', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['385','COSAM Los Cerros', 'Biobío', 'Talcahuano', 'Calle', '1340', 'Bahía San Vicente, sector Ex Fundo Centinela', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['386','Centro Comunitario de Salud Familiar Villa Centinela', 'Biobío', 'Talcahuano', 'Avenida', '1301', 'Punta Peñablanca, Villa centinela I', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['387','Posta de Salud Rural Granerillos', 'Biobío', 'Florida', 'Calle', 'S/N', 'Caserío de Granerillos', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['388','Centro Comunitario de Salud Familiar Ríos de Chile', 'Biobío', 'Penco', 'Calle', '100', 'Rios Ñuble', '413279570', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['389','Buque Talcahuano', 'Biobío', 'Talcahuano', 'No Aplica', 'No Aplica', 'No Aplica', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['390','Hospital Naval Almirante Adriazola', 'Biobío', 'Talcahuano', 'Calle', 'S/N', 'Michimalongo', '412743009', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['391','Centro Comunitario de Salud Familiar Punta de Parra', 'Biobío', 'Tome', 'Avenida', '61', 'Cardenal Samoré, Punta de Parra', '412170392', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['392','Posta de Salud Rural Tumbes', 'Biobío', 'Talcahuano', 'Calle', 'S/N', 'Pueblo de Caleta Tumbes', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['393','Centro de Salud Familiar Bellavista', 'Biobío', 'Tome', 'Calle', '297', 'Los Cerezos', '412209729', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['394','SAPU Bellavista', 'Biobío', 'Tome', 'Calle', '297', 'Los Cerezos', '412209729', 'SI', 'Urgencia Ambulatoria (SAPU)', 'Corto'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['395','Centro Comunitario de Salud Familiar El Santo Esfuerzo de Todos', 'Biobío', 'Tome', 'Calle', '47', 'Los Helechos', '412658308', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['396','Hospital de Tomé', 'Biobío', 'Tome', 'Calle', '1633', "O'Higgins", '412724950', 'SI', 'Urgencia Hospitalaria (UEH)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['397','Centro Comunitario de Salud Familiar Cerro Estanque', 'Biobío', 'Tome', 'Calle', '2276', 'Santiago Osorio', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['398','SAR Dr. Alberto Reyes', 'Biobío', 'Tome', 'Calle', '2720', 'Nueva Aldea', '412655172', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['399','Centro de Salud Familiar Dr. Alberto Reyes', 'Biobío', 'Tome', 'Calle', '2720', 'Nueva Aldea', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['400','Posta de Salud Rural Coliumo', 'Biobío', 'Tome', 'Calle', 'S/N', 'Sector de Coliumo', '957797870', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['401','Posta de Salud Rural Menque', 'Biobío', 'Tome', 'Calle', 'S/N', 'Villoslada, Aldea de Menque', '957797870', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['402','Centro de Salud Familiar Dichato', 'Biobío', 'Tome', 'Calle', '373', 'Daniel Vera', '412722472', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['403','SUR Dichato', 'Biobío', 'Tome', 'Calle', '373', 'Daniel Vera', '412722472', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['404','Unidad de Vacunación Móvil del BíoBío', 'Biobío', 'Concepción', 'No Aplica', 'No Aplica', 'No Aplica', 'No Aplica', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['405','UNO Salud DENTAL CORONEL', 'Biobío', 'Coronel', 'Calle', '321', 'Manuel Montt (Local 1)', '2 2763 9182', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['406','Vacunatorio Lomas', 'Biobío', 'Concepción', 'Avenida', '956', 'San Sebastian', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['407','LABORATORIO CLINICO SAN CRISTOBAL SPA', 'Biobío', 'Talcahuano', 'Avenida', '2909', 'Cristobal Colón ( primer y segundo piso. Sector Santa Clara)', '(41) 242 7520', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['408','Vacunatorio Los Ángeles', 'Biobío', 'Los Ángeles', 'Calle', '221', 'Jose Manso de Velasco (oficina 414)', '(56) 932168278', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['409','CECOSF RAFAEL', 'Biobío', 'Tome', 'Calle', '435', 'Calle Urrejola de Rafael', '41-2209748', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['410','SAR Carlos Pinto Fierro', 'Biobío', 'Coronel', 'Calle', '1409', 'Manuel Montt', '2719658', 'SI', 'Urgencia ambulatoria (SAR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['411','CMT Salud Concepción', 'Biobío', 'Concepción', 'Calle', '390', 'Arturo Prat', '(+56) 41 277 5411', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['412','SUR Tucapel', 'Biobío', 'Tucapel', 'Calle', '430', 'Comercio', '432333474-urgencia 432333472_SOME', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['413','Vacunatorio Líderes en Salud', 'Biobío', 'Los Ángeles', 'Avenida', '398', "O'Higgins", 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['414','Centro de Salud Familiar Valle La Piedra', 'Biobío', 'Chiguayante', 'Calle', '3973', 'San Martín N° 3973', '416046 (RED MINSAL)', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['415','RedMédica Sur', 'Biobío', 'San Pedro de la Paz', 'Avenida', '115', 'LAGUNA GRANDE', '56 962418248', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['416','Vacunatorio Vaxsur Spa 2', 'Biobío', 'Concepción', 'Avenida', '77', 'OHiggins Poniente', '56978187549', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['417','Centro de Resolutividad-UAPORRINO', 'Biobío', 'Los Ángeles', 'Calle', '581', 'Caupolicán', '56 432 216130', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['418','APS 2', 'Biobío', 'Curanilahue', 'Avenida', '111', 'Bernardo Ohiggins', 'Pendiente', 'NO', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['419','Vacunatorio BioBio', 'Biobío', 'Concepción', 'Avenida', '553', 'San Martín (OF. 1304 )', '56963205700', 'No', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['420','SUR LEBU NORTE', 'Biobío', 'Lebu', 'Calle', '1441', 'IGNACIO CARRERA PINTO', '+56 41 272 5795', 'SI', 'Urgencia Ambulatoria (SUR)', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['421','UNO SALUD DENTAL CONCEPCIÓN 3', 'Biobío', 'Concepción', 'Calle', '518', 'Angol', '', 'No', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
      tx.executeSql(
          "INSERT OR IGNORE INTO centrosMedicos (id, NombreOficial, Region, Comuna, Via, Numero, Calle, Telefono, TieneServicioDeUrgencia, TipoDeUrgencia, TipoDeSAPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          ['422','UNO SALUD DENTAL LOS ÁNGELES 2', 'Biobío', 'Los Ángeles', 'Avenida', '610', 'ALEMANIA', '', 'No', 'No Aplica', 'No Aplica'],
          () =>{},  
          (_, error) => console.log('Error al insertar datos:', error)
      );
      
    });
})};


