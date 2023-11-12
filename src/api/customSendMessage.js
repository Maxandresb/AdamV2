import react from 'react';
import { View, Icon, Text } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import styles from './styles';

const CustomSend = props => {
  return (
    <Send {...props}
    containerStyle={styles.customSendChat}>
     
      <Text style={{color:"#cceaf5", textAlign: 'center', alignSelf: 'center', marginBottom: 8}}>Enviar</Text>
  
      
    </Send>
  );
};

export default CustomSend;