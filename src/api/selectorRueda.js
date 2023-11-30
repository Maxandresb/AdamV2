import React, { useState } from 'react';
import { View, ScrollView, Text, Dimensions, Modal, Button, TouchableHighlight, StyleSheet } from 'react-native';
import styles from '../api/styles';

const { height, width } = Dimensions.get('window');

export default function SelectorRueda({ rango, titulo, onValueChange, metrica }) {
    const [valorSeleccionado, setValorSeleccionado] = useState(rango[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const [estadoSeleccion, setEstadoSeleccion] = useState(false);

    const renderItem = (item, index) => (
        <TouchableHighlight
            key={index}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={() => { handleValueChange(index), setEstadoSeleccion(true), setModalVisible(false) }}
            style={styless.item}
        >
            <>
                <Text style={styless.text}>{item}</Text>
                <View style={styles.lineaContainer4}></View>
            </>
        </TouchableHighlight>
    );



    const handleValueChange = (index) => {
        setValorSeleccionado(rango[index]);
        onValueChange(rango[index]);
    };

    return (
        <>
            {
                !estadoSeleccion ? (
                    <View
                        style={styless.selectedValueContainer}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text
                            style={styless.textInput}
                            onPress={() => setModalVisible(true)}
                        >
                            {'Toca aquí para seleccionar una opción'}</Text>
                    </View>
                ) : (
                    <View
                        style={styless.selectedValueContainer}
                        onPress={() => { setEstadoSeleccion(false), setModalVisible(true) }}
                    >
                        <Text
                            style={styless.textInput}
                            onPress={() => { setEstadoSeleccion(false), setModalVisible(true) }}
                        >
                            {valorSeleccionado} {metrica}</Text>
                    </View>
                )
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styless.modalContainer}>
                    <View style={styless.modalContent}>
                        <View style={styless.textContainer}>
                            <Text style={styless.textInput2}>{'Selecciona tu '}{titulo}{':'}</Text>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {rango.map(renderItem)}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styless = StyleSheet.create({
    textInput: {
        color: 'black',
        fontSize: 16,
        paddingLeft: 18
    },
    textInput2: {
        color: 'black',
        fontSize: 16,
        marginBottom: 20,
        marginTop: 20,
        fontWeight: 'bold',
    },
    textContainer:{
        justifyContent: 'center',
        alignItems: 'center',

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
    item: {
        height: 60,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        padding:20
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '80%',
        maxHeight: height / 2,
    },
});
