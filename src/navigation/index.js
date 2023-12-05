import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Linking, View, Text, Image, TouchableOpacity } from 'react-native';
import { colors } from '../api/theme';
import { ThemeContext } from '../api/themeContext';
import { useContext } from 'react';
//PANTALLAS

import Recordatorios from "../screens/Recordatorios";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { calcularDiferenciaSegundos, calcularProximaFecha, calcularSegundosHastaProximoHorario } from '../api/notificaciones';
import { actualizarRecordatorio, obtenerIdsNotificacionesRec } from '../api/sqlite';

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
import { addIdNotification } from "../api/sqlite";
import CambiarTema from '../screens/cambiarTema';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <Tab.Navigator initialRouteName="Principal" screenOptions={{
      headerShown: false,
      tabBarActiveBackgroundColor: activeColors.tertiary,
      tabBarActiveTintColor: '#000000',
      tabBarLabelStyle: { color: activeColors.quinary, fontWeight: 'bold', fontSize: 12, marginBottom: 5 },
      tabBarStyle: {
        backgroundColor: activeColors.secondary,
        height: "10%"
      }
    }}>
      <Tab.Screen name="Emergencias" component={Emergencias} options={{ tabBarIcon: ({ focused }) => <Image source={activeColors.sosImage} style={{ width: 40, height: 40, marginBottom: -5, marginTop: 5 }} /> }} />
      <Tab.Screen name="Principal" component={PrincipalScreen} options={{ tabBarIcon: ({ focused }) => <Image source={activeColors.chatImage} style={{ width: 40, height: 40, marginBottom: -5, marginTop: 5 }} /> }} />
      <Tab.Screen name="Recordatorios" component={Recordatorios} options={{ tabBarIcon: ({ focused }) => <Image source={activeColors.calendarImage} style={{ width: 40, height: 40, marginBottom: -5, marginTop: 5 }} /> }} />

    </Tab.Navigator>
  )
}

function PrincipalStack() {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <Drawer.Navigator initialRouteName="ADAM" screenOptions={{

      drawerActiveTintColor: activeColors.primary,
      drawerActiveBackgroundColor: activeColors.secondary,
      drawerInactiveTintColor: activeColors.secondary,

      drawerStyle: {
        backgroundColor: activeColors.primary,
      },

      drawerItemStyle: {
        height: 65,
      },

      drawerLabelStyle: {
        fontWeight: 'bold',
        fontSize: 25,

      },

      headerStyle: {
        backgroundColor: activeColors.primary,

      },

      headerTitleStyle: {
        color: activeColors.secondary
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
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <PerfilNestedStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: activeColors.primary
      },

      headerTitleStyle: {
        color: activeColors.secondary
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
  const { theme, updateTheme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  return (
    <ConfiguracionNestedStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: activeColors.primary

      },

      headerTitleStyle: {
        color: activeColors.secondary
      },
    }}>
      <ConfiguracionNestedStack.Screen name="Configuración" component={Config} />
      <ConfiguracionNestedStack.Screen name="Seleccionar datos a vocalizar" component={SelecDatosVocalizar} />
      <ConfiguracionNestedStack.Screen name="Contactos de emergencia" component={ContactosEmergencia} />
      <ConfiguracionNestedStack.Screen name="Cambiar tema" component={CambiarTema} />
    </ConfiguracionNestedStack.Navigator>
  );

}

const linking = {
  prefixes: ['adam://'],
  config: {
    screens: {
      'seguimiento-nocturno': 'seguimiento-nocturno',
      'medicamento': 'medicamento',
      'agenda-dolencias': 'agenda-dolencias',
      'ADAM': 'ADAM',
    },
  },
};

export default function AppNavigation() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Saludo">
        {/* <Stack.Screen name="Principal" component={PrincipalScreen} /> */}
        {/* <Stack.Screen name="Tabs" component={MyTabs}/> */}
        <Stack.Screen name="Saludo" component={SaludoScreen} />
        <Stack.Screen name="Principal" component={PrincipalStack} />
        <Stack.Screen name="PerfilNested" component={PerfilNestedScreen} />
        <Stack.Screen name="ConfiguracionNested" component={ConfiguracionNestedScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="medicamentos" component={Medicamentos} />
        <Stack.Screen name="agenda-dolencias" component={DolenciasSintomas} />
        <Stack.Screen name="ADAM" component={MyTabs} />
      </Stack.Navigator>
      <NotificationHandler />
    </NavigationContainer>
  );
}
function NotificationHandler() {
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(async response => {
      try {
        console.log(response);
        if (!response) {
          return;
        }
        if (response.notification.request.content.data) {
          const navigateTo = response.notification.request.content.data.navigateTo;
          console.log('content: ', response.notification.request.content);
          console.log('navigate to: ', navigateTo);
          try {
            if (navigateTo && typeof navigateTo === 'string') {
              navigation.navigate(navigateTo);
            }
          } catch (error) {
            console.log('Error al navegar: ', error);
          }
          if (response.notification.request.content.data.tipoNotificacion === 'medicamento') {
            let horario = response.notification.request.content.data.horarioMedicamento
            let segundos = calcularSegundosHastaProximoHorario(horario)
            let id = response.notification.request.content.data.idMedicamento
            let notificacion;
            try {
              notificacion = await Notifications.scheduleNotificationAsync({
                content: {
                  title: response.notification.request.content.title,
                  body: response.notification.request.content.body,
                  data: response.notification.request.content.data
                },
                trigger: {
                  seconds: segundos
                },
              });
              console.log('>> Nueva notificacion: ', notificacion);
            } catch (error) {
              console.log('Error al crear la notificación: ', error);
            }
            try {
              if (notificacion) {
                console.log('>> Id de la notificacion: ', id);
                await addIdNotification(id, notificacion)
              }
            } catch (error) {
              console.log('Error al manejar la notificación: ', error);
            }
          } else if (response.notification.request.content.data.tipoNotificacion === 'recordatorio') {
            let hora = response.notification.request.content.data.horaRecordar
            let dia = response.notification.request.content.data.diaRecordar
            let id = response.notification.request.content.data.idRecordatorio
            let idsNotificacion = response.notification.request.content.data.idNotificacion
            let proximaFecha = calcularProximaFecha(dia.trim(), hora)
            let segundos = calcularDiferenciaSegundos(proximaFecha)
            let notificacion;

            try {
              notificacion = await Notifications.scheduleNotificationAsync({
                content: {
                  title: response.notification.request.content.title,
                  body: response.notification.request.content.body,
                  data: response.notification.request.content.data
                },
                trigger: {
                  seconds: segundos
                },
              });
              console.log('>> Nueva notificacion: ', notificacion);
            } catch (error) {
              console.log('Error al crear la notificación: ', error);
            }
            try {
              if (notificacion) {
                console.log('>> Id del recordatorio: ', id);
                if (idsNotificacion === 'vacio') {
                  try {
                    idsNotificacion = await obtenerIdsNotificacionesRec(id)
                    notificacion = idsNotificacion + ',' + notificacion
                  } catch (error) {
                    console.log('Error al obtener ids de notificaciones recordatorios: ', error);
                  }


                }
                try {
                  await actualizarRecordatorio(id, { Estado: '0', idNotificacion: notificacion })
                } catch (error) {
                  console.log('Error al actualizar el recordatorio: ', error);
                }
              }
            } catch (error) {
              console.log('Error al manejar la notificación: ', error);
            }
          }
        }
        else {
          console.log('No hay data en la notificacion');
        }
      } catch (error) {
        console.log('Error al manejar condiciones del addlistener: ', error);
      }
    });

    // Efecto de limpieza
    return () => {
      subscription.remove();
    };
  }, []);


  return;
}