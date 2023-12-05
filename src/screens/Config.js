import React from 'react';
import { Alert, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import getStyles from '../api/styles';
import { colors } from '../api/theme';
import { ThemeContext } from '../api/themeContext';
import { useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { borrarDatos, contarRecordatorios } from "../api/sqlite";

export default function Config({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  console.log(theme.mode)


  async function cancelarNotificaciones() {
    console.log('ELIMINANDO NOTIFICACIONES');
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  //alert de confirmacion para eliminar
  const confirmacionEliminar = () =>
    Alert.alert(
      "Eliminar notificaciones",
      "¿Está seguro que desea eliminar todas las notificaciones?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Aceptar", onPress: () => cancelarNotificaciones() }
      ]
    );

  //alert de confirmacion para borrarDatos
  const confirmacionBorrarDatos = () =>
    Alert.alert(
      "Eliminar todos sus datos",
      `¿Está seguro que desea eliminar su informacion de la aplicacion?.
    Esto eliminara todos sus datos y debera ingresarlos nuevamente para continuar utilizando la aplicacion.`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Aceptar", onPress: () => {
            borrarDatos(),
              cancelarNotificaciones()
              // navigation.navigate('SignIn')
          }
        }
      ]
    );

  return (
    <ScrollView className="flex-1 p-5 space-y-5 bg-grisClaro">
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity className='px-3' style={styles.cardButton} onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Seleccionar datos a vocalizar' })}>
          <Text style={styles.secondaryText}>Seleccionar datos </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Contactos de emergencia' })}>
          <Text style={styles.secondaryText}>Contactos de Emergencia</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row h-56 justify-center px-5">
        <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Cambiar tema' })}>
          <Text style={styles.secondaryText}> Cambiar tema</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity style={styles.cardButton} onPress={() => confirmacionEliminar()}>
          <Text style={styles.secondaryText}> Borrar notificaciones activas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardButton} onPress={() => confirmacionBorrarDatos()}>
          <Text style={styles.secondaryText}> Borrar todos sus datos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

