import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function Perfil({ navigation }) {
  return (
    <ScrollView className="flex-1 p-5 space-y-5 bg-beige">
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity className="bg-redcoral rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Datos de usuario' })}>
          <Text className="text-xl text-damasco text-center font-bold">Ir a datos de usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-redcoral rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Alergias' })}>
          <Text className="text-xl text-damasco text-center font-bold">Ir a Alergias</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity className="bg-redcoral rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Medicamentos' })}>
          <Text className="text-xl text-damasco text-center font-bold">Ir a Medicamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-redcoral rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Patologias' })}>
          <Text className="text-xl text-damasco text-center font-bold">Ir a Patologías</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity className="bg-redcoral rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Limitacion fisica' })}>
          <Text className="text-xl text-damasco text-center font-bold">Ir a Limitación Física</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-redcoral rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Contactos de emergencia' })}>
          <Text className="text-xl text-damasco text-center font-bold">Ir a Contactos de emergencia</Text>
        </TouchableOpacity>        
      </View>
    </ScrollView>
  );
}
