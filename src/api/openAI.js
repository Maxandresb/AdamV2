//import {OPENAI_API_KEY} from '@env';
import axios from 'axios';
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const client = axios.create({
    headers: {
        "Authorization": "Bearer "+ apiKey,
        "Content-Type": "application/json"
    }
})

const chatgptUrl = 'https://api.openai.com/v1/chat/completions';
const dalleUrl = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt)=>{
    
    // // Logic 1 : this will check the prompt from chatgpt if user wants to create an image
    
try{
    console.log(prompt)
    console.log('****obteniendo respuesta******')
    const res = await client.post(chatgptUrl, {
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'system',
            content: ` Eres un asistente que analiza el siguente prompt y define que funcion corresponde  usarse , solo responde el numero, nada mas, una respuesta de 1 caracter: 
             1.Respuesta general , 2. crear imagen, 3.ver clima.
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

    }catch(err){
        console.log('error: ',err);
        return Promise.resolve({success: false, msg: err.message});
    }

    // // Logic 2 : sometimes chatgpt does not understand the art messages but thats fine, you can use this approach :)

    // prompt = prompt.toLowerCase();
    // let isArt = prompt.includes('image') || prompt.includes('sketch') || prompt.includes('art') || prompt.includes('picture') || prompt.includes('drawing');
    // if(isArt){
    //     console.log('dalle api call');
    //     return dalleApiCall(prompt, messages)
    // }else{
    //     console.log('chatgpt api call')
    //     return chatgptApiCall(prompt, messages);
    // }
    
}

const chatgptApiCall = async (prompt)=>{
    try{
        const res = await client.post(chatgptUrl, {
            model: "gpt-3.5-turbo",
            messages:[{
                role: "system",
                content:
                  "Eres un asistente virtual llamado adam, pensado para adultos mayores, responde preguntas medicas pero recordando que no eres un experto y recomiendas ver un profesional para tener mayor claridad",
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
