import React, { useEffect, useRef, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"
import { format } from 'date-fns';
import SelecTiempoAtras from '../api/selecTiempoAtras';
import EVA from "../api/escalaEVA";
import { FontAwesome5 } from '@expo/vector-icons';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';


const db = SQLite.openDatabase('adamdb.db');

const DolenciaSintoma = ({ dolenciaSintoma, isEditing, handlePress, handleDelete, setCurrentDolenciaSintomaId }) => {
    const [currentDolenciaSintoma, setCurrentDolenciaSintoma] = useState(dolenciaSintoma);

    const handleChange = (key, val) => {
        setCurrentDolenciaSintoma(current => ({
            ...current,
            [key]: val
        }));
    };

    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Dolencia o Síntoma",
            "¿Estás seguro de que quieres eliminar esta dolencia o síntoma?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(dolenciaSintoma.id)
                }
            ]
        );
    };

    const partesCuerpo = ["Cabeza", "Torso", "Brazo derecho", "Brazo izquierdo", "Pierna derecha", "Pierna izquierda"];

    const {theme, updateTheme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <View className="mx-5">
            {isEditing ? (
                <>
                    <Text style={styles.encabezado}>Dolencia o Síntoma:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentDolenciaSintoma.dolenciaSintoma}
                        onChangeText={(val) => handleChange('dolenciaSintoma', val)}
                    />
                    <Text style={styles.encabezado}>Descripción:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentDolenciaSintoma.descripcion}
                        onChangeText={(val) => handleChange('descripcion', val)}
                    />
                    <Text style={styles.encabezado}>Parte del cuerpo afectada:</Text>
                    <View style={styles.inputPicker}>
                        <Picker
                            selectedValue={currentDolenciaSintoma.parteCuerpoAfectada}
                            onValueChange={(itemValue) => handleChange('parteCuerpoAfectada', itemValue)}
                        >
                            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                            {partesCuerpo.map((parte, index) => (
                                <Picker.Item key={index} label={parte} value={parte} />
                            ))}
                        </Picker>
                    </View>
                    <Text style={styles.encabezado}>Tiempo desde aparición:</Text>
                    <SelecTiempoAtras onConfirm={(number, word) => {
                        let tiempodesde = number + ' ' + word
                        //setTiempoDesdeAparicion(tiempodesde)
                        handleChange('tiempoDesdeAparicion', tiempodesde)
                    }} />
                    <Text style={styles.encabezado}>Nivel de dolor en escala EVA:</Text>
                    <EVA onChangeValue={(value) => handleChange('nivelDolor', value)} />
                    <Text style={styles.encabezado}>Medicamento utilizado:</Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="gray"
                        placeholder="ej: Paracetamol - Tapsin sobre"
                        value={currentDolenciaSintoma.medicamentosUtilizados}
                        onChangeText={(val) => handleChange('medicamentosUtilizados', val)}
                    />
                    <Text style={styles.encabezado}>Dosis utilizada:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentDolenciaSintoma.dosisUtilizada}
                        onChangeText={(val) => handleChange('dosisUtilizada', val)}
                    />

                </>
            ) : (
                <>
                    <Text style={styles.header}>Dolencia o Síntoma:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.dolenciaSintoma}</Text>
                    <Text style={styles.header}>Fecha y hora del registro:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.fechaHora}</Text>
                    <Text style={styles.header}>Descripción:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.descripcion}</Text>
                    <Text style={styles.header}>Parte del cuerpo afectada:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.parteCuerpoAfectada}</Text>
                    <Text style={styles.header}>Tiempo desde aparición:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.tiempoDesdeAparicion}</Text>
                    <Text style={styles.header}>Nivel de dolor en escala EVA:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.nivelDolor}</Text>
                    <Text style={styles.header}>Medicamento utilizado:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.medicamentosUtilizados}</Text>
                    <Text style={styles.header}>Dosis utilizada:</Text>
                    <Text style={styles.content}>{currentDolenciaSintoma.dosisUtilizada}</Text>
                </>
            )}
            <View className="flex-row  justify-between self-center mt-5">
                <TouchableOpacity
                    style={[styles.primaryButton, { textAlign: 'center', textAlignVertical: 'center', flexWrap: 'wrap' }]}
                    onPress={() => handlePress(dolenciaSintoma.id, currentDolenciaSintoma)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Dolencia/Síntoma'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText2}>
                        Eliminar Dolencia/Síntoma
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => setCurrentDolenciaSintomaId(null)}
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

const DolenciasSintomas = () => {
    const [dolenciasSintomas, setDolenciasSintomas] = useState([]);
    const [currentDolenciaSintomaId, setCurrentDolenciaSintomaId] = useState(null);

    const [modalVisibleDolenciasSintomas, setModalVisibleDolenciasSintomas] = useState(false);
    const [dolenciaSintoma, setDolenciaSintoma] = useState('');
    const [fechaHora, setFechaHora] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [parteCuerpoAfectada, setParteCuerpoAfectada] = useState('');
    const [tiempoDesdeAparicion, setTiempoDesdeAparicion] = useState('');
    const [nivelDolor, setNivelDolor] = useState('');
    const [medicamentosUtilizados, setMedicamentosUtilizados] = useState(null);
    const [dosisUtilizada, setDosisUtilizada] = useState(null);
    const [saveDolenciaAlert, setSaveDolenciaAlert] = useState(false);

    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) =>
                setDolenciasSintomas(rows._array)
            );
        });
    }, []);

    const handleAgregarDolenciaSintomaPress = () => {
        setModalVisibleDolenciasSintomas(true);
    };

    const partesCuerpo = ["Cabeza", "Torso", "Brazo derecho", "Brazo izquierdo", "Pierna derecha", "Pierna izquierda"];

    const handlePress = (id, dolenciaSintoma) => {
        if (currentDolenciaSintomaId === id) {
            // Actualizar dolencia o síntoma
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE DolenciasSintomas SET dolenciaSintoma = ?, descripcion = ?, parteCuerpoAfectada = ?, tiempoDesdeAparicion = ?, nivelDolor= ?, medicamentosUtilizados = ?, dosisUtilizada = ? WHERE id = ?',
                    [dolenciaSintoma.dolenciaSintoma, dolenciaSintoma.descripcion, dolenciaSintoma.parteCuerpoAfectada, dolenciaSintoma.tiempoDesdeAparicion, dolenciaSintoma.nivelDolor, dolenciaSintoma.medicamentosUtilizados, dolenciaSintoma.dosisUtilizada, id],
                    (_, resultSet) => {
                        console.log("Actualización dolencia exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) =>
                            setDolenciasSintomas(rows._array)
                        );
                    }
                );
            });

            // Resetear estado de edición
            setCurrentDolenciaSintomaId(null);
        } else {
            // Iniciar edición
            setCurrentDolenciaSintomaId(id);
        }
    };

    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM DolenciasSintomas WHERE id = ?', [id], (_, resultSet) => {
                console.log("Eliminación exitosa!");
                // Recargar datos
                tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) =>
                    setDolenciasSintomas(rows._array)
                );
            });
        });
    };

    const agregarDolenciaSintoma = async () => {
        try {
            let usuario_rut = await obtenerRut()
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(
                        'INSERT INTO DolenciasSintomas (dolenciaSintoma, fechaHora, descripcion, parteCuerpoAfectada, tiempoDesdeAparicion, nivelDolor, medicamentosUtilizados, dosisUtilizada, usuario_rut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [dolenciaSintoma, fec_hor, descripcion, parteCuerpoAfectada, tiempoDesdeAparicion, nivelDolor, medicamentosUtilizados, dosisUtilizada, usuario_rut],
                        (_, resultSet) => {
                            console.log("Adición exitosa!");
                            // Recargar datos
                            tx.executeSql('SELECT * FROM DolenciasSintomas', [], (_, { rows }) => {
                                setDolenciasSintomas(rows._array);
                                resolve(rows._array);
                            }, (tx, error) => {
                                console.log("Error al cargar los datos: " + error.message);
                                reject(error);
                            });
                        },
                        (tx, error) => {
                            console.log("Error al insertar los datos: " + error.message);
                            reject(error);
                        }
                    );
                }, (error) => {
                    console.log("Error en la transacción: " + error.message);
                    reject(error);
                });
                // Resetear los estados
                setDolenciaSintoma('');
                setFechaHora('');
                setDescripcion('');
                setParteCuerpoAfectada('');
                setTiempoDesdeAparicion('');
                setNivelDolor('');
                setMedicamentosUtilizados('');
                setDosisUtilizada('');
            });
        } catch (error) {
            console.log("Error: " + error.message);
            reject(error);
        }
    };

    let fec_hor = format(new Date(), 'dd/MM/yyyy - HH:mm');

    const cambioNivelDolor = (value) => {
        // Actualiza el estado con el valor seleccionado
        setNivelDolor(value);
    };
    const verificarMedicamento = (text) => {
        if (text) {
            setMedicamentosUtilizados(text);
        } else {
            let texto = 'No se ingresó medicamento'
            setMedicamentosUtilizados(texto);
        }
    }
    const verificarDosis = (text) => {
        if (text) {
            setDosisUtilizada(text);
        } else {
            let texto = 'No se ingresó dosis'
            setDosisUtilizada(texto);
        }
    }

    const [estadoSeguimiento, setEstadoSeguimiento] = useState(ESTADO_INACTIVO);

    const ESTADO_ACTIVO = '1'
    const ESTADO_INACTIVO= '0'
    const estado_actual = useRef(null)

    const obtenerEstSeguimiento = () => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM configuracion WHERE SeguimientoDolencias = ?',
                [1],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        console.log('El campo SeguimientoDolencias es igual a 1');
                        setEstadoSeguimiento(ESTADO_ACTIVO);
                    } else {
                        console.log('El campo SeguimientoDolencias es igual a 0');
                        setEstadoSeguimiento(ESTADO_INACTIVO);
                    }
                },
                (_, error) => {
                    console.log('Error al hacer la consulta: ' + error.message);
                }
            );
        });
    }
    
    //useEffect
    useEffect(() => {
        obtenerEstSeguimiento()
    }, [])

    const cambiarEstadoSeguimiento = () => {
        // Determinar el nuevo estado
        const nuevoEstado = estadoSeguimiento === ESTADO_ACTIVO ? ESTADO_INACTIVO : ESTADO_ACTIVO;
    
        // Actualizar la base de datos SQLite
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE configuracion SET SeguimientoDolencias = ?',
                [nuevoEstado],
                (_, resultSet) => {
                    console.log('Cambio de estado de seguimiento exitoso!');
                    // Actualizar el estado actual
                    setEstadoSeguimiento(nuevoEstado);
                },
                (_, error) => {
                    console.log('Error al cambiar el estado de seguimiento: ' + error.message);
                }
            );
        });
    }

    const {theme, updateTheme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];
        

    return (
        <ScrollView className="px-2" style={styles.container}>
            <View className="mt-5 mx-3 mb-5">
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleAgregarDolenciaSintomaPress}
                >
                    <Text style={styles.buttonText}>
                        Agregar nueva dolencia o síntoma
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            <View className="flex-row " style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop:-10, marginBottom:-20}}>
                <View>
                    <Text style={styles.seguimientoDolenciaHeader}>{'Seguimiento diario de \n\dolencias o sintomas: '}</Text>
                </View>
                <TouchableOpacity style={{ paddingRight: 15 }} onPress={() => {cambiarEstadoSeguimiento()}}>
                    <Text><FontAwesome5 name="check" size={25} color={ estadoSeguimiento === '0' ? 'black' : 'green'} /></Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>

            {dolenciasSintomas.map((dolenciaSintoma) => (
                <DolenciaSintoma
                    key={dolenciaSintoma.id}
                    dolenciaSintoma={dolenciaSintoma}
                    isEditing={currentDolenciaSintomaId === dolenciaSintoma.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    setCurrentDolenciaSintomaId={setCurrentDolenciaSintomaId}
                    setTiempoDesdeAparicion={setTiempoDesdeAparicion}
                />
            ))}


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleDolenciasSintomas}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleDolenciasSintomas(false);
                }}
            >
                <View className="flex-1 justify-center bg-fondoOscurecido py-5">
                    <ScrollView>
                        <View>
                            <View style={[styles.modalView,]} className="self-center">
                                <Text style={styles.seguimientoFormHeader}>Ingresa tu dolencia o síntoma:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="gray"
                                    placeholder="ej: Dolor de cabeza"
                                    onChangeText={text => setDolenciaSintoma(text)}
                                    value={dolenciaSintoma}
                                />
                                <Text style={styles.seguimientoFormHeader}>Fecha y hora del registro:</Text>
                                <View style={[styles.input, { justifyContent: 'center' }]}><Text>{fec_hor}</Text></View>

                                <Text style={styles.seguimientoFormHeader}>Ingresa la descripción:</Text>
                                <TextInput
                                    style={[styles.input, { height: 80 }]}
                                    placeholderTextColor="gray"
                                    placeholder={`Describe aqui tu dolencia o sintoma a detalle \n\junto con la zona especifica afectada. \n\ \n\Si crees que existe una causa, tambien añadela `}
                                    onChangeText={text => setDescripcion(text)}
                                    value={descripcion}
                                />
                                <Text style={styles.seguimientoFormHeader}>Selecciona la parte del cuerpo afectada:</Text>
                                <View style={styles.inputPicker}>
                                    <Picker
                                        selectedValue={parteCuerpoAfectada}
                                        onValueChange={(itemValue) => setParteCuerpoAfectada(itemValue)}
                                    >
                                        <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                        {partesCuerpo.map((parte, index) => (
                                            <Picker.Item key={index} label={parte} value={parte} />
                                        ))}
                                    </Picker>
                                </View>
                                <Text style={styles.seguimientoFormHeader}>Ingresa el tiempo desde aparición:</Text>
                                <SelecTiempoAtras onConfirm={(number, word) => {
                                    let tiempodesde = number + ' ' + word
                                    setTiempoDesdeAparicion(tiempodesde)
                                }} />

                                <Text style={styles.seguimientoFormHeader}>Nivel de dolor en escala EVA:</Text>
                                <EVA onChangeValue={cambioNivelDolor} />

                                <Text style={styles.seguimientoFormHeader}>Ingresa el o los medicamentos utilizados:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="gray"
                                    placeholder="ej: Paracetamol - Tapsin sobre"
                                    onChangeText={text => verificarMedicamento(text)}
                                    value={medicamentosUtilizados}
                                />
                                <Text style={styles.seguimientoFormHeader}>Ingresa la o las dosis utilizadas:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="gray"
                                    placeholder="ej: 200mg - 5g"
                                    onChangeText={text => verificarDosis(text)}
                                    value={dosisUtilizada}
                                />

                                <CustomAlert
                                  isVisible={saveDolenciaAlert}
                                  onClose={() => {setSaveDolenciaAlert(false)}}
                                  message='Dolencia Ingresada exitosamente'
                                />

                                <View className="flex-row  justify-between self-center mt-5" >
                                    <TouchableOpacity style={styles.secondaryButton} onPress={() => { setModalVisibleDolenciasSintomas(false) }}>
                                        <Text style={styles.buttonText2}>
                                            Cerrar
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.primaryButton} 
                                    onPress={() => { 
                                        agregarDolenciaSintoma()
                                        setSaveDolenciaAlert(true) }}>
                                        <Text style={styles.buttonText}>
                                            Agregar nueva dolencia o síntoma
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus dolencias o síntomas.'
            />
        </ScrollView>
    );
};
export default DolenciasSintomas;

