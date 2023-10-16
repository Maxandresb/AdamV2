import 'react-native-gesture-handler';
import { View, Text } from 'react-native'
import React from 'react'
import AppNavigation from "./src/navigation"
import { initDB } from "./src/api/sqlite"

export default function App() {
  initDB();
  return (
    <AppNavigation/>
  )
  
}