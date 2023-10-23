import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';

const db = SQLite.openDatabase('adamdb.db');

const Medicamento = ({ medicamento, isEditing, handlePress, handleDelete }) => {
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
        <View>
            {isEditing ? (
                <>
                    <Text style={styles.encabezadoInicial}>Medicamento:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.medicamento}
                        onChangeText={(val) => handleChange('medicamento', val)}
                    />
                    <Text style={styles.encabezado}>Dosis:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.dosis}
                        onChangeText={(val) => handleChange('dosis', val)}
                    />
                    <Text style={styles.encabezado}>Periodicidad:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.periodicidad}
                        onChangeText={(val) => handleChange('periodicidad', val)}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.encabezadoInicial}>Medicamento:</Text>
                    <Text style={styles.content}>{currentMedicamento.medicamento}</Text>
                    <Text style={styles.encabezado}>Dosis:</Text>
                    <Text style={styles.content}>{currentMedicamento.dosis}</Text>
                    <Text style={styles.encabezado}>Periodicidad:</Text>
                    <Text style={styles.content}>{currentMedicamento.periodicidad}</Text>
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePress(medicamento.id, currentMedicamento)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Medicamento'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress} // Modificar esto
                >
                    <Text style={styles.buttonText}>
                        Eliminar Medicamento
                    </Text>
                </TouchableOpacity>
            </View>
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
    const agregarMedicamento = () => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Medicamentos (medicamento, dosis, periodicidad) VALUES (?, ?, ?)',
                [nomMedicamento, dosis, periodicidad],
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
        <ScrollView style={styles.container}>
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAgregarMedicamentoPress} // Agregar esto
                >
                    <Text style={styles.buttonText}>
                        Agregar un nuevo medicamento
                    </Text>
                </TouchableOpacity>
            </View>
            {medicamentos.map(medicamento => (
                <Medicamento
                    key={medicamento.id}
                    medicamento={medicamento}
                    isEditing={currentMedicamentoId === medicamento.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.header}>Indica el nombre del medicamento:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setNomMedicamento(text)}
                            value={nomMedicamento}
                        />
                        <Text style={styles.header}>Indica la dosis a ingerir:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setDosis(text)}
                            value={dosis}
                        />
                        <Text style={styles.header}>Indica cada cuanto debes tomar el medicamento:</Text>
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
                        <View style={styles.buttonContainerCenter}>
                            <Button
                                title="Agregar Nuevo Medicamento"
                                color="green"
                                onPress={() => {
                                    agregarMedicamento();
                                }}
                            />
                        </View>
                        <View style={styles.buttonContainerCenter}>
                            <Button
                                title="Listo"
                                color="green"
                                onPress={() => {
                                    setModalVisibleMedicamentos(false);
                                    agregarMedicamento();
                                }}
                            />
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