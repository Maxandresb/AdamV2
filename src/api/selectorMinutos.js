import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

const numbers = Array.from({ length: 60 }, (_, i) => i + 1);
const numbersData = [...numbers, ...numbers, ...numbers];

const SelectorMinutos = ({ onConfirm, selectedViewStyle }) => {
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoSeleccion, setEstadoSeleccion] = useState(false);


    const numberScrollRef = useRef();

    return (
        <>
            {
                !estadoSeleccion ? (
                    <View
                        style={styles.selectedValueContainer}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text
                            style={styles.textInput}
                            onPress={() => {
                                setModalVisible(true),
                                    // Ajusta el desplazamiento inicial para comenzar en el medio
                                    setTimeout(() => {
                                        numberScrollRef.current.scrollTo({ y: 40 * numbers.length });
                                    }, 0);
                            }}
                        >
                            {'Toca aquí para seleccionar una opción'}</Text>
                    </View>
                ) : (
                    <View
                        onPress={() => { setEstadoSeleccion(false), setModalVisible(true) }}
                    >
                        <Text
                            style={[selectedViewStyle]}
                            onPress={() => { setEstadoSeleccion(false), setModalVisible(true) }}
                        >
                            {selectedNumber} Minutos</Text>
                    </View>
                )
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView
                            ref={numberScrollRef}
                            style={styles.column}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={40}
                            onMomentumScrollEnd={event => {
                                const index = Math.round((event.nativeEvent.contentOffset.y + 20) / 40) % numbers.length;
                                setSelectedNumber(numbers[index]);
                            }}
                        >
                            {numbersData.map((number, index) => (
                                <TouchableOpacity key={index} style={number === selectedNumber ? styles.selectedRow : styles.row}>
                                    <Text style={styles.text}>{number}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={{ marginLeft: 10, marginRight: -25, backgroundColor: '#ff3e45', padding: 10 }}
                            onPress={() => {
                                setModalVisible(false);
                                setEstadoSeleccion(true);
                                onConfirm(selectedNumber);
                            }} >
                            <Text style={{ fontSize: 17, color: 'white' }} >{"Seleccionar"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    textInput: {
        color: 'black',
        fontSize: 16,
        paddingLeft: 10,
        paddingRight:10
    },
    selectedValueContainer: {
        backgroundColor: '#efefef',
        height: 40,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'black',
        color: '#00008B',
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    column: {
        height: 120,
        flex: 1,
    },
    row: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    selectedRow: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: 'rgba(255, 62, 69, 0.5)',
    },
    text: {
        fontSize: 18,
    },
});

export default SelectorMinutos;
