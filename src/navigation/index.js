import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Importa tus pantallas aquí
import PrincipalScreen from '../screens/PrincipalScreen';
import SaludoScreen from '../screens/SaludoScreen';
import Perfil from '../screens/Perfil'; 
import Config from '../screens/Config'; 
import HistorialChats from '../screens/HistorialChats'; 


const Drawer = createDrawerNavigator();
//const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

function PrincipalStack() {
  return (
    <Drawer.Navigator initialRouteName="ADAM">
      <Drawer.Screen name="ADAM" component={PrincipalScreen} />
      <Drawer.Screen name="Perfil de usuario" component={Perfil} />
      <Drawer.Screen name="Historial de chats" component={HistorialChats} />
      <Drawer.Screen name="Configuración" component={Config} />
    </Drawer.Navigator>
  );
}
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Saludo">
        <Stack.Screen name="Saludo" component={SaludoScreen} />
        <Stack.Screen name="Principal" component={PrincipalStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
