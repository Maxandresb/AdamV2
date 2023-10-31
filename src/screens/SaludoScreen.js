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
        <SafeAreaView className="flex-1 flex justify-around bg-white">
            {/* title */}
            <View className="space-y-2">
                <Text style={{fontSize: wp(10)}} className="text-center font-bold text-gray-700">
                    ADAM
                </Text>
                <Text style={{fontSize: wp(4)}} className="text-center tracking-wider font-semibold text-gray-600">
                    Tu asistente personal
                </Text>
            </View>
            
            {/* assistant image */}
            <View className="flex-row justify-center">
                <Image  
                    source={require('../../assets/images/iron-adam.png')}
                    style={{height: wp(75), width: wp(75)}}
                />
            </View>
            
            {/* start button */}
            <TouchableOpacity onPress={handlePress} className="bg-emerald-600 mx-5 p-4 rounded-2xl">
                <Text style={{fontSize: wp(6)}} className="text-center font-bold text-white">
                    Conversemos
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
