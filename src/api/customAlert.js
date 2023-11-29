import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import getStyles from '../api/styles';
import { useContext } from 'react';
import { ThemeContext } from '../api/themeContext';

const CustomAlert = ({ isVisible, onClose, message }) => {
    const {theme} = useContext(ThemeContext);
    let styles = getStyles(theme)

    return (
        <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.alertFondo}>
                <View style={styles.alertContainer}>
                    <Text style={styles.alertText}>{message}</Text>
                    <TouchableOpacity onPress={onClose}>
                    <View style={styles.closeButton}>
                        <Text style={styles.primaryText}>Cerrar</Text>
                    </View >
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

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