import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

//PANTALLAS
import PrincipalScreen from "../screens/PrincipalScreen";
import SaludoScreen from "../screens/SaludoScreen";
import Recordatorios from "../screens/Recordatorios";
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Saludo">
        {/* <Stack.Screen name="Principal" component={PrincipalScreen} /> */}
        <Stack.Screen name="Tabs" component={MyTabs}/>
        <Stack.Screen name="Saludo" component={SaludoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;