import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"
import { format } from 'date-fns';
import SelecTiempoAtras from '../api/selecTiempoAtras';

const db = SQLite.openDatabase('adamdb.db');

const DolenciaSintoma = ({ dolenciaSintoma, isEditing, handlePress, handleDelete, setCurrentDolenciaSintomaId }) => {
    const [currentDolenciaSintoma, setCurrentDolenciaSintoma] = useState(dolenciaSintoma);
    const [tiempoDesdeAparicion, setTiempoDesdeAparicion] = useState('');

    const handleChange = (key, val) => {
        setCurrentDolenciaSintoma(current => ({
            ...current,
            [key]: val
        }));
    };

    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Dolencia o Síntoma",
            "¿Estás seguro de que quieres eliminar esta dolencia o síntoma?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(dolenciaSintoma.id)
                }
            ]
        );
    };

    const partesCuerpo = ["Cabeza", "Torso", "Brazo derecho", "Brazo izquierdo", "Pierna derecha", "Pierna izquierda"];

    return (
        <View className="mx-5">
            {isEditing ? (
                <>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Dolencia o Síntoma:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentDolenciaSintoma.dolenciaSintoma}
                        onChangeText={(val) => handleChange('dolenciaSintoma', val)}
                    />
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Descripción:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentDolenciaSintoma.descripcion}
                        onChangeText={(val) => handleChange('descripcion', val)}
                    />
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Parte del cuerpo afectada:</Text>
                    <View style={styles.inputPicker}>
                        <Picker
                            selectedValue={currentDolenciaSintoma.parteCuerpoAfectada}
                            onValueChange={(itemValue) => handleChange('parteCuerpoAfectada', itemValue)}
                            style={styles.inputPicker2}
                        >
                            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                            {partesCuerpo.map((parte, index) => (
                                <Picker.Item key={index} label={parte} value={parte} />
                            ))}
                        </Picker>
                    </View>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Tiempo desde aparición:</Text>
                    <SelecTiempoAtras onConfirm={(number, word) => {
                        let tiempodesde = number + ' ' + word
                        //setTiempoDesdeAparicion(tiempodesde)
                        handleChange('tiempoDesdeAparicion', tiempodesde)
                    }} />


                </>
            ) : (
                <>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Dolencia o Síntoma:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentDolenciaSintoma.dolenciaSintoma}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Fecha y hora del registro:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentDolenciaSintoma.fechaHora}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Descripción:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentDolenciaSintoma.descripcion}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Parte del cuerpo afectada:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentDolenciaSintoma.parteCuerpoAfectada}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Tiempo desde aparición:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentDolenciaSintoma.tiempoDesdeAparicion}</Text>
                </>

            )}

            <View className="flex-row  justify-between self-center mt-5">
                <TouchableOpacity
                    style={[styles.rojoIntensoButton, { textAlign: 'center', textAlignVertical: 'center', flexWrap: 'wrap' }]}
                    onPress={() => handlePress(dolenciaSintoma.id, currentDolenciaSintoma)}
                >
                    <Text style={styles.celesteText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Dolencia/Síntoma'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.celesteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.rojoIntensoText}>
                        Eliminar Dolencia/Síntoma
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.celesteButton}
                        onPress={() => setCurrentDolenciaSintomaId(null)}
                    >
                        <Text style={styles.rojoIntensoText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </>
            ) : null}

        </View>
    );
};

const DolenciasSintomas = () => {
    const [dolenciasSintomas, setDolenciasSintomas] = useState([]);
    const [currentDolenciaSintomaId, setCurrentDolenciaSintomaId] = useState(null);

    const [modalVisibleDolenciasSintomas, setModalVisibleDolenciasSintomas] = useState(false);
    const [dolenciaSintoma, setDolenciaSintoma] = useState('');
    const [fechaHora, setFechaHora] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [parteCuerpoAfectada, setParteCuerpoAfectada] = useState('');
    const [tiempoDesdeAparicion, setTiempoDesdeAparicion] = useState('');

    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) =>
                setDolenciasSintomas(rows._array)
            );
        });
    }, []);

    const handleAgregarDolenciaSintomaPress = () => {
        setModalVisibleDolenciasSintomas(true);
    };

    const partesCuerpo = ["Cabeza", "Torso", "Brazo derecho", "Brazo izquierdo", "Pierna derecha", "Pierna izquierda"];

    const handlePress = (id, dolenciaSintoma) => {
        if (currentDolenciaSintomaId === id) {
            // Actualizar dolencia o síntoma
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE DolenciasSintomas SET dolenciaSintoma = ?, descripcion = ?, parteCuerpoAfectada = ?, tiempoDesdeAparicion = ? WHERE id = ?',
                    [dolenciaSintoma.dolenciaSintoma, dolenciaSintoma.descripcion, dolenciaSintoma.parteCuerpoAfectada, dolenciaSintoma.tiempoDesdeAparicion, id],
                    (_, resultSet) => {
                        console.log("Actualización exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) =>
                            setDolenciasSintomas(rows._array)
                        );
                    }
                );
            });

            // Resetear estado de edición
            setCurrentDolenciaSintomaId(null);
        } else {
            // Iniciar edición
            setCurrentDolenciaSintomaId(id);
        }
    };

    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM DolenciasSintomas WHERE id = ?', [id], (_, resultSet) => {
                console.log("Eliminación exitosa!");
                // Recargar datos
                tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) =>
                    setDolenciasSintomas(rows._array)
                );
            });
        });
    };

    const agregarDolenciaSintoma = async () => {
        try {
            let usuario_rut = await obtenerRut()
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(
                        'INSERT INTO DolenciasSintomas (dolenciaSintoma, fechaHora, descripcion, parteCuerpoAfectada, tiempoDesdeAparicion, usuario_rut) VALUES (?, ?, ?, ?, ?, ?)',
                        [dolenciaSintoma, fec_hor, descripcion, parteCuerpoAfectada, tiempoDesdeAparicion, usuario_rut],
                        (_, resultSet) => {
                            console.log("Adición exitosa!");
                            // Recargar datos
                            tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) => {
                                setDolenciasSintomas(rows._array);
                                resolve(rows._array);
                            }, (tx, error) => {
                                console.log("Error al cargar los datos: " + error.message);
                                reject(error);
                            });
                        },
                        (tx, error) => {
                            console.log("Error al insertar los datos: " + error.message);
                            reject(error);
                        }
                    );
                }, (error) => {
                    console.log("Error en la transacción: " + error.message);
                    reject(error);
                });
                // Resetear los estados
                setDolenciaSintoma('');
                setFechaHora('');
                setDescripcion('');
                setParteCuerpoAfectada('');
                setTiempoDesdeAparicion('');


            });
        } catch (error) {
            console.log("Error: " + error.message);
            reject(error);
        }
    };

    let fec_hor = format(new Date(), 'dd/MM/yyyy - HH:mm');

    return (
        <ScrollView className="flex-1 bg-grisClaro px-5 pt-3">
            <View className="mt-5 mx-3 mb-5">
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={handleAgregarDolenciaSintomaPress}
                >
                    <Text style={styles.celesteText}>
                        Agregar nueva dolencia o síntoma
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            {dolenciasSintomas.map((dolenciaSintoma) => (
                <DolenciaSintoma
                    key={dolenciaSintoma.id}
                    dolenciaSintoma={dolenciaSintoma}
                    isEditing={currentDolenciaSintomaId === dolenciaSintoma.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    setCurrentDolenciaSintomaId={setCurrentDolenciaSintomaId}
                    setTiempoDesdeAparicion={setTiempoDesdeAparicion}
                />
            ))}
            <View style={styles.lineaContainer}></View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDolenciasSintomas}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleDolenciasSintomas(false);
                }}
            >
                <View className="flex-1 justify-center bg-fondoOscurecido py-12">
                    <View style={styles.modalView} className="self-center">
                        <Text className="text-center text-rojoIntenso text-lg font-bold pb-3">Ingresa tu dolencia o síntoma:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: Dolor de cabeza"
                            onChangeText={text => setDolenciaSintoma(text)}
                            value={dolenciaSintoma}
                        />
                        <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Fecha y hora del registro:</Text>
                        <Text style={styles.input}>{fec_hor}</Text>
                        <Text className="text-center text-rojoIntenso text-lg font-bold pb-3">Ingresa la descripción:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder={`ej: Dolor fuerte en la cabeza`}
                            onChangeText={text => setDescripcion(text)}
                            value={descripcion}
                        />
                        <Text className="text-center text-rojoIntenso text-lg font-bold pb-3">Selecciona la parte del cuerpo afectada:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={parteCuerpoAfectada}
                                onValueChange={(itemValue) => setParteCuerpoAfectada(itemValue)}
                                style={styles.inputPicker2}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                {partesCuerpo.map((parte, index) => (
                                    <Picker.Item key={index} label={parte} value={parte} />
                                ))}
                            </Picker>
                        </View>
                        <Text className="text-center text-rojoIntenso text-lg font-bold pb-3">Ingresa el tiempo desde aparición:</Text>
                        <SelecTiempoAtras onConfirm={(number, word) => {
                            let tiempodesde = number + ' ' + word
                            setTiempoDesdeAparicion(tiempodesde)
                        }} />
                        <View className="flex-row  justify-between self-center mt-5" >
                            <TouchableOpacity style={styles.celesteButton} onPress={() => { setModalVisibleDolenciasSintomas(false) }}>
                                <Text style={styles.rojoIntensoText}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rojoIntensoButton} onPress={() => { agregarDolenciaSintoma() }}>
                                <Text style={styles.celesteText}>
                                    Agregar nueva dolencia o síntoma
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus dolencias o síntomas.'
            />
        </ScrollView>
    );
};
export default DolenciasSintomas;

