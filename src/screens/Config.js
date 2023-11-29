import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';
import { useContext } from 'react';


export default function Config({ navigation }) {
    const {theme, updateTheme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    
  return (
    <ScrollView className="space-y-5" style={styles.container}>
    <View className="flex-row h-56 justify-between px-5">
      <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Seleccionar datos a vocalizar' })}>
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

