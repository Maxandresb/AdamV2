import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"


const db = SQLite.openDatabase('adamdb.db');

const Alergia = ({ alergia, isEditing, handlePress, handleDelete }) => {
    const [currentAlergia, setCurrentAlergia] = useState(alergia);

    const handleChange = (key, val) => {
        setCurrentAlergia(current => ({
            ...current,
            [key]: val
        }));
    };

    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Alergia",
            "¿Estás seguro de que quieres eliminar esta alergia?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(alergia.id)
                }
            ]
        );
    };

    return (
        <View className="mx-5">
            {isEditing ? (
                <>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Tipo de alergia:</Text>
                    <View style={styles.inputPicker}>
                        <Picker
                            selectedValue={currentAlergia.tipo}
                            onValueChange={(itemValue) => handleChange('tipo', itemValue)}
                            style={styles.inputPicker2}
                        >
                            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                            <Picker.Item label="Alergenos" value="Alergenos" />
                            <Picker.Item label="Medicamentos" value="Medicamentos" />
                            <Picker.Item label="Alimentos" value="Alimentos" />
                        </Picker>
                    </View>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5">Alergeno:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentAlergia.alergeno}
                        onChangeText={(val) => handleChange('alergeno', val)}
                    />
                </>
            ) : (
                <>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Tipo de alergia:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentAlergia.tipo}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Alergeno:</Text>
                    <Text className="h-6 mb-2 mx-5 text-negro">{currentAlergia.alergeno}</Text>
                </>
            )}

            <View className="flex-row self-center justify-around w-full mt-3">
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={() => handlePress(alergia.id, currentAlergia)}
                >
                    <Text style={styles.celesteText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Alergia'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.celesteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.rojoIntensoText}>
                        Eliminar Alergia
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}>
            </View>

        </View>
    );
};

const Alergias = () => {
    const [alergias, setAlergias] = useState([]);
    const [currentAlergiaId, setCurrentAlergiaId] = useState(null);

    const [modalVisibleAlergias, setModalVisibleAlergias] = useState(false);
    const [tipoAlergia, setTipoAlergia] = useState('');
    const [alergeno, setAlergeno] = useState('');

    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Alergias', [], (_, { rows }) =>
                setAlergias(rows._array)
            );
        });
    }, []);

    const handleAgregarAlergiaPress = () => {
        setModalVisibleAlergias(true);
    };

    const handlePress = (id, alergia) => {
        if (currentAlergiaId === id) {
            // Actualizar alergia 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Alergias SET tipo = ?, alergeno = ? WHERE id = ?',
                    [alergia.tipo, alergia.alergeno, id],
                    (_, resultSet) => {
                        console.log("Actualización exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM Alergias', [], (_, { rows }) =>
                            setAlergias(rows._array)
                        );
                    }
                );
            });

            // Resetear estado de edición
            setCurrentAlergiaId(null);
        } else {
            // Iniciar edición
            setCurrentAlergiaId(id);
        }

    };
    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM Alergias WHERE id = ?', [id], (_, resultSet) => {
                console.log("Eliminación exitosa!");
                // Recargar datos
                tx.executeSql('SELECT * FROM Alergias', [], (_, { rows }) =>
                    setAlergias(rows._array)
                );
            });
        });
    };
    const agregarAlergia = async() => {
        let usuario_rut= await obtenerRut()
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Alergias (tipo, alergeno, usuario_rut) VALUES (?, ?, ?)',
                [tipoAlergia, alergeno, usuario_rut],
                (_, resultSet) => {
                    console.log("Adición exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM Alergias', [], (_, { rows }) =>
                        setAlergias(rows._array)
                    );
                }
            );
        });
        // Resetear los estados
        setTipoAlergia('');
        setAlergeno('');
    };


    return (
        <ScrollView className="bg-damasco">
            <View className="mt-5 mx-3 mb-5">
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={handleAgregarAlergiaPress} // Agregar esto
                >
                    <Text style={styles.celesteText}>
                        Agregar nueva alergia
                    </Text>
                </TouchableOpacity>
            </View>
            {alergias.map((alergia) => (
                <Alergia
                    key={alergia.id}
                    alergia={alergia}
                    isEditing={currentAlergiaId === alergia.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                />
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAlergias}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleAlergias(false);
                }}
            >
                <View className="flex-1 justify-center bg-fondoOscurecido py-12">
                    <View style={styles.modalView} className="self-center">
                        <Text className="text-center text-rojoIntenso text-lg font-bold pb-3">Ingresa tu tipo de alergia:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={tipoAlergia}
                                onValueChange={(itemValue) => setTipoAlergia(itemValue)}
                                style={styles.inputPicker2}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Alergenos" value="Alergenos" />
                                <Picker.Item label="Medicamentos" value="Medicamentos" />
                                <Picker.Item label="Alimentos" value="Alimentos" />
                            </Picker>
                        </View>
                        <Text className="text-center text-rojoIntenso text-lg font-bold pb-3">Ingresa tu alergeno:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: Perros"
                            onChangeText={text => setAlergeno(text)}
                            value={alergeno}
                        />
                        <View className="flex-row w-4/5 justify-between self-center mt-5">
                            <TouchableOpacity style={styles.celesteButton}  onPress={() => {setModalVisibleAlergias(false)}}>
                                <Text style={styles.rojoIntensoText}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rojoIntensoButton} onPress={() => {agregarAlergia()}}>
                                <Text style={styles.celesteText}>
                                    Agregar nueva alergia
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus alergias.'
            />
        </ScrollView>
    );

};
export default Alergias;


