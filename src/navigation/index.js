import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

//PANTALLAS
import PrincipalScreen from "../screens/PrincipalScreen";
import SaludoScreen from "../screens/SaludoScreen";
import Recordatorios from "../screens/Recordatorios";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Importa tus pantallas aquí


import Perfil from '../screens/Perfil'; 
import Config from '../screens/Config'; 
import HistorialChats from '../screens/HistorialChats'; 


const Drawer = createDrawerNavigator();
//const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabs(){
  return(
    <Tab.Navigator screenOptions={{headerShown:false}}>
      <Tab.Screen name="Principal" component={PrincipalScreen} options={{tabBarIcon:({color,size}) =>(<MaterialCommunityIcons name="chat-question" size={24} color="black" />)}} />
      <Tab.Screen name="Recordatorios" component={Recordatorios} options={{tabBarIcon:({color,size}) =>(<MaterialCommunityIcons name="calendar" size={24} color="black" />)}}/>

    </Tab.Navigator>
  )
}

function PrincipalStack() {
  return (
    <Drawer.Navigator initialRouteName="ADAM">
      <Drawer.Screen name="ADAM" component={MyTabs} />
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
        {/* <Stack.Screen name="Principal" component={PrincipalScreen} /> */}
        {/* <Stack.Screen name="Tabs" component={MyTabs}/> */}
        <Stack.Screen name="Saludo" component={SaludoScreen} />
        <Stack.Screen name="Principal" component={PrincipalStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
