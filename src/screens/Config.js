import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';
import { useContext } from 'react';


export default function Config({ navigation }) {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  console.log(theme.mode)
  return (
    <ScrollView className="flex-1 p-5 space-y-5 bg-grisClaro">
    <View className="flex-row h-56 justify-around space-x-10 px-5">
      <TouchableOpacity  className='px-3' style={styles.cardButton} onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Seleccionar datos a vocalizar' })}>
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
    </ScrollView>
  )
}

