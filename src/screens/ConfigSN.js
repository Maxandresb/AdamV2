//ConfigSN.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { EstadoSeguimiento } from "../api/ayudaNocturna";
import styles from '../api/styles';
import SelectorMinutos from "../api/selectorMinutos";
import SelectorHora from "../api/selectorHora";

export const db = SQLite.openDatabase('adamdb.db');

export default function ConfigSN() {
    const [seguimientoActivo, setSeguimientoActivo] = useState(false);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [tiempoEspera, setTiempoEspera] = useState('');
    const [editarDatos, setEditarDatos] = useState(false);
    const [editando, setEditando] = useState(false);


    useEffect(() => {
        // Leer el estado del seguimiento nocturno de la base de datos al cargar la pantalla
        db.transaction((tx) => {
            tx.executeSql('SELECT SeguimientoNocturno FROM Configuracion WHERE id = ?',
                [1],
                (tx, results) => {
                    let estado = results.rows.length > 0 ? results.rows.item(0).SeguimientoNocturno : '0';
                    setSeguimientoActivo(estado === '1');
                },
                (error) => {
                    console.log('Error al leer el estado del seguimiento nocturno de la base de datos: ' + error);
                }
            );
        }, (error) => {
            console.log('estado de seguimiento nocturno no definido aun en seguimiento: ' + error);
        });
        try {
            EstadoSeguimiento()
        } catch (error) {
            console.log('Error al obtener el estado del seguimiento nocturno: ', error);
        }
    }, []);

    const toggleSeguimiento = () => {
        // Cambiar el estado del seguimiento nocturno
        const nuevoEstado = !seguimientoActivo;
        setSeguimientoActivo(nuevoEstado);

        // Guardar el nuevo estado en la base de datos
        db.transaction((tx) => {
            tx.executeSql('UPDATE Configuracion SET SeguimientoNocturno = ?', [nuevoEstado ? '1' : '0']);
        }, (error) => {
            console.log('Error al escribir en la base de datos: ' + error.message);
        });

    };

    useEffect(() => {
        EstadoSeguimiento();
    }, [seguimientoActivo]);

    useEffect(() => {
        try{
            db.transaction((tx) => {
                tx.executeSql('SELECT SNHoraInicio, SNHoraFin, SNTiempoEspera FROM Configuracion WHERE id = ?', [1], (tx, results) => {
                    let config = results.rows.length > 0 ? results.rows.item(0) : null;
                    if (config) {
                        //console.log("Configuraciones obtenidas: ", config);
                        setHoraInicio(config.SNHoraInicio);
                        setHoraFin(config.SNHoraFin);
                        setTiempoEspera(config.SNTiempoEspera);
                    }

                }, (error) => {
                    console.log('Error al obtener la configuración: ', error);
                });
            }, (error) => {
                console.log('Error al obtener la configuración: ', error);
            });
        } catch(error){
            console.log('Error al obtener la configuración: ', error);
        }
    }, []);

    const guardarCambios = () => {
        db.transaction((tx) => {
            tx.executeSql('UPDATE Configuracion SET SNHoraInicio = ?, SNHoraFin = ?, SNTiempoEspera = ?', [horaInicio, horaFin, tiempoEspera]);
        }, (error) => {
            console.log('Error al escribir en la base de datos: ' + error.message);
        });
        setEditando(false);
    };

    const cambiarConfig = () => {
        setEditarDatos(true);
        setEditando(true)
    };
    const cancelar = () => {
        setEditarDatos(false);
        setEditando(false);
    }
    const guardar = () => {
        setEditarDatos(false);
        setEditando(false);
        guardarCambios()
    }
    const minutosSeleccionados = (selectedNumber) => {
        let minutos = selectedNumber.toString();
        setTiempoEspera(minutos)
    };
    const styleMinutos = {
        fontSize: 15,
        paddingLeft: 20,
        paddingTop: 12,
        backgroundColor: '#efefef',
        height: 40,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    };
    const horaInicioSeleccionada = (selectedNumber, selectedAmPm) => {
        let hora = selectedNumber + ' ' + selectedAmPm
        setHoraInicio(hora)
    };
    const horaFinSeleccionada = (selectedNumber, selectedAmPm) => {
        let hora = selectedNumber + ' ' + selectedAmPm
        setHoraFin(hora)
    };

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 30, paddingBottom: 30, paddingLeft: 20, alignItems: 'center', backgroundColor: '#000000' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Estado de la funcion: </Text>
                <TouchableOpacity
                    style={{
                        width: '40%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 20,
                        backgroundColor: seguimientoActivo ? 'lightgreen' : '#ff3e45',
                        padding: 20,

                    }}
                    onPress={toggleSeguimiento}
                >
                    <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>
                        {seguimientoActivo ? 'ACTIVA' : 'INACTIVA'}
                    </Text>
                </TouchableOpacity>

            </View>
            <View style={{ margin: 5, }}>
                {
                    editarDatos ? (
                        <View style={{ marginTop: 20 }}>
                            <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">¿A que horas quieres que inicie el seguimiento?</Text>
                            <View style={{ margin: 10 }}>
                                <SelectorHora onConfirm={horaInicioSeleccionada} />
                            </View>

                            <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">¿A que hora quieres que termine el seguimiento?</Text>
                            <View style={{ margin: 10 }}>
                                <SelectorHora onConfirm={horaFinSeleccionada} />
                            </View>

                            <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">¿En cuanto tiempo debemos avisar a tu contacto de emergencia?</Text>
                            <View style={{ margin: 10 }}>
                                <SelectorMinutos onConfirm={minutosSeleccionados} selectedViewStyle={styleMinutos} />
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: 20 }}>
                            <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Hora de inicio del seguimiento:</Text>
                            <Text className="h-6 mb-2 mx-5 text-negro">{horaInicio}</Text>
                            <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Hora de termino del seguimiento:</Text>
                            <Text className="h-6 mb-2 mx-5 text-negro">{horaFin}</Text>
                            <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Tiempo de espera antes de avisar a tu contacto de emergencia:</Text>
                            <Text className="h-6 mb-2 mx-5 text-negro">{tiempoEspera}{' Minutos'}</Text>
                        </View>
                    )
                }
                {
                    editando ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ width: '40%', borderWidth: 1, borderColor: 'black', padding: 20, margin: 10, alignItems: 'center', backgroundColor: 'lightgreen' }} onPress={guardar}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{'Guardar'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '40%', borderWidth: 1, borderColor: 'black', padding: 20, margin: 10, alignItems: 'center', backgroundColor: '#ff3e45' }} onPress={cancelar}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{'Cancelar'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 30 }}>
                            <TouchableOpacity style={{ alignItems: 'center', width: '80%', borderWidth: 1, borderColor: 'black', padding: 20, backgroundColor: '#ff3e45' }} onPress={cambiarConfig}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{'Cambiar Configuracion'}</Text>
                            </TouchableOpacity>
                        </View>
                    )

                }
                <View style={styles.lineaContainer}></View>
                <View style={{ margin: 20, marginTop: 20 }}>
                    <Text style={{ fontSize: 17, textAlign: 'justify', fontWeight: 'bold' }}>Esta funcion registra movimientos bruscos que hagas con tu telefono, en caso de caidas o accidentes podemos avisar a tu contacto de emergencia mediante un mensaje de WhatsApp </Text>
                </View>
            </View>
        </>
    );
}
