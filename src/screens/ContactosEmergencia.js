
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';

const db = SQLite.openDatabase('adamdb.db');
const ContactoEmergencia = ({ contacto, isEditing, handlePress, handleDelete }) => {
    const [currentContacto, setCurrentContacto] = useState(contacto);
    const handleChange = (key, val) => {
        setCurrentContacto(current => ({
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
    return (
        <View>
            {isEditing ? (
                <>
                    <Text style={styles.encabezado}>Nombre completo:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentContacto.nombreCompleto}
                        onChangeText={(val) => handleChange('nombreCompleto', val)}
                    />
                    <Text style={styles.encabezadoInicial}>Alias:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentContacto.alias}
                        onChangeText={(val) => handleChange('alias', val)}
                    />
                    <Text style={styles.encabezado}>Número:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentContacto.numero}
                        onChangeText={(val) => handleChange('numero', val)}
                    />
                    <Text style={styles.encabezado}>Relación:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentContacto.relacion}
                        onChangeText={(val) => handleChange('relacion', val)}
                    />
                </>
            ) : (
                <>
                    <Text style={styles.encabezado}>Nombre completo:</Text>
                    <Text style={styles.content}>{currentContacto.nombreCompleto}</Text>
                    <Text style={styles.encabezadoInicial}>Alias:</Text>
                    <Text style={styles.content}>{currentContacto.alias}</Text>
                    <Text style={styles.encabezado}>Número:</Text>
                    <Text style={styles.content}>{currentContacto.numero}</Text>
                    <Text style={styles.encabezado}>Relación:</Text>
                    <Text style={styles.content}>{currentContacto.relacion}</Text>
                </>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePress(contacto.id, currentContacto)}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Contacto'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress}
                >
                    <Text style={styles.buttonText}>
                        Eliminar Contacto
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}>
            </View>
        </View>
    );
};
const ContactosEmergencia = () => {
    const [contactos, setContactos] = useState([]);
    const [currentContactoId, setCurrentContactoId] = useState(null);
    const [modalVisibleContactos, setModalVisibleContactos] = useState(false);
    const [alias, setAlias] = useState('');
    const [numero, setNumero] = useState('');
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [relacion, setRelacion] = useState('');
    const [isAlertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Contacto', [], (_, { rows }) =>
                setContactos(rows._array)
            );
        });
    }, []);
    const handleAgregarContactoPress = () => {
        setModalVisibleContactos(true);
    };
    const handlePress = (id, contacto) => {
        if (currentContactoId === id) {
            // Actualizar contacto 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Contacto SET  nombreCompleto = ?, alias = ?, numero = ?, relacion = ? WHERE id = ?',
                    [contacto.nombreCompleto, contacto.alias, contacto.numero, contacto.relacion, id],
                    () => {
                        setCurrentContactoId(null);
                        setContactos(prevContactos =>
                            prevContactos.map(c => (c.id === id ? { ...c, ...contacto } : c))
                        );
                    }
                );
            });
        } else {
            setCurrentContactoId(id);
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
    const agregarContacto = () => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO Contacto ( nombreCompleto, alias, numero, relacion) VALUES (?, ?, ?, ?)',
                [ nombreCompleto, alias, numero, relacion],
                (_, { insertId }) => {
                    setContactos(prevContactos => [
                        ...prevContactos,
                        {
                            id: insertId,
                            nombreCompleto,
                            alias,
                            numero,
                            relacion
                        }
                    ]);
                    setNombreCompleto('');
                    setAlias('');
                    setNumero('');
                    setRelacion('');
                }
            );
        });
    };
    return (
        <ScrollView style={styles.container}>
            <View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleAgregarContactoPress}
                >
                    <Text style={styles.buttonText}>Agregar Contacto</Text>
                </TouchableOpacity>
            </View>
            {contactos.map(contacto => (
                <ContactoEmergencia
                    key={contacto.id}
                    contacto={contacto}
                    isEditing={currentContactoId === contacto.id}
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                />
            ))}
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
                            <Button
                                title="Agregar Nuevo Contacto"
                                color="green"
                                onPress={() => {
                                    agregarContacto();
                                }}
                            />
                        </View>
                        <View style={styles.buttonContainerCenter}>
                            <Button
                                title="Listo"
                                color="green"
                                onPress={() => {
                                    setModalVisibleContactos(false);
                                    agregarContacto();
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus contactos.'
            />
        </ScrollView >
    );
};
export default ContactosEmergencia;
