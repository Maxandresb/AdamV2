import { Audio } from "expo-av";
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import { guardarHistoriarChats} from "../api/sqlite";
import { format } from 'date-fns';


const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
    headers: {
        "Authorization": "Bearer "+ apiKey,
        "Content-Type": "application/json"
    }
})
const whispcli = axios.create({
    headers: {
        "Authorization": "Bearer "+ apiKey,
        "Content-Type": "multipart/form-data"
    }
})
const whisperUrl='https://api.openai.com/v1/audio/transcriptions';
const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const whisperCall = async (formData) =>{
    
    try {
        const res = await whispcli.post(whisperUrl,formData);
        console.log(res.data?.text)
        return res.data?.text
    }catch(err){
        console.log('error: ',err);
        if(err && err.msg){
            return Promise.resolve({success: false, msg: err.msg});
        } else if (err && err.message) {
            return Promise.resolve({success: false, msg: err.message});
        } else {
            return Promise.resolve({success: false, msg: "An unknown error occurred"});
        }
    }
}

let message;
let function_name;
let args;
let function_response;
let promises = [];


const functions = [
    {
        "name": "hola",
        "description": "Responder un saludo, debes saludar cordialmente en lenguaje natural con una formalidad intermedia cuando te digan 'hola' o un '¿como estas?' o '¿que tal hoy?'. ten en cuenta que eres un asistente virtual llamada SARA.",
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
        "description": "el usuario solicita llamar a una persona, debes identificar el nombre de la persona",
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
        "name": "contactos",
        "description": "el usuario solicita contactos",
        "parameters": {
            "type": "object",
            "properties": {
                "llamar": {
                    "type": "string",
                    "description": "indica que se quiere contactos",
                }
            }
        }
    },
    {
        "name": "base_de_datos",
        "description": "el usuario solicita base de datos",
        "parameters": {
            "type": "object",
            "properties": {
                "llamar": {
                    "type": "string",
                    "description": "indica que se quiere base de datos",
                }
            }
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

export async function secondApiCall(prompt, message, function_name, function_response) {
    console.log('START 2DA LLAMADA');
    conversationHistory.push({
        role: 'user',
        content: prompt
    });
    try {
        const finalres = await client.post(chatgptUrl, {
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
            })
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
        let id= respuesta._id.toString();
        let fec_hor = format(new Date(respuesta.createdAt), 'dd/MM/yyyy - HH:mm');
        let name_func= function_name.toString();
        let consulta= prompt.toString();
        let contestacion= respuesta.text.toString();
        let rut= 195953171


        //console.log('id: ', id, 'fec_hor: ', fec_hor, )
        if (respuesta){
            //console.log('********************************************************************')
            //console.log('id: ', id, 'fec_hor: ', fec_hor, 'function name: ',name_func, 'prompt: ', consulta, 'respuesta: ', contestacion, 'rut: ', rut)
            guardarHistoriarChats(id, fec_hor, name_func, consulta, contestacion, rut)
            //console.log('********************************************************************')
        }
        

        return respuesta;       
    } catch (error) {
        console.error(error);
    }
}


export async function firstApiCall(prompt) {
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo-0613",
            messages: [
                {
                    role: 'system',
                    content: "Eres un asistente, tus funciones son: responder preguntas especificas, conversar sobre diversos temas y realizar funciones solicitadas. "
                },
                {
                    role: "user", 
                    content: prompt},
            ],
            functions: functions,
            function_call: "auto",
       
        });
        promises.push(res);
        let message, function_name, args;
        if(res.data?.choices[0]?.message?.function_call?.name){
            const tex = JSON.stringify(res.data?.choices[0])
            //console.log('CHOICES: '+tex)
            const tex2 = JSON.stringify(res.data?.choices[0]?.message)
            console.log('MENSAJE: '+tex2)
            message = res.data?.choices[0]?.message;
            function_name = res.data?.choices[0]?.message?.function_call?.name;
            console.log('function_name: ' + function_name)
            args = res.data?.choices[0]?.message?.function_call?.arguments;
            console.log('args: ' + args)
        }else{
            function_name="funcion_extra"
            message={"role":"assistant","content":null,"function_call":{"name":"funcion_extra","arguments":"{}"}}
            args='{}'
        }

        return { function_name: function_name, args: args, message: message };

    } catch (error) {
        console.error(error);
    }
}



