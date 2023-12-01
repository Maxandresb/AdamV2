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

const Limitacion = ({ limitacion, isEditing, handlePress, handleDelete, setCurrentLimitacionId }) => {
    const [currentLimitacion, setCurrentLimitacion] = useState(limitacion);

    const handleChange = (key, val) => {
        setCurrentLimitacion(current => ({
            ...current,
            [key]: val
        }));
    };

    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Limitacion",
            "¿Estás seguro de que quieres eliminar esta limitacion?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(limitacion.id)
                }
            ]
        );
    };

    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <View>
            {isEditing ? (
                <>
                    <Text style={styles.encabezado}>Tipo de Limitacion:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentLimitacion.tipo_lim}
                        onChangeText={(val) => handleChange('tipo_lim', val)}
                    />
                    <Text style={styles.encabezado}>Severidad:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentLimitacion.severidad_lim}
                        onChangeText={(val) => handleChange('severidad_lim', val)}
                    />
                    <Text style={styles.encabezado}>Origen:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentLimitacion.origen_lim}
                        onChangeText={(val) => handleChange('origen_lim', val)}
                    />
                    <Text style={styles.encabezado}>Descripcion:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentLimitacion.descripcion_lim}
                        onChangeText={(val) => handleChange('descripcion_lim', val)}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.encabezado} className="ml-5">Tipo de Limitacion:</Text>
                    <Text style={styles.content} className="ml-5">{currentLimitacion.tipo_lim}</Text>
                    <Text style={styles.encabezado} className="ml-5">Severidad:</Text>
                    <Text style={styles.content} className="ml-5">{currentLimitacion.severidad_lim}</Text>
                    <Text style={styles.encabezado} className="ml-5">Origen:</Text>
                    <Text style={styles.content} className="ml-5">{currentLimitacion.origen_lim}</Text>
                    <Text style={styles.encabezado} className="ml-5">Descripcion:</Text>
                    <Text style={styles.content} className="ml-5">{currentLimitacion.descripcion_lim}</Text>
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handlePress(limitacion.id, currentLimitacion)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Limitacion'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress} // Modificar esto
                >
                    <Text style={styles.buttonText2}>
                        Eliminar Limitacion
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => setCurrentLimitacionId(null)}
                    >
                        <Text style={styles.buttonText2}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </>
            ) : null}
            <View style={styles.lineaContainer}></View>

        </View>
    );
};

const Limitaciones = () => {
    const [limitaciones, setLimitaciones] = useState([]);
    const [currentLimitacionId, setCurrentLimitacionId] = useState(null);

    const [modalVisibleLimitaciones, setModalVisibleLimitaciones] = useState(false);
    const [tipoLimitacion, setTipoLimitacion] = useState('');
    const [severidad, setSeveridad] = useState('');
    const [origen_lim, setOrigenLim] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [saveLimitacionAlert, setSaveLimitacionAlert] = useState(false);

    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Limitaciones', [], (_, { rows }) =>
                setLimitaciones(rows._array)
            );
        });
    }, []);

    const handleAgregarLimitacionPress = () => {
        setModalVisibleLimitaciones(true);
    };

    const handlePress = (id, limitacion) => {
        if (currentLimitacionId === id) {
            // Actualizar limitacion 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Limitaciones SET tipo_lim = ?, severidad_lim = ?, origen_lim = ?, descripcion_lim = ? WHERE id = ?',
                    [limitacion.tipo_lim, limitacion.severidad_lim, limitacion.origen_lim, limitacion.descripcion_lim, id],
                    (_, resultSet) => {
                        console.log("Actualización exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM Limitaciones', [], (_, { rows }) =>
                            setLimitaciones(rows._array)
                        );
                    }
                );
            });

            // Resetear estado de edición
            setCurrentLimitacionId(null);
        } else {
            // Iniciar edición
            setCurrentLimitacionId(id);
        }
    };
    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM Limitaciones WHERE id = ?',
                [id],
                (_, resultSet) => {
                    console.log("Eliminación exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM Limitaciones', [], (_, { rows }) =>
                        setLimitaciones(rows._array)
                    );
                }
            );
        });
    };
    const agregarLimitacion = async () => {
        let usuario_rut = await obtenerRut()
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Limitaciones (tipo_lim, severidad_lim, origen_lim, descripcion_lim, usuario_rut) VALUES (?, ?, ?, ?, ?)',
                [tipoLimitacion, severidad, origen_lim, descripcion, usuario_rut],
                (_, resultSet) => {
                    console.log("Inserción exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM Limitaciones', [], (_, { rows }) =>
                        setLimitaciones(rows._array)
                    );
                }
            );
        });

        // Resetear los estados
        setTipoLimitacion('');
        setSeveridad('');
        setOrigenLim('');
        setDescripcion('');
    };

    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <ScrollView style={styles.container}>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleAgregarLimitacionPress} // Agregar esto
                >
                    <Text style={styles.buttonText}>
                        Agregar una nueva limitacion
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            {limitaciones.map(limitacion => (
                <Limitacion
                    key={limitacion.id}
                    limitacion={limitacion}
                    isEditing={currentLimitacionId === limitacion.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    setCurrentLimitacionId={setCurrentLimitacionId}
                />
            ))}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleLimitaciones}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleLimitaciones(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.header}>Nombra o describe tu limitacion:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setDescripcion(text)}
                            value={descripcion}
                        />

                        <CustomAlert    
                            isVisible={saveLimitacionAlert}
                            onClose={() => {setSaveLimitacionAlert(false)}}
                            message='Limitación Ingresada exitosamente'
                        />
                        <Text style={styles.header}>Indica tu tipo de limitacion fisica:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={tipoLimitacion}
                                onValueChange={(itemValue) => setTipoLimitacion(itemValue)}
                                
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Motricidad" value="Motricidad" />
                                <Picker.Item label="Sensorial" value="Sensorial" />
                                <Picker.Item label="Mental" value="Mental" />
                            </Picker>
                        </View>
                        <Text style={styles.header}>Indica tu nivel de severidad:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={severidad}
                                onValueChange={(itemValue) => setSeveridad(itemValue)}
                                
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Grave" value="Grave" />
                                <Picker.Item label="Moderada" value="Moderada" />
                                <Picker.Item label="Leve" value="Leve" />
                            </Picker>
                        </View>
                        <Text style={styles.header}>Indica el origen de tu limitacion:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={origen_lim}
                                onValueChange={(itemValue) => setOrigenLim(itemValue)}
                                
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Adquirida" value="Adquirida" />
                                <Picker.Item label="Congénitas o de nacimiento" value="Congénitas o de nacimiento" />
                            </Picker>
                        </View>

                        <View style={styles.buttonContainerCenter}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setModalVisibleLimitaciones(false) }}>
                                <Text style={styles.buttonText2}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryButton} onPress={() => { agregarLimitacion(); setSaveLimitacionAlert(true)}}>
                                <Text style={styles.buttonText}>
                                    Agregar Nueva Limitación
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus Limitaciones.'
            />
        </ScrollView>
    );
};
export default Limitaciones;

