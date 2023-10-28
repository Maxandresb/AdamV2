import React, { useRef } from 'react';
import { Pressable, Text, Animated, TouchableOpacity, View } from 'react-native';

const CheckBoxRapido = React.memo(({ isChecked, onCheck, title }) => {
    return (
        <Pressable onPress={onCheck} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'black', backgroundColor: isChecked ? 'palegreen' : 'transparent', padding: 10 }}>
            <Text style={{ color: 'black', fontSize: 18 }}>{title}</Text>
        </Pressable>
    );
});

export {CheckBoxRapido};
