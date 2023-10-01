import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrincipalScreen from "../screens/PrincipalScreen";
import SaludoScreen from "../screens/SaludoScreen";


const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Saludo">
        <Stack.Screen name="Principal" component={PrincipalScreen} />
        <Stack.Screen name="Saludo" component={SaludoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;