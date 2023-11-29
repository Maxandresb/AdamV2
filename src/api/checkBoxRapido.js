import React, { useRef, useContext } from 'react';
import { Pressable, Text, Animated, TouchableOpacity, View } from 'react-native';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';

const CheckBoxRapido = React.memo(({ isChecked, onCheck, title }) => {
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    return (
        <Pressable onPress={onCheck} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: activeColors.tertiary, backgroundColor: isChecked ? activeColors.secondary : 'transparent', padding: 10}}>
            <Text style={{ color: activeColors.primary, fontSize: 18 }}>{title}</Text>
        </Pressable>
    );
});

export {CheckBoxRapido};
