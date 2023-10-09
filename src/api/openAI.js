import { Audio } from "expo-av";
import axios from 'axios';

import { addDoc, collection } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";


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
    } catch (err) {
        console.log(err)
    }

}

export const apiCall = async (prompt)=>{
    
    ////  Logica 1 : analizar el texto devuelto, determinar que funcion debe ejecutarse segun lo que el usuario pida.
    
try{
    console.log(prompt)
    console.log('****obteniendo respuesta******')
    const res = await client.post(chatgptUrl, {
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'system',
            content: ` Eres un asistente que analiza el siguente prompt y define que funcion corresponde  usarse , solo responde el numero, nada mas, una respuesta de 1 caracter: 
             1.Respuesta general , 2. crear imagen, 3.ver clima. , 4.Añadir recordatorio
            El promt es el siguiente
             ${prompt}  .`
        }],
       
    });
    console.log('********funcion a usar**********')
    console.log(res.data?.choices[0]?.message?.content)
    funcionUsar = res.data?.choices[0]?.message?.content;
    funcionUsar = funcionUsar.trim();
    if(funcionUsar.toLowerCase().includes('1')){
        console.log('chatgpt api call');
        //return dalleApiCall(prompt)
        return chatgptApiCall(prompt);
    }else if(funcionUsar.toLowerCase().includes('2')){
        console.log('dalle api call')
        return chatgptApiCall(prompt);
         //return dalleApiCall(prompt)
    }
    else if(funcionUsar.toLowerCase().includes('3')){
    console.log('dalle api call')
    return chatgptApiCall(prompt);
     //return dalleApiCall(prompt)
}

else if(funcionUsar.toLowerCase().includes('4')){
    console.log('Recordatorio')
    return recordatorioApiCall(prompt);
     //return dalleApiCall(prompt)
}
    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }

    
}

const chatgptApiCall = async (prompt)=>{
    try{
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages:[{
                role: "system",
                content:
                  "Eres un asistente virtual llamado adam, pensado para adultos mayores, responde preguntas medicas pero recordando que no eres un experto y recomiendas ver un profesional para tener mayor claridad, responde en menos de 100 palabras",
              },
              { role: "user", content: `${prompt}` },],
              max_tokens:200,
        })

        let answer = res.data?.choices[0]?.message?.content;
        const respuesta={_id: new Date().getTime() + 1,
            text: answer,
            createdAt: new Date(),
            user: {
              _id: 2,
              
            },};
        // console.log('got chat response', answer);
        return Promise.resolve({success: true, data: respuesta}); 

    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

const dalleApiCall = async (prompt)=>{
    try{
        const res = await client.post(dalleUrl, {
            prompt,
            n: 1,
            size: "512x512"
        })

        let url = res?.data?.data[0]?.url;
        // console.log('got image url: ',url);
        messages.push({role: 'assistant', content: url});
        return Promise.resolve({success: true, data: messages});

    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }
}

const recordatorioApiCall = async(prompt) =>{
    try {
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages:[{
                role: "system",
                content:
                  "Responde solo en formato Json, nada mas, divide el prompt del usuario en un json que se usara para generar un recordatorio {titulo:valor, hora: valor formato 24hrs, periodicidad: (lunes-viernes o diario o dias mencionados) , tipo:(medico o general)}",
              },
              { role: "user", content: `${prompt}` },],
              max_tokens:200,
        })
        let answer = res.data?.choices[0]?.message?.content;
        const respuesta={_id: new Date().getTime() + 1,
            text: answer,
            createdAt: new Date(),
            user: {
              _id: 2,
              
            },};

            //rO5RqC1R84d67ZDciPD4

            guardarRecordatorio(answer)
        return Promise.resolve({success: true, data: respuesta}); 
    } catch (error) {
        return Promise.resolve({success: false, data: error});
    }
}

const guardarRecordatorio= async (answer)=>{
   try {
    let recordatorio = JSON.parse(answer)
    console.log('Intentando guardar')
    let time= new Date(recordatorio.hora)
    console.log(recordatorio.hora)
    console.log(time)


    await addDoc(collection(FIREBASE_DB,'Recordatorios'), {id:'rO5RqC1R84d67ZDciPD4', tipo:recordatorio.tipo, titulo:recordatorio.titulo, hora:recordatorio.hora, periodicidad:recordatorio.periodicidad, activo:true});
    console.log(' guardado')

   } catch (error) {
    console.log(error)
   } 
   
}