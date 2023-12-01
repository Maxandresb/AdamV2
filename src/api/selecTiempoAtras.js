// selecTiempoAtras.js
import React, { useState, useRef, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';

const numbers = Array.from({ length: 24 }, (_, i) => i + 1);
const words = ['hora(s)', 'dia(s)', 'semana(s)', 'año(s)'];

// Duplica los datos para lograr el efecto de desplazamiento infinito
const numbersData = [...numbers, ...numbers, ...numbers];
const wordsData = [...words, ...words, ...words];

const SelecTiempoAtras = ({ onConfirm }) => {
    const [selectedNumber, setSelectedNumber] = useState(1);
    const [selectedWord, setSelectedWord] = useState('hora(s)');
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoSeleccion, setEstadoSeleccion] = useState(false);

    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme)
    let activeColors = colors[theme.mode];
    

    // Referencias a los ScrollView para ajustar el desplazamiento inicial
    const numberScrollRef = useRef();
    const wordScrollRef = useRef();

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
                                        wordScrollRef.current.scrollTo({ y: 40 * words.length });
                                    }, 0);
                            }}
                        >
                            {'Toca aquí para seleccionar una opción'}</Text>
                    </View>
                ) : (
                    <View
                        style={styles.selectedValueContainer}
                        onPress={() => { setEstadoSeleccion(false), setModalVisible(true) }}
                    >
                        <Text
                            style={styles.textInput}
                            onPress={() => { setEstadoSeleccion(false), setModalVisible(true) }}
                        >
                            {selectedNumber}{' '}{selectedWord}</Text>
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
                            snapToInterval={40} // Ajusta el desplazamiento para que siempre se detenga en un elemento
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

                        <ScrollView
                            ref={wordScrollRef}
                            style={styles.column}
                            showsVerticalScrollIndicator={false}
                            snapToInterval={40} // Ajusta el desplazamiento para que siempre se detenga en un elemento
                            onMomentumScrollEnd={event => {
                                const index = Math.round((event.nativeEvent.contentOffset.y + 20) / 40) % words.length;
                                setSelectedWord(words[index]);
                            }}
                        >
                            {wordsData.map((word, index) => (
                                <TouchableOpacity key={index} style={word === selectedWord ? styles.selectedRow : styles.row}>
                                    <Text style={styles.text}>{word}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={{ marginLeft: 10, marginRight: -25, backgroundColor: activeColors.primary, padding: 10 , shadowColor: '#000000',
                            shadowOffset: { width: -2, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 3,
                            elevation: 8,
                            borderRadius: 8}}
                            onPress={() => {
                                setModalVisible(false);
                                setEstadoSeleccion(true);
                                onConfirm(selectedNumber, selectedWord);
                            }} >
                            <Text style={{fontSize: 17, color: activeColors.secondary}} >{"Seleccionar"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const useTheme = (theme) => {
    return colors[theme.mode];
}

const getStyles = (theme) => {
    let activeColors = useTheme(theme);

    return StyleSheet.create({
        textInput: {
            color: activeColors.quinary,
            fontSize: 16,
            paddingLeft: 18
        },
        selectedValueContainer: {
            backgroundColor: activeColors.secondary,
            height: 40,
            marginBottom: 10,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: 'black',
            color: activeColors.quinary,
            fontWeight: 'bold',
            justifyContent: 'center',
        },
        container: {
            flex: 1,
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
            backgroundColor: activeColors.quaternary,
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
            backgroundColor: activeColors.secondary, // Cambia el color de fondo del elemento seleccionado
        },
        text: {
            fontSize: 18,
        },
    });
}

export default SelecTiempoAtras;
