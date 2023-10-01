import { View, Text,Image, SafeAreaView, TouchableOpacity , Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GiftedChat } from 'react-native-gifted-chat'
import { dummyMessages } from "../constants";
import { apiCall } from "../api/openAI";
export default function PrincipalScreen() {
  const [inputUsuario, setinputUsuario]= useState('')
  const [mensajes, setMensajes]= useState([])
  const [cargando, setCargando] =useState(false)
  const [hablando, setHablando] =useState(false)
  //useEffect(()=> dummyMessages.map((mensaje)=>setMensajes((mensajesPrevios)=>GiftedChat.append(mensajesPrevios,mensaje))))



  const obtenerRespuesta = async (input)=>{
    setinputUsuario(input);
    const mensajeUsuario= input[0];
    setMensajes((mensajesPrevios)=> GiftedChat.append(mensajesPrevios,mensajeUsuario))
    

    if(input[0].text.length >0){
      console.log('entra en if')
    console.log("**********************************")

      setCargando(true);
      // let newMensajes ={ _id: new Date().getTime() + 2,   para cuando se use voz
      //   text: input,
      //   createdAt: new Date(),
      //   user: {
      //     _id: 1,
          
      //   }};
      let newMensaje = mensajeUsuario.text;
          apiCall(newMensaje).then(res=>{
        console.log('******respuesta api obtenida*****');
        setCargando(false);
        if(res.success){
          console.log(res.data);
          setMensajes((mensajesPrevios)=>GiftedChat.append(mensajesPrevios,res.data))
          setinputUsuario('');
        }else{
          Alert.alert("Ha ocurrido un error : ", res.msg);
        }
      })
    }
  }; 
















  return (
    <View className="flex-1 bg-green-100">
     <SafeAreaView className="flex-1 justify-center">
     <View className="flex-row justify-center">
      <Image 
      source={require('../../assets/images/iron-adam.png')}
      style={{height:hp(8), width:wp(12)}}
      />
      
     </View>
     <View><Text>Chat ADAM</Text></View>
     <View className="flex-1 flex-row justify-center">
      
      <View style={{height:hp(80), width:wp(90)}}  className= " bg-blue-100 rounded-3xl p-4">
     <GiftedChat 
     messages={mensajes}
     renderUsernameOnMessage={false}
     onSend={(input)=>obtenerRespuesta(input)}
     user={{_id:1}}
     />
     </View>
      {/* recording, clear and stop buttons */}
      
     </View>
     <View className="flex justify-center items-center">
          {
            cargando? (
              <Image 
                source={require('../../assets/images/loading.gif')}
                style={{width: hp(10), height: hp(10)}}
              />
            ):
              hablando ? (
                <TouchableOpacity className="space-y-2">
                  {/* recording stop button */}
                  <Image 
                    className="rounded-full" 
                    source={require('../../assets/images/voiceLoading.gif')}
                    style={{width: hp(10), height: hp(10)}}
                  />
                </TouchableOpacity>
                
              ) : (
                <TouchableOpacity >
                  {/* recording start button */}
                  <Image 
                    className="rounded-full" 
                    source={require('../../assets/images/recordingIcon.png')}
                    style={{width: hp(10), height: hp(10)}}
                  />
                </TouchableOpacity>
              )
          }
          {
            mensajes.length>0 && (
              <TouchableOpacity 
               // onPress={clear} 
                className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
              >
                <Text className="text-white font-semibold">Clear</Text>
              </TouchableOpacity>
            )
          }
          {/* {
            speaking && (
              <TouchableOpacity 
                //onPress={stopSpeaking} 
                className="bg-red-400 rounded-3xl p-2 absolute left-10"
              >
                <Text className="text-white font-semibold">Stop</Text>
              </TouchableOpacity>
            )
          } */}
            
            
          
        </View>
     </SafeAreaView>
    </View>
  )
}


// axios instalado, navigation instalado, tailwindcss instalado
