import React, { useRef } from 'react';
import { Pressable, Text, Animated, TouchableOpacity, View } from 'react-native';

const CheckBoxRapido = React.memo(({ isChecked, onCheck, title }) => {
    return (
        <Pressable onPress={onCheck} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#fad9a0', backgroundColor: isChecked ? '#233050' : 'transparent', padding: 10}}>
            <Text style={{ color: '#fad9a0', fontSize: 18 }}>{title}</Text>
        </Pressable>
    );
});

export {CheckBoxRapido};
