
//Modulos instalados
import { View, Text,Image, SafeAreaView, TouchableOpacity , Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GiftedChat } from 'react-native-gifted-chat'
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';

import { MaterialCommunityIcons } from '@expo/vector-icons';
// Creaciones propias
import { addRecordatorio, initDB } from "../api/sqlite"
import { secondApiCall ,firstApiCall, whisperCall} from "../api/openAI";
import { obtenerUbicacion} from "../api/location";
import { buscarEnDB} from "../api/centrosMedicos";
import { realizarLlamada} from "../api/llamada";
import { requestContactsPermission} from "../api/contactos";
import * as FileSystem from 'expo-file-system';
export default function PrincipalScreen() {
  const [inputUsuario, setinputUsuario]= useState('')
  const [mensajes, setMensajes]= useState([])
  const [cargando, setCargando] =useState(false)
  const [hablando, setHablando] =useState(false)
  const [vozAdam, setVozAdam] =useState(false)
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
            type: 'audio/m4a', 
            
          });
          formData.append('model', 'whisper-1');
          formData.append('language', 'es');

    console.log (tempRecordingUri);
    console.log(formData)
    whisperCall(formData).then(res => {
      let newMensajes =[{ _id: new Date().getTime() + 2,  // para cuando se use voz
         text: res,
           createdAt: new Date(),
           user: {
             _id: 1,
            
           }}];
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
      let prompt = mensajeUsuario.text;
      console.log(prompt)
      let { function_name, args, message } = await firstApiCall(prompt);
      console.log('FUNCION SELECCIONADA: ', function_name)
      if(function_name){
        console.log('LOGICA DE SELECCION')
        if (function_name === "hola") {
            function_response = "responder el saludo, presentarse indicando tu nombre" 
            respuesta= await secondApiCall(prompt, message, function_name, function_response)           
        }else if (function_name === "explicar_algo") {
            function_response = "explicar lo solicitado" 
            respuesta= await secondApiCall(prompt, message, function_name, function_response)
        }else if (function_name === "ubicacion") {
            let ubicacion = await obtenerUbicacion('direccion');
            function_response = `La ubicación actual es: ${ubicacion}`; 
            respuesta= await secondApiCall(prompt, message, function_name, function_response)
        }else if (function_name === "centro_salud_cercano") {
            //let {comuna, region} = await obtenerUbicacion('comuna');
            let comuna = 'Hualqui'
            let region = 'Biobío Region'
            console.log('COMUNA: ',comuna)
            console.log('REGION: ',region)
            let centros = await buscarEnDB('Comuna', comuna)
            console.log('CENTROS: ', centros)
            function_response = `estos son los centros de salud cercanos: ${centros}`; 
            respuesta= await secondApiCall(prompt, message, function_name, function_response)
            console.log('CENTROS: ', centros)
        }else if (function_name === "llamar") {
          function_response = "llama al contacto predeterminado" 
          realizarLlamada('56953598945');
          respuesta= await secondApiCall(prompt, message, function_name, function_response)
        }else if (function_name === "contactos") {
          function_response = "obten los contactos" 
          requestContactsPermission();
          respuesta= await secondApiCall(prompt, message, function_name, function_response)
        }else if (function_name === "base_de_datos") {
          function_response = "bd creada" 
          initDB();
          respuesta= await secondApiCall(prompt, message, function_name, function_response)
        }else if (function_name === "recordatorio") {
          //let json =JSON.parse(args);
          //console.log(json.Titulo)
          function_response = "Di que se agrega el recordatorio" 
          respuesta= await secondApiCall(prompt, message, function_name, function_response)
          //console.log("Respuesta texto:" + respuesta.text)
          //console.log("Argumentos: " + args)
          addRecordatorio(JSON.parse(args))
        }else{
            function_name = "responder"
            function_response = "responde o trata de dar solucion a lo que te indiquen, utiliza el contexto de la conversacion para dar una respuesta mas exacta" 
            respuesta= await secondApiCall(prompt, message, function_name, function_response)
           
        }
      }
      console.log('******respuesta api obtenida*****');
      setCargando(false);
      if(respuesta){
       // console.log(respuesta);
        setMensajes((mensajesPrevios)=>GiftedChat.append(mensajesPrevios,respuesta))
        setinputUsuario('');
        respuestaVoz(respuesta.text)
        respuesta = null; // Vacía la variable respuesta
        //console.log(JSON.parse(respuesta))
       // 
      }else{
        Alert.alert("Ha ocurrido un error : ", respuesta.msg);
      }
      
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
    pitch: 0.85,
    onDone:() => setVozAdam(false) 
  };
  Speech.speak(texto,options)
  setVozAdam(true)
};

const detenerVoz =() =>{
  Speech.stop()
  setVozAdam(false)
}
{/* Fin Voz de respuesta de ADAM */}









// **********************************************************************************************************************************************************************************
// ***                                                         Vista de pantalla                                                                                                  ***
// **********************************************************************************************************************************************************************************
  return (
    
     <SafeAreaView className="flex-1 justify-center">
      <View className="flex-1 bg-green-100">
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
                <TouchableOpacity className="space-y-2" onPress={detenerGrabacion}>
                  {/* recording stop button */}
                  <Image 
                    className="rounded-full" 
                    source={require('../../assets/images/voiceLoading.gif')}
                    style={{width: hp(10), height: hp(10)}}
                  />
                </TouchableOpacity>
                
              ) : (
                <TouchableOpacity onPress={()=>{iniciarGrabacion().then(setTimeout(()=> detenerGrabacion, 1000));}} >
                  {/* recording start button */}
                  <Image 
                    className="rounded-full" 
                    source={require('../../assets/images/recordingIcon.png')}
                    style={{width: hp(10), height: hp(10)}} 
                  />
                </TouchableOpacity>
              )
          }
          {/* {
            mensajes.length>0 && (
              <TouchableOpacity 
               // onPress={clear} 
                className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
              >
                <Text className="text-white font-semibold">Clear</Text>
              </TouchableOpacity>
            )
          } */}
          {
            vozAdam && (
              <TouchableOpacity 
                onPress={detenerVoz} 
                className="bg-red-400 rounded-3xl p-2 absolute left-10"
              >
                <Text className="text-white font-semibold"><MaterialCommunityIcons name="account-tie-voice-off" size={24} color="black" /></Text>
              </TouchableOpacity>
            )
          }
            
            
          
        </View>
        </View>
     </SafeAreaView>
   
  )
}

// axios instalado, navigation instalado, tailwindcss instalado
