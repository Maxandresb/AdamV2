//Modulos instalados
import { View, Text,Image, SafeAreaView, TouchableOpacity , Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GiftedChat } from 'react-native-gifted-chat'
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native'

// Creaciones propias
import { apiCall , whisperCall} from "../api/openAI";
import * as FileSystem from 'expo-file-system';

export default function PrincipalScreen() {
  const [inputUsuario, setinputUsuario]= useState('')
  const [mensajes, setMensajes]= useState([])
  const [cargando, setCargando] =useState(false)
  const [hablando, setHablando] =useState(false)
  const [respondiendo, setRespondiendo]= useState(false)
  const navigation = useNavigation();

  //useEffect(()=> dummyMessages.map((mensaje)=>setMensajes((mensajesPrevios)=>GiftedChat.append(mensajesPrevios,mensaje))))
 {/* inicio funciones de grabacion de voz de usuario  */ }
 const [grabacion, setGrabacion]= useState();
 const [grabaciones, setGrabaciones]= useState([]);


 

 async function iniciarGrabacion(){
   try {
     const permisos= await Audio.requestPermissionsAsync();
     setHablando(true)
     if(permisos.status === "granted"){await Audio.setAudioModeAsync({allowsRecordingIOS:true,playsInSilentModeIOS:true,});
       console.log('Starting recording..');
       const { recording } =await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
       setGrabacion(recording);
       console.log('Recording started');//console.log(recording);
     }
   } catch (error) {console.log(error)}}
 async function detenerGrabacion(){
   setGrabacion(undefined);
   await grabacion.stopAndUnloadAsync();
   const uri = grabacion.getURI();
   console.log('Recording stopped and stored at', uri);
   const fileName = `recording-${Date.now()}.mp4`;
  // Copy the recording file to a temporary directory
  const tempDirectory = FileSystem.cacheDirectory + 'recordings/';
  await FileSystem.makeDirectoryAsync(tempDirectory, { intermediates: true });
  const tempRecordingUri = tempDirectory + fileName;
  await FileSystem.copyAsync({
    from: uri,
    to: tempRecordingUri,
  });

  const formData = new FormData();
          formData.append('file', {
            uri: tempRecordingUri,
            name: fileName,
            type: 'audio/m4a', // Change to the desired audio format
          });
          formData.append('model', 'whisper-1');
    console.log (tempRecordingUri);
    console.log(formData)

    whisperCall(formData).then(res => {
      let newMensajes =[{ _id: new Date().getTime() + 2,  // para cuando se use voz
         text: res,
           createdAt: new Date(),
           user: {
             _id: 1,
            
           }}];
           console.log(res)
      console.log(newMensajes)
      obtenerRespuesta(newMensajes)
    });
   //whisperCall(uri).then(res =>{
    //console.log('******respuesta api obtenida*****');
    //console.log(res)
   //});
   let todasGrabaciones = [...grabaciones];
   const { sound, status }= await grabacion.createNewLoadedSoundAsync();
   todasGrabaciones.push({sound:sound,duration: getDuracionFormato(status.durationMillis),file: grabacion.getURI()});
   setGrabaciones(todasGrabaciones);
   //console.log(grabaciones);
   setHablando(false)}
 function getDuracionFormato(milliseconds){
   const minutos = milliseconds /1000 /60;
   const segundos = Math.round((minutos - Math.floor(minutos)) * 60);
   return segundos < 10 ? `${Math.floor(minutos)}:0${segundos}`:`${Math.floor(minutos)}:${segundos}`
 }
 function clearGrabaciones(){
   setGrabaciones([])
 }
{/* fin funciones de grabacion de voz de usuario  */ }

{/* Inicio funciones de obtencion de data de apis  */ }
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
          respuestaVoz(res.data.text)
        }else{
          Alert.alert("Ha ocurrido un error : ", res.msg);
        }
      })
    }
  }; 


  {/* Inicio Voz de respuesta de ADAM */}

  {/* voces hombres
  voice:"es-es-x-eed-local" 
  voice:"es-us-x-esf-local" 
  voice:"es-es-x-eed-network" 
  voice:"es-us-x-esd-network"
*/}

  const respuestaVoz= (texto)=>{
    //const saludo ='test de saludo';
    const options={
      voice:"es-us-x-esd-network"  ,
      rate:0.9,
      pitch: 0.85
       
    };
    Speech.speak(texto,options)
  };

  {/* Fin Voz de respuesta de ADAM */}











// **********************************************************************************************************************************************************************************
// ***                                                         Vista de pantalla                                                                                                  ***
// **********************************************************************************************************************************************************************************

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
                <TouchableOpacity className="space-y-2" onPress={detenerGrabacion}>
                  {/* recording stop button */}
                  <Image 
                    className="rounded-full" 
                    source={require('../../assets/images/voiceLoading.gif')}
                    style={{width: hp(10), height: hp(10)}}
                  />
                </TouchableOpacity>
                
              ) : (
                <TouchableOpacity onPress={iniciarGrabacion} >
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
            mensajes.length>=0 && (
              <TouchableOpacity 
                onPress={()=> navigation.navigate('Recordatorios')} 
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
