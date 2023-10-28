
//Modulos instalados
import { Button, Modal, View, Text, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GiftedChat } from 'react-native-gifted-chat'
import { Audio } from "expo-av";
// Creaciones propias
import { initDB, mostarDB, BuscarContactoEmergencia } from "../api/sqlite"
import { crearRespuesta, secondApiCall, firstApiCall, whisperCall } from "../api/openAI";
import { obtenerUbicacion } from "../api/location";
import { buscarEnDB } from "../api/centrosMedicos";
import { realizarLlamada } from "../api/llamada";
import { Contactos } from "../api/contactos";
import styles from '../api/styles';
import * as FileSystem from 'expo-file-system';
export default function PrincipalScreen() {
  const [inputUsuario, setinputUsuario] = useState('')
  const [mensajes, setMensajes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [hablando, setHablando] = useState(false)
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
  const [nombreCentroMed, setNombreCentroMed] = useState('');
  const centrosMed = useRef([]);
  const centroMedSeleccionado = useRef([]);

  const [mensajeProcesamiento, setMensajeProcesamiento] = useState('');
  const [respondiendo, setRespondiendo] = useState(false);

  async function iniciarGrabacion() {
    try {
      const permisos = await Audio.requestPermissionsAsync();
      setHablando(true)
      if (permisos.status === "granted") {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true, });
        console.log('Starting recording..');
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setGrabacion(recording);
        console.log('Recording started');//console.log(recording);
      }
    } catch (error) { console.log(error) }
  }
  async function detenerGrabacion() {
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
    console.log(tempRecordingUri);
    console.log(formData)
    whisperCall(formData).then(res => {
      let newMensajes = [{
        _id: new Date().getTime() + 2,  // para cuando se use voz
        text: res,
        createdAt: new Date(),
        user: {
          _id: 1,
        }
      }];
      console.log(newMensajes)
      obtenerRespuesta(newMensajes)
    });
    //whisperCall(uri).then(res =>{
    //console.log('******respuesta api obtenida*****');
    //console.log(res)
    //});
    let todasGrabaciones = [...grabaciones];
    const { sound, status } = await grabacion.createNewLoadedSoundAsync();
    todasGrabaciones.push({ sound: sound, duration: getDuracionFormato(status.durationMillis), file: grabacion.getURI() });
    setGrabaciones(todasGrabaciones);
    //console.log(grabaciones);
    setHablando(false)
  }
  function getDuracionFormato(milliseconds) {
    const minutos = milliseconds / 1000 / 60;
    const segundos = Math.round((minutos - Math.floor(minutos)) * 60);
    return segundos < 10 ? `${Math.floor(minutos)}:0${segundos}` : `${Math.floor(minutos)}:${segundos}`
  }
  function clearGrabaciones() {
    setGrabaciones([])
  }
  {/* fin funciones de grabacion de voz de usuario  */ }
  {/* Inicio funciones de obtencion de data de apis  */ }
  const obtenerRespuesta = async (input) => {
    let respuesta = null;
    setinputUsuario(input);
    const mensajeUsuario = input[0];
    setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, mensajeUsuario))
    if (input[0].text.length > 0) {
      console.log('entra en if')
      console.log("**********************************")
      setCargando(true);
      let prompt = mensajeUsuario.text;
      console.log(prompt)
      setRespondiendo(true)
      setMensajeProcesamiento('Procesando pregunta...');
      let { function_name, args, message } = await firstApiCall(prompt);
      console.log('FUNCION SELECCIONADA: ', function_name)
      if (function_name) {
        console.log('LOGICA DE SELECCION')
        if (function_name === "hola") {
          function_response = "responder el saludo, presentarse indicando tu nombre"
          setMensajeProcesamiento('Procesando respuesta...');
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        } else if (function_name === "explicar_algo") {
          function_response = "explicar lo solicitado"
          setMensajeProcesamiento('Procesando respuesta...');
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        } else if (function_name === "ubicacion") {
          let ubicacion = await obtenerUbicacion('direccion');
          function_response = `La ubicación actual es: ${ubicacion}, informa al uauario que debe tener en cuenta que la ubicacion tiene un margen de error de aproximadamente 100 metros`;
          setMensajeProcesamiento('Procesando respuesta...');
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        } else if (function_name === "centro_salud_cercano") {
          let { comuna, region } = await obtenerUbicacion('comuna');
          //let comuna = 'Hualqui'
          //let region = 'Biobío Region'
          console.log('REGION: ', region, 'COMUNA: ', comuna)
          centros = await buscarEnDB('Comuna', comuna)
          if (centros) {
            console.log('CENTROS: ', centros)
            function_response = `ubicacion del usuario: ${comuna} \n\ centros de salud encontrados en la base de datos, segun la ubicacion del usuario:\n\ ${JSON.stringify(centros)} \n\ esta informacion es real y fidedigna, no debes modificarla bajo ningun punto. la informacion viene con el siguiente formato: \n\ {"_array": [{"Comuna": "ejcomuna", "Calle": "ejcalle", "NombreOficial": "ejnombreoficial", "Numero": "ejnumero", "Region": "ejregion", "Telefono": "ejtelefono", "TieneServicioDeUrgencia": "SI/NO", "TipoDeSAPU": "ejtiposapu", "TipoDeUrgencia": "ejtipourgencia", "Via": "ejvia", "id": 1}], "length": cantidad_de_centros_de_salud_identificados} \n\ para generar una respuesta con esta informacion debes dar un formato a la informacion como el siguiente: \n\ ejnombreoficial, ejcalle ejnumero, ejcomuna, ejtelefono `;
            console.log('FUNCION RESPONSE: \n\ ', function_response)
            setMensajeProcesamiento('Procesando respuesta...');
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
          } else {
            console.log('No se encontraron centros')
          }
        } else if (function_name === "llamar_contacto") {
          console.log('PERSONA A LLAMAR: ', args)
          contactosEmergencia.current = await BuscarContactoEmergencia(args);
          if (contactosEmergencia.current) {
            console.log('CONTACTOS ENCONTRADOS: ', contactosEmergencia.current)
            if (contactosEmergencia.current.length === 1) {
              console.log('********* UN CONTACTO ENCONTRADO *********')
              let numeroDeContacto = contactosEmergencia.current[0].numero;
              let nombreContacto = contactosEmergencia.current[0].nombreCompleto
              function_response = `responde lo exactamente siguiente: \n\ \n\ Seras redigido a la aplicacion telefono para llamar al contacto de nombre o alias ${JSON.stringify(nombreContacto)}.\n\ \n\ debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes. SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO `
              console.log('numeroDeContacto', JSON.stringify(numeroDeContacto))
              realizarLlamada(numeroDeContacto);
              setMensajeProcesamiento('Procesando respuesta...');
              respuesta = await secondApiCall(prompt, message, function_name, function_response)
              contactosEmergencia.current = [];
            } else if (contactosEmergencia.current.length > 1) {
              console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')
              setModalCEVisible(true);
              if (!modalCEVisible) {
                function_response = `responde lo exactamente siguiente: \n\ \n\ Seras redigido a la aplicacion telefono para llamar al contacto de nombre o alias ${JSON.stringify(nombreContactoEm)}.\n\ \n\ Debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes. SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO `
                respuesta = await secondApiCall(prompt, message, function_name, function_response)
                setAliasContactoEm('')
                setNombreContactoEm('')
              }
            } 

          } else{
            function_response = `responde lo exactamente siguiente: \n\ \n\ No posees algun contacto de nombre o alias ${JSON.stringify(args)}.\n\ \n\ debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes, SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO`
            setMensajeProcesamiento('Procesando respuesta...');
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
            let answer = `No posees algun contacto de nombre o alias ${JSON.stringify(args)}`
            Alert.alert("Contacto no encontrado: ", answer);
            contactosEmergencia.current = [];
          }
        }


        //function_response = "llama al contacto predeterminado"
        //realizarLlamada('56953598945');
        //respuesta = await secondApiCall(prompt, message, function_name, function_response)

        else if (function_name === "llamar_a_centro_salud") {
          let { comuna, region } = await obtenerUbicacion('comuna');
          console.log('REGION: ', region, 'COMUNA: ', comuna)
          centrosMed.current = await buscarEnDB('Comuna', comuna)
          if (centrosMed.current && Array.isArray(centrosMed.current._array)) {
            console.log('CENTROS: ', centrosMed.current)
            // Filtrar los centros de salud que tienen un número telefónico disponible
            centrosMed.current._array = centrosMed.current._array.filter(centro => /\d/.test(centro.Telefono));
            console.log('CENTROS: ', centrosMed.current._array)
            if (centrosMed.current._array.length === 1) {
              console.log('********* UN CENTRO ENCONTRADO *********')
              let numeroDeCentro = centrosMed.current._array[0].Telefono;
              let nombreCentro = centrosMed.current._array[0].NombreOficial
              function_response = `responde lo exactamente siguiente: \n\ \n\ Seras redigido a la aplicacion telefono para llamar al centro de salud ${JSON.stringify(nombreCentro)}.\n\ \n\ debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes. SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO `
              console.log('numeroDeCentro', JSON.stringify(numeroDeCentro))
              realizarLlamada(numeroDeCentro);
              setMensajeProcesamiento('Procesando respuesta...');
              respuesta = await secondApiCall(prompt, message, function_name, function_response)
              centrosMed.current._array = [];
            } else if (centrosMed.current._array.length > 1) {
              console.log('********* MAS DE UN CENTRO ENCONTRADO *********')
              setModalNCMVisible(true);
              if (!modalNCMVisible) {
                function_response = `responde lo exactamente siguiente: \n\ \n\ Seras redigido a la aplicacion telefono para llamar al centro de salud ${JSON.stringify(nombreCentroMed)}.\n\ \n\ Debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes. SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO `
                setMensajeProcesamiento('Procesando respuesta...');
                respuesta = await secondApiCall(prompt, message, function_name, function_response)
                setNombreCentroMed('')
              }

            }
          }else{
            function_response = `responde lo exactamente siguiente: \n\ \n\ No existe algun centro de salud disponible para llamar en la comuna ${JSON.stringify(comuna)}.\n\ \n\ debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes, SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO`
            setMensajeProcesamiento('Procesando respuesta...');
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
            let answer = `No existe algun centro de salud disponible para llamar en la comuna ${JSON.stringify(comuna)}`
            Alert.alert("Centro de salud no encontrado: ", answer);
            centrosMed.current._array = [];
          }
        } else if (function_name === "llamar_numero") {
          console.log('NUMERO A LLAMAR: ', args)
          function_response = `responde lo exactamente siguiente: \n\ \n\ Seras redigido a la aplicacion telefono para llamar al numero ${JSON.stringify(args)}.\n\ \n\ debes responder unicamente con la oracion anterior, ya que la llamada la realizara el usuario. \n\ No comentes tus capacidades ni algo similar, solo responde con la frase indicada ya que solo estas informando el nombre del contacto. \n\ Si te dicen "llama a ..." o similar, se refiere a que respondas con el mensaje que te entrege 3 lineas antes. SI RESPONDES CUALQUIER OTRA PARABRA U ORACION ESTARAS ARRUINANDO TODO `
          realizarLlamada(args);
          setMensajeProcesamiento('Procesando respuesta...');
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
          
        } else if (function_name === "mostrar_base_de_datos") {
          // tablas: Usuario Alergias PatologiasCronicas Medicamentos Limitaciones Contacto Historial centrosMedicos 
          console.log('MOSTRANDO BD')
          /*mostarDB('Usuario');
          mostarDB('Alergias');
          mostarDB('Medicamentos');
          mostarDB('Limitaciones');
          mostarDB('PatologiasCronicas');*/
          mostarDB('Contactos');

        } else {
          function_name = "responder"
          function_response = "responde o trata de dar solucion a lo que te indiquen, utiliza el contexto de la conversacion para dar una respuesta mas exacta"
          setMensajeProcesamiento('Procesando respuesta...');
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        }
      }
      console.log('******respuesta api obtenida*****');
      setCargando(false);
      setRespondiendo(false)
      setMensajeProcesamiento('');
      if (respuesta) {
        //console.log(respuesta);
        setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
        setinputUsuario('');
        respuesta = null; // Vacía la variable respuesta
      } else {
        console.log('NO SE OBTUVO UNA RESPUETA A LA SEGUNDA LLAMADA')
        setMensajeProcesamiento('');
        let answer = 'NO SE OBTUVO RESPUESTA'
        Alert.alert("Ha ocurrido un error : ", answer);
        
      }
    }
  };












  // **********************************************************************************************************************************************************************************
  // ***                                                         Vista de pantalla                                                                                                  ***
  // **********************************************************************************************************************************************************************************
  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <View className="flex-1">
        <View className="flex-row justify-center">
          {/*<Image 
      source={require('../../assets/images/iron-adam.png')}
      style={{height:hp(8), width:wp(12)}}
      />*/}
        </View>
        {/*<View><Text className="text-center font-bold pt-0 -mt-4 mb-2 ">Chat ADAM</Text></View>*/}
        <View className="flex-1 flex-row justify-center">
          <View className="rounded-3xl p-2 w-80 bg-pink-light shadow-md shadow-black">
            <GiftedChat
              messages={mensajes}
              renderUsernameOnMessage={false}
              onSend={(input) => obtenerRespuesta(input)}
              user={{ _id: 1 }}
            />
            <View>
            {respondiendo ? (
                <>
          <Text style={{ backgroundColor: 'black',color: 'green', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{mensajeProcesamiento}</Text>
          </>
            ) : (
              <>
              </>
            )}
            </View>
          </View>
          {/* recording, clear and stop buttons */}
        </View>
        <View className="flex justify-center items-center">
          {
            cargando ? (
              <Image
                source={require('../../assets/images/loading.gif')}
                style={{ width: hp(10), height: hp(10) }}
              />
            ) :
              hablando ? (
                <TouchableOpacity className="space-y-2" onPress={detenerGrabacion}>
                  {/* recording stop button */}
                  <Image
                    className="rounded-full"
                    source={require('../../assets/images/voiceLoading.gif')}
                    style={{ width: hp(10), height: hp(10) }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={iniciarGrabacion} >
                  {/* recording start button */}
                  <Image
                    className="rounded-full"
                    source={require('../../assets/images/recordingIcon.png')}
                    style={{ width: hp(10), height: hp(10) }}
                  />
                </TouchableOpacity>
              )
          }
          {/*Modal mas de un contactos de emergencia */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCEVisible}
            onRequestClose={() => { setModalCEVisible(false); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Selecciona un contacto para llamar</Text>
                {contactosEmergencia.current.map((contacto, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      contactoEmSeleccionado.current = contacto;
                      console.log(contactoEmSeleccionado)
                      setModalCEVisible(false);
                      realizarLlamada(contactoEmSeleccionado.current.numero)
                      setNombreContactoEm(contactoEmSeleccionado.current.nombreCompleto);
                      setAliasContactoEm(contactoEmSeleccionado.current.alias);
                      contactosEmergencia.current = [];
                      contactoEmSeleccionado.current = {};

                    }}
                    style={styles.button} // Agrega los estilos que desees aquí
                  >
                    <Text>{`Contacto: ${contacto.nombreCompleto} y Alias: ${contacto.alias}`}</Text>
                  </TouchableOpacity>
                ))}
                <Button
                  title="Cerrar"
                  onPress={() => {
                    setModalCEVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
          {/*Modal mas de un numero d centros medicos */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalNCMVisible}
            onRequestClose={() => { setModalNCMVisible(false); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Selecciona un centro de salud a llamar </Text>
                {centrosMed.current && Array.isArray(centrosMed.current._array) 
                && centrosMed.current._array.map((centro, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      centroMedSeleccionado.current = centro;
                      setModalNCMVisible(false);
                      realizarLlamada(centroMedSeleccionado.current[0].Telefono)
                      setNombreCentroMed(centroMedSeleccionado.current[0].NombreOficial);
                      centrosMed.current._array = [];
                      centroMedSeleccionado.current = {};

                    }}
                    style={styles.button} // Agrega los estilos que desees aquí
                  >
                    <Text>{`Centro: ${centro.NombreOficial}`}</Text>
                  </TouchableOpacity>
                ))}
                <Button
                  title="Cerrar"
                  onPress={() => {
                    setModalNCMVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
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
      </View>
    </SafeAreaView>
  )
}

// axios instalado, navigation instalado, tailwindcss instalado
