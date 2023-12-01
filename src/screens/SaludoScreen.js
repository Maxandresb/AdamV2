import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { checkUser } from '../api/sqlite';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';

export default function SaludoScreen() {
    const navigation = useNavigation();
    const [userExists, setUserExists] = useState(false);
    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

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
        <SafeAreaView className="flex-1 justify-around" style={styles.container}>
            {/* title */}
            <View className="space-y-2">
                <Text style={styles.saludoHeader}>
                    ADAM
                </Text>
                <Text style={styles.saludoSubHeader}>
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
            <TouchableOpacity onPress={handlePress} style={styles.closeButton}>
                <Text style={styles.primaryText}>
                    Conversemos
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
