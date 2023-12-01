//app.js
import 'react-native-gesture-handler';
import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AppNavigation from "./src/navigation"
import { initDB } from "./src/api/sqlite"
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { ThemeContext } from './src/api/themeContext';

import { InsertCentrosMedicos } from "./src/api/insertCentrosMedicos"
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import { calcularProximaFecha, scheduleRecordatorioNotification } from "./src/api/notificaciones";

import { storeData, getData } from "./src/api/asyncStorage";
import * as SplashScreen from "expo-splash-screen";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});




export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [theme, setTheme] = useState({mode: 'default'})

  const updateTheme = (newTheme) => {
    if (!newTheme) {
      mode = theme.mode === 'default' ? 'tropicalSunrise':'default';
      newTheme = {mode};
    }
    setTheme(newTheme);
    storeData("appTheme", newTheme);
  };

  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData("appTheme")

      if (themeData) {
        updateTheme(themeData);
      }
    } catch ({message}) {
      alert(message)
    } finally {
      SplashScreen.hideAsync();
    }
  }

  useEffect(() => {
    fetchStoredTheme();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      // Obtiene los datos de la notificación
      let data = response.notification.request.content.data;

      // Comprueba si el día es 'unico'
      if (data.dias[0] !== 'unico') {
        // Si no es 'unico', recalcula la próxima fecha para ese recordatorio y programa una nueva notificación para esa fecha
        // Calcula la próxima fecha que corresponde a este día de la semana
        let proximaFecha = calcularProximaFecha(data.dias);

        // Modifica data para incluir la próxima fecha
        data.Fecha = proximaFecha;

        // Reprograma la notificación para la próxima fecha
        scheduleRecordatorioNotification(data);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  initDB();
  return (
    <ThemeContext.Provider value={{theme, updateTheme}}>
        <AppNavigation />
    </ThemeContext.Provider>
  )




  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
      //console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }
}
