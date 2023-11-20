import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { View, Text, Image, TouchableOpacity } from 'react-native';
//PANTALLAS

import Recordatorios from "../screens/Recordatorios";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import PrincipalScreen from '../screens/PrincipalScreen';
import SaludoScreen from '../screens/SaludoScreen';
import Perfil from '../screens/Perfil';
import DolenciasSintomas from '../screens/DolenciasSintomas';
import HistorialChats from '../screens/HistorialChats';
import Config from '../screens/Config';
// Pantallas formularios
import SignIn from '../screens/SignIn';
import DatosUsuario from '../screens/DatosUsuario';
import Alergias from '../screens/Alergias';
import Medicamentos from '../screens/Medicamentos';
import Patologias from '../screens/Patologias';
import LimitacionFisica from '../screens/LimitacionFisica';
import ContactosEmergencia from '../screens/ContactosEmergencia';
//Pantallas configuracion
import SelecDatosVocalizar from '../screens/SelecDatosVocalizar';


import styles from '../api/styles';
import Emergencias from "../screens/Emergencias";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs(){
  return(
    <Tab.Navigator  initialRouteName="Principal" screenOptions={{headerShown:false, 
      tabBarActiveBackgroundColor: '#a9a9a9',
      tabBarActiveTintColor: '#000000',
      tabBarLabelStyle: {color: '#ff3e45', fontWeight: 'bold', fontSize: 12, marginBottom: 5},
    tabBarStyle:{
      backgroundColor: "#cceaf5",  
      height: "10%"}}}>
       <Tab.Screen name="Emergencias" component={Emergencias} options={{tabBarIcon:({focused}) => <Image source={require('../../assets/images/sos.png')} style={{width: 40, height: 40, marginBottom: -5, marginTop: 5}} />}} /> 
      <Tab.Screen name="Principal" component={PrincipalScreen} options={{tabBarIcon:({focused}) => <Image source={require('../../assets/images/chat_icon_red.png')} style={{width: 40, height: 40, marginBottom: -5, marginTop: 5}} />}} />
      <Tab.Screen name="Recordatorios" component={Recordatorios} options={{tabBarIcon:({focused}) => <Image source={require('../../assets/images/calendar_icon_red.png')} style={{width: 40, height: 40, marginBottom: -5, marginTop: 5}} />}} />
      
    </Tab.Navigator>
  )
}

function PrincipalStack() {
  return (
    <Drawer.Navigator initialRouteName="ADAM" screenOptions={{

      drawerActiveTintColor: '#cceaf5',
      drawerActiveBackgroundColor: '#ff3e45',
      drawerInactiveTintColor: '#ff3e45',

      drawerStyle: {
        backgroundColor:"#cceaf5",
        },
      
      drawerItemStyle: {
        height: 65,
      },

      drawerLabelStyle: {
        fontWeight: 'bold',
        fontSize: 25,
        
      },

      headerStyle: {
        backgroundColor: '#ff3e45',
        
      },

      headerTitleStyle: {
        color: '#cceaf5'
      },

      


      }}>
      <Drawer.Screen name="ADAM" component={MyTabs} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Agenda de dolencias " component={DolenciasSintomas} />
      <Drawer.Screen name="Historial de chats" component={HistorialChats} />
      <Drawer.Screen name="Configuración" component={Config} />
    </Drawer.Navigator>
  );
}
const PerfilNestedStack = createNativeStackNavigator();
function PerfilNestedScreen() {
  return (
    <PerfilNestedStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#cceaf5'
      },

      headerTitleStyle: {
        color: '#ff3e45'
      }
    }}>
      <PerfilNestedStack.Screen name="Perfil" component={Perfil} />
      <PerfilNestedStack.Screen name="Datos de usuario" component={DatosUsuario} />
      <PerfilNestedStack.Screen name="Alergias" component={Alergias} />
      <PerfilNestedStack.Screen name="Medicamentos" component={Medicamentos} />
      <PerfilNestedStack.Screen name="Patologias" component={Patologias} />
      <PerfilNestedStack.Screen name="Limitacion fisica" component={LimitacionFisica} />
      <PerfilNestedStack.Screen name="Contactos de emergencia" component={ContactosEmergencia} />
      

    </PerfilNestedStack.Navigator>
  );
}
const ConfiguracionNestedStack = createNativeStackNavigator();
function ConfiguracionNestedScreen() {
  return (
    <ConfiguracionNestedStack.Navigator>
      <ConfiguracionNestedStack.Screen name="Configuración" component={Config} />
      <ConfiguracionNestedStack.Screen name="Seleccionar datos a vocalizar" component={SelecDatosVocalizar} />
      <ConfiguracionNestedStack.Screen name="Contactos de emergencia" component={ContactosEmergencia} />
    </ConfiguracionNestedStack.Navigator>
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
        <Stack.Screen name="PerfilNested" component={PerfilNestedScreen} />
        <Stack.Screen name="ConfiguracionNested" component={ConfiguracionNestedScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
