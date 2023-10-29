import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
// pantallas
import PrincipalScreen from '../screens/PrincipalScreen';
import SaludoScreen from '../screens/SaludoScreen';
import Perfil from '../screens/Perfil';
import Config from '../screens/Config';
import HistorialChats from '../screens/HistorialChats';
// Pantallas formularios
import SignIn from '../screens/SignIn';
import DatosUsuario from '../screens/DatosUsuario';
import Alergias from '../screens/Alergias';
import Medicamentos from '../screens/Medicamentos';
import Patologias from '../screens/Patologias';
import LimitacionFisica from '../screens/LimitacionFisica';
import ContactosEmergencia from '../screens/ContactosEmergencia';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
function PrincipalStack() {
  return (
    <Drawer.Navigator initialRouteName="ADAM">
      <Drawer.Screen name="ADAM" component={PrincipalScreen} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Historial de chats" component={HistorialChats} />
      <Drawer.Screen name="Configuración" component={Config} />
    </Drawer.Navigator>
  );
}
const PerfilNestedStack = createNativeStackNavigator();
function PerfilNestedScreen() {
  return (
    <PerfilNestedStack.Navigator>
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
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Saludo">
        <Stack.Screen name="Saludo" component={SaludoScreen} />
        <Stack.Screen name="Principal" component={PrincipalStack} />
        <Stack.Screen name="PerfilNested" component={PerfilNestedScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
