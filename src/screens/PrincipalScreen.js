
//Modulos instalados
import { Button, Modal, View, Text, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';


import { MaterialCommunityIcons } from '@expo/vector-icons';
// Creaciones propias
import { addRecordatorio, guardarHistoriarChats, mostarDB, BuscarContactoEmergencia, obtenerRut } from "../api/sqlite"
import { generarRespuesta, crearRespuesta, secondApiCall, firstApiCall, whisperCall } from "../api/openAI";
import { obtenerUbicacion } from "../api/location";
import { buscarEnDB } from "../api/centrosMedicos";
import { realizarLlamada } from "../api/llamada";
import { scheduleRecordatorioNotification, MostrarNotificacionesGuardadas } from "../api/notificaciones";
import styles from '../api/styles';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import { obtenerClima } from "../api/clima";
import customtInputToolbar from '../api/customInputToolbar';

export default function PrincipalScreen() {
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
    formData.append('language', 'es');
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
      if (res.includes('Error')){
        Alert.alert(
          'Ha ocurrido un error',
          'Lo siento ocurrio un problema con tu grabacion, intentalo nuevamente',
          [
            {
              text: 'Cerrar',
             
            }
          ],
          { cancelable: false }
        );
      }else{
        obtenerRespuesta(newMensajes)
      }
      
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
  function seleccionarRespuestaRecordatorio(args) {
    args = JSON.parse(args);
    let partes = args.Fecha.split('-');
    args.Fecha = `${partes[2]}-${partes[1]}-${partes[0]}`;
    let respuestas = [];
    if (args.Dias === 'Unico') {
      respuestas = [
        `¡Perfecto! He configurado un recordatorio para el ${args.Fecha} a las ${args.Hora} para que no olvides '${args.Titulo}'. Te avisaré mediante una notificación cuando llegue el momento.`,
        `¡Hecho! No te preocupes, te recordaré '${args.Titulo}' el ${args.Fecha} a las ${args.Hora} mediante una notificación.`,
        `¡Listo! Te recordaré '${args.Titulo}' el ${args.Fecha} a las ${args.Hora} con una notificación. ¡No te preocupes, estaré aquí para recordártelo!`,
        `¡Genial! He programado un recordatorio para el ${args.Fecha} a las ${args.Hora}. Te recordaré '${args.Titulo}' mediante una notificación cuando llegue el momento.`,
        `¡Está todo listo! Te recordaré '${args.Titulo}' el ${args.Fecha} a las ${args.Hora} con una notificación. ¡Puedes contar conmigo!`
      ];
    } else {
      respuestas = [
        `¡Perfecto! He configurado un recordatorio para que suene ${args.Dias} a las ${args.Hora} para que no olvides '${args.Titulo}'. Te avisaré cada vez mediante una notificación.`,
        `¡Hecho! No te preocupes, te recordaré '${args.Titulo}' ${args.Dias} a las ${args.Hora} con una notificación.`,
        `¡Listo! Te recordaré '${args.Titulo}' ${args.Dias} a las ${args.Hora} mediante una notificación. ¡No te preocupes, estaré aquí para recordártelo!`,
        `¡Genial! He programado un recordatorio para ${args.Dias} a las ${args.Hora}. Te recordaré '${args.Titulo}' cada vez con una notificación.`,
        `¡Está todo listo! Te recordaré '${args.Titulo}' ${args.Dias} a las ${args.Hora} mediante una notificación. ¡Puedes contar conmigo!`
      ];
    }
    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }

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
      try {
        let { function_name, args, message } = await firstApiCall(prompt);
        //let function_name='recordatorio'
        if (function_name) {
          setMensajeProcesamiento('Procesando respuesta...');
          console.log('FUNCION SELECCIONADA: ', function_name)
          console.log('LOGICA DE SELECCION')
          if (function_name === "hola") {
            function_response = "responder el saludo, presentarse indicando tu nombre"
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
          } else if (function_name === "explicar_algo") {
            function_response = "explicar lo solicitado"
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
          } else if (function_name === "ubicacion") {
            let ubicacion = await obtenerUbicacion('direccion');
            function_response = `La ubicación actual es: ${ubicacion}, informa al uauario que debe tener en cuenta que la ubicacion tiene un margen de error de aproximadamente 100 metros`;
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
                function_response = `Seras redigido a la aplicacion telefono para llamar al contacto de nombre o alias ${JSON.stringify(nombreContacto)}.`
                console.log('numeroDeContacto', JSON.stringify(numeroDeContacto))
                realizarLlamada(numeroDeContacto);
                respuesta = await generarRespuesta('Llamar a contacto', function_response, prompt)
                contactosEmergencia.current = [];
              } else if (contactosEmergencia.current.length > 1) {
                console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')
                setModalCEVisible(true);
                if (!modalCEVisible) {
                  function_response = `Seras redigido a la aplicacion telefono para llamar al contacto de nombre o alias ${JSON.stringify(nombreContacto)}.`
                  respuesta = await generarRespuesta('Llamar a contacto', function_response, prompt)
                  setAliasContactoEm('')
                  setNombreContactoEm('')
                }
              } else {
                function_response = `No posees algun contacto de nombre o alias ${JSON.stringify(args)}.`
                respuesta = await generarRespuesta('Llamar a contacto', function_response, prompt)
                //Alert.alert("Contacto no encontrado: ", function_response);
                contactosEmergencia.current = [];
              }
            }else{
              function_response = `No se encontraron contactos de emergencia guardados en la aplicacion.`
              respuesta = await generarRespuesta('ERROR', function_response, prompt)
              //Alert.alert("Contacto no encontrado: ", function_response);
              contactosEmergencia.current = [];
            }
            //function_response = "llama al contacto predeterminado"
            //realizarLlamada('56953598945');
            //respuesta = await secondApiCall(prompt, message, function_name, function_response)

          }else if (function_name === "llamar_a_centro_salud") {
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
                function_response = `Seras redigido a la aplicacion telefono para llamar al centro de salud ${JSON.stringify(nombreCentro)}.`
                console.log('numeroDeCentro', JSON.stringify(numeroDeCentro))
                realizarLlamada(numeroDeCentro);
                respuesta = await generarRespuesta('Llamar a centro de salud', function_response, prompt)
                centrosMed.current._array = [];
              } else if (centrosMed.current._array.length > 1) {
                console.log('********* MAS DE UN CENTRO ENCONTRADO *********')
                setModalNCMVisible(true);
                if (!modalNCMVisible) {
                  function_response = `Seras redigido a la aplicacion telefono para llamar al centro de salud ${JSON.stringify(nombreCentro)}.`
                  respuesta = await generarRespuesta('Llamar a centro de salud', function_response, prompt)
                  setNombreCentroMed('')
                }
              } else {
                function_response = `No existe algun centro de salud disponible para llamar en la comuna ${JSON.stringify(comuna)}.`
                respuesta = await generarRespuesta('Llamar a centro de salud', function_response, prompt)
                //Alert.alert("Centro de salud no encontrado: ", function_response);
                centrosMed.current._array = [];
              }
            }console.log('ERROR: centrosMed no esxiste o no es un array')
          } else if (function_name === "llamar_numero") {
            console.log('NUMERO A LLAMAR: ', args)
            function_response = `Seras redigido a la aplicacion telefono para llamar al numero ${JSON.stringify(args)}.`
            realizarLlamada(args);
            respuesta = await generarRespuesta('Llamar a numero', function_response, prompt)
          } else if (function_name === "mostrar_base_de_datos") {
            // tablas: Usuario Alergias PatologiasCronicas Medicamentos Limitaciones Contacto Historial centrosMedicos 
            console.log('MOSTRANDO BD')
            mostarDB('Usuario');
            mostarDB('Alergias');
            mostarDB('Medicamentos');
            mostarDB('Limitaciones');
            mostarDB('PatologiasCronicas');
            mostarDB('Contacto');
            mostarDB('recordatorios');
            await MostrarNotificacionesGuardadas()
            //mostarDB('centrosMedicos');
            respuesta = await generarRespuesta('Mostrar base de datos', 'La base de datos se mostrara en la consola.', prompt)
  
          } else if (function_name === "recordatorio") {
            //let args={"Descripcion": "", "Dias": "Unico", "Fecha": "2026-07-13", "Hora": "19:43", "Titulo": "Llamar a sax"}
            respuestaRecordatorio = seleccionarRespuestaRecordatorio(args)
            let idNotificacion = await scheduleRecordatorioNotification(JSON.parse(args))
            addRecordatorio(JSON.parse(args), idNotificacion)
            respuesta = await generarRespuesta(function_name, respuestaRecordatorio, prompt)

          
          
          
          
          }else if (function_name === "clima") {
            
            clima = await obtenerClima('coordenadas',JSON.parse(args))
            jsonclima = JSON.stringify(clima)
            //console.log(jsonclima)
            function_response= `${jsonclima} Este json contiene informacion del clima Convierte este json en informacion util  para un usuario que habla español, resumelo presicamente, usa Celsius y terminologia basica, resume en no mas de 50 palabras `
            //console.log(function_response)
           respuesta = await secondApiCall(prompt, message, function_name, function_response)
          } else {
            console.log('FUNCION NO ENCONTRADA')
            function_name = "responder"
            function_response = "indica al usuario que esa funcion no esta dentro del catalogo de funciones disponibles, pero responde o trata de dar solucion a lo que te indiquen en base a tus conocimientos, utiliza el contexto de la conversacion para dar una respuesta mas exacta"
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
          }
        } else {
          console.log('FUNCION NO ENCONTRADA')
          function_name = "responder"
          function_response = "indica al usuario que esa funcion no esta dentro del catalogo de funciones disponibles, pero responde o trata de dar solucion a lo que te indiquen en base a tus conocimientos, utiliza el contexto de la conversacion para dar una respuesta mas exacta"
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        }
        
      
        
        
        console.log('******respuesta api obtenida*****');
        setCargando(false);
        setRespondiendo(false)
        setMensajeProcesamiento('');
        if (respuesta) {
          //console.log(respuesta);
          setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
          setinputUsuario('');
          respuesta = null;
        } else {
          setMensajeProcesamiento('Procesando respuesta...');
          console.log('NO SE OBTUVO UNA RESPUETA A LA SEGUNDA LLAMADA')
          let answer = 'No se obtuvo respuesta, revisa tu conexion a internet'
          respuesta = await generarRespuesta('ERROR', answer, prompt)
          setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
          setinputUsuario('');
          respuesta = null;
          setMensajeProcesamiento('');

        }

      } catch (error) {
        setMensajeProcesamiento('Procesando respuesta...');
        console.log('ERROR: ', error)
        setCargando(false);
        setRespondiendo(false)
        let answer = 'No se obtuvo respuesta, revisa tu conexion a internet'
        respuesta = await generarRespuesta('ERROR', answer, prompt)
        setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
        setinputUsuario('');
        respuesta = null;
        setMensajeProcesamiento('');
      }
    }
  };




  {/* Inicio Voz de respuesta de ADAM */ }

  {/* voces hombres
  voice:"es-es-x-eed-local" 
  voice:"es-us-x-esf-local" 
  voice:"es-es-x-eed-network" 
  voice:"es-us-x-esd-network"
*/}

  const respuestaVoz = (texto) => {
    //const saludo ='test de saludo';
    const options = {
      voice: "es-us-x-esd-network",
      rate: 0.9,
      pitch: 0.85,
      onDone: () => setVozAdam(false)
    };
    Speech.speak(texto, options)
    setVozAdam(true)
  };

  const detenerVoz = () => {
    Speech.stop()
    setVozAdam(false)
  }
  {/* Fin Voz de respuesta de ADAM */ }








  // **********************************************************************************************************************************************************************************
  // ***                                                         Vista de pantalla                                                                                                  ***
  // **********************************************************************************************************************************************************************************
  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <View className="flex-1 bg-damasco">
        <View className="flex-row justify-center">
          {/*<Image 
      source={require('../../assets/images/iron-adam.png')}
      style={{height:hp(8), width:wp(12)}}
      />*/}
        </View>
        {/*<View><Text className="text-center font-bold pt-0 -mt-4 mb-2 ">Chat ADAM</Text></View>*/}
        <View className="flex-1 flex-row justify-center">
          <View className="rounded-3xl p-2 w-80 mt-2 bg-beige shadow-md shadow-negro">
            <GiftedChat
              renderInputToolbar={props => customtInputToolbar(props)}
              messages={mensajes}
              placeholder='Escriba su mensaje...'
              renderUsernameOnMessage={false}
              onSend={(input) => obtenerRespuesta(input)}
              user={{ _id: 1 }}                         
              
            />
            
            <View>
              {respondiendo ? (
                <>
                  <Text className="bg-azulnegro text-celeste text-center rounded-full my-2 py-1 shadow-md shadow-negro">{mensajeProcesamiento}</Text>
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
              <Image className="w-12 h-12 bg-azulnegro py-3 rounded-full my-3"
                source={require('../../assets/images/processingQuestion.gif')}
              />
            ) :
              hablando ? (
                <TouchableOpacity className="bg-salmon w-20 h-20 my-3 rounded-full justify-center shadow-lg shadow-negro" onPress={detenerGrabacion}>
                  {/* recording stop button */}
                  <Image
                    className="w-12 h-12 self-center"
                    source={require('../../assets/images/micRecording.gif')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="bg-beige w-20 h-20 my-3 rounded-full justify-center shadow-lg shadow-negro" onPress={()=>{iniciarGrabacion().then(setTimeout(()=> detenerGrabacion, 1000));}} >
                  {/* recording start button */}
                  <Image
                    className="w-10 h-10 self-center"
                    source={require('../../assets/images/startRecord.png')}
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
                        centrosMed.current._array = [];
                        centroMedSeleccionado.current = {};

                      }}
                      style={styles.button} // Agrega los estilos que desees aquí
                    >
                      <Text>{`Centro: ${centro.NombreOficial}`}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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
