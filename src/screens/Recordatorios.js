import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { Agenda } from "react-native-calendars"

const Recordatorios = () => {
  return (
    <SafeAreaView style={{flex:1}}>
   
    <Agenda
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={{
    '2023-10-22': [{name: 'item 1 - any js object'}],
    '2023-10-23': [{name: 'item 2 - any js object', height: 80}],
    '2023-10-24': [],
    '2023-10-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
  }}
  // Callback that gets called when items for a certain month should be loaded (month became visible)
 
  
/>
   
    </SafeAreaView>
  )
}

export default Recordatorios