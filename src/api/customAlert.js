import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '../api/styles';

const CustomAlert = ({ isVisible, onClose, message }) => (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text style={{ fontSize: 23, color: 'black' }}>{message}</Text>
                <View style={styles.espacioContainer}></View >
                <View style={{ alignSelf: 'flex-end', flexDirection: 'row', borderBottomColor: 'green', borderBottomWidth: 4, }}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{  fontSize: 20, textAlign: 'right', marginTop: 10 }}>Cerrar</Text>
                    </TouchableOpacity>
                </View >
            </View>
        </View>
    </Modal>
);

export default CustomAlert;

/*
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';


const [isAlertVisible, setAlertVisible] = useState(false);

setAlertVisible(true);

<CustomAlert
    isVisible={isAlertVisible}
    onClose={() => setAlertVisible(false)}
    message=''
/>  
*/