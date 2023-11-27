import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


export default function Config({ navigation }) {
  return (
    <ScrollView className="flex-1 p-5 space-y-5 bg-grisClaro">
    <View className="flex-row h-56 justify-around space-x-10 px-5">
      <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Seleccionar datos a vocalizar' })}>
        <Text className="text-xl text-celeste text-center font-bold">Seleccionar datos </Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Contactos de emergencia' })}>
        <Text className="text-xl text-celeste text-center font-bold">Contactos de Emergencia</Text>
      </TouchableOpacity>
    </View>
    <View className="flex-row h-56 justify-around space-x-10 px-5">
      <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('ConfiguracionNested', { screen: 'Configuración seguimiento nocturno' })}>
        <Text className="text-xl text-celeste text-center font-bold">Seguimiento nocturno </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

