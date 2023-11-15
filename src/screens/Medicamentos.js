import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"

const db = SQLite.openDatabase('adamdb.db');

const Medicamento = ({ medicamento, isEditing, handlePress, handleDelete, setCurrentMedicamentoId}) => {
    const [currentMedicamento, setCurrentMedicamento] = useState(medicamento);

    const handleChange = (key, val) => {
        setCurrentMedicamento(current => ({
            ...current,
            [key]: val
        }));
    };

    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Medicamento",
            "¿Estás seguro de que quieres eliminar este medicamento?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(medicamento.id)
                }
            ]
        );
    };

    return (
        <View className="mt-2">
            {isEditing ? (
                <>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5 mt-2">Medicamento:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.medicamento}
                        onChangeText={(val) => handleChange('medicamento', val)}
                    />
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5 mt-2">Dosis:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.dosis}
                        onChangeText={(val) => handleChange('dosis', val)}
                    />
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 ml-5 mt-2">Periodicidad:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.periodicidad}
                        onChangeText={(val) => handleChange('periodicidad', val)}
                    />
                </>
            ) : (
                <>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Medicamento:</Text>
                    <Text className="h-6 mb-2 mx-5 text-azulnegro">{currentMedicamento.medicamento}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Dosis:</Text>
                    <Text className="h-6 mb-2 mx-5 text-azulnegro">{currentMedicamento.dosis}</Text>
                    <Text className="text-rojoIntenso text-lg font-bold mb-3 pl-5">Periodicidad:</Text>
                    <Text className="h-6 mb-2 mx-5 text-azulnegro">{currentMedicamento.periodicidad}</Text>
                </>
            )}

            <View className="flex-row self-center justify-around w-full mt-3">
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={() => handlePress(medicamento.id, currentMedicamento)}
                >
                    <Text style={styles.celesteText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Medicamento'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.celesteButton}
                    onPress={handleDeletePress} // Modificar esto
                >
                    <Text style={styles.rojoIntensoText}>
                        Eliminar Medicamento
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.celesteButton}
                        onPress={() => setCurrentMedicamentoId(null)}
                    >
                        <Text style={styles.rojoIntensoText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                    </>
            ):null}
            <View style={styles.lineaContainer}>
            </View>

        </View>
    );
};

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [currentMedicamentoId, setCurrentMedicamentoId] = useState(null);

    const [modalVisibleMedicamentos, setModalVisibleMedicamentos] = useState(false);
    const [nomMedicamento, setNomMedicamento] = useState('');
    const [dosis, setDosis] = useState('');
    const [periodicidad, setPeriodicidad] = useState('');

    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) =>
                setMedicamentos(rows._array)
            );
        });
    }, []);

    const handleAgregarMedicamentoPress = () => {
        setModalVisibleMedicamentos(true);
    };

    const handlePress = (id, medicamento) => {
        if (currentMedicamentoId === id) {
            // Actualizar medicamento 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Medicamentos SET medicamento = ?, dosis = ?, periodicidad = ? WHERE id = ?',
                    [medicamento.medicamento, medicamento.dosis, medicamento.periodicidad, id],
                    (_, resultSet) => {
                        console.log("Actualización exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) =>
                            setMedicamentos(rows._array)
                        );
                    }
                );
            });

            // Resetear estado de edición
            setCurrentMedicamentoId(null);
        } else {
            // Iniciar edición
            setCurrentMedicamentoId(id);
        }
    };
    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM Medicamentos WHERE id = ?',
                [id],
                (_, resultSet) => {
                    console.log("Eliminación exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) =>
                        setMedicamentos(rows._array)
                    );
                }
            );
        });
    };
    const agregarMedicamento = async () => {
        let usuario_rut= await obtenerRut()
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Medicamentos (medicamento, dosis, periodicidad, usuario_rut) VALUES (?, ?, ?, ?)',
                [nomMedicamento, dosis, periodicidad, usuario_rut],
                (_, resultSet) => {
                    console.log("Inserción exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) =>
                        setMedicamentos(rows._array)
                    );
                }
            );
        });

        // Resetear los estados
        setNomMedicamento('');
        setDosis('');
        setPeriodicidad('');
    };

    return (
        <ScrollView className="flex-1 bg-grisClaro px-5 pt-3">
            <View>
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={handleAgregarMedicamentoPress} // Agregar esto
                >
                    <Text style={styles.celesteText}>
                        Agregar un nuevo medicamento
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            {medicamentos.map(medicamento => (
                <Medicamento
                    key={medicamento.id}
                    medicamento={medicamento}
                    isEditing={currentMedicamentoId === medicamento.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    setCurrentMedicamentoId={setCurrentMedicamentoId}
                />
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleMedicamentos}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleMedicamentos(false);
                }}
            >
                <View className="flex-1 justify-center items-center px-3 bg-fondoOscurecido">
                    <View style={styles.modalView}>
                        <Text className="text-center text-rojoIntenso font-bold text-lg pb-3">Indica el nombre del medicamento:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setNomMedicamento(text)}
                            value={nomMedicamento}
                        />
                        <Text className="text-center text-rojoIntenso font-bold text-lg pb-3">Indica la dosis a ingerir:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setDosis(text)}
                            value={dosis}
                        />
                        <Text className="text-center text-rojoIntenso font-bold text-lg pb-3">Indica cada cuanto debes tomar el medicamento:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={periodicidad}
                                onValueChange={(itemValue) => setPeriodicidad(itemValue)}
                                style={styles.inputPicker2}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Cada 24 hrs (Una vez al dia)" value="Cada 24 hrs (Una vez al dia)" />
                                <Picker.Item label="Cada 12 hrs (Dos veces al dia)" value="Cada 12 hrs (Dos veces al dia)" />
                                <Picker.Item label="Cada 8 hrs (Tres veces al dia)" value="Cada 8 hrs (Tres veces al dia)" />
                                <Picker.Item label="Cada 6 hrs (Cuatro veces al dia)" value="Cada 6 hrs (Cuatro veces al dia)" />
                                <Picker.Item label="Cada 4 hrs (Seis veces al dia)" value="Cada 4 hrs (Seis veces al dia)" />
                            </Picker>
                        </View>
                        <View className="flex-row self-center justify-around w-full mt-5">
                        <TouchableOpacity style={styles.celesteButton} onPress={() => {setModalVisibleMedicamentos(false)}}>
                                <Text style={styles.rojoIntensoText}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rojoIntensoButton} onPress={() => {agregarMedicamento()}}>
                                <Text style={styles.celesteText}>
                                    Agregar nuevo medicamento
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus medicamentos.'
            />
        </ScrollView>
    );
};
export default Medicamentos;