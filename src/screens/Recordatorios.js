import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { Agenda } from "react-native-calendars"
import { db, mostarDB } from "../api/sqlite"
import { FontAwesome5 } from '@expo/vector-icons';

import { useIsFocused } from '@react-navigation/native'


const Recordatorios = () => {
  const [recordatorios,setRecordatorios]= useState({})
  const [items,setItems]=useState({})
  const [data,setData] = useState([])
  //const [fechaFin, setFechaFin]= useState('');
  //const [fechaIni, setFechaIni]= useState('');
  

  const fechaFin = new Date().getFullYear() -1;
  const isFocused= useIsFocused();
  useEffect(()=>{
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Recordatorios ORDER BY Fecha', null, (txObj, resultSet) => {
        let newRecordatorios= resultSet.rows._array

        let groupedData = newRecordatorios.reduce((acc, curr) => {
          if (!acc[curr.Fecha]) {
            acc[curr.Fecha] = [];
          }
          acc[curr.Fecha].push(curr);
          return acc;});
        const reduced = newRecordatorios.reduce((acc,currentItem)=>{
          const {Fecha, ...Rec }=currentItem
          acc[Fecha] =[Rec];
          return acc;
        },{});
        //console.log(groupedData);
        
        setRecordatorios(groupedData);
        //mostarDB()
      });
      
    })
    
      
  },[isFocused]);
 // console.log(recordatorios);
  const renderRecordatorio= (recordatorio)=>{
   // console.log(recordatorio);
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
    )}}
    else {
      return(<View/>)
    }
  };


  

  const timeToString=(time) =>{
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const loadItems = (day) => {
   

    setTimeout(()=>{
      const items = recordatorios || {};
      for (item in items){
       // console.log(item)
     renderRecordatorio(item)}}
    , 3000);
  };
  
  return (
    <SafeAreaView style={{flex:1}}>
   
    <Agenda
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={recordatorios}
  renderItem={renderRecordatorio}
  //renderEmptyData={()=>renderRecordatorio}
  loadItemsForMonth={loadItems}
  //renderEmptyDate={renderDiaVacio}
  renderEmptyData={ loadItems}
  
  // Callback that gets called when items for a certain month should be loaded (month became visible)
 
  
/>
   
    </SafeAreaView>
  )
}

  
   
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
    customDay: {
      margin: 10,
      fontSize: 24,
      color: 'green'
    },
    dayItem: {
      marginLeft: 34
    }
  });
  


export default Recordatorios