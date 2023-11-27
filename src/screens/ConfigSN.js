//SeguimientoNocturno.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { EstadoSeguimiento } from "../api/ayudaNocturna";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

export const db = SQLite.openDatabase('adamdb.db');

export default function ConfigSN() {
    const [seguimientoActivo, setSeguimientoActivo] = useState(false);

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

    return (
        <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 10, alignItems: 'center' }}>
            <Text>Estado actual:   {seguimientoActivo ? 'ACTIVO' : 'INACTIVO'} </Text>
            <TouchableOpacity style={{ marginLeft: '30%', borderWidth: 1, borderColor: 'black', padding: 20 }} onPress={toggleSeguimiento}>
                <Text>{seguimientoActivo ? 'Desactivar' : 'Activar'}</Text>
            </TouchableOpacity>
        </View>
    );
}
