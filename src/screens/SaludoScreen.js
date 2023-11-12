import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { checkUser } from '../api/sqlite';

export default function SaludoScreen() {
    const navigation = useNavigation();
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
        checkUser().then((exists) => setUserExists(exists));
    }, []);

    const handlePress = () => {
        if (userExists) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Principal' }],
            });
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
            });
        }
    }

    return (
        <SafeAreaView className="flex-1 flex justify-around bg-grisClaro">
            {/* title */}
            <View className="space-y-2">
                <Text className="text-center text-4xl font-bold text-rojoIntenso">
                    ADAM
                </Text>
                <Text className="text-center tracking-wider font-semibold text-md text-gris">
                    Tu asistente personal
                </Text>
            </View>
            
            {/* assistant image */}
            <View className="flex">
                <Image className="w-72 h-64 pb-0 self-center fixed"
                    source={require('../../assets/images/logo_ADAM_red.png')}
                />
                <Text className="text-negro text-lg font-semibold italic self-center mx-2 pt-0 relative bottom-10">-Facilitando tu día a día para un envejecimiento feliz-</Text>
            </View>
            

            
            {/* start button */}
            <TouchableOpacity onPress={handlePress} className="bg-celeste mx-5 p-4 rounded-2xl active:bg-azul shadow-lg shadow-negro">
                <Text className="text-rojoIntenso text-center font-semibold text-2xl active:text-azulnegro">
                    Conversemos
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
