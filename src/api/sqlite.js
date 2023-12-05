//sqlite.js
import * as SQLite from 'expo-sqlite';
import { InsertCentrosMedicos } from "../api/insertCentrosMedicos"

export const db = SQLite.openDatabase('adamdb.db');


// funcion borrar datos de la app
export const borrarDatos = async () => {
    db.transaction(tx => {
        // tx.executeSql(
        //     'DELETE FROM Usuario',
        //     [],
        //     (_, { rows }) => console.log('Registros eliminados tabla Usuario'),
        //     (_, error) => console.log('Error al eliminar los registros tabla Usuario:', error)
        // );
        tx.executeSql(
            'DELETE FROM Medicamentos',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla Medicamentos'),
            (_, error) => console.log('Error al eliminar los registros tabla Medicamentos:', error)
        );
        tx.executeSql(
            'DELETE FROM Contacto',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla Contacto'),
            (_, error) => console.log('Error al eliminar los registros tabla Contacto:', error)
        );
        tx.executeSql(
            'DELETE FROM Historial',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla Historial'),
            (_, error) => console.log('Error al eliminar los registros tabla Historial:', error)
        );
        tx.executeSql(
            'DELETE FROM Limitaciones',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla Limitaciones'),
            (_, error) => console.log('Error al eliminar los registros tabla Limitaciones:', error)
        );
        tx.executeSql(
            'DELETE FROM PatologiasCronicas',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla PatologiasCronicas'),
            (_, error) => console.log('Error al eliminar los registros tabla PatologiasCronicas:', error)
        );
        tx.executeSql(
            'DELETE FROM Alergias',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla Alergias'),
            (_, error) => console.log('Error al eliminar los registros tabla Alergias:', error)
        );
        tx.executeSql(
            'DELETE FROM Configuracion',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla Configuracion'),
            (_, error) => console.log('Error al eliminar los registros tabla Configuracion:', error)
        );
        tx.executeSql(
            'DELETE FROM ConfigNotificaciones',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla ConfigNotificaciones'),
            (_, error) => console.log('Error al eliminar los registros tabla ConfigNotificaciones:', error)
        );
        tx.executeSql(
            'DELETE FROM DolenciasSintomas',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla DolenciasSintomas'),
            (_, error) => console.log('Error al eliminar los registros tabla DolenciasSintomas:', error)
        );
        tx.executeSql(
            'DELETE FROM recordatorios',
            [],
            (_, { rows }) => console.log('Registros eliminados tabla recordatorios'),
            (_, error) => console.log('Error al eliminar los registros tabla recordatorios:', error)
        );
    });
};


//contar la cantidad de recordatorios existentes
export const contarRecordatorios = async () => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) as count FROM recordatorios;',
                    [],
                    (_, { rows }) => {
                        console.log('Número de recordatorios: ' + rows.item(0).count);
                        resolve(rows.item(0).count)
                    },
                    (_, error) => {
                        console.log('Error al contar los recordatorios: ' + error);
                        reject()
                    }
                );
            }, (error) => {
                reject(`Error al iniciar la transacción contar rec: ${error}`);
            });
        })
    } catch (error) {
        console.log('Error al contar los recordatorios: ' + error);
    }
};

// obtener ids notificaciones recordatorios
export async function obtenerIdsNotificacionesRec(id) {
    console.log('> ejecutando obtenerIdsNotificacionesRec');
    try {
        return new Promise((resolve, reject) => {
            try {
                db.transaction(tx => {
                    tx.executeSql(
                        `SELECT idNotificacion FROM recordatorios WHERE id = ?;`,
                        [id],
                        (_, { rows: { _array } }) => {
                            // log array
                            console.log('array:', _array);
                            console.log('idNotificacion obtenido:', _array[0].idNotificacion);
                            if (_array.length > 0) {
                                let idNotificacion = _array[0].idNotificacion;
                                //console.log('idsNotificacionesSD obtenido con la funcion:', idsNotificacionesSD);
                                resolve(idNotificacion);
                            } else {
                                console.log('No hay idsNotificacionesSD en la tabla Configuracion.');
                                resolve(null);
                            }
                        },
                        (_, error) => {
                            console.log('Error al obtener los idsNotificacionesSD:', error);
                            reject(error);
                        }
                    );
                });
            } catch (error) {
                console.log('Error al obtener los idsNotificacionesSD:', error);
                reject(error);
            }
        });
    } catch (error) {

    }
}

// Función para actualizar el recordatorio en la base de datos
export async function actualizarRecordatorio(id, campos) {
    console.log('<ACTUALIZANDO RECORDATORIO>')
    console.log('id: ', id);
    console.log('campos: ', campos);
    if (campos.idNotificacion) {
        const cadena = campos.idNotificacion.join(',');
        campos.idNotificacion = cadena
        console.log('cadena: ', cadena)
    }
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE recordatorios SET Estado = ?, idNotificacion = ? WHERE id = ?',
                    [campos.Estado, campos.idNotificacion, id],
                    (_, result) => {
                        console.log('</RECORDATORIO ACTUALIZADO>')
                        // Realiza una operación de lectura para obtener el idNotificacion actualizado
                        tx.executeSql(
                            'SELECT idNotificacion FROM Recordatorios WHERE id = ?',
                            [id],
                            (_, result) => {
                                // Resuelve la promesa con el idNotificacion actualizado
                                resolve(result.rows.item(0).idNotificacion);
                            },
                            (_, error) => reject(error)
                        );
                    },
                    (_, error) => reject(error)
                );
            }, error => reject(error)
            );
        });
    } catch (error) {
        console.log('Error al actualizar el recordatorio:', error);

    }

};


//funcion para obtener idsNotificacionesSD
export async function obtenerIdsNotificacionesSD() {
    return new Promise((resolve, reject) => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT idsNotificacionesSD FROM ConfigNotificaciones WHERE id = ?;`,
                    [1],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            let idsNotificacionesSD = _array[0].idsNotificacionesSD;
                            //console.log('idsNotificacionesSD obtenido con la funcion:', idsNotificacionesSD);
                            resolve(idsNotificacionesSD);
                        } else {
                            console.log('No hay idsNotificacionesSD en la tabla Configuracion.');
                            resolve(null);
                        }
                    },
                    (_, error) => {
                        console.log('Error al obtener los idsNotificacionesSD:', error);
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.log('Error al obtener los idsNotificacionesSD:', error);
            reject(error);
        }
    });
}
/*export async function guardarIdsNotificacionesSD(nuevosIds) {
    console.log('guardar ids SD');
    const stringIds = nuevosIds.join(',');
    //console.log('stringIds: ', stringIds);
    return new Promise((resolve, reject) => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM Configuracion WHERE id = ?`,
                    [1],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            console.log('actualizando ids');
                            // Si existe un registro con id = 1, realiza una operación UPDATE
                            tx.executeSql(
                                `UPDATE Configuracion SET idsNotificacionesSD = ? WHERE id = ?`,
                                [stringIds, 1],
                                (_, resultSet) => {
                                    // Verifica si el valor se cambió
                                    tx.executeSql(
                                        `SELECT idsNotificacionesSD FROM Configuracion WHERE id = ?`,
                                        [1],
                                        (_, result) => {
                                            if (result.rows.item(0).idsNotificacionesSD) {
                                                let idsNotificacionesSD = result.rows.item(0).idsNotificacionesSD;
                                                if (idsNotificacionesSD === stringIds) {
                                                    console.log('idsNotificacionesSD actualizados correctamente');
                                                    console.log(`ids antes del cambio: ${idsNotificacionesSD} || ids antes del cambio: ${stringIds}`);
                                                    mostarDB('Configuracion')
                                                } else {
                                                    console.log('idsNotificacionesSD no actualizados');
                                                    console.log(`ids antes del cambio: ${idsNotificacionesSD} || ids antes del cambio: ${stringIds}`);
                                                    mostarDB('Configuracion')
                                                }
                                                resolve('ok');
                                            } else {
                                                console.log('No hay idsNotificacionesSD en la tabla Configuracion.');
                                                resolve(null);
                                            }
                                        },
                                        (_, error) => {
                                            console.log('Error al obtener los idsNotificacionesSD:', error);
                                            reject(error);
                                        }
                                    );
                                },
                                (_, error) => {
                                    console.log('Error en la consulta UPDATE', error);
                                    reject(error);
                                }
                            );
                        } else {
                            console.log('insertando ids');
                            // Si no existe un registro con id = 1, realiza una operación INSERT
                            tx.executeSql(
                                `INSERT INTO Configuracion (id, idsNotificacionesSD) VALUES (?, ?)`,
                                [1, stringIds],
                                (_, resultSet) => {
                                    // Verifica si el valor se cambió
                                    tx.executeSql(
                                        `SELECT idsNotificacionesSD FROM Configuracion WHERE id = ?`,
                                        [1],
                                        (_, result) => {
                                            if (result.rows.item(0).idsNotificacionesSD) {
                                                let idsNotificacionesSD = result.rows.item(0).idsNotificacionesSD;
                                                if (idsNotificacionesSD === stringIds) {
                                                    console.log('idsNotificacionesSD actualizados correctamente');
                                                    console.log(`ids antes del cambio: ${idsNotificacionesSD} || ids antes del cambio: ${stringIds}`);
                                                    mostarDB('Configuracion')
                                                } else {
                                                    console.log('idsNotificacionesSD no actualizados');
                                                    console.log(`ids antes del cambio: ${idsNotificacionesSD} || ids antes del cambio: ${stringIds}`);
                                                    mostarDB('Configuracion')
                                                }
                                                resolve(idsNotificacionesSD);
                                            } else {
                                                console.log('No hay idsNotificacionesSD en la tabla Configuracion.');
                                                resolve(null);
                                            }
                                        },
                                        (_, error) => {
                                            console.log('Error al obtener los idsNotificacionesSD:', error);
                                            reject(error);
                                        }
                                    );
                                    resolve(resultSet);
                                },
                                (_, error) => {
                                    console.log('Error en la consulta INSERT', error);
                                    reject(error);
                                }
                            );
                        }
                    },
                    (_, error) => {
                        console.log('Error en la consulta SELECT', error);
                        reject(error);
                    }
                );
            },
                error => {
                    console.log('Error en la transacción guardar ids SD', error);
                    reject(error);
                },
                () => {
                    console.log('Transacción completa guardar ids SD');
                    resolve();
                }
            );
        } catch (error) {
            console.error('Se produjo un error guardar ids SD', error);
            reject(error);
        }
    });
}*/

/*export const guardarIdsNotificacionesSD = (idsNotificacionesSD) => {
    console.log('guardar ids SD');
    // console.log('idsAntes: ', idsNotificacionesSD)
    // let stringIds = idsNotificacionesSD.join(',');
    // console.log('idsDespues: ', stringIds);
    let stringIds = 'intentando ingresar datos'
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO Configuracion (id, idsNotificacionesSD) VALUES (?, ?)',
          [1, stringIds],
          (_, resultSet) => {
            console.log('Inserción o reemplazo idsNotificacionesSD exitoso en la tabla Configuracion');
            mostarDB('Configuracion')
            resolve(resultSet);
          },
          (_, error) => {
            console.log('Error al insertar o reemplazar idsNotificacionesSD en la tabla Configuracion:', error);
            reject(error);
            return true;
          }
        );
      }, (error) => {
        console.log('Error en la transacción guardar ids SD', error);
        reject(error);
      });
    });
  }; */


export async function obtenerFechaSD() {
    return new Promise((resolve, reject) => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT fechaSD FROM ConfigNotificaciones WHERE id = ?;`,
                    [],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            let fechaSD = _array[0].fechaSD;
                            //console.log('fechaSD obtenido con la funcion:', fechaSD);
                            resolve(fechaSD);
                        } else {
                            console.log('No hay fechaSD en la tabla Configuracion.');
                            resolve(null);
                        }
                    },
                    (_, error) => {
                        console.log('Error al obtener la fechaSD:', error);
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.log('Error al obtener la fechaSD:', error);
            reject(error);
        }
    });
}
export async function guardarFechaSD(nuevaFecha) {
    console.log('iniciando guardarFechaSD');
    return new Promise((resolve, reject) => {
        try {
            let fechaString;

            // Verifica si nuevaFecha es una cadena
            if (typeof nuevaFecha === 'string') {
                // Intenta analizar la cadena como fecha
                if (isNaN(Date.parse(nuevaFecha))) {
                    reject(new Error('Formato de fecha inválido'));
                } else {
                    fechaString = nuevaFecha;
                }
            }
            // Verifica si nuevaFecha es un objeto Date
            else if (nuevaFecha instanceof Date) {
                // Convierte la fecha a una cadena en formato ISO
                fechaString = nuevaFecha.toISOString();
            }

            // Inicia transacción en la base de datos
            db.transaction(
                tx => {
                    // Ejecuta la consulta SQL
                    tx.executeSql(
                        `INSERT OR REPLACE INTO ConfigNotificaciones (id, fechaSD) VALUES (?, ?)`,
                        [1, fechaString],
                        (_, resultSet) => {
                            console.log('Inserción o actualización fechaSD exitosa');
                            resolve('ok');
                        },
                        (_, error) => {
                            console.log('Error en la consulta fechaSD', error);
                            reject(error);
                        }
                    );
                },
                error => {
                    console.log('Error en la transacción fechaSD', error);
                    reject(error);
                }
            );
        } catch (error) {
            console.error('Se produjo un error', error);
            reject(error);
        }
    });
}




//crea una funcion para obtener los idNotifications a de la tabla medicamentos segun el id
export async function obtenerIdNotificacion(id) {
    if (id === undefined || id === null) {
        console.log('El id es undefined o null');
        return;
    }

    let idString = id.toString();
    try {
        const idNotificacion = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT idNotificacion FROM Medicamentos WHERE id = ?`,
                    [idString],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            resolve(_array[0].idNotificacion);
                        } else {
                            reject(new Error('No se encontró ningún idNotificacion para el id proporcionado.'));
                        }
                    },
                    (_, error) => {
                        reject(new Error(`Error interno en la consulta al obtener el idNotificacion: ${error}`));
                    }
                );
            }, (error) => {
                reject(new Error(`Error al ejecutar la consulta al obtener el idNotificacion: ${error}`));
            });
        });
        console.log('idNotificacion obtenido:', idNotificacion);
        return idNotificacion;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateMedicamentos = async (idNotificacion, id) => {
    console.log('> ejecutando updateMedicamentos');
    if (id === undefined || id === null || idNotificacion === undefined || idNotificacion === null) {
        console.log('El id o idNotificacion son undefined o null');
        return;
    }
    try {
        const result = await new Promise((resolve, reject) => {
            console.log('=> dentro de la promesa');
            mostarDB('Medicamentos')
            console.log('id del medicamento en updateMedicamentos: ', String(id));
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE Medicamentos SET idNotificacion = ? WHERE id = ?",
                    [idNotificacion, String(id)],
                    (_, result) => {
                        // log result
                        console.log('result:', result);
                        console.log('idNotificacion actualizado:', idNotificacion);
                        resolve('Actualización exitosa');
                        tx.executeSql(
                            'SELECT * FROM Medicamentos WHERE id = ?',
                            [id],
                            (_, result) => {
                                if (idNotificacion === result.rows.item(0).idNotificacion) {
                                    console.log('idNotificacion actualizado correctamente');
                                } else {
                                    console.log('idNotificacion no actualizado');
                                    console.log(`ids antes del cambio: ${idNotificacion} || ids antes del cambio: ${result.rows.item(0).idNotificacion}`);
                                }
                                resolve()
                            },
                            (_, error) => {
                                console.log('Error al obtener los ids dsps de actualizarlos:', error);
                                reject(new Error(`Error al ejecutar la consulta SQL: ${error}`));
                            }
                        );
                    },
                    (_, error) => {
                        reject(new Error(`Error al ejecutar la consulta SQL: ${error}`));
                    }
                );
            }, (error) => {
                reject(new Error(`Error al iniciar la transacción: ${error}`));
            });
        });
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function addIdNotification(id, idNotificacion) {
    try {
        // Obtener la notificación previa
        const notifPrevia = await obtenerIdNotificacion(id);

        // Crear la nueva cadena de IDs de notificación
        const notificacionIds = notifPrevia ? `${notifPrevia} ${idNotificacion}` : idNotificacion;

        // Actualizar la base de datos
        const result = await updateMedicamentos(notificacionIds, id);

        console.log('Actualización exitosa:', result);
        return result;
    } catch (error) {
        console.error('Error al agregar la ID de notificación:', error);
        throw error;
    }
}


export const numContactoEmergencia = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT numero FROM Contacto WHERE estadoContacto = ?`,
                ['sí'],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        let numero = rows.item(0).numero;
                        console.log('Número del contacto con estado "sí":', numero);
                        resolve(numero);
                    } else {
                        console.log('No se encontró ningún contacto de emergencia activo.');
                        resolve('sin numero');
                    }
                },
                (_, error) => {
                    console.log('Error al buscar el contacto:', error);
                    reject(error);
                }
            );
        });
    });
};


export async function obtenerDatosPreviosSelec(rutUsuario) {
    console.log('OBTENIENDO DATOS MEDICOS PREVIOS DEL RUT: ', rutUsuario);
    return new Promise((resolve, reject) => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM Configuracion WHERE usuario_rut = ?',
                    [rutUsuario],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            const datosPreviosSelec = _array[0].DatosSeleccionados;
                            //console.log('Datos previos a vocalizar obtenidos:', datosPreviosSelec);
                            resolve(datosPreviosSelec)

                        } else {
                            console.log('No se encontraron datos previos a vocalizar');
                            resolve(null)
                        }
                    },
                    (_, error) => { reject(error), console.log('Error al obtener los datos al obtener datos previos a vocalizar:', error) }
                );
            });
        } catch (error) {
            console.log('Error al obtener los datos al obtener datos previos a vocalizar:', error)
            reject(error)

        }
    })
}


export async function obtenerDatosPreviosAnon(rutUsuario) {
    console.log('OBTENIENDO DATOS MEDICOS PREVIOS ANONIMOS DEL RUT: ', rutUsuario);
    return new Promise((resolve, reject) => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM Configuracion WHERE usuario_rut = ?',
                    [rutUsuario],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            let datosPreviosSelec = _array[0].DatosSeleccionados;
                            //console.log('Datos previos a vocalizar obtenidos:', datosPreviosSelec);
                            let patronesAEliminar = [
                                /^Rut: .*/m,
                                /^Primer nombre: .*/m,
                                /^Segundo nombre: .*/m,
                                /^Primer apellido: .*/m,
                                /^Segundo apellido: .*/m,
                                /^Alias: .*/m
                            ];

                            // Aplicar los patrones
                            for (let patron of patronesAEliminar) {
                                datosPreviosSelec = datosPreviosSelec.replace(patron, '');
                            }
                            datosPreviosSelec = datosPreviosSelec.replace(/\s+/g, ' ');
                            datosPreviosSelec = datosPreviosSelec.split('\n').filter(Boolean).join(', ');
                            //console.log(datosPreviosSelec.trim());


                            resolve(datosPreviosSelec.trim())

                        } else {
                            console.log('No se encuentran datos seleccionados');
                            resolve()
                        }
                    },
                    (_, error) => { reject(error), console.log('Error al obtener los datos al obtener datos previos:', error) }
                );
            });
        } catch (error) {
            console.log('Error al obtener los datos al obtener datos previos :', error)
            reject(error)

        }
    })
}

export async function addRecordatorio(recordatorio, idNotificacion) {
    return new Promise( (resolve, reject) => {
        let data = recordatorio;
        obtenerRut()
            .then(async (usuario_rut) => {
                console.log('idNotification: ', idNotificacion.toString());
                try {
                    db.transaction(async (tx) => {
                        tx.executeSql(
                            "INSERT OR IGNORE INTO Recordatorios (Titulo, Fecha, Hora, Descripcion, Estado, Dias, idNotificacion, usuario_rut) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
                            [
                                data.Titulo,
                                data.Fecha,
                                data.Hora,
                                data.Descripcion,
                                '0',
                                data.Dias.toString(),
                                idNotificacion.toString(),
                                usuario_rut,
                            ],
                            (_, { rows }) =>
                                console.log(
                                    'Recordatorio insertado:',
                                    data.Titulo,
                                    data.Fecha,
                                    data.Hora,
                                    data.Descripcion,
                                    '0',
                                    data.Dias.toString(),
                                    idNotificacion.toString(),
                                    usuario_rut
                                ),
                            (_, error) => {
                                console.log('Error al insertar datos:', error);
                                reject(error);
                            }
                        );
                    });
                    resolve();
                } catch (error) {
                    console.log('Error en la transacción:', error);
                    reject(error);
                }
            })
            .catch((error) => {
                console.log('Error al obtener el rut:', error);
                reject(error);
            });
    });
}


// resto de la implementacion de la bd

export function obtenerContactosEmergencia() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM Contacto;`,
                [],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        let contacto = _array;

                        resolve(contacto);
                    } else {
                        console.log('No hay registros en la tabla Contacto.');
                        resolve([]);
                    }
                },
                (_, error) => {
                    console.log('Error al obtener registros en la tabla Contacto:', error);
                    reject(error);
                }
            );
        })
    });
}


export async function obtenerContactosAlmacenados() {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT nombreCompleto ,alias ,relacion FROM Contacto;`,
                    [],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            let contacto = _array;
                            resolve(contacto);
                        } else {
                            resolve('No hay contactos ingresados');
                        }
                    },
                    (_, error) => {
                        reject();
                    }
                );
            })
        });
    } catch (error) {
        console.log('No hay contactos ingresados, error capturado');
    }
}



export function obtenerRut() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT rut FROM Usuario ORDER BY rut LIMIT 1;`,
                [],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        let rut = _array[0].rut;
                        //console.log('rut obtenido con la funcion:', rut);
                        resolve(rut);
                    } else {
                        console.log('No hay rut en la tabla Usuario.');
                        resolve(null);
                    }
                },
                (_, error) => {
                    console.log('Error al obtener el rut:', error);
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

export async function mostarDB(tabla) {
    db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${tabla}`, [], (_, { rows }) => {
            console.log(tabla, JSON.stringify(rows));
        });
    }
    )
};

export function obtenerMute(rut) {

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT Mute FROM Configuracion WHERE usuario_rut =?;`,
                [rut],
                (_, { rows: { _array } }) => {

                    if (_array.length > 0) {
                        //let Mute = _array[0].Mute;

                        const Mute = _array.map(mute => ({
                            ...mute,
                            Mute: mute.Mute,

                        }));

                        resolve(Mute);
                    } else {
                        //console.log('No hay rut en la tabla Configuracion.');
                        resolve(null);
                    }
                },
                (_, error) => {
                    console.log('Error al obtener el rut:', error);
                    reject(error);
                }
            );
        });
    });
}

export function muteADAM(usuario_rut, estado) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Configuracion WHERE usuario_rut = ?',
                [usuario_rut],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        // Si ya existe un registro para el usuario, actualiza los datos
                        tx.executeSql(
                            'UPDATE Configuracion SET Mute = ? WHERE usuario_rut = ?',
                            [estado, usuario_rut],
                            () => console.log('Mute estado ' + estado),
                            (_, error) => { reject(error), console.log('Error al actualizar los datos:', error) }
                        );
                    } else {
                        // Si no existe un registro para el usuario, inserta los datos
                        tx.executeSql(
                            'INSERT INTO Configuracion (Mute, usuario_rut) VALUES (?, ?)',
                            [estado, usuario_rut],
                            () => console.log('Datos a vocalizar insertados correctamente'),
                            (_, error) => { reject(error), console.log('Error al insertar los datos a vocalizar:', error) }
                        );
                    }
                },
                (_, error) => { reject(error), console.log('Error al obtener los datos a vocalizar :', error) }
            );
        });
    });
}





export function initDB() {
    //console.log('CREANDO BASE DE DATOS SQLITE')
    // tablas: Usuario Alergias PatologiasCronicas Medicamentos Limitaciones Contacto Historial centrosMedicos   


    // eliminar tabla
    /*db.transaction(tx => {
        tx.executeSql('DROP TABLE DolenciasSintomas', [], 
        (_,) => {console.log('Tabla eliminada DolenciasSintomas');},
        (_, error) => console.log('Error al crear la tabla DolenciasSintomas:', error)
        );

        
    });*/
    //eliminar contenido de una tabla
    /*db.transaction(tx => {
      tx.executeSql('DELETE FROM Usuario', [], (_, { rows }) => {
        console.log('Registros eliminados');
      });
    });*/

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
          altura TEXT,
          peso TEXT,
          imc TEXT,
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
        //crar tabla DolenciasSintomas con id, dolencia o sintoma, fecha, hora, descripcion, parte del cuerpo afectada, tiempo desde que aparecio dolencia
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS DolenciasSintomas (
          id INTEGER PRIMARY KEY NOT NULL,
          dolenciaSintoma TEXT,
          fechaHora TEXT,
          descripcion TEXT,
          parteCuerpoAfectada TEXT,
          tiempoDesdeAparicion TEXT,
          nivelDolor TEXT,
          medicamentosUtilizados  TEXT,
          dosisUtilizada  TEXT,
          usuario_rut TEXT,
          FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        );`,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla DolenciasSintomas:', error)
        );


        //Crear tabla recordatorios
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS recordatorios (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                Titulo TEXT, 
                Fecha TEXT, 
                Hora TEXT, 
                Descripcion TEXT, 
                Estado TEXT,
                Dias TEXT,
                idNotificacion TEXT,
                usuario_rut TEXT,
                FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
                
            );`,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla:', error)
        );

        //crear tabla confignotificaciones
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ConfigNotificaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            SeguimientoDolencias TEXT, 
            fechaSD TEXT,
            idsNotificacionesSD TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
            ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Configuracion:', error)
        )


        // Crear tabla Configuracion
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Configuracion(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            DatosSeleccionados TEXT,
            EstadoLlamadaDS TEXT,
            Mute TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Configuracion:', error)
        )

        // Crear tabla Medicamentos
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Medicamentos(
            id INTEGER PRIMARY KEY NOT NULL,
            medicamento TEXT,
            dosis TEXT,
            periodicidad TEXT,
            horarios TEXT,
            estadoNotificacion TEXT,
            idNotificacion TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Medicamentos:', error)
        );

        // Crear tabla Alergias
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Alergias(
            id INTEGER PRIMARY KEY NOT NULL,
            tipo TEXT,
            alergeno TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Alergias:', error)
        );

        // Crear tabla Patologias cronicas
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS PatologiasCronicas(
            id INTEGER PRIMARY KEY NOT NULL,
            tipo_patologia TEXT,
            nombre_patologia TEXT,
            transmisibilidad TEXT,
            morbilidad_intensidad TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Alergias:', error)
        );

        // Crear tabla Limitaciones
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Limitaciones(
            id INTEGER PRIMARY KEY NOT NULL,
            tipo_lim TEXT,
            severidad_lim TEXT,
            origen_lim TEXT,
            descripcion_lim TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Limitaciones:', error)
        );

        // Crear tabla Historial
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Historial(
            id TEXT PRIMARY KEY NOT NULL,
            fecha_hora TEXT,
            funcion TEXT,
            input TEXT,
            output TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Historial:', error)
        );

        // Crear tabla Contacto
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Contacto(
            id INTEGER PRIMARY KEY NOT NULL,
            nombreCompleto TEXT,
            alias TEXT,
            numero TEXT,
            relacion TEXT,
            estadoContacto TEXT,
            usuario_rut TEXT,
            FOREIGN KEY(usuario_rut) REFERENCES Usuario(rut)
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla Contacto:', error)
        );

        // Crear tabla centros medicos
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS centrosMedicos(
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
        ); `,
            [],
            () => { },
            (_, error) => console.log('Error al crear la tabla centrosMedicos:', error)
        );

        InsertCentrosMedicos()


    })
};
