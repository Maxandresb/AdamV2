import react from 'react';
import { View, Icon, Text } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import getStyles from './styles';
import {colors} from './theme';

const useTheme = (theme) => {
  return colors[theme.mode];
}


const CustomSend = (props, theme) => {
  const styles = getStyles(theme);
  let activeColors = useTheme(theme);
  return (
    <Send {...props}
    containerStyle={styles.customSendChat}>
     
      <Text style={styles.customSendButtonText}>Enviar</Text>
  
      
    </Send>
  );
};

export default CustomSend;