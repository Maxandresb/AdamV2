//SeguimientoNocturno.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Modal } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import styles from '../api/styles';
import { EstadoSeguimiento } from "../api/ayudaNocturna";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import SelectorMinutos from "../api/selectorMinutos";

export const db = SQLite.openDatabase('adamdb.db');


export default function SeguimientoNocturno() {
    const [modalVisible, setModalVisible] = useState(false);
    const [minutos, setMinutos] = useState(0);
    const navigation = useNavigation();

    const continua = () => {
        EstadoSeguimiento()
        navigation.navigate('ADAM');
    }
    const minutosSeleccionados = (selectedNumber) => {
        setMinutos(selectedNumber)
    };
    const espera = async () => {
        //transformar minutos a segundos
        let segundos = minutos * 60;

        // envía una notificación al usuario en el tiempo indicado por el 
        const notificacion = {
            title: `Ya pasaron ${minutos} minutos`,
            body: 'Avisare a tu contacto de emergencia si no respondes pronto',
            data: { navigateTo: 'seguimiento-nocturno' },
        };
        console.log('Enviando notificación: ', notificacion);
        try {
            await Notifications.scheduleNotificationAsync({
                content: notificacion,
                trigger: segundos,
            });
        } catch (error) {
            console.log('Error al programar la notificación: ', error);
        }
        setModalVisible(false)
        navigation.navigate('ADAM');
    }



    return (
        <View style={styless.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>Selecciona una opcion:</Text>
            </View>
            <TouchableOpacity
                style={{ width: '70%', alignItems: 'center', margin: 20, borderWidth: 1, borderColor: 'black', padding: 30, backgroundColor: 'lightgreen' }}
                onPress={() => { continua() }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Ya volvi a la cama</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ width: '70%', alignItems: 'center', margin: 20, borderWidth: 1, borderColor: 'black', padding: 30, backgroundColor: 'lightblue' }}
                onPress={() => { setModalVisible(true) }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Preguntame en unos minutos</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ width: '70%', alignItems: 'center', margin: 20, borderWidth: 1, borderColor: 'black', padding: 30, backgroundColor: 'red' }}
                onPress={() => { setModalVisible(true) }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Necesito ayuda</Text>
            </TouchableOpacity>
            <View style={{ width: '70%', alignItems: 'flex-start', marginTop: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Si no se selecciona una opcion, se avisara a tu contacto de emergencia en 5 minutos</Text>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View className="flex-1 justify-center items-center px-3 bg-fondoOscurecido">
                    <View style={styles.modalView}>
                        <SelectorMinutos onConfirm={minutosSeleccionados} />
                        <View style={{flexDirection:'column', alignItems:'center'}}>
                        <TouchableOpacity
                            style={{ width: '80%', alignItems: 'center', margin: 10, borderWidth: 1, borderColor: 'black', padding: 15, backgroundColor: 'lightgreen' }}
                            onPress={() => { espera() }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Continuar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: '80%', alignItems: 'center', margin: 10, borderWidth: 1, borderColor: 'black', padding: 15, backgroundColor: 'red' }}
                            onPress={() => { setModalVisible(!modalVisible) }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Cancelar</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styless = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});