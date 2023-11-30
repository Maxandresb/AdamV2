import React, { useRef } from 'react';
import { Pressable, Text, Animated, TouchableOpacity, View } from 'react-native';

const CheckBoxRapido = React.memo(({ isChecked, onCheck, title }) => {
    return (
        <Pressable onPress={onCheck} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#a9a9a9', backgroundColor: isChecked ? '#cceaf5' : 'transparent', padding: 10}}>
            <Text style={{ color: '#ff3e45', fontSize: 18 }}>{title}</Text>
        </Pressable>
    );
});

export {CheckBoxRapido};
