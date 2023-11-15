import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"

const db = SQLite.openDatabase('adamdb.db');

const PatologiaCronica = ({ patologia, isEditing, handlePress, handleDelete, setCurrentPatologiaId }) => {
    const [currentPatologia, setCurrentPatologia] = useState(patologia);

    const handleChange = (key, val) => {
        setCurrentPatologia(current => ({
            ...current,
            [key]: val
        }));
    };

    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Patología Crónica",
            "¿Estás seguro de que quieres eliminar esta patología crónica?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(patologia.id)
                }
            ]
        );
    };

    return (
        <View>
            {isEditing ? (
                <>
                    <Text style={styles.encabezado}>Nombre de la Patología:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPatologia.nombre_patologia}
                        onChangeText={(val) => handleChange('nombre_patologia', val)}
                    />
                    <Text style={styles.encabezado}>Tipo de Patología:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPatologia.tipo_patologia}
                        onChangeText={(val) => handleChange('tipo_patologia', val)}
                    />
                    <Text style={styles.encabezado}>Transmisibilidad:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPatologia.transmisibilidad}
                        onChangeText={(val) => handleChange('transmisibilidad', val)}
                    />
                    <Text style={styles.encabezado}>Morbilidad e Intensidad:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPatologia.morbilidad_intensidad}
                        onChangeText={(val) => handleChange('morbilidad_intensidad', val)}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.encabezado}>Nombre de la Patología:</Text>
                    <Text style={styles.content}>{currentPatologia.nombre_patologia}</Text>
                    <Text style={styles.encabezado}>Tipo de Patología:</Text>
                    <Text style={styles.content}>{currentPatologia.tipo_patologia}</Text>
                    <Text style={styles.encabezado}>Transmisibilidad:</Text>
                    <Text style={styles.content}>{currentPatologia.transmisibilidad}</Text>
                    <Text style={styles.encabezado}>Morbilidad e Intensidad:</Text>
                    <Text style={styles.content}>{currentPatologia.morbilidad_intensidad}</Text>
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={() => handlePress(patologia.id, currentPatologia)}
                >
                    <Text style={styles.celesteText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Patología'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.celesteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.rojoIntensoText}>
                        Eliminar Patología
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.celesteButton}
                        onPress={() => setCurrentPatologiaId(null)}
                    >
                        <Text style={styles.rojoIntensoText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </>
            ) : null}
            <View style={styles.lineaContainer}>
            </View>

        </View>
    );
};

const PatologiasCronicas = () => {
    const [patologias, setPatologias] = useState([]);
    const [currentPatologiaId, setCurrentPatologiaId] = useState(null);

    const [modalVisiblePatologias, setModalVisiblePatologias] = useState(false);
    const [tipo_patologia, setTipoPatologia] = useState('');
    const [nom_patologia, setNomPatologia] = useState('');
    const [transmisibilidad, setTransmisibilidad] = useState('');
    const [morbilidad_intensidad, setMorbilidadIntensidad] = useState('');

    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM PatologiasCronicas', [], (_, { rows }) =>
                setPatologias(rows._array)
            );
        });
    }, []);

    const handleAgregarPatologiaPress = () => {
        setModalVisiblePatologias(true);
    };

    const handlePress = (id, patologia) => {
        if (currentPatologiaId === id) {
            // Actualizar patologia
            // Actualizar patologia 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE PatologiasCronicas SET tipo_patologia = ?, nombre_patologia = ?, transmisibilidad = ?, morbilidad_intensidad = ? WHERE id = ?',
                    [patologia.tipo_patologia, patologia.nombre_patologia, patologia.transmisibilidad, patologia.morbilidad_intensidad, id],
                    (_, resultSet) => {
                        console.log("Actualización exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM PatologiasCronicas', [], (_, { rows }) =>
                            setPatologias(rows._array)
                        );
                    }
                );
            });

            // Resetear estado de edición
            setCurrentPatologiaId(null);
        } else {
            // Iniciar edición
            setCurrentPatologiaId(id);
        }
    };

    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM PatologiasCronicas WHERE id = ?',
                [id],
                (_, resultSet) => {
                    console.log("Eliminación exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM PatologiasCronicas', [], (_, { rows }) =>
                        setPatologias(rows._array)
                    );
                }
            );
        });
    };

    const agregarPatologia = async () => {
        let usuario_rut = await obtenerRut()
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO PatologiasCronicas (tipo_patologia, nombre_patologia, transmisibilidad, morbilidad_intensidad, usuario_rut) VALUES (?, ?, ?, ?, ?)',
                [tipo_patologia, nom_patologia, transmisibilidad, morbilidad_intensidad, usuario_rut],
                (_, resultSet) => {
                    console.log("Inserción exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM PatologiasCronicas', [], (_, { rows }) =>
                        setPatologias(rows._array)
                    );
                }
            );
        });

        // Resetear los estados
        setTipoPatologia('');
        setNomPatologia('');
        setTransmisibilidad('');
        setMorbilidadIntensidad('');
    };

    return (
        <ScrollView style={styles.container}>
            <View>
                <TouchableOpacity
                    style={styles.rojoIntensoButton}
                    onPress={handleAgregarPatologiaPress}
                >
                    <Text style={styles.celesteText}>
                        Agregar una nueva patología
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            {patologias.map(patologia => (
                <PatologiaCronica
                    key={patologia.id}
                    patologia={patologia}
                    isEditing={currentPatologiaId === patologia.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    setCurrentPatologiaId={setCurrentPatologiaId}
                />
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisiblePatologias}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisiblePatologias(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.header}>Ingresa tu tipo de patologia:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={tipo_patologia}
                                onValueChange={(itemValue) => setTipoPatologia(itemValue)}
                                style={styles.inputPicker2}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Patologías crónicas cardiovasculares" value="Patologías crónicas cardiovasculares" />
                                <Picker.Item label="Patologías crónicas respiratorias" value="Patologías crónicas respiratorias" />
                                <Picker.Item label="Patologías crónicas digestivas" value="Patologías crónicas digestivas" />
                                <Picker.Item label="Patologías crónicas endocrinas" value="Patologías crónicas endocrinas" />
                                <Picker.Item label="Patologías crónicas musculoesqueléticas" value="Patologías crónicas musculoesqueléticas" />
                                <Picker.Item label="Patologías crónicas neurológicas" value="Patologías crónicas neurológicas" />
                                <Picker.Item label="Patologías crónicas oncológicas" value="Patologías crónicas oncológicas" />
                                <Picker.Item label="Otras Patologías crónicas" value="Otras Patologías crónicas" />
                            </Picker>
                        </View>
                        <Text style={styles.header}>Ingresa el nombre de tu patologia:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXX"
                            onChangeText={text => setNomPatologia(text)}
                            value={nom_patologia}
                        />
                        <Text style={styles.header}>Indica la transmisibilidad de tu patologia:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={transmisibilidad}
                                onValueChange={(itemValue) => setTransmisibilidad(itemValue)}
                                style={styles.inputPicker2}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Patología crónica no transmisible" value="Patología crónica no transmisible" />
                                <Picker.Item label="Patología crónica transmisible" value="Patología crónica transmisible" />
                            </Picker>
                        </View>
                        <Text style={styles.header}>Indica el nivel de morbilidad e intensidad de tu patologia:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={morbilidad_intensidad}
                                onValueChange={(itemValue) => setMorbilidadIntensidad(itemValue)}
                                style={styles.inputPicker2}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Patología crónica de alto consumo" value="Patología crónica de alto consumo" />
                                <Picker.Item label="Patología crónica de bajo consumo" value="Patología crónica de bajo consumo" />
                            </Picker>
                        </View>
                        <View style={styles.buttonContainerCenter}>
                            <TouchableOpacity style={styles.closeButton} className="w-28" onPress={() => { setModalVisiblePatologias(false); }}>
                                <Text className="text-azul text-center font-bold">
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.rojoIntensoButton} className="w-32" onPress={() => { agregarPatologia(); }}>
                                <Text style={styles.celesteText}>
                                    Agregar nueva patología
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus patologias.'
            />
        </ScrollView>
    );
};
export default PatologiasCronicas;
