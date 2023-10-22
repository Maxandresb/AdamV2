import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
            <View style={styles.buttonContainer2}>
                <TouchableOpacity
                    style={styles.buttoningresar}
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
                transparent={false}
                visible={modalVisibleMedicamentos}
                onRequestClose={() => {
                    Alert.alert('No haz ingresado tus medicamentos.');
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
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    lineaContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingTop: 10,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22
    },
    modalView: {
        marginHorizontal: '10%',
    },
    header: {
        color: 'black',
        fontSize: 18,
        marginBottom: 5,
    },
    inputPicker: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        alignContent: 'flex-start',
        justifyContent: 'center', // Asegúrate de que el texto esté centrado verticalmente
    },
    buttonContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    buttonContainer2: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    buttoningresar: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        padding: 10,
        margin: 10,
        width: '80%',

    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        padding: 10,
        margin: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',

    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        padding: 10,
        margin: 10
    },
    buttonContainerCenter: {
        width: '50%',
        alignSelf: 'center',
        marginBottom: 30,
    },
    encabezado: {
        marginBottom: 5,
        color: 'black',
        fontSize: 18,
    },
    encabezadoInicial: {
        marginBottom: 5,
        color: 'black',
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 10
    },
    content: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        color: 'gray',
        paddingLeft: 18,
        paddingTop: 10
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        color: 'black',
        paddingLeft: 18,
    },
});

export default Medicamentos;