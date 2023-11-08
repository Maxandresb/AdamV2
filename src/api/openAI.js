import { Audio } from "expo-av";
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import { guardarHistoriarChats, obtenerRut } from "../api/sqlite";
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
var FechaHoy = new Date()
//console.log('Fecha Hoy: ' + FechaHoy)

const functions = [
    {
        "name": "hola",
        "description": "Responder un saludo, debes saludar cordialmente en lenguaje natural con una formalidad intermedia cuando te digan 'hola' o un '¿como estas?' o '¿que tal hoy?'. ten en cuenta que eres un asistente virtual llamado ADAM, si te preguntan el nombre eso debes responder.",
        "parameters": {
            "type": "object",
            "properties": {
                "saludo": {
                    "type": "string",
                    "description": "El saludo recibido, puede ser 'hola', '¿como estas?' o '¿que tal hoy?'",
                },
            },
            "required": ["saludo"],
        }
    },
    {
        "name": "explicar_algo",
        "description": "Explica un tema solicitado de manera comprensible.",
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
        "name": "funcion_extra",
        "description": "responde cordial y brevemente lo solicitado",
        "parameters": {
            "type": "object",
            "properties": {
                "contenido": {
                    "type": "string",
                    "description": "contenido o tema que compone la conversacion",
                },
            }
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
        "description": "el usuario solicita llamar a una persona, debes responder con el nombre de la persona a la cual llamara",
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
        "description": "el usuario solicita conocer el clima o informacion relacionada a este, infomracion que pueda entregrar openweathermap, de una zona tipo cuidad pais .Hoy ,mañana,ayer no son ubicaciones ",
        "parameters": {
            "type": "object",
            "properties": {
                "Locacion": {
                    "type": "string",
                    "description": " responde solo en español, indica la ubicacion real  sobre la cual el usuario quiere conocer el clima, hoy ,mañana,ayer no son ubicaciones, solo ubicaciones nada mas ni dias ni tiempo ni otros parametros idealmente ubicaciones tipo (ciudad pais), a menos que exista explicito la locacion responde: No definido",
                }
            }
        }
    }

];

let conversationHistory = [
    {
        role: 'system',
        content: "Eres un asistente, tus funciones son: responder preguntas especificas, conversar sobre diversos temas y realizar funciones solicitadas"
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
    console.log('START 2DA LLAMADA');
    conversationHistory.push({
        role: 'user',
        content: prompt
    });
    let retries = 2;
    while (retries > 0) {
        try {
            const finalres = await new Promise((resolve, reject) => {
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
                }, 7000); // Espera 5 segundos antes de hacer la llamada a la API
            });
            // Si la promesa se resuelve con éxito, procesa la respuesta y sale del bucle
            // Procesa tu respuesta aquí...
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
            console.error('Error Message:', error.message);
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
        }
    }
}

export async function firstApiCall(prompt) {
    var FechaHoy = new Date()
    console.log('Fecha Hoy: ' + FechaHoy)
    let retries = 2;
    while (retries > 0) {
        try {
            const res = await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const result = await client.post(chatgptUrl, {
                            model: "gpt-3.5-turbo-0613",
                            messages: [
                                {
                                    role: 'system',
                                    content: "Eres un asistente, tus funciones son: responder preguntas especificas, conversar sobre diversos temas y realizar funciones solicitadas. "
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
                }, 5000); // Espera 5 segundos antes de hacer la llamada a la API
            });
            // Si la promesa se resuelve con éxito, procesa la respuesta y sale del bucle
            // Procesa tu respuesta aquí...
            promises.push(res);
            let message, function_name, args;
            if (res.data?.choices[0]?.message?.function_call?.name) {
                const tex = JSON.stringify(res.data?.choices[0])
                //console.log('CHOICES: '+tex)
                //const tex2 = JSON.stringify(res.data?.choices[0]?.message)
                //console.log('MENSAJE: ' + tex2)
                message = res.data?.choices[0]?.message;
                function_name = res.data?.choices[0]?.message?.function_call?.name;
                //console.log('function_name: ' + function_name)
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
                //console.log('args: ' + args)
            } else {
                function_name = "funcion_extra"
                message = { "role": "assistant", "content": null, "function_call": { "name": "funcion_extra", "arguments": "{}" } }
                args = '{}'
            }

            return { function_name: function_name, args: args, message: message };

        } catch (error) {
            if (retries === 0) throw error; // Si se han agotado los intentos, lanza el error
            console.error('Error Message:', error.message);
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

        }
    }
}


