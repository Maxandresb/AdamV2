// Este es el componente EVA modificado que recibe como props la función para notificar el cambio de valor
import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableHighlight } from "react-native";
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';

const EVA = ({ onChangeValue }) => {
    const [dolor, setDolor] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoSeleccion, setEstadoSeleccion] = useState(false);

    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    // Esta es la función que se ejecuta cuando el usuario presiona un botón de la escala
    const handlePress = (value) => {
        let valor = value + ' de 10 en escala EVA'
        setDolor(valor);
        setModalVisible(false);
        // Notifica el cambio de valor al script principal
        onChangeValue(valor);
    };

    const colores = [ // Crea un array de colores para cada número de la escala
        "rgba(0, 255, 0, 0.25)", // 0: verde claro
        "rgba(0, 245, 0, 0.5)", // 1: verde medio claro
        "rgba(0, 235, 0, 0.75)", // 2: verde medio
        "rgba(0, 215, 0, 1)", // 3: verde medio oscuro
        "rgba(244, 255, 0, 0.25)", // 4: amarillo claro
        "rgba(247, 250, 0, 0.5)", // 5: amarillo medio claro
        "rgba(252, 245, 0, 0.75)", // 6: amarillo medio
        "rgba(255, 230, 0, 1)", // 7: amarillo medio oscuro
        "rgba(255, 15, 0, 0.4)", // 8: rojo claro
        "rgba(255, 0, 0, 0.6)", // 9: rojo medio
        "rgba(245, 0, 0, 0.8)", // 10: rojo oscuro
    ];



    const texts = [ // Crea un array de textos para cada número de la escala
        "Sin dolor", // 0
        "", // 1
        "leve", // 2
        "", // 3
        "", // 4
        "moderado", // 5
        "", // 6
        "", // 7
        "severo", // 8
        "", // 9
        "insoportable", // 10
    ];

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
                            onPress={() => setModalVisible(true)}
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
                            {dolor}</Text>
                    </View>
                )
            }
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 20, margin: 10, marginBottom: 30, justifyContent: 'center', color: activeColors.primary }}>
                            {`Escala de dolor EVA \n\Selecciona tu nivel de dolor:`}
                        </Text>
                        <View style={{ flexDirection: "column", alignItems: 'flex-start', paddingLeft: '22%' }}>
                            {[...Array(11).keys()].reverse().map((i) => (
                                <TouchableOpacity style={{ flexDirection: 'row' }} key={i} onPress={() => {setEstadoSeleccion(true), handlePress(i)}}>
                                    <View
                                        key={i}
                                        style={[
                                            styles.button,
                                            { backgroundColor: colores[i] }, // Usa el array de colores para asignar el color de cada botón

                                        ]}
                                    >
                                        <Text style={styles.text}>{i}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontSize: 16, marginLeft: 10 }}>{texts[i]}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={{ margin: 10, marginLeft: 30, marginRight: 30, marginTop: 30, padding: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.secondary,  shadowColor: '#000000',
                            shadowOffset: { width: -2, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 3,
                            elevation: 8, 
                            borderRadius: 8}}
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Text style={{ fontSize: 20, color: activeColors.primary }}>{'Cerrar'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
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
            color: 'black',
            fontSize: 16,
            paddingLeft: 18
        },
        button: {
            width: 40,
            height: 40,
            borderRadius: 20,
            margin: 5,
            justifyContent: "center",
            alignItems: "center",
            borderColor: 'black',
            borderWidth: 1
        },
        text: {
            color: "black",
            fontSize: 18,
            fontWeight: "bold",
        },
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalContent: {
            backgroundColor: activeColors.quaternary,
            borderRadius: 10,
            padding: 20,
            width: "80%",
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
    });
    
}

export default EVA;
