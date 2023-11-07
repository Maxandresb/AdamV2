import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '../api/styles';

const CustomAlert = ({ isVisible, onClose, message }) => (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
        <View style={styles.alertFondo}>
            <View style={styles.alertContainer}>
                <Text style={styles.alertText}>{message}</Text>
                <TouchableOpacity onPress={onClose}>
                <View style={styles.alertButton}>
                    <Text style={styles.alertButtonText}>Cerrar</Text>
                </View >
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

export default CustomAlert;

/*
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';

style={{  fontSize: 20, textAlign: 'right', marginTop: 10 }}
const [isAlertVisible, setAlertVisible] = useState(false);

setAlertVisible(true);

<CustomAlert
    isVisible={isAlertVisible}
    onClose={() => setAlertVisible(false)}
    message=''
/>  
*/