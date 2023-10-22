import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const db = SQLite.openDatabase('adamdb.db');

const PatologiaCronica = ({ patologia, isEditing, handlePress, handleDelete }) => {
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
                    <Text style={styles.encabezadoInicial}>Tipo de Patología:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPatologia.tipo_patologia}
                        onChangeText={(val) => handleChange('tipo_patologia', val)}
                    />
                    <Text style={styles.encabezado}>Nombre de la Patología:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPatologia.nombre_patologia}
                        onChangeText={(val) => handleChange('nombre_patologia', val)}
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
                    <Text style={styles.encabezadoInicial}>Tipo de Patología:</Text>
                    <Text style={styles.content}>{currentPatologia.tipo_patologia}</Text>
                    <Text style={styles.encabezado}>Nombre de la Patología:</Text>
                    <Text style={styles.content}>{currentPatologia.nombre_patologia}</Text>
                    <Text style={styles.encabezado}>Transmisibilidad:</Text>
                    <Text style={styles.content}>{currentPatologia.transmisibilidad}</Text>
                    <Text style={styles.encabezado}>Morbilidad e Intensidad:</Text>
                    <Text style={styles.content}>{currentPatologia.morbilidad_intensidad}</Text>
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePress(patologia.id, currentPatologia)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Patología'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText}>
                        Eliminar Patología
                    </Text>
                </TouchableOpacity>
            </View>
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

    const agregarPatologia = () => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO PatologiasCronicas (tipo_patologia, nombre_patologia, transmisibilidad, morbilidad_intensidad) VALUES (?, ?, ?, ?)',
                [tipo_patologia, nom_patologia, transmisibilidad, morbilidad_intensidad],
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
            <View style={styles.buttonContainer2}>
                <TouchableOpacity
                    style={styles.buttoningresar}
                    onPress={handleAgregarPatologiaPress}
                >
                    <Text style={styles.buttonText}>
                        Agregar una nueva patología
                    </Text>
                </TouchableOpacity>
            </View>
            {patologias.map(patologia => (
                <PatologiaCronica
                    key={patologia.id}
                    patologia={patologia}
                    isEditing={currentPatologiaId === patologia.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                />
            ))}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisiblePatologias}
                onRequestClose={() => {
                    Alert.alert('No haz ingresado tus patologias.');
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
                            <Button
                                title="Agregar Nueva Patología"
                                color="green"
                                onPress={() => {
                                    agregarPatologia();
                                }}
                            />
                        </View>
                        <View style={styles.buttonContainerCenter}>
                            <Button
                                title="Listo"
                                color="green"
                                onPress={() => {
                                    setModalVisiblePatologias(false);
                                    agregarPatologia();
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

export default PatologiasCronicas;
