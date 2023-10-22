import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function Perfil({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PerfilNested', { screen: 'Datos usuario' })}>
          <Text style={styles.buttonText}>Ir a datos de usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PerfilNested', { screen: 'Alergias' })}>
          <Text style={styles.buttonText}>Ir a Alergias</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PerfilNested', { screen: 'Medicamentos' })}>
          <Text style={styles.buttonText}>Ir a Medicamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PerfilNested', { screen: 'Patologias' })}>
          <Text style={styles.buttonText}>Ir a Patologías</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PerfilNested', { screen: 'Limitacion Fisica' })}>
          <Text style={styles.buttonText}>Ir a Limitación Física</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5%', 
  },
  row: {
    flexDirection: 'row',
    width: '100%', 
  },
  button: {
    width: '45%', 
    height: height * 0.25, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin:10
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});
