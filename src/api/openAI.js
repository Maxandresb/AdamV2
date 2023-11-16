import { Audio } from "expo-av";
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import { guardarHistoriarChats, obtenerContactosAlmacenados, obtenerRut } from "../api/sqlite";
import { format } from 'date-fns';



const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
    headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
    }
})
const whispcli = axios.create({
    headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "multipart/form-data"
    }
})
const whisperUrl = 'https://api.openai.com/v1/audio/transcriptions';
const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';
export const whisperCall = async (formData) => {

    try {
        const res = await whispcli.post(whisperUrl, formData);
        console.log(res.data?.text)
        return res.data?.text
    } catch (err) {
        console.log('error: ', err);
        if (err && err.msg) {
            return `Error : ${err.msg}`

        } else if (err && err.message) {
            return `Error : ${err.msg}`
        } else {
            return `Error : A ocurrido un error desconocido`
        }
    }
}

let message;
let function_name;
let args;
let function_response;
let promises = [];
let FechaHoy = new Date()
//console.log('Fecha Hoy: ' + FechaHoy)
let contactos = obtenerContactosAlmacenados()
const functions = [
    {
        "name": "explicar_algo",
        "description": "el usuario puede solicitar que se le explique un tema especifico, debes hacerlo de manera comprensible. si el usuario solicitar que le expliquen una funcion de la aplicacion, debes hacerlo paso a paso indicando el orden de ejecucion en el cual el usuario debera navegar en la aplicacion para realizar la funcion",
        "parameters": {
            "type": "object",
            "properties": {
                "tema": {
                    "type": "string",
                    "description": "El tema sobre el que se solicita la explicación. Si no se proporciona, se solicitará al usuario.",
                },
                "nivel": {
                    "type": "string",
                    "description": "El nivel de profundidad deseado para la explicación, puede ser 'básico', 'intermedio' o 'avanzado'.",
                },
                "ejemplos": {
                    "type": "boolean",
                    "description": "Indica si se deben incluir ejemplos en la explicación.",
                }
            },
            "required": ["tema"]
        }
    },
    {
        "name": "ubicacion",
        "description": "obtener la ubicacion del usuario",
        "parameters": {
            "type": "object",
            "properties": {
                "latitud": {
                    "type": "string",
                    "description": "es la distancia angular de un punto de la Tierra al ecuador, medida en grados.",
                },
                "longitud": {
                    "type": "string",
                    "description": "es la distancia angular de un punto de la Tierra al meridiano de Greenwich, medida en grados.",
                },
            }
        }
    },
    {
        "name": "centro_salud_cercano",
        "description": "identifica que centro de salud es el mas cercano a mi ubicacion ",
        "parameters": {
            "type": "object",
            "properties": {
                "centro_de_salud": {
                    "type": "string",
                    "description": "puede ser un hospital publico o privado, una POSTA, un centro medico, un centro de urgencias, una clinica, un SAPU, un SAR o un policlinico ",
                }
            }
        }
    },
    {
        "name": "llamar_contacto",
        "description": `el usuario solicita llamar a una persona, debes responder con el nombre de la persona a la cual llamara , es obligatorio mencionar a un contacto para llamar los contactos actuales son  ${contactos}`,
        "parameters": {
            "type": "object",
            "properties": {
                "persona a llamar": {
                    "type": "string",
                    "description": "nombre de la persona a la cual se desea llamar, puede ser un nombre como tal o un alias",
                }
            }, "required": ["persona a llamar"]
        }
    },
    {
        "name": "enviar_mensaje_a_contacto",
        "description": `El usuario solicita enviar un mensaje a una persona, debes responder con el nombre de la persona a la cual llamara , es obligatorio mencionar el contacto al cual enviar el mensaje. Los contactos disponibles son  ${contactos}`,
        "parameters": {
            "type": "object",
            "properties": {
                "nombre_persona": {
                    "type": "string",
                    "description": "Este parametro es obligatorio. Indica el nombre de la persona a la cual se desea enviar el mensaje, puede ser un nombre como tal o un alias",
                },
                "mensaje": {
                    "type": "string",
                    "description": "Este parametro es obligatorio. Indica el mensaje que el usuario quiere enviar, no puedes modificar el mensaje que indique el usuario, debes indicar tal cual lo que dice ",
                }
            }, "required": ["nombre persona a enviar mensaje", "mensaje"]
        }
    },
    {
        "name": "llamar_a_centro_salud",
        "description": "identifica que el usuario desea llamar a un centro de salud",
        "parameters": {
            "type": "object",
            "properties": {
                "centro_de_salud": {
                    "type": "string",
                    "description": "puede ser un hospital publico o privado, una POSTA, un centro medico, un centro de urgencias, una clinica, un SAPU, un SAR o un policlinico que posea numero telefonico",
                }
            }
        }
    },
    {
        "name": "llamar_numero",
        "description": "el usuario solicita llamar a un numero, debes responder con el numero al que el usuario desea llamar",
        "parameters": {
            "type": "object",
            "properties": {
                "numero a llamar": {
                    "type": "string",
                    "description": "numero al cual se desea llamar",
                }
            }, "required": ["numero a llamar"]
        }
    },
    {
        "name": "llamar_contacto_emergencia",
        "description": "el usuario solicita llamar a su contacto de emergencia",
        "parameters": {
            "type": "object",
            "properties": {
                "contacto de emergencia": {
                    "type": "string",
                    "description": "el usuario indica en la oracion 'contacto de emergencia'",
                }
            },
        }
    },
    {
        "name": "recordatorio",
        "description": `El usuario solicita crear un recordatorio, tu debes identificar las propiedades de la funcion en el prompt del usuario. Debes saber que el dia de hoy es: ${FechaHoy} ya que lo usaras mas adelante para indicar la fecha del recordatorio, siempre debes retornar la fecha. Tienes que analizar el prompt del usuario y devolver siempre los siguientes parámetros o propiedades obligatorios: Titulo, Fecha, Hora y Dias. Si no se menciona alguna debes seguir las descripciones de cada propiedad para saber como intrepretar el prompt del usuario, bajo niun punto pueden faltar alguna de estas 4 propiedades, siempre las debes encontrar.`,
        "parameters": {
            "type": "object",
            "properties": {
                "Titulo": {
                    "type": "string",
                    "description": "Retornar esta property es obligatorio. El título o encabezado del recordatorio. Por ejemplo, si el usuario dice 'recordarme comprar leche', el título sería 'Comprar leche'. este parámetro es obligatorio."
                },
                "Fecha": {
                    "type": "string",
                    "description": "Retornar esta property es obligatorio. La fecha del recordatorio en formato YYYY-MM-DD. Debes analizar la fecha mencionada por el usuario e intentar convertirla a este formato. Por ejemplo, si dice 'el 15 de marzo', la fecha sería '2023-03-15'. Si se indica una fecha como por ejemplo, 10 de marzo, pero esa fecha ya paso, debes asignar el dia y mes que indica el usuario pero en el año asignar el año proximo, entonces segun el ejemplo lo que deberias indicar es: '2024-03-10'. Si el usuario no menciona una fecha, indica la fecha actual como la fecha del recordatorio, esto es obligatorio, no puede faltar. Recuerda que Titulo, Fecha, Hora y Dias son parametros obligatorios. Este parámetro es obligatorio."
                },
                "Hora": {
                    "type": "string",
                    "description": "Retornar esta property es obligatorio. La hora del recordatorio en formato 24h (hh:mm). Debes analizar la hora mencionada por el usuario y convertirla a este formato. Por ejemplo, si dice 'a las 3pm', la hora sería '15:00'. Si no se menciona hora, asume la hora actual. Recuerda que Titulo, Fecha, Hora y Dias son parametros obligatorios. Este parámetro es obligatorio."
                },
                "Descripcion": {
                    "type": "string",
                    "description": "La descripción o detalles del recordatorio. Completa la información del título. Por ejemplo, para el título 'Comprar leche', la descripción podría ser, por ejemplo '2 litros de leche descremada' segun lo que mencione el usuario. Recuerda que Titulo, Fecha, Hora y Dias son parametros obligatorios. Este parámetro es opcional."
                },
                "Dias": {
                    "type": "string",
                    "description": "Retornar esta property es obligatorio. Los días en que se repetirá el recordatorio. Por ejemplo, 'Lunes, Miércoles, Viernes'. Si no se especifican días, el valor debe ser 'Unico'. Recuerda que Titulo, Fecha, Hora y Dias son parametros obligatorios. Este parámetro es obligatorio."
                }
            }, "required": ["Fecha", "Hora", "Dias"]
        }
    },
    {
        "name": "mostrar_base_de_datos",
        "description": "el usuario solicita ver base de datos",
        "parameters": {
            "type": "object",
            "properties": {
                "llamar": {
                    "type": "string",
                    "description": "indica que se quiere ver la base de datos",
                }
            }
        }
    },
    {
        "name": "clima",
        "description": "el usuario solicita conocer el clima o informacion relacionada a este, infomracion que pueda entregrar openweathermap, de una zona tipo cuidad pais .Hoy ,mañana,ayer no son ubicaciones, 'Clima de hoy' significa el clima de hoydia no de la locacion hoy lo mismo con  'clima de mañana' o 'clima de ayer'",
        "parameters": {
            "type": "object",
            "properties": {
                "Locacion": {
                    "type": "string",
                    "description": " responde solo en español, indica la ubicacion real  sobre la cual el usuario quiere conocer el clima, hoy ,mañana,ayer no son ubicaciones, solo ubicaciones nada mas ni dias ni tiempo ni otros parametros idealmente ubicaciones tipo (ciudad pais), a menos que exista explicito la locacion responde: NULL",
                }
            }
        }
    },
    {

        "name": "informacion_medica_del_usuario",
        "description": "El usuario quiere ver y escuchar su informacion medica previamente configurada",
        "parameters": {
            "type": "object",
            "properties": {
            }
        }
    },
    {
        "name": "recomendacion_medica_general",
        "description": "el usuario solicita obtener sus informacion sobre salud general como rutinas, consejos de salud, dietas, actividades recomendadas para adultos mayores, debes reconocer frases como 'que dieta me recomiendas', 'que actividades deberia realizar', 'como mejorar mi salud mental' , 'consejos sobre salud' , 'di mis datos de emergencia' o algo similar",
        "parameters": {
            "type": "object",
            "properties": {
                "frase rconocida": {
                    "type": "string",
                    "description": "indica la frase que reconociste del usuario, esta propiedad es oblogatoria",
                }
            }
        }
    },
    {
        "name": "Compartir_Ubicacion",
        "description": `el usuario solicita compartir su ubicacion actual con un contacto , los contactos solo pueden ser los siguientes : [ ${contactos} ] solo puedes responder con uno de los contactos en el array o null, tiene que estar en el array para reconocerlo si no esta en el array no es un contacto valido, debes reconocer frases como 'Enviale mi ubicacion a', 'comparte mi ubicacion', 'manda mi ubicacion' , 'dile a x donde estoy'  o algo similar`,
        "parameters": {
            "type": "object",
            "properties": {
                "Contacto": {
                    "type": "string",
                    "description": `Indica el contacto que reconociste, esta propiedad es oblogatoria , de no mencionarse explicitamente responde : NULL , los contactos solo pueden ser los siguientes : [ ${contactos} ] solo puedes responder con uno de los contactos en el array o null`,
                }
            }
        }
    },
    {
        "name": "explicar_funcion",
        "description": `el usuario solicita una explicacion de una funcion de la aplicacion, debes reconocer frases como 'explicame como cambiar los datos seleccionados desde configuracion' o 'como elimino un recordatorio' o 'como modifico mis datos personales'. ademas debes responder en base a la informacion que se te ha proporcionado de en que parte de la aplicacion se encuentra cada una de las funciones`,
        "parameters": {
            "type": "object",
            "properties": {
                "funcion reconocida": {
                    "type": "string",
                    "description": `Indica cual es la funcion que hay que explicar`,
                }
            }
        }
    },




];

let conversationHistory = [
    {
        role: 'system',
        content: `Eres un asistente digital enfocado en el bienestar fisico y mental del usuario, 
        puedes ejecutar diversas funciones como: 
        establecer una conversacion (siguiendo el contexto de la conversacion reconocido en el historial, esto no se le muestra al usuario), 
        compartir informacion medica del usuario,
        obtener la ubicacion actual del usuario,
        compartir la ubicacion actual del usuario,
        encontrar un centro de salud segun la ubicacion del usuario,
        llamar a contactos que el usuario añade a la aplicacion ,
        llamar a un numero que el usuario indique,
        llamar al contacto registrado como contacto de emergencia,
        llamar a un centro de salud cercano segun la ubicacion del usuario,
        compartir la ubicacion al contacto de emergencia seleccionado por el usuario mediante whatsapp,
        enviar un mensaje a un contacto especificado,
        obtener el clima actual,
        generar recomendaciones a partir de la informacion medica del usuario y de los lineamientos que establece el ministerio de salud de chile,
        explicar un tema determinado,
        generar un recordatorio de alguna actividad unica o recurrente (los recordatorios tienen un estado de activo o inactivo, este estado se inicializa como activo y el usuario puede manejarlo en la pantalla correspondiente).
        Ahora te dare algunos ejemplos de como debes responder segun que caso:
        - si preguntan tu nombre: indica que tu nombre es "ADAM" acronimo de "Asistente Digital para Adultos Mayores".
        - si debes explicar que eres: indica que eres un asistente digital enfocado en adultos mayores y el area medica creado para brindar un acompañamiento social y medico personalizado segun la informacion medica del usuario.
        - si preguntan tus funciones: indica las 15 primeras funciones mencionadas anteriormente, de forma simple.
        - si preguntan por una funcion en especifico: indica que debe proporcionar el usuario para realizar la funcion.
        - si preguntan como agregar un recordatorio: indica que en la pantalla principal mediante el microfono el usuario puede decir que quiere recordar, a que hora y que dia, ademas de indicar si es un recordatorio unico o se repite mas de un dia.
        - si preguntan por donde ver los recordatorios: indica que se puede acceder a los recordatorios presionando el icono de calendario en la parte inferior derecha en la pantalla principal. los recordatorios no son accesibles desde el menu, solo desde la pantalla principal.
        - si preguntan como acceder a un recordatorio: indica como llegar a los recordatorios, ademas, dentro de la pantalla recordatorios el usuario tiene distintac opciones, en la parte superior de la pantalla el usuario puede desplegar un calendario en el cual estaran marcados todos los dias que tienen un recordatorio, ademas al seleccionar un dia el calendario se cierra permitiendo ver los recordatorios asignados a ese dia y a que hora sonara la notificacion, sino, por defecto se muestran los recordatorios para el dia actual. 
        - si preguntan como modificar un recordatorio: el usuario tiene dos opciones por cada recordatorio: puede modificar o cambiar el estado del recordatorio, cada funcion independiente una de otra en iconos distintos, para modificar el recordatorio (modificar titulo, descripcion, hora, dias a repetir o fecha) debe hacer click al PRIMER icono a la derecha del recordatorio, el icono es un lapiz.
        - si preguntan como activar o desacrtivar un recordatorio: puede cambiar su estado de activo a inactivo o viceversa puede hacer click en el SEGUNDO icono al lado derecho de cada recordatorio, el icono es un 'tick' o un check .
        - si preguntan como eliminar un recordatorio: puede eliminar un recordatorio haciendo click en el icono para modificar(un lapiz) el recordatorio al lado derecho de cada recordatorio, dentro de modificar, esta la opcion de eliminar recordatorio
        - si preguntan por el menu: indica que este se encuentra en la esquima superior izquierda de cada pantalla en la aplicacion en un icono(tres barras horizontales), en el, el usuario puede acceder a la pantalla principal para interacctuar con ADAM, acceder al perfil donde se pueden agregar o modificar sus datos, acceder al historial de las conversaciones de ADAM con el usuario, acceder a la configuracion de la aplicacion.
        - si preguntan como acceder a las funciones de emergencia: indica que las funciones de emergencia se encuentran en el en la pantalla SOS y el usuario puede acceder a ellas haciendo click en el icono(SOS) inferior izquierdo en la pantalla principal.
        - si preguntan por funciones de emergencia: indica como acceder a la pantalla SOS y que existen 4 funciones de emergencia. En la pantalla SOS se ven 4 botones. el boton superior izquierdo es para la funcion de emergencia llamar a un centro de salud cercano segun la ubicacion del usuario, el segundo boton superior derecho es para la funcion de emergencia compartir la ubicacion con el contcato de emergencia, el tercer boton inferior izquierdo es para la funcion de emergencia llamar al contracto de emergencia y el cuarto boton inferior derecho es para la funcion de emergencia mostrar y vocalizar los datos medicos del usuario.
        - si preguntan como silenciar o mutear la voz de ADAM: indica que en la pantalla principal en la árte centrar al lado izquiero del microfono existe un boton(icono de persona hablando), si el usuario hace click en el ya no se escucharan las respuestas de ADAM. Para activar la voz debe dar click en el nuevamente.
        - si preguntan como modificar los datos del usuario(datos medicos o personales): en el menu debe acceder a la opcion 'Perfil', en ella el usuario podra visualizar o modificar sus datos personales, ademas de añadir, visualizar, modificar o eliminar enfermedades, medicamentos, alergias o limitaciones que el usuario tenga. 
        - si preguntan por los contactos: indica que puede acceder a la pantalla 'Contactos' en el ultimo boton llamado 'Gestionar Contactos' al final de la 'Perfil' o en la pantalla 'Configuracion' en el boton 'Contactos de emergencia'.
        - si preguntan como agregar contactos desde el telefono: indica que debe acceder a la pantalla 'Contactos', luego en la parte superior vera un boton que dice 'Agregar contactos desde el telefono', al dar click se despliegan los contactos del telefono y el usuario puede tocar todos los contactos que desea guardar en la aplicacion. Cuando la seleccion de contactos esta lista, debe dar click al boton 'Guardar contactos seleccionados'.
        - si preguntan como agregar contactos manualmente: indica que debe acceder a la pantalla 'Contactos', luego en la parte superior bajo el boton 'Agregar contactos desde el telefono', vera un boton que dice 'Agregar nuevo contactos', al dar click se despliega un formulario donde el usuario debe ingresar el nombre del contacto, el numero telefonico y el parentesco o relacion que tiene con el usuario. Cuando el formulario esta listo, debe dar click al boton 'Agregar nuevo contacto'.
        - si preguntan como configurar un contacto de emergencia: indica que debe acceder a la pantalla 'Contactos', en ella, bajo los dos botones de la parte superior se puede visualizar una lista de contactos que el usuario añadio a la aplicacion. Cada contacto muestra si este esta seleccionado como contacto de emergencia, esto mediante un interriptor se Sí/No ubicado en la esquina superior derecha de cada contacto. Solo puede existir un contacto de emergencia por lo que al seleccionar un nuevo contacto como contacto de emergencia se deseleccionara el contacto elegido previamente.
        - si preguntan como seleccionar los datos de emergencia a mostrar o vocalizar: indica que debe acceder a la Pantalla 'Configuracion', en ella, debe tocar el boton 'Seleccionar datos', al hacerlo, el usuario accede a una nueva pantalla en la cual puede visualizar sus datos personales o informacion medica. Para seleccionar los datos solo debe tocarlos y el color de su contenedor cambiara. Cuando tenga todos los datos que desea seleccionados debe dar click en el segundo boton se arriba hacia abajo, en la parte superior de la pantalla,antes de los datos, llamado 'Guardar seleccion actual', una vez hecho eso podra ver su eleccion tocanco el primer boton de arriba a abajo llamado 'Mostrar datos seleccionados anteriormente'. cuando el usuario selecciona nuevos datos y guarda esa seleccion, los datos anteriores se deseleccionan. Para ejecutar esta funcion puede hacerlo desde el microfono de la pantalla principal o desde las funciones de la pantalla SOS.
        - en caso de que el usuario ingrese un mensaje incoherente: debes tratar de darle logica a lo que dice el usuario, en caso de no poder solo continua la conversacion segun el contexto.
        Ademas, siempre debes responder segun la funcion solicitada por el usuario y la indicacion especifica de como responder  proporcinada en el content.
        Las interacciones que haz tenido con el usuario hasta ahora son las siguientes, si eso (el historial de la conversacion) no es lo que viene a continuacion, es por que esta es la primera interaccion.`
    }
];

// abrir bd para guardar historial de respuestas
const db = SQLite.openDatabase('adamdb.db');

export async function crearRespuesta(answer) {
    function generarIdUnico() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    return {
        _id: generarIdUnico(),
        text: answer,
        createdAt: new Date(),
        user: {
            _id: 2,
        },
    };
}
export async function generarRespuesta(name_func, answer, prompt) {
    console.log('generando respuesta')
    let respuesta = await crearRespuesta(answer);
    let id = respuesta._id.toString();
    let fec_hor = format(new Date(respuesta.createdAt), 'dd/MM/yyyy - HH:mm');
    let consulta = prompt.toString();
    let contestacion = respuesta.text.toString();
    let rut = await obtenerRut();
    await guardarHistoriarChats(id, fec_hor, name_func, consulta, contestacion, rut);
    return respuesta
}

export async function secondApiCall(prompt, message, function_name, function_response) {
    conversationHistory.push({
        role: 'user',
        content: prompt
    });
    const timeout = (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(`Tiempo agotado después de ${ms} ms`);
            }, ms);
        });
    };

    let retries = 2;
    let intento = 1;
    while (retries > 0) {
        console.log('START 2DA LLAMADA INTENTO: ', intento);
        try {
            const finalres = await Promise.race([
                new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        try {
                            const result = await client.post(chatgptUrl, {
                                model: "gpt-3.5-turbo-0613",
                                messages: [
                                    ...conversationHistory,
                                    message,
                                    {
                                        role: "function",
                                        name: function_name,
                                        content: function_response,
                                    },
                                ]
                            });
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }, 3000); // Espera 5 segundos antes de hacer la llamada a la API
                }),
                timeout(60000) // Agrega un tiempo de espera de 5 segundos
            ]);

            promises.push(finalres);
            console.log("TERMINO 2DA LLAMADA API OPENAI")
            // Añade la respuesta del asistente al historial de la conversación
            conversationHistory.push(finalres.data?.choices[0]?.message);
            //console.log(conversationHistory)
            //console.log(finalres.data?.choices[0]?.message?.content)
            let answer = finalres.data?.choices[0]?.message?.content;
            promises.push(finalres);
            let respuesta = await crearRespuesta(answer);
            console.log("FINAL DE LA CREACION DE LA RESPUESTA")
            promises.push(respuesta);
            const tex3 = JSON.stringify(respuesta)
            //console.log('RESPUESTA CREADA: '+tex3)
            //console.log("PRINT INTENTO: " + respuesta)
            let id = respuesta._id.toString();
            let fec_hor = format(new Date(respuesta.createdAt), 'dd/MM/yyyy - HH:mm');
            let name_func = function_name.toString();
            let consulta = prompt.toString();
            let contestacion = respuesta.text.toString();
            let rut = await obtenerRut()


            //console.log('id: ', id, 'fec_hor: ', fec_hor, )
            if (respuesta) {
                //console.log('********************************************************************')
                //console.log('id: ', id, 'fec_hor: ', fec_hor, 'function name: ',name_func, 'prompt: ', consulta, 'respuesta: ', contestacion, 'rut: ', rut)
                guardarHistoriarChats(id, fec_hor, name_func, consulta, contestacion, rut)
                //console.log('********************************************************************')
            }
            return respuesta;

        } catch (error) {
            if (retries === 0) throw error; // Si se han agotado los intentos, lanza el error
            console.error('Error Message:', error);
            if (error.response) {
                console.error('Response:', {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data
                });
            } else if (error.request) {
                console.error('Request:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            retries--;
            intento++;
        }
    }
}


export async function firstApiCall(prompt) {
    let FechaHoy = new Date()
    console.log('Fecha Hoy: ' + FechaHoy)
    functions.find(func => func.name === 'recordatorio').description = `El usuario solicita crear un recordatorio, tu debes identificar las propiedades de la funcion en el prompt del usuario. Debes saber que el dia de hoy es: ${FechaHoy} ya que lo usaras mas adelante para indicar la fecha del recordatorio, siempre debes retornar la fecha. Tienes que analizar el prompt del usuario y devolver siempre los siguientes parámetros o propiedades obligatorios: Titulo, Fecha, Hora y Dias. Si no se menciona alguna debes seguir las descripciones de cada propiedad para saber como intrepretar el prompt del usuario, bajo niun punto pueden faltar alguna de estas 4 propiedades, siempre las debes encontrar.;`
    functions.find(func => func.name === 'Compartir_Ubicacion').description = `el usuario solicita compartir su ubicacion actual con un contacto , los contactos actuales son ${contactos} , debes reconocer frases como 'Enviale mi ubicacion a', 'comparte mi ubicacion', 'manda mi ubicacion' , 'dile a x donde estoy' o algo similar`;
    functions.find(func => func.name === 'llamar_contacto').description = `el usuario solicita llamar a una persona, debes responder con el nombre de la persona a la cual llamara , es obligatorio mencionar a un contacto para llamar los contactos actuales son ${contactos}`;


    const timeout = (ms) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(`Tiempo agotado después de ${ms} ms`);
            }, ms);
        });
    };

    let retries = 2;
    let intento = 1;
    
    while (retries > 0) {
        console.log('START 1RA LLAMADA INTENTO: ', intento);
        try {
            const res = await Promise.race([
                new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        try {
                            const result = await client.post(chatgptUrl, {
                                model: "gpt-3.5-turbo-0613",
                                messages: [
                                    {
                                        role: 'system',
                                        content: "Segun el prompt proporcionado a continuacion debes identificar que funcion se desea seleccionar y responder segun lo mencionado en el detalle de cada funcion esta ultima parte es estrictamente obligatoria, debes seguir las instrucciones de cada parametro de la funcion seleccionada. "
                                    },
                                    {
                                        role: "user",
                                        content: prompt
                                    },
                                ],
                                functions: functions,
                                function_call: "auto",
                            });
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }, 3000); // Espera 5 segundos antes de hacer la llamada a la API
                }),
                timeout(15000) // Agrega un tiempo de espera de 5 segundos
            ]);

            promises.push(res);
            let message, function_name, args;
            if (res.data?.choices[0]?.message?.function_call?.name) {
                const tex = JSON.stringify(res.data?.choices[0])
                message = res.data?.choices[0]?.message;
                function_name = res.data?.choices[0]?.message?.function_call?.name;
                if (function_name === 'llamar_contacto') {
                    let res_args = res.data?.choices[0]?.message?.function_call?.arguments;
                    let parsedArgs = JSON.parse(res_args);
                    args = parsedArgs["persona a llamar"];
                } else if (function_name === 'llamar_numero') {
                    let res_args = res.data?.choices[0]?.message?.function_call?.arguments;
                    let parsedArgs = JSON.parse(res_args);
                    args = parsedArgs["numero a llamar"];
                } else {
                    args = res.data?.choices[0]?.message?.function_call?.arguments;
                }
            } else {
                function_name = "explicar_algo"
                message = { "role": "assistant", "content": null, "function_call": { "name": "explicar_algo", "arguments": "{}" } }
                args = '{}'
            }

            return { function_name: function_name, args: args, message: message };

        } catch (error) {
            if (retries === 0) throw error; // Si se han agotado los intentos, lanza el error
            console.error(`Error en el intento ${intento}:`, error);
            if (error.response) {
                console.error('Respuesta:', {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data
                });
            } else if (error.request) {
                console.error('Solicitud:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            retries--;
            intento++;
        }
    }
}

