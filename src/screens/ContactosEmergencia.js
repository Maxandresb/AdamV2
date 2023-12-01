
import React, { useEffect, useState, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import CustomAlert from '../api/customAlert';
import * as Contacts from 'expo-contacts';
import { CheckBoxRapido } from '../api/checkBoxRapido';
import { obtenerRut } from "../api/sqlite"
import { Slider } from 'react-native-elements';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';



const db = SQLite.openDatabase('adamdb.db');

const MostrarEditarContactos = ({ contacto, isEditing, handlePress, handleDelete, setContactoId, estadoContactoEmergencia }) => {
    const [Contacto, setContacto] = useState(contacto);
    const handleChange = (key, val) => {
        setContacto(current => ({
            ...current,
            [key]: val
        }));
    };


    const handleDeletePress = () => {
        Alert.alert(
            "Eliminar Contacto",
            "¿Estás seguro de que quieres eliminar este contacto?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => handleDelete(contacto.id)
                }
            ]
        );
    };

    const {theme, updateTheme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <View>
            {isEditing ? (
                <>

                    <Text style={styles.encabezado}>Nombre completo:</Text>
                    <TextInput
                        style={styles.input}
                        value={Contacto.nombreCompleto}
                        onChangeText={(val) => handleChange('nombreCompleto', val)}
                    />
                    <Text style={styles.encabezado}>Alias:</Text>
                    <TextInput
                        style={styles.input}
                        value={Contacto.alias}
                        onChangeText={(val) => handleChange('alias', val)}
                    />
                    <Text style={styles.encabezado}>Número:</Text>
                    <TextInput
                        style={styles.input}
                        value={Contacto.numero}
                        onChangeText={(val) => handleChange('numero', val)}
                    />
                    <Text style={styles.encabezado}>Relación:</Text>
                    <TextInput
                        style={styles.input}
                        value={Contacto.relacion}
                        onChangeText={(val) => handleChange('relacion', val)}
                    />
                </>
            ) : (
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <View style={[styles.c2, { alignItems: 'flex-start' }]}>
                            <Text style={styles.encabezado}>Contacto de emergencia:</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.containerDeslizable, { alignItems: 'flex-end' }]}
                            onPress={() => estadoContactoEmergencia(contacto.id, contacto.estadoContacto === 'no' ? 'sí' : 'no')}
                        >
                            <View style={styles.switchContainer}>
                                <View style={[styles.switchOption, contacto.estadoContacto === 'sí' && styles.selectedOption]}>
                                    <Text style={styles.switchText}>No</Text>
                                </View>
                                <View style={[styles.switchOption, contacto.estadoContacto === 'no' && styles.selectedOption]}>
                                    <Text style={styles.switchText}>Sí</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.espacioContainer2}></View>
                    <Text style={styles.encabezado}>Nombre completo:</Text>
                    <Text style={styles.content}>{Contacto.nombreCompleto}</Text>
                    <Text style={styles.encabezado}>Alias:</Text>
                    <Text style={styles.content}>{Contacto.alias}</Text>
                    <Text style={styles.encabezado}>Número:</Text>
                    <Text style={styles.content}>{Contacto.numero}</Text>
                    <Text style={styles.encabezado}>Relación:</Text>
                    <Text style={styles.content}>{Contacto.relacion}</Text>
                </>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => handlePress(contacto.id, Contacto)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Contacto'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText2}>
                        Eliminar Contacto
                    </Text>
                </TouchableOpacity>
            </View>
            {
                isEditing ? (
                    <>
                        <View style={styles.espacioContainer2}></View>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => setContactoId(null)}
                        >
                            <Text style={styles.buttonText2}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.lineaContainer}></View>
                    </>
                ) : null
            }
            <View style={styles.espacioContainer}></View>
        </View >
    );
};
const Contactos = () => {
    const [contactos, setContactos] = useState([]);
    const [ContactoId, setContactoId] = useState(null);
    const [modalVisibleContactos, setModalVisibleContactos] = useState(false);
    const [alias, setAlias] = useState('');
    const [numero, setNumero] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [relacion, setRelacion] = useState('');
    const [isAlertVisible, setAlertVisible] = useState(false);
    //Contactos del telefono
    const [contactosTelefono, setContactosTelefono] = useState([]);
    const [contactosSeleccionados, setContactosSeleccionados] = useState([]);
    const [modalCTVisible, setModalCTVisible] = useState(false);

    const obtenerContactosTelefono = async () => {
        console.log('Solicitando permiso para leer contactos...');
        const { status } = await Contacts.requestPermissionsAsync();
        let contactos = [];
        if (status === 'granted') {
            console.log('Permiso concedido. Leyendo contactos...');
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers, Contacts.Fields.Addresses],
            });
            if (data.length > 0) {
                console.log(`Se encontraron ${data.length} contactos.`);
                contactos = data;
            } else {
                console.log('No se encontraron contactos.');
            }
        } else {
            console.log('Permiso para leer contactos no concedido.');
        }
        return contactos;
    }

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Contacto', [], (_, { rows }) =>
                setContactos(rows._array)
            );
        });
    }, []);

    const obtenerYGuardarContactos = async () => {
        const contactos = await obtenerContactosTelefono();
        setContactosTelefono(contactos);
        setModalCTVisible(true);
    };

    const guardarContactosSeleccionados = async () => {
        let usuario_rut = await obtenerRut()
        let contador = 0;
        for (let contacto of contactosSeleccionados) {
            const nombre = contacto.name;
            const numero = contacto.phoneNumbers ? contacto.phoneNumbers[0].number : '';
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO Contacto (nombreCompleto, numero, usuario_rut) VALUES (?, ?, ?)',
                    [nombre, numero, usuario_rut],
                    (_, { insertId }) => {
                        setContactos(prevContactos => [
                            ...prevContactos,
                            {
                                id: insertId,
                                nombreCompleto: nombre,
                                numero: numero,
                                alias: '',
                                relacion: '',
                                estadoContacto: 'no'
                            }
                        ]);

                    }
                );
            });
            contador++;
        }
        console.log(`Se agregaron ${contador} contactos a la base de datos.`);
        setContactosSeleccionados([]);
    };
    const handleAgregarContactoPress = () => {
        setModalVisibleContactos(true);
        setModalCTVisible(false);
    };
    const handleCheck = (contacto) => {
        if (contactosSeleccionados.includes(contacto)) {
            setContactosSeleccionados(contactosSeleccionados.filter(c => c !== contacto));
        } else {
            setContactosSeleccionados([...contactosSeleccionados, contacto]);
        }
    };
    const handlePress = (id, contacto) => {
        if (ContactoId === id) {
            // Actualizar contacto 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Contacto SET  nombreCompleto = ?, alias = ?, numero = ?, relacion = ? WHERE id = ?',
                    [contacto.nombreCompleto, contacto.alias, contacto.numero, contacto.relacion, id],
                    () => {
                        setContactoId(null);
                        setContactos(prevContactos =>
                            prevContactos.map(c => (c.id === id ? { ...c, ...contacto } : c))
                        );
                    }
                );
            });
        } else {
            setContactoId(id);
        }
    };
    const handleDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM Contacto WHERE id = ?',
                [id],
                () => {
                    setContactos(prevContactos =>
                        prevContactos.filter(c => c.id !== id)
                    );
                }
            );
        });
    };
    const agregarContacto = async () => {
        try {
            let usuario_rut = await obtenerRut();
            return new Promise((resolve, reject) => {
                db.transaction(
                    tx => {
                        tx.executeSql(
                            'INSERT INTO Contacto (nombreCompleto, alias, numero, relacion, estadoContacto, usuario_rut) VALUES (?, ?, ?, ?, ?, ?)',
                            [nombreCompleto, alias, numero, relacion, 'no', usuario_rut],
                            (_, { insertId }) => {
                                setContactos(prevContactos => [
                                    ...prevContactos,
                                    {
                                        id: insertId,
                                        nombreCompleto,
                                        alias,
                                        numero,
                                        relacion,
                                        estadoContacto: 'no'
                                    }
                                ]);
                                setNombreCompleto('');
                                setAlias('');
                                setNumero('');
                                setRelacion('');
                                resolve(insertId);
                            },
                            (_, error) => {
                                console.log('Error al ejecutar el SQL:', error);
                                reject(error);
                            }
                        );
                    },
                    error => {
                        console.log('Error en la transacción de la base de datos:', error);
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.log('Error al obtener el RUT del usuario:', error);
            throw error;
        }
    };

    const estadoContactoEmergencia = (id, valor) => {
        return new Promise((resolve, reject) => {
            try {
                // Si el nuevo valor es 'no', solo actualiza el contacto actual
                if (valor === 'no') {
                    db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE Contacto SET estadoContacto = "no" WHERE id = ?',
                            [id],
                            () => {
                                setContactos(prevContactos =>
                                    prevContactos.map(c =>
                                        c.id === id ? { ...c, estadoContacto: 'no' } : c
                                    )
                                );
                                resolve();
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                    });
                }
                // Si el nuevo valor es 'sí', actualiza todos los contactos
                else {
                    db.transaction(tx => {
                        tx.executeSql(
                            'UPDATE Contacto SET estadoContacto = "no"',
                            [],
                            () => {
                                tx.executeSql(
                                    'UPDATE Contacto SET estadoContacto = "sí" WHERE id = ?',
                                    [id],
                                    () => {
                                        setContactos(prevContactos =>
                                            prevContactos.map(c =>
                                                c.id === id ? { ...c, estadoContacto: 'sí' } : { ...c, estadoContacto: 'no' }
                                            )
                                        );
                                        resolve();
                                    },
                                    (error) => {
                                        reject(error);
                                    }
                                );
                            },
                            (error) => {
                                reject(error);
                            }
                        );
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    };


    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={obtenerYGuardarContactos}
                >
                    <Text style={styles.buttonText}>Agregar contactos desde el telefono</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCTVisible}
                onRequestClose={() => {
                    setModalCTVisible(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView>
                            {contactosTelefono.map((contacto) => (
                                <CheckBoxRapido
                                    key={contacto.id}
                                    isChecked={contactosSeleccionados.includes(contacto)}
                                    onCheck={() => handleCheck(contacto)}
                                    title={contacto.name}
                                />
                            ))}
                        </ScrollView>
                        <View style={styles.verticalButtonsContainer}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => {
                                    guardarContactosSeleccionados();
                                    setModalCTVisible(false);
                                    setContactosSeleccionados([]);
                                }}
                            >
                                <Text style={styles.buttonText}>Guardar contactos seleccionados</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => {
                                    setModalCTVisible(false);
                                    setContactosSeleccionados([]);
                                }}
                            >
                                <Text style={styles.buttonText2}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleAgregarContactoPress}
                >
                    <Text style={styles.buttonText2}>Agregar nuevo contacto</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.espacioContainer}></View>
            {/*<View style={styles.lineaContainer}></View>*/}
            <ScrollView>
                {contactos.map(contacto => (
                    <MostrarEditarContactos
                        key={contacto.id}
                        contacto={contacto}
                        isEditing={ContactoId === contacto.id}
                        handlePress={handlePress}
                        handleDelete={handleDelete}
                        setContactoId={setContactoId}
                        estadoContactoEmergencia={estadoContactoEmergencia}

                    />
                ))}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleContactos}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleContactos(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.header}>Nombre completo:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setNombreCompleto(text)}
                            value={nombreCompleto}
                        />
                        <Text style={styles.header}>Alias:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setAlias(text)}
                            value={alias}
                        />
                        <Text style={styles.header}>Número:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setNumero(text)}
                            value={numero}
                        />
                        <Text style={styles.header}>Indica la relación con el contacto:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setRelacion(text)}
                            value={relacion}
                        />
                        <View style={styles.buttonContainerCenter}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setModalVisibleContactos(false); }}>
                                <Text style={styles.buttonText2}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryButton} onPress={() => { agregarContacto(); }}>
                                <Text style={styles.buttonText}>
                                    Agregar Nuevo Contacto
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus contactos.'
            />
        </View >
    );
};
export default Contactos;