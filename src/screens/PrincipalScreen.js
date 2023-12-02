
//Modulos instalados
import { Button, Modal, View, Text, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useRef, useEffect, useState, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GiftedChat, InputToolbar, Day } from 'react-native-gifted-chat'
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Creaciones propias
import { numContactoEmergencia, obtenerDatosPreviosSelec, addRecordatorio, guardarHistoriarChats, mostarDB, BuscarContactoEmergencia, obtenerRut, obtenerDatosPreviosAnon, obtenerContactosEmergencia, muteADAM, obtenerMute } from "../api/sqlite"
import { source, generarRespuesta, crearRespuesta, secondApiCall, firstApiCall, whisperCall } from "../api/openAI";
import { obtenerUbicacion } from "../api/location";
import { buscarEnDB } from "../api/centrosMedicos";
import { enviarMensajeWSP, enviarMensajeEmergencia, realizarLlamada } from "../api/llamada";
import { seleccionarRespuestaRecordatorio } from "../api/respuestasPredeterminadas";
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';


import styles from '../api/styles';
import * as FileSystem from 'expo-file-system';
import { format } from 'date-fns';
import { obtenerClima } from "../api/clima";
import customtInputToolbar from '../api/customInputToolbar';
import customSend from '../api/customSendMessage';
import customChatMessage from '../api/customChatMessage';
import { MostrarNotificacionesGuardadas, scheduleRecordatorioNotification } from "../api/notificaciones";
import { CancelarLlamada } from '../api/detenerProceso';

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

  const [llamada, setLlamada] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const [mute, setMute] = useState(false);
  const [mensajeProcesamiento, setMensajeProcesamiento] = useState('');
  const [respondiendo, setRespondiendo] = useState(false);
  const navigation = useNavigation();


  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];

  // Obtiene el estado de enfoque de la pantalla
  const isFocused = useIsFocused();


  async function cambiarMute(estado){
    let rut = await obtenerRut()
     muteADAM(rut,estado)
    
    if (estado == '1'){
      setMute(true)
      
    }else if (estado == '0' ){
      setMute(false)
      
    }
    
    
  }
  
  useEffect(  ()=>{
    async function estadoMUTE(){
    let rut= await obtenerRut()
    let est= await obtenerMute(rut)
    //console.log(est[0].Mute)
    if( est !== null){
      if (est[0].Mute == 0 ){
        setMute(false)
      }
      else if (est[0].Mute == 1 ){
        setMute(true)
      }
    }
    }
    
    estadoMUTE()
  },[isFocused]);
  const [MostrarDetenerProceso, setMostrarDetenerProceso] = useState(false)
  const [detenerProceso, setDetenerProceso] = useState(false)
  const estadoDetener = useRef(false)

  async function iniciarGrabacion() {
    try {
      setDetenerProceso(false)
    } catch (error) {
      console.log('Error al cambiar estado de detener proceso en iniciar grabacion', error)
    }
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
      if (res.includes('Error')) {
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
      } else {
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

  let respuesta;

  async function elegirFuncion(function_name, args, message, prompt) {
    console.log('LOGICA DE SELECCION')
    try {
      if (function_name === "explicar_algo") {
        if (detenerProceso) {
          console.log('Proceso detenido en explicar algo');
          return;
        } else {
          function_response = "explica lo solicitado, si no se indica nivel de detalle, debe ser una explicacion simple pero concisa"
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        }
      } else if (function_name === "ubicacion") {
        if (detenerProceso) {
          console.log('Proceso detenido en ubicacion');
          return;
        } else {
          let ubicacion = await obtenerUbicacion('direccion');
          function_response = `La ubicación actual es: ${ubicacion}, informa al uauario que debe tener en cuenta que la ubicacion tiene un margen de error de aproximadamente 100 metros`;
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        }
      } else if (function_name === "centro_salud_cercano") {
        if (detenerProceso) {
          console.log('Proceso detenido en centro salud cercano');
          return;
        } else {
          let { comuna, region } = await obtenerUbicacion('comuna');
          //let comuna = 'Hualqui'
          //let region = 'Biobío Region'
          if (detenerProceso) {
            return;
          } else {
            console.log('REGION: ', region, 'COMUNA: ', comuna)
            centros = await buscarEnDB('Comuna', comuna)
            if (centros) {
              if (detenerProceso) {
                return;
              } else {
                console.log('CENTROS: ', centros)
                function_response = `ubicacion del usuario: ${comuna} \n\ centros de salud encontrados en la base de datos, segun la ubicacion del usuario:\n\ ${JSON.stringify(centros)} \n\ esta informacion es real y fidedigna, no debes modificarla bajo ningun punto. la informacion viene con el siguiente formato: \n\ {"_array": [{"Comuna": "ejcomuna", "Calle": "ejcalle", "NombreOficial": "ejnombreoficial", "Numero": "ejnumero", "Region": "ejregion", "Telefono": "ejtelefono", "TieneServicioDeUrgencia": "SI/NO", "TipoDeSAPU": "ejtiposapu", "TipoDeUrgencia": "ejtipourgencia", "Via": "ejvia", "id": 1}], "length": cantidad_de_centros_de_salud_identificados} \n\ para generar una respuesta con esta informacion debes dar un formato a la informacion como el siguiente: \n\ ejnombreoficial, ejcalle ejnumero, ejcomuna, ejtelefono `;
                console.log('FUNCION RESPONSE: \n\ ', function_response)
                respuesta = await secondApiCall(prompt, message, function_name, function_response)
              }
            } else {
              console.log('No se encontraron centros')
            }
          }
        }
      } else if (function_name === "llamar_contacto") {
        if (detenerProceso) {
          console.log('Proceso detenido en llamar contacto');
          return;
        } else {
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
              if (detenerProceso) {
                console.log('Proceso detenido en llamar contacto > 1');
                return;
              } else {
                console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')
                setModalCEVisible(true);
                if (!modalCEVisible) {
                  function_response = `Seras redigido a la aplicacion telefono para llamar al contacto de nombre o alias ${JSON.stringify(nombreContacto)}.`
                  respuesta = await generarRespuesta('Llamar a contacto', function_response, prompt)
                  setAliasContactoEm('')
                  setNombreContactoEm('')
                }
              }
            } else {
              if (detenerProceso) {
                console.log('Proceso detenido en llamar contacto 0');
                return;
              } else {
                function_response = `No posees algun contacto de nombre o alias ${JSON.stringify(args)}.`
                respuesta = await generarRespuesta('Llamar a contacto', function_response, prompt)
                //Alert.alert("Contacto no encontrado: ", function_response);
                contactosEmergencia.current = [];
              }
            }
          } else {
            if (detenerProceso) {
              console.log('Proceso detenido en llamar contacto null');
              return;
            } else {
              function_response = `No se encontraron contactos de emergencia guardados en la aplicacion.`
              respuesta = await generarRespuesta('ERROR', function_response, prompt)
              //Alert.alert("Contacto no encontrado: ", function_response);
              contactosEmergencia.current = [];
            }
          }
        }
      } else if (function_name === "llamar_a_centro_salud") {
        if (detenerProceso) {
          console.log('Proceso detenido en llamar centro salud');
          return;
        } else {
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
              if (detenerProceso) {
                console.log('Proceso detenido en llamar centro salud > 1');
                return;
              } else {
                console.log('********* MAS DE UN CENTRO ENCONTRADO *********')
                setModalNCMVisible(true);
                if (!modalNCMVisible) {
                  function_response = `Seras redigido a la aplicacion telefono para llamar al centro de salud ${JSON.stringify(nombreCentro)}.`
                  respuesta = await generarRespuesta('Llamar a centro de salud', function_response, prompt)
                  setNombreCentroMed('')
                }
              }
            } else {
              function_response = `No existe algun centro de salud disponible para llamar en la comuna ${JSON.stringify(comuna)}.`
              respuesta = await generarRespuesta('Llamar a centro de salud', function_response, prompt)
              //Alert.alert("Centro de salud no encontrado: ", function_response);
              centrosMed.current._array = [];
            }
          } console.log('ERROR: centrosMed no esxiste o no es un array')
        }
      } else if (function_name === "llamar_numero") {
        if (detenerProceso) {
          console.log('Proceso detenido en llamar num');
          return;
        } else {
          console.log('NUMERO A LLAMAR: ', args)
          function_response = `Seras redigido a la aplicacion telefono para llamar al numero ${JSON.stringify(args)}.`
          realizarLlamada(args);
          respuesta = await generarRespuesta('Llamar a numero', function_response, prompt)
        }
      } else if (function_name === "llamar_contacto_emergencia") {
        if (detenerProceso) {
          console.log('Proceso detenido en llamar contacto emergencia');
          return;
        } else {
          let numeroEmergencia = await numContactoEmergencia()
          console.log('numero de emergencia a llamar: ', numeroEmergencia);
          realizarLlamada(numeroEmergencia);
          let answer = `Se llamara al contacto de emergencia`
          respuesta = await generarRespuesta('llamar_contacto_emergencia', answer, prompt)
        }
      } else if (function_name === "enviar_mensaje_a_contacto") {
        if (detenerProceso) {
          console.log('Proceso detenido en enviar mensaje');
          return;
        } else {
          console.log('DATOS RECONOCIDOS: ', args)
          args = JSON.parse(args)
          console.log('args: ', args);
          let mensaje = args.mensaje
          let nombre = args.nombre_persona
          console.log('MENSAJE: ', mensaje)
          console.log('NOMBRE: ', nombre)
          contactosEmergencia.current = await BuscarContactoEmergencia(nombre);
          if (contactosEmergencia.current !== null) {
            console.log('CONTACTOS ENCONTRADOS: ', contactosEmergencia.current)
            if (contactosEmergencia.current.length === 1) {
              console.log('********* UN CONTACTO ENCONTRADO *********')
              let numeroDeContacto = contactosEmergencia.current[0].numero;
              let nombreContacto = contactosEmergencia.current[0].nombreCompleto
              function_response = `Seras redigido a la aplicacion whatsapp para enviar un mensaje al contacto de nombre o alias ${JSON.stringify(nombreContacto)}.`
              console.log('numeroDeContacto', JSON.stringify(numeroDeContacto))
              enviarMensajeWSP(numeroDeContacto, mensaje)
              respuesta = await generarRespuesta('enviar_mensaje_a_contacto', function_response, prompt)
              contactosEmergencia.current = [];
            } else if (contactosEmergencia.current.length > 1) {
              if (detenerProceso) {
                console.log('Proceso detenido en enviar mensaje > 1');
                return;
              } else {
                console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')
                //generar modal seleccion de persona a enviar msj
              }
            } else {
              if (detenerProceso) {
                console.log('Proceso detenido en enviar mensaje 0');
                return;
              } else {
                function_response = `No posees algun contacto de nombre o alias ${nombre}.`
                respuesta = await generarRespuesta('enviar_mensaje_a_contacto', function_response, prompt)
                //Alert.alert("Contacto no encontrado: ", function_response);
                contactosEmergencia.current = [];
              }
            }
          }
        }
      } else if (function_name === "informacion_medica_del_usuario") {
        if (detenerProceso) {
          console.log('Proceso detenido en informacion medica del usuario');
          return;
        } else {
          console.log('FRASE RECONOCIDA: ', args)
          let rut = await obtenerRut();
          if (detenerProceso) {
            console.log('Proceso detenido en informacion medica del usuario');
            return;
          } else {
            let infMedica = await obtenerDatosPreviosSelec(rut)
            if (infMedica) {
              if (detenerProceso) {
                console.log('Proceso detenido en informacion medica del usuario');
                return;
              } else {
                console.log('INFORMACION MEDICA: ', infMedica)
                let answer = `Esta es la informacion medica del usuario: \n\ ${infMedica}`
                respuesta = await generarRespuesta('informacion_medica_del_usuario', answer, prompt)
              }
            } else {
              if (detenerProceso) {
                console.log('Proceso detenido en else informacion medica del usuario');
                return;
              } else {
                let answer = `No se han configurado datos medicos a mostrar.`
                respuesta = await generarRespuesta('informacion_medica_del_usuario', answer, prompt)
              }
            }
          }
        }
      } else if (function_name === "mostrar_base_de_datos") {
        if (detenerProceso) {
          console.log('Proceso detenido en mostrar base de datos');
          return;
        } else {
          // tablas: Usuario Alergias PatologiasCronicas Medicamentos Limitaciones Contacto Historial centrosMedicos 
          console.log('MOSTRANDO BD')
          /*mostarDB('Usuario');
          mostarDB('Alergias');
          mostarDB('Medicamentos');
          mostarDB('Limitaciones');
          mostarDB('PatologiasCronicas');
          mostarDB('Contacto');
          mostarDB('recordatorios');
          mostarDB('Configuracion');
          await MostrarNotificacionesGuardadas()*/
          mostarDB('DolenciasSintomas');
          //mostarDB('centrosMedicos');
          respuesta = await generarRespuesta('Mostrar base de datos', 'La base de datos se mostrara en la consola.', prompt)
        }
      } else if (function_name === "recordatorio") {
        if (detenerProceso) {
          console.log('Proceso detenido en recordatorio');
          return;
        } else {
          //let args={"Descripcion": "", "Dias": "Unico", "Fecha": "2026-07-13", "Hora": "19:43", "Titulo": "Llamar a sax"}
          respuestaRecordatorio = seleccionarRespuestaRecordatorio(args)
          if (detenerProceso) {
            console.log('Proceso detenido en scheduleRecordatorioNotification');
            return;
          } else {
            let idNotificacion = await scheduleRecordatorioNotification(JSON.parse(args))
            if (detenerProceso) {
              console.log('Proceso detenido en addRecordatorio');
              return;
            } else {
              addRecordatorio(JSON.parse(args), idNotificacion)
              if (detenerProceso) {
                console.log('Proceso detenido en generarRespuesta recordatorio');
                return;
              } else {
                respuesta = await generarRespuesta(function_name, respuestaRecordatorio, prompt)
              }
            }
          }
        }
      } else if (function_name === "clima") {
        if (detenerProceso) {
          console.log('Proceso detenido en clima');
          return;
        } else {
          clima = await obtenerClima('coordenadas', JSON.parse(args))
          jsonclima = JSON.stringify(clima)
          //console.log(jsonclima)
          function_response = `${jsonclima} Este json contiene informacion del clima Convierte este json en informacion util  para un usuario que habla español, resumelo presicamente, la temperatura que viene es en  Fahrenheit , convierte a celsius  y terminologia basica, resume en no mas de 50 palabras `
          //console.log(function_response)
          if (detenerProceso) {
            console.log('Proceso detenido en generarRespuesta clima');
            return;
          } else {
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
          }
        }
      } else if (function_name === 'recomendacion_medica_general') {
        if (detenerProceso) {
          console.log('Proceso detenido en recomendacion medica general');
          return;
        } else {
          let rut = await obtenerRut()
          if (detenerProceso) {
            console.log('Proceso detenido en recomendacion medica general');
            return;
          } else {
            if (detenerProceso) {
              console.log('Proceso detenido en recomendacion medica general');
              return;
            } else {
              let perfilAnnon = await obtenerDatosPreviosAnon(rut)
              console.log(perfilAnnon)
              function_name = "responder_temas_de_salud"
              function_response = `El usuario solicita que le respondas una recomendacion medica o de salud para eso puedes considerar que el perfil medico del usuario es  ${perfilAnnon}, intenta responder lo mejor que puedas, entendiendo que no eres medico, y agrega una pequeña frase al final, diciendole al usuario que siempre es recomendable consultar a un profesional, esta frase que sea lo mas corto posible `
              if (detenerProceso) {
                console.log('Proceso detenido en generarRespuesta recomendacion medica general');
                return;
              } else {
                respuesta = await secondApiCall(prompt, message, function_name, function_response)
              }
            }
          }
        }
      } else if (function_name === 'Compartir_Ubicacion') {
        if (detenerProceso) {
          console.log('Proceso detenido en compartir ubicacion');
          return;
        } else {
          let answer = await compartir_ubicacion(prompt)
          if (detenerProceso) {
            console.log('Proceso detenido en compartir ubicacion');
            return;
          } else {
            respuesta = await generarRespuesta('Compartir_Ubicacion', answer, prompt)
          }
        }
      } else if (function_name === 'explicar_funcion') {
        if (detenerProceso) {
          console.log('Proceso detenido en explicar funcion');
          return;
        } else {
          console.log('ARGS: ', args)
          function_response = 'Debes explicar paso a paso como navegar entre las pantallas de la aplicacion para realizar la funcioncion que el usuario solicita'
          if (detenerProceso) {
            console.log('Proceso detenido en explicar funcion');
            return;
          } else {
            respuesta = await secondApiCall(prompt, message, function_name, function_response)
          }
        }
      } else {
        if (detenerProceso) {
          console.log('Proceso detenido en else');
          return;
        } else {
          console.log('FUNCION NO ENCONTRADA')
          function_name = "responder"
          function_response = "indica al usuario que esa funcion no esta dentro del catalogo de funciones disponibles, pero responde o trata de dar solucion a lo que te indiquen en base a tus conocimientos, utiliza el contexto de la conversacion para dar una respuesta mas exacta"
          respuesta = await secondApiCall(prompt, message, function_name, function_response)
        }
      }
      return respuesta;

    } catch (error) {
      console.log('error en elegir funcion', error);
      if (detenerProceso) {
        respuesta = `respuesta cancelada`
        return respuesta;
      }

    }
  }

  {/* Inicio funciones de obtencion de data de apis  */ }
  const obtenerRespuesta = async (input) => {
    if (detenerProceso) {
      console.log('Proceso detenido antes de fac');
      return;
    }
    setMostrarDetenerProceso(true)
    setDetenerProceso(false)
    setinputUsuario(input);
    const mensajeUsuario = input[0];
    if (detenerProceso) {
      console.log('Proceso detenido antes de fac');
      return;
    }
    if (mensajeUsuario.text === null) {
      mensajeUsuario.text = '...'
    } else if (mensajeUsuario.text === ' ') {
      mensajeUsuario.text = '...'
    } else if (mensajeUsuario.text === 'Subtítulos realizados por la comunidad de Amara.org') {
      mensajeUsuario.text = '...'
    } else if (typeof mensajeUsuario.text === 'undefined') {
      mensajeUsuario.text = '...'
    } else if (mensajeUsuario.text === undefined) {
      mensajeUsuario.text = '...'
    }
    if (detenerProceso) {
      console.log('Proceso detenido antes de fac');
      return;
    }
    setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, mensajeUsuario))
    if (input[0].text.length > 0) {
      if (detenerProceso) {
        console.log('Proceso detenido antes de fac');
        return;
      }
      console.log("************* PROCESO DE RESPUESTA *********************")
      setCargando(true);
      let prompt = mensajeUsuario.text;
      console.log(prompt)
      setRespondiendo(true)
      setMensajeProcesamiento('Procesando pregunta...');
      setDetenerProceso(false)
      try {
        if (detenerProceso) {
          console.log('Proceso detenido antes de fac');
          return;
        }
        let result = await firstApiCall(prompt);
        let function_name, args, message;
        if (result !== undefined) {
          ({ function_name, args, message } = result);

          if (detenerProceso) {
            console.log('Proceso detenido en antes del if function_name');
            return;
          }
          if (function_name) {
            setMensajeProcesamiento('Procesando respuesta...');
            console.log('FUNCION SELECCIONADA: ', function_name)


            respuesta = await elegirFuncion(function_name, args, message, prompt)

          } else {
            if (detenerProceso) {
              console.log('Proceso detenido en else');
              return;
            } else {
              //siempre se encuentra una funcion por lo que si no se obtiene el nombre de una funcion es por que entremedio se detuvo el proceso, pq en caso de error lanza el catch
              respuesta = `respuesta cancelada`
            }
          }
        } else if (result === `respuesta cancelada`) {
          respuesta = `respuesta cancelada`
        } else if (result === 'tiempo de espera agotado') {
          respuesta = 'tiempo de espera agotado'
        } else {
          console.log('ERROR NO IDENTIFICADO EN PRIMERA LLAMADA')
        }




        console.log('******respuesta api obtenida*****');
        setCargando(false);
        setRespondiendo(false)
        setMensajeProcesamiento('');
        console.log('RESPUESTA: ', respuesta)
        if (respuesta) {
          // si existe respuesta se verifica que el tiempo de espera no se haya agotado en la segunda llamada o se haya cancelado alguna de las llamadas, si es el caso, se genera respuesta acorde
          if (respuesta === 'tiempo de espera agotado') {
            let answer = `Tiempo de espera agotado, revisa tu conexion a internet`
            respuesta = await generarRespuesta('tiempo_agotado_sac', answer, prompt)
          } else if (respuesta === `respuesta cancelada`) {
            let answer = 'Haz detenido el proceso, esperare tu siguiente mensaje'
            respuesta = await generarRespuesta('respuesta cancelada', answer, prompt)
          }
          //si todo dale bien se muestra respuesta en pantalla
          setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
          if (mute == false) {
            respuestaVoz(respuesta.text)
          }
          setinputUsuario('');
          respuesta = null;
        } else {
          // si no existe, se verifica si se detuvo el proceso y se genera respuesta acorde
          if (detenerProceso) {
            let answer = 'Haz detenido el proceso, esperare tu siguiente mensaje'
            if (mute == false) {
              respuestaVoz(answer)
            }
            respuesta = await generarRespuesta('Proceso detenido', answer, prompt)
            setDetenerProceso(false)
          } else {
            setMensajeProcesamiento('Procesando respuesta...');
            console.log('NO SE OBTUVO UNA RESPUETA A LA SEGUNDA LLAMADA')
            let answer = 'Ocurrio un error con la respuesta, intentalo nuevamente'
            if (mute == false) {
              respuestaVoz(answer)
            }
            respuesta = await generarRespuesta('ERROR', answer, prompt)
            setDetenerProceso(false)
          }
          setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
          setinputUsuario('');
          respuesta = null;
          setMensajeProcesamiento('');

        }
        setMostrarDetenerProceso(false)

      } catch (error) {
        console.log('DETENCION O ERROR: -------------------->');
        setMensajeProcesamiento('Procesando respuesta...');
        console.log('ERROR: ', error)
        setCargando(false);
        setRespondiendo(false)
        if (detenerProceso) {
          let answer = 'Haz detenido el proceso, esperare tu siguiente mensaje'
          if (mute == false) {
            respuestaVoz(answer)
          }
          respuesta = await generarRespuesta('Proceso detenido', answer, prompt)
          setDetenerProceso(false)
        } else if (error instanceof TypeError && /Cannot read property 'function_name' of undefined/.test(error.message)) {
          let answer = 'Haz detenido el proceso, esperare tu siguiente mensaje'
          if (mute == false) {
            respuestaVoz(answer)
          }
          respuesta = await generarRespuesta('Proceso detenido', answer, prompt)
          setDetenerProceso(false)
        } else {
          setMensajeProcesamiento('Procesando respuesta...');
          console.log('NO SE OBTUVO UNA RESPUETA A LA SEGUNDA LLAMADA')
          let answer = 'No se obtuvo respuesta, revisa tu conexion a internet'
          if (mute == false) {
            respuestaVoz(answer)
          }
          respuesta = await generarRespuesta('ERROR', answer, prompt)
          setDetenerProceso(false)
        }
        setMensajes((mensajesPrevios) => GiftedChat.append(mensajesPrevios, respuesta))
        setinputUsuario('');
        respuesta = null;
        setMensajeProcesamiento('');
        setMostrarDetenerProceso(false)
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




  /* funciones de emergencias */

  async function compartir_ubicacion() {
    let answerOK = 'Serás redirigido para compartir ubicación'
    let answerError = 'Por favor agrega contactos de emergencia para compartir tu ubicación'
    let answerMultiple = 'Selecciona un contacto para compartir tu ubicación'

    contactosEmergencia.current = await obtenerContactosEmergencia();

    if (contactosEmergencia.current.length == 1) {
      let contacto = contactosEmergencia.current[0]
      let numero = contacto.numero.replace(/\D/g, '')
      enviarMensajeEmergencia(numero)
      return answerOK
    }
    else if (contactosEmergencia.current.length == 0 || contactosEmergencia.current.length == undefined) {

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
            onPress: () => { navigation.navigate('ConfiguracionNested', { screen: 'Contactos de emergencia' }) }
          }
        ]
      );
      return answerError;
    }
    else {

      console.log('********* MAS DE UN CONTACTO ENCONTRADO *********')

      setMensaje(true)
      setModalCEVisible(true);
      return answerMultiple;
    }
  }

  const cancelarProceso = () => {
    try {
      setDetenerProceso(true)
    } catch (error) {
      console.log("ERROR SET DETENER PROCESO")
    }
    try {
      CancelarLlamada('Operación cancelada por el usuario');
    } catch (error) {
      console.log("ERROR AL CANCELAR PROCESO")
    }
    /*try {
      setMostrarDetenerProceso(false)
    } catch (error) {
      console.log("ERROR SET MOSTRAR DETENER PROCESO")
    }*/
  }
  //detener proceso
  const pressDetenerProceso = () => {
    for (let i = 0; i < 2; i++) {
      setTimeout(cancelarProceso, 1000)
    }

  }

  // **********************************************************************************************************************************************************************************
  // ***                                                         Vista de pantalla                                                                                                  ***
  // **********************************************************************************************************************************************************************************
  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <View style={styles.container}>
        <View className="flex-row justify-center">
          {/*<Image 
      source={require('../../assets/images/iron-adam.png')}
      style={{height:hp(8), width:wp(12)}}
      />*/}
        </View>
        {/*<View><Text className="text-center font-bold pt-0 -mt-4 mb-2 ">Chat ADAM</Text></View>*/}
        <View className="flex-1 flex-row justify-center">
          <View style={styles.msjContainer} className="flex-1">
            {/* <View style={styles.chatTopButtonsContainer}>
              <TouchableOpacity style={styles.chatTopButton}>
                <Text style={styles.chatTopButtonText}>Informacón médica</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatTopButton}>
                <Text style={styles.chatTopButtonText}>Nuevas noticias</Text>
              </TouchableOpacity>
            </View> */}
            <GiftedChat
              renderInputToolbar={props => customtInputToolbar(props)}
              renderSend={props => customSend(props, theme)}
              renderMessage={props => customChatMessage(props, theme)}
              messages={mensajes}
              placeholder='Escriba su mensaje...'
              renderUsernameOnMessage={false}
              onSend={(input) => obtenerRespuesta(input)}
              user={{ _id: 1 }}

            />

            <View>
              {respondiendo ? (
                <>
                  <Text style={styles.mensajeProcesamiento}>{mensajeProcesamiento}</Text>
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
              <Image className="w-12 h-12 py-3 rounded-full my-3" style={{backgroundColor: activeColors.quinary}}
                source={require('../../assets/images/processingQuestion.gif')}
              />
            ) :
              hablando ? (
                <TouchableOpacity style={styles.detenerGrabacionButton} onPress={detenerGrabacion}>
                  {/* recording stop button */}
                  <Image
                    className="w-12 h-12 self-center"
                    source={activeColors.micRecordingImage}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.iniciarGrabacionButton} onPress={() => { iniciarGrabacion().then(setTimeout(() => detenerGrabacion, 1000)); }} >
                  {/* recording start button */}
                  <Image
                    className="w-10 h-10 self-center"
                    source={activeColors.micImage}
                  />
                </TouchableOpacity>
              )
          }

          {
            MostrarDetenerProceso ? (
              <TouchableOpacity
                className="bg-negro rounded-3xl p-4 absolute right-7 shadow-lg shadow-black"
                onPress={() => { pressDetenerProceso() }}>
                <Text style={{ color: '#ff3e45' }}>{'Detener '} <FontAwesome5 name="stop" size={10} color={'#ff3e45'} /></Text>
                {/*<FontAwesome5 name="stop" size={25} color={'#ff3e45'} />*/}
              </TouchableOpacity>
            ) : null
          }

          {/* Modal contactos emergencia */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalCEVisible}
            onRequestClose={() => { setModalCEVisible(false); }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>{llamada == true && `Selecciona un contacto para llamar`} {mensaje == true && `Selecciona un contacto para compartir ubicación`}</Text>
                <ScrollView>
                  {contactosEmergencia.current.map((contacto, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        contactoEmSeleccionado.current = contacto;
                        console.log(contactoEmSeleccionado)
                        setModalCEVisible(false);
                        if (llamada == true) {
                          realizarLlamada(contactoEmSeleccionado.current.numero.replace(/\D/g, ''))
                          setLlamada(false)
                        } else if (mensaje == true) {
                          enviarMensajeEmergencia(contactoEmSeleccionado.current.numero.replace(/\D/g, ''))
                          setMensaje(false)
                        }

                        setNombreContactoEm(contactoEmSeleccionado.current.nombreCompleto);
                        setAliasContactoEm(contactoEmSeleccionado.current.alias);
                        contactosEmergencia.current = [];
                        contactoEmSeleccionado.current = {};

                      }}
                      style={[styles.rojoIntensoButton, { padding: '8%', margin: '2%' }]} // Agrega los estilos que desees aquí
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
                        style={styles.redcoralButton} // Agrega los estilos que desees aquí
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
            mute ? (
              <TouchableOpacity
                onPress={()=> {cambiarMute('0') }}
                className="bg-negro rounded-3xl p-3 absolute left-10 shadow-lg shadow-black"
              >
                <Text className="text-white font-semibold"><MaterialCommunityIcons name="account-tie-voice-off" size={28} color="#ff3e45" /></Text>
              </TouchableOpacity>
            ):
            (
              <TouchableOpacity
                onPress={()=>{cambiarMute('1'); detenerVoz()}}
                className="bg-negro rounded-3xl p-3 absolute left-10 shadow-lg shadow-black"
              >
                <Text className="text-white font-semibold"><MaterialCommunityIcons name="account-tie-voice" size={28} color="#ff3e45" /></Text>
              </TouchableOpacity>
            )
          }


        </View>
      </View>
    </SafeAreaView>
  )
}

// axios instalado, navigation instalado, tailwindcss instalado
