import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';

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
                    <Text style={styles.encabezadoInicial}>Tipo de alergia:</Text>
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
                    <Text style={styles.encabezado}>Alergeno:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentAlergia.alergeno}
                        onChangeText={(val) => handleChange('alergeno', val)}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.encabezadoInicial}>Tipo de alergia:</Text>
                    <Text style={styles.content}>{currentAlergia.tipo}</Text>
                    <Text style={styles.encabezado}>Alergeno:</Text>
                    <Text style={styles.content}>{currentAlergia.alergeno}</Text>
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePress(alergia.id, currentAlergia)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Alergia'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText}>
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
    const agregarAlergia = () => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Alergias (tipo, alergeno) VALUES (?, ?)',
                [tipoAlergia, alergeno],
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
        <ScrollView style={styles.container}>
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAgregarAlergiaPress} // Agregar esto
                >
                    <Text style={styles.buttonText}>
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.header}>Ingresa tu tipo de alergia:</Text>
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
                        <Text style={styles.header}>Ingresa tu alergeno:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: Perros"
                            onChangeText={text => setAlergeno(text)}
                            value={alergeno}
                        />
                        <View style={styles.buttonContainerCenter}>
                            <Button
                                title="Agregar Nueva alergia"
                                color="green"
                                onPress={() => {
                                    agregarAlergia();
                                }}
                            />
                        </View>
                        <View style={styles.buttonContainerCenter}>
                            <Button
                                title="Listo"
                                color="green"
                                onPress={() => {
                                    setModalVisibleAlergias(false);
                                    agregarAlergia();
                                }}
                            />
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


