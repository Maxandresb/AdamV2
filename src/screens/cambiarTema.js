import {React, useContext, useEffect, useState} from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';

export default function CambiarTema() {
    const {theme, updateTheme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];
    console.log('************************************' + theme.mode)


    const [isActive, setIsActive] = useState(theme.mode === 'default');


    useEffect(() => {
       
    }, []);

    const onPress = () => {
        updateTheme(theme.mode);
        setIsActive((previousState) => !previousState);
        
        
    };
    console.log( "COLOR ACTIVO ---> "+ activeColors['primary']);
    return (

        <View className='w-full h-full' style={{backgroundColor: activeColors.quaternary}}>
            <View className="p-5 mx-5 mt-3 rounded-lg shadow-lg shadow-negro" style={{backgroundColor: activeColors.secondary}}>
                <View className='flex'>
                    {Object.keys(colors).map(c => {
                        return (
                            <TouchableOpacity key={c} className="w-56 h-12 my-2 justify-center self-center rounded-lg" isActive={theme.mode === c} onPress={() => updateTheme({mode: c})} style={[styles.changeThemeColorButton, theme.mode === c ? styles.isActiveChangeThemeButton : null,]}>
                                <Text key={c} className="text-center font-bold" style={{color: activeColors.secondary}}>{colors[c]['label']}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
        </View>
        
    )
}