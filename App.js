import 'react-native-gesture-handler';
import React from 'react'
import AppNavigation from "./src/navigation"
import { initDB } from "./src/api/sqlite"
import { InsertCentrosMedicos } from "./src/api/insertCentrosMedicos"

export default function App() {
  initDB();
  InsertCentrosMedicos();
  return (
    <AppNavigation/>
  )
}
