//recordatorios.js
import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { Agenda } from "react-native-calendars"
import { db, mostarDB } from "../api/sqlite"
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native'

// Define el componente Recordatorios
const Recordatorios = () => {
  // Inicializa el estado del componente
  const [recordatorios,setRecordatorios]= useState({})

  // Obtiene el estado de enfoque de la pantalla
  const isFocused= useIsFocused();

  // Define un efecto que se ejecuta cuando la pantalla está enfocada
  useEffect(()=>{
    // Abre una transacción en la base de datos
    db.transaction(tx => {
      // Ejecuta una consulta SQL para obtener todos los recordatorios ordenados por fecha
      tx.executeSql('SELECT * FROM Recordatorios ORDER BY Fecha', null, (txObj, resultSet) => {
        // Procesa los resultados de la consulta
        let newRecordatorios= resultSet.rows._array

        // Agrupa los recordatorios por fecha
        let groupedData = newRecordatorios.reduce((acc, curr) => {
          if (!acc[curr.Fecha]) {
            acc[curr.Fecha] = [];
          }
          acc[curr.Fecha].push(curr);
          return acc;
        });

        // Actualiza el estado con los nuevos recordatorios
        setRecordatorios(groupedData);
      });
    })
  },[isFocused]); // Se ejecuta cada vez que cambia el estado de enfoque

  // Define cómo se renderiza cada recordatorio
  const renderRecordatorio= (recordatorio)=>{
    if (recordatorio){
      for (item in recordatorio){
        return(
          <View className="flex-row ">
            <View className="flex flex-2 py-10"><Text>{recordatorio.Hora}</Text></View>
            <View className="flex flex-1 px-3 py-2"><Text className=" py-2">{recordatorio.Titulo}</Text>
            <Text className=" py-2" >{recordatorio.Descripcion}</Text></View>
            { recordatorio.id? (<View className="flex-row  py-10 ml-10 mr-5">
              <TouchableOpacity>
                <Text><FontAwesome5 name="check" size={18} color="black" /></Text>
              </TouchableOpacity>
            </View>):(<View/>)}
          </View>
        )
      }
    }
    else {
      return(<View/>)
    }
  };

  // Define cómo se cargan los elementos para un mes específico
  const loadItems = (day) => {
    setTimeout(()=>{
      const items = recordatorios || {};
      for (item in items){
       renderRecordatorio(item)}
    }, 3000);
  };
  
  // Renderiza el componente
  return (
    <SafeAreaView style={{flex:1}}>
      <Agenda
        items={recordatorios}
        renderItem={renderRecordatorio}
        loadItemsForMonth={loadItems}
        renderEmptyData={ loadItems}
      />
    </SafeAreaView>
  )
}

// Define los estilos del componente
const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
});

// Exporta el componente
export default Recordatorios
