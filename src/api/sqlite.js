//sqlite.js
import * as SQLite from 'expo-sqlite';
import { InsertCentrosMedicos } from "../api/insertCentrosMedicos"

export const db = SQLite.openDatabase('adamdb.db');

export async function addRecordatorio(recordatorio) {
    let data = recordatorio
    let usuario_rut = await obtenerRut()
    console.log('registro de dias: ', data.Dias)
    db.transaction(tx => {
        tx.executeSql(
            "INSERT OR IGNORE INTO Recordatorios ( Titulo, Fecha, Hora, Descripcion, Estado, Dias, usuario_rut ) VALUES (?, ?, ?, ?, ?, ?, ?);",
            [data.Titulo, data.Fecha, data.Hora, data.Descripcion, '0', data.Dias.toString(), usuario_rut,],

            (_, { rows }) => console.log('Recordatorio insertado:', data.Titulo, data.Fecha, data.Hora, data.Descripcion, '0', data.Dias.toString(), usuario_rut,),
            (_, error) => console.log('Error al insertar datos:', error)
        );

    });
};

// resto de la implementacion de la bd


export function obtenerRut() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT rut FROM Usuario ORDER BY rut LIMIT 1;`,
                [],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        let rut = _array[0].rut;
                        console.log('rut:', rut);
                        resolve(rut);
                    } else {
                        console.log('No hay registros en la tabla Usuario.');
                        resolve(null);
                    }
                },
                (_, error) => {
                    console.log('Error al obtener el primer rut:', error);
                    reject(error);
                }
            );
        });
    });
}



export const checkUser = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Usuario;',
                [],
                (_, { rows: { _array } }) => {
                    resolve(_array.length > 0);
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                    return true;
                }
            );
        });
    });
}

export async function BuscarContactoEmergencia(nombre) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM Contacto WHERE alias LIKE ? OR nombreCompleto LIKE ?`,
                [`%${nombre}%`, `%${nombre}%`],
                (_, { rows: { _array } }) => {
                    console.log('COINCIDENCIAS ENCONTRADAS')
                    console.log(_array);
                    // Agrega los nombres completos, alias y números de teléfono al array contactosEncontrados
                    let contactosEncontrados = _array.map(contacto => ({
                        nombreCompleto: contacto.nombreCompleto,
                        alias: contacto.alias,
                        numero: contacto.numero
                    }));
                    resolve(contactosEncontrados);
                },
                (_, error) => {
                    console.log('Error al buscar contacto:', error);
                    reject(error);
                }
            )
        });
    });
};


export async function guardarHistoriarChats(id, fecha_hora, function_name, prompt, respuesta, usuario_rut) {
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
            console.log(tabla, JSON.stringify(rows));
        });
    }
    )
};








export function initDB() {
    console.log('CREANDO BASE DE DATOS SQLITE')
    // tablas: Usuario Alergias PatologiasCronicas Medicamentos Limitaciones Contacto Historial centrosMedicos   


    // eliminar tabla
    /*db.transaction(tx => {
        tx.executeSql('DROP TABLE Usuario', [], (_, { rows }) => {
            console.log('Tabla eliminada Usuario');
        });
    });*/

    //eliminar contenido de una tabla
    /*db.transaction(tx => {
      tx.executeSql('DELETE FROM Usuario', [], (_, { rows }) => {
        console.log('Registros eliminados');
      });
    });*/

    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS recordatorios (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            Titulo TEXT, 
            Fecha TEXT, 
            Hora TEXT, 
            Descripcion TEXT, 
            Estado INTEGER,
            Dias TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
            
        );`,
            [],
            (_, { rows }) => console.log('Tabla creada:', rows),
            (_, error) => console.log('Error al crear la tabla:', error)
        );

    });

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
          donante TEXT,
          limitacion_fisica TEXT, 
          toma_medicamentos TEXT
        );`
            ,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Usuario:', error)
        );

        // Crear tabla Alergias
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Alergias (
          id INTEGER PRIMARY KEY NOT NULL,
          tipo TEXT,
          alergeno TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Alergias:', error)
        );

        // Crear tabla Patologias cronicas
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS PatologiasCronicas (
          id INTEGER PRIMARY KEY NOT NULL,
          tipo_patologia TEXT,
          nombre_patologia TEXT,
          transmisibilidad TEXT,
          morbilidad_intensidad TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Alergias:', error)
        );

        // Crear tabla Limitaciones
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Limitaciones (
          id INTEGER PRIMARY KEY NOT NULL,
          tipo_lim TEXT,
          severidad_lim TEXT,
          origen_lim TEXT,
          descripcion_lim TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Limitaciones:', error)
        );

        // Crear tabla Medicamentos
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Medicamentos (
          id INTEGER PRIMARY KEY NOT NULL,
          medicamento TEXT,
          dosis TEXT,
          periodicidad TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
            [],
            () => { },
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
            () => { },
            (_, error) => console.log('Error al crear la tabla Historial:', error)
        );

        // Crear tabla Contacto
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Contacto (
          id INTEGER PRIMARY KEY NOT NULL,
          nombreCompleto TEXT,
          alias TEXT,
          numero TEXT,
          relacion TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
            [],
            () => { },
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
            () => { },
            (_, error) => console.log('Error al crear la tabla centrosMedicos:', error)
        );

        InsertCentrosMedicos()


    })
};
