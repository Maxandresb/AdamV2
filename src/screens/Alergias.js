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
        <View>
            {isEditing ? (
                <>
                    <Text className="text-redcoral text-lg font-bold mb-3 ml-5">Tipo de alergia:</Text>
                    <View className="bg-beige h-12 mb-3 mx-5 border-2 border-salmon rounded-md">
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
                    <Text className="text-redcoral text-lg font-bold mb-3 ml-5">Alergeno:</Text>
                    <TextInput
                        className="bg-beige h-12 mb-3 mx-5 border-b-2 border-salmon rounded-t-md placeholder:text-azulnegro pl-3"
                        value={currentAlergia.alergeno}
                        onChangeText={(val) => handleChange('alergeno', val)}
                    />
                </>
            ) : (
                <>
                    <Text className="text-redcoral text-lg font-bold mb-3 pl-5">Tipo de alergia:</Text>
                    <Text className="h-6 mb-2 mx-5 text-azulnegro">{currentAlergia.tipo}</Text>
                    <Text className="text-redcoral text-lg font-bold mb-3 pl-5">Alergeno:</Text>
                    <Text className="h-6 mb-2 mx-5 text-azulnegro">{currentAlergia.alergeno}</Text>
                </>
            )}

            <View className="flex-row self-center justify-around w-full mt-3">
                <TouchableOpacity
                    className="bg-redcoral p-3 rounded-md justify-center shadow-lg shadow-negro"
                    onPress={() => handlePress(alergia.id, currentAlergia)}
                >
                    <Text className="text-damasco text-center font-bold">
                        {isEditing ? 'Guardar cambios' : 'Modificar Alergia'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-azulnegro p-3 rounded-md justify-center shadow-lg shadow-negro"
                    onPress={handleDeletePress}
                >
                    <Text className="text-center text-azul font-bold">
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
                    className="bg-redcoral rounded-md h-10 justify-center shadow-lg shadow-negro"
                    onPress={handleAgregarAlergiaPress} // Agregar esto
                >
                    <Text className="text-damasco font-bold text-lg self-center">
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
                <View className="flex-1 justify-center align-middle bg-fondoOscurecido py-12">
                    <View className="bg-redcoral py-5 mx-6 rounded-lg">
                        <Text className="text-center text-damasco text-lg font-bold pb-3">Ingresa tu tipo de alergia:</Text>
                        <View className="h-12 border-2 border-salmon mb-5 bg-beige rounded-md justify-center pt-4 mx-10">
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
                        <Text className="text-center text-damasco text-lg font-bold pb-3">Ingresa tu alergeno:</Text>
                        <TextInput
                            className="bg-beige h-12 border-2 border-salmon mb-5 rounded-md pl-2 mx-10 placeholder:text-azulnegro"
                            placeholderTextColor="gray"
                            placeholder="ej: Perros"
                            onChangeText={text => setAlergeno(text)}
                            value={alergeno}
                        />
                        <View className="flex-row w-4/5 justify-between self-center mt-5">
                            <TouchableOpacity className="h-12 w-28 p-2 bg-azulnegro justify-center rounded-md shadow-md shadow-negro"  onPress={() => {setModalVisibleAlergias(false)}}>
                                <Text className=" text-md text-azul font-bold text-center">
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="h-12 w-28 p-2 bg-damasco justify-center rounded-md shadow-md shadow-negro" onPress={() => {agregarAlergia()}}>
                                <Text className="text-md text-redcoral font-bold text-center">
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


