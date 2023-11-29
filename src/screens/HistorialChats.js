import React, { useEffect, useState, useCallback, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import getStyles from '../api/styles';
import { ThemeContext } from '../api/themeContext';

const db = SQLite.openDatabase('adamdb.db');

const HistorialChat = () => {

  const [historial, setHistorial] = useState([]);
  const {theme, updateTheme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  const loadData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Historial', [], (_, { rows }) =>
        setHistorial(rows._array)
      );
    });
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const deleteAll = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Historial', [], (_, { rows }) =>
        loadData()
      );
    });
  }

  const deleteRecord = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Historial WHERE id = ?', [id], (_, { rows }) =>
        loadData()
      );
    });
  }

  const DeleteRegistro = (id) => {
    Alert.alert(
      "Eliminar Registro",
      "¿Estás seguro de que quieres eliminar este registro del historial?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => deleteRecord(id)
        }
      ]
    );
  };

  const DeleteHistorial = () => {
    Alert.alert(
      "Eliminar Historial",
      "¿Estás seguro de que quieres eliminar todo el historial?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: deleteAll
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.primaryButton}
        onPress={DeleteHistorial}>
        <Text style={styles.secondaryText}>Eliminar todo el historial</Text>
      </TouchableOpacity>
      <View style={styles.espacioContainer}></View>
      {historial.map(registro => (
        <View key={registro.id}>
          <Text style={styles.msjContainer}>Función reconocida: {registro.funcion}</Text>
          <View style={styles.msjContainer}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.encabezadoInput}>Consulta:</Text>
              <Text style={styles.inputTexto}>{registro.input}</Text>
            </View>
            <View style={styles.lineaContainer2}></View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.encabezadoOutput}>Respuesta de ADAM</Text>
              <Text style={styles.outputTexto}>{registro.output}</Text>
            </View>
          </View>

          <Text style={styles.msjContainer}>Fecha y hora: {registro.fecha_hora}</Text>
          <TouchableOpacity className="mt-5" style={styles.deleteButton}
            onPress={() => DeleteRegistro(registro.id)}>
            <Text style={styles.deleteButtonText}>Eliminar registro</Text>
          </TouchableOpacity>

          <View style={styles.lineaContainer}></View>
        </View>
      ))}
      
    </ScrollView>
  );
}

export default HistorialChat
