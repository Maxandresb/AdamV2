//Modulos instalados
import { Button, Modal, View, Text, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';


import { MaterialCommunityIcons } from '@expo/vector-icons';
// Creaciones propias
import { addRecordatorio, guardarHistoriarChats, mostarDB, BuscarContactoEmergencia, obtenerRut, obtenerContactosEmergencia, obtenerDatosPreviosAnon, obtenerDatosPreviosSelec } from "../api/sqlite"
import { generarRespuesta, crearRespuesta, secondApiCall, firstApiCall, whisperCall } from "../api/openAI";
import { obtenerUbicacion } from "../api/location";
import { buscarEnDB } from "../api/centrosMedicos";
import { enviarMensaje, realizarLlamada } from "../api/llamada";

import styles from '../api/styles';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import { obtenerClima } from "../api/clima";
import customtInputToolbar from '../api/customInputToolbar';
import { useNavigation } from "@react-navigation/native";


  


export default function Emergencias ()  {
    const [inputUsuario, setinputUsuario] = useState('')
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [hablando, setHablando] = useState(false)
  const [vozAdam, setVozAdam] = useState(false)
  //useEffect(()=> dummyMessages.map((mensaje)=>setMensajes((mensajesPrevios)=>GiftedChat.append(mensajesPrevios,mensaje))))
  {/* inicio funciones de grabacion de voz de usuario  */ }
  const [grabacion, setGrabacion] = useState();
  const [grabaciones, setGrabaciones] = useState([]);
  //estados para el modal de mas de un contacto de emergencia (CE)
  const [modalCEVisible, setModalCEVisible] = useState(false);
  const [nombreContactoEm, setNombreContactoEm] = useState('');
  const [aliasContactoEm, setAliasContactoEm] = useState('');
  const contactosEmergencia = useRef([]);
  const contactoEmSeleccionado = useRef([]);
  //estados para el numero de los centros medicos:
  const [modalNCMVisible, setModalNCMVisible] = useState(false);
  const[modalDMVisible, setModalDMVisible] = useState(false);
  const [nombreCentroMed, setNombreCentroMed] = useState('');
  const centrosMed = useRef([]);
  const centroMedSeleccionado = useRef([]);
  const datosPerfilMed =useRef([]);
  const [mensajeProcesamiento, setMensajeProcesamiento] = useState('');
  const [respondiendo, setRespondiendo] = useState(false);

  const [llamada,setLlamada]= useState(false)
  const [mensaje,setMensaje]= useState(false)

  const navigation = useNavigation();


  async function datos_medicos(){



    let rut = await obtenerRut();
    let datos = await obtenerDatosPreviosSelec(rut)
    
    let arrayDeItems = datos.split('\n').filter(Boolean);
    datosPerfilMed.current = arrayDeItems
   if (datosPerfilMed.current.length >0){
    setModalDMVisible(true);
  }
  else {
    Alert.alert(
      "¡No tienes datos de tu perfil seleccionados!",
      "¿Quieres que te dirija donde puedes configurarlo? Es recomendado realizar este paso con un médico",
      [
          {
              text: "Cancelar",
              style: "cancel"
          },
          {
              text: "Aceptar",
              onPress: () =>{navigation.navigate('ConfiguracionNested', { screen: 'Seleccionar datos a vocalizar' })}
          }
      ]
  );
  }
   
  }

  async function compartir_ubicacion(){
    contactosEmergencia.current = await obtenerContactosEmergencia();
    
    if(contactosEmergencia.current.length == 1  ){
      let contacto= contactosEmergencia.current[0]
      let numero= contacto.numero.replace(/\D/g, '')
      enviarMensaje(numero)
    }
    else if (contactosEmergencia.current.length == 0 || contactosEmergencia.current.length == undefined){
      
      Alert.alert(
        "¡No tienes contactos de emergencia!",
        "¿Quieres que te dirija donde puedes agregarlo?",
        [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Aceptar",
                onPress: () =>{navigation.navigate('ConfiguracionNested', { screen: 'Contactos de emergencia' })}
            }
        ]
    );
    }
    else  {
      
      console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')
      setMensaje(true)
      setModalCEVisible(true);
    }
  }
    async function llamada_contacto(){
       contactosEmergencia.current = await obtenerContactosEmergencia();
      if(contactosEmergencia.current.length == 1  ){
        let contacto= contactosEmergencia.current[0]
        
        let numero= contacto.numero.replace(/[^\d+]/g, '')
        
        realizarLlamada(numero)
      }
      else if (contactosEmergencia.current.length == 0 || contactosEmergencia.current.length === undefined){
        Alert.alert(
          "¡No tienes contactos de emergencia!",
          "¿Quieres que te dirija donde puedes agregarlo?",
          [
              {
                  text: "Cancelar",
                  style: "cancel"
              },
              {
                  text: "Aceptar",
                  onPress: () =>{navigation.navigate('ConfiguracionNested', { screen: 'Contactos de emergencia' })}
              }
          ]
      );
      }
      else {
        console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')
        setLlamada(true)
        setModalCEVisible(true);
      }
    }
  

    async function llamada_centro (){
       // console.log('Entra')
       setCargando(true);
        let { comuna, region } = await obtenerUbicacion('comuna');
            console.log('REGION: ', region, 'COMUNA: ', comuna)
            centrosMed.current = await buscarEnDB('Comuna', comuna)
            setCargando(false);
            if (centrosMed.current && Array.isArray(centrosMed.current._array)) {
              console.log('CENTROS: ', centrosMed.current)
              // Filtrar los centros de salud que tienen un número telefónico disponible
              centrosMed.current._array = centrosMed.current._array.filter(centro => /\d/.test(centro.Telefono));
              console.log('CENTROS: ', centrosMed.current._array)

              if (centrosMed.current._array.length === 1) {
                console.log('********* UN CENTRO ENCONTRADO *********')
                let numeroDeCentro = centrosMed.current._array[0].Telefono;
                let nombreCentro = centrosMed.current._array[0].NombreOficial
                
                console.log('numeroDeCentro', JSON.stringify(numeroDeCentro))
                realizarLlamada(numeroDeCentro);
                
                centrosMed.current._array = [];
              } else if (centrosMed.current._array.length > 1) {
                console.log('********* MAS DE UN CENTRO ENCONTRADO *********')
                setModalNCMVisible(true);
                
              } else {
                Alert.alert("Centro de salud cercano no encontrado. Por favor asegurate de tener internet");
                centrosMed.current._array = [];
              }
            }//console.log('ERROR: centrosMed no esxiste o no es un array')
    }

    {/* Inicio Voz de respuesta de ADAM */ }

  {/* voces hombres
  voice:"es-es-x-eed-local" 
  voice:"es-us-x-esf-local" 
  voice:"es-es-x-eed-network" 
  voice:"es-us-x-esd-network"
*/}

  const respuestaVoz = (texto) => {
    //const saludo ='test de saludo';
    setVozAdam(true)
    const options = {
      voice: "es-us-x-esd-network",
      rate: 0.9,
      pitch: 0.85,
      onDone: () => setVozAdam(false)
    };
    Speech.speak(texto, options)
    
  };

  const detenerVoz = () => {
    Speech.stop()
    setVozAdam(false)
  }
  {/* Fin Voz de respuesta de ADAM */ }







  return (
    <ScrollView className="flex-1  p-5 space-y-5 bg-grisclaro">
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={async() => await llamada_centro()}>
          <Text className="text-xl text-celeste text-center font-bold">Llamar a centro de salud</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={() =>  compartir_ubicacion()}>
          <Text className="text-xl text-celeste text-center font-bold">Compartir ubicación </Text>
        </TouchableOpacity>

        
      </View>
      <View className="flex-row h-56 justify-around space-x-10 px-5">
        <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={async() => await llamada_contacto()}>
          <Text className="text-xl text-celeste text-center font-bold">Llamar contacto emergencia</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-rojoIntenso rounded-lg justify-center w-1/2 shadow-xl shadow-negro" onPress={async() => await datos_medicos()}>
          <Text className="text-xl text-celeste text-center font-bold">Mostrar datos médicos</Text>
        </TouchableOpacity>
      </View>

{/* MODAL DE CARGANDO */}
    <Modal
       animationType="slide"
       transparent={true}
       visible={cargando}
       onRequestClose={() => { setCargando(false); }}
    >

      <View style={[styles.centeredView, {padding:'38%'}] }>
        <View style={[styles.modalView]}>
        <Image  className="w-12 h-12 bg-negro py-3 rounded-full my-3"
                source={require('../../assets/images/processingQuestion.gif')}
              />
        </View>
      </View>
    </Modal>

{/* Modal de centros medicos */}
      <Modal
            animationType="slide"
            transparent={true}
            visible={modalNCMVisible}
            onRequestClose={() => { setModalNCMVisible(false); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Selecciona un centro de salud a llamar </Text>
                <ScrollView>
                {centrosMed.current && Array.isArray(centrosMed.current._array)
                  && centrosMed.current._array.map((centro, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        centroMedSeleccionado.current = centro;
                        setModalNCMVisible(false);
                        realizarLlamada(centroMedSeleccionado.current.Telefono)
                        setNombreCentroMed(centroMedSeleccionado.current.NombreOficial);
                        
                        centroMedSeleccionado.current = {};

                      }}
                      style={styles.rojoIntensoButton} // Agrega los estilos que desees aquí
                    >
                      <Text style={styles.celesteText}>{`Centro: ${centro.NombreOficial}`}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={() => {setModalNCMVisible(false);}}>
                  <Text style={styles.rojoIntensoText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
{/* Fin modal centros medicos */}

{/* Modal contactos emergencia */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCEVisible}
            onRequestClose={() => { setModalCEVisible(false); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>{llamada ==true && `Selecciona un contacto para llamar`} {mensaje ==true && `Selecciona un contacto para compartir ubicación`}</Text>
                <ScrollView>
                {contactosEmergencia.current.map((contacto, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      contactoEmSeleccionado.current = contacto;
                      console.log(contactoEmSeleccionado)
                      setModalCEVisible(false);
                      if(llamada ==true){
                        realizarLlamada(contactoEmSeleccionado.current.numero.replace(/\D/g, ''))
                        setLlamada(false)
                      } else if (mensaje==true){
                        enviarMensaje(contactoEmSeleccionado.current.numero.replace(/\D/g, ''))
                        setMensaje(false)
                      }
                      
                      setNombreContactoEm(contactoEmSeleccionado.current.nombreCompleto);
                      setAliasContactoEm(contactoEmSeleccionado.current.alias);
                      contactosEmergencia.current = [];
                      contactoEmSeleccionado.current = {};

                    }}
                    style={[styles.rojoIntensoButton, {padding:'8%' , margin:'2%'}]} // Agrega los estilos que desees aquí
                  >
                   
                   <Text className="text-celeste font-semibold">
                    {contacto.nombreCompleto !== null && `Contacto: ${contacto.nombreCompleto}`}
                    {contacto.nombreCompleto !== null && contacto.alias !== null && ' y '}
                    {contacto.alias !== null && `Alias: ${contacto.alias}`}
                  </Text>
                  </TouchableOpacity>
                ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  
                  onPress={() => {
                    setModalCEVisible(false);
                    setLlamada(false)
                    setMensaje(false)
                  }}
                >
                  <Text style={styles.rojoIntensoText}>Cerrar</Text>
                </TouchableOpacity>

              </View>
            </View>
          </Modal>

{/* Fin modal contactos emergencias */}



          {/* Inicio modal datos medicos */}
          <Modal
             animationType="slide"
             transparent={true}
             visible={modalDMVisible}
             onRequestClose={() => { setModalDMVisible(false); }}
          >
               <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.header}>Datos médicos </Text>
              {
            vozAdam ?(
              <TouchableOpacity
              className=" bg-negro rounded-3xl flex-row flex-3 row-2 "
                onPress={detenerVoz}
                style={[{padding:'5%', marginLeft:'38%', marginRight:'44%', justifyContent:'center'}]}
              >
                <Text className="text-white font-semibold"><MaterialCommunityIcons name="account-tie-voice-off" size={24} color="white" /></Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className=" bg-negro rounded-3xl flex-row flex-3 row-2 "
                onPress={() => {respuestaVoz(datosPerfilMed.current.join(','))}}
                style={[{padding:'5%', marginLeft:'38%', marginRight:'44%', justifyContent:'center'}]}
              >
                <Text className="text-white font-semibold"><MaterialCommunityIcons name="account-tie-voice" size={24} color="white" /></Text>
              </TouchableOpacity>
            )
          }
                <ScrollView>
                  {datosPerfilMed.current.map((campo,index)=>(
                    <Text key={index} style={[styles.rojoIntensoButton, {padding:'4%' , margin:'2%'}]}> {campo}</Text>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  
                  onPress={() => {
                    setModalDMVisible(false);
                    
                  }}
                >
                  <Text style={styles.rojoIntensoText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
              </View>

                  
          </Modal>
    </ScrollView>
  
  
  
  
  )
}

