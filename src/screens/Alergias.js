import React, { useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';


const db = SQLite.openDatabase('adamdb.db');

const Alergia = ({ alergia, isEditing, handlePress, handleDelete, setCurrentAlergiaId }) => {
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

    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <View className="mx-5">
            {isEditing ? (
                <>
                    <Text style={styles.encabezado}>Tipo de alergia:</Text>
                    <View style={styles.inputPicker}>
                        <Picker
                            selectedValue={currentAlergia.tipo}
                            onValueChange={(itemValue) => handleChange('tipo', itemValue)}
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
                    <Text style={styles.encabezado} className="ml-5">Tipo de alergia:</Text>
                    <Text style={styles.content} className="ml-5">{currentAlergia.tipo}</Text>
                    <Text style={styles.encabezado} className="ml-5">Alergeno:</Text>
                    <Text style={styles.content} className="ml-5">{currentAlergia.alergeno}</Text>
                </>
            )}

            <View className="flex-row self-center justify-around w-full mt-3">
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handlePress(alergia.id, currentAlergia)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Alergia'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText2}>
                        Eliminar Alergia
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => setCurrentAlergiaId(null)}
                    >
                        <Text style={styles.buttonText2}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                    </>
            ):null}
                

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

    const [saveAlergiaAlert, setSaveAlergiaAlert] = useState(false);

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
    const agregarAlergia = async () => {
        let usuario_rut = await obtenerRut()
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

    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];


    return (
        <ScrollView className="flex-1 bg-grisClaro px-5 pt-3">
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleAgregarAlergiaPress} // Agregar esto
                >
                    <Text style={styles.buttonText}>
                        Agregar nueva alergia
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            {alergias.map((alergia) => (
                <Alergia
                    key={alergia.id}
                    alergia={alergia}
                    isEditing={currentAlergiaId === alergia.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    setCurrentAlergiaId={setCurrentAlergiaId}
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
                <CustomAlert
                    isVisible={saveAlergiaAlert}
                    onClose={() => {setSaveAlergiaAlert(false)}}
                    message='Alergia Ingresada exitosamente'
                />

                <View className="flex-1 justify-center bg-fondoOscurecido py-12">
                    <View style={styles.modalView} className="self-center">
                        <Text style={styles.encabezado}>Ingresa tu tipo de alergia:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={tipoAlergia}
                                onValueChange={(itemValue) => setTipoAlergia(itemValue)}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Alergenos" value="Alergenos" />
                                <Picker.Item label="Medicamentos" value="Medicamentos" />
                                <Picker.Item label="Alimentos" value="Alimentos" />
                            </Picker>
                        </View>
                        <Text style={styles.encabezado}>Ingresa tu alergeno:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: Perros"
                            onChangeText={text => setAlergeno(text)}
                            value={alergeno}
                        />
                        <View className="flex-row w-4/5 justify-between self-center mt-5">
                            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setModalVisibleAlergias(false) }}>
                                <Text style={styles.buttonText2}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryButton} onPress={() => { agregarAlergia(), setSaveAlergiaAlert(true) }}>
                                <Text style={styles.buttonText}>
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


