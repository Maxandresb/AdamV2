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
        <SafeAreaView className="flex-1 flex justify-around bg-damasco">
            {/* title */}
            <View className="space-y-2">
                <Text className="text-center text-4xl font-bold text-redcoral">
                    ADAM
                </Text>
                <Text className="text-center tracking-wider font-semibold text-md text-salmon">
                    Tu asistente personal
                </Text>
            </View>
            
            {/* assistant image */}
            <View className="flex-row justify-center">
                <Image className="w-72 h-64"
                    source={require('../../assets/images/logo_inicio_ADAM.png')}
                />
            </View>
            
            {/* start button */}
            <TouchableOpacity onPress={handlePress} className="bg-redcoral mx-5 p-4 rounded-2xl active:bg-azul">
                <Text className="text-damasco text-center font-semibold text-2xl active:text-azulnegro">
                    Conversemos
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
