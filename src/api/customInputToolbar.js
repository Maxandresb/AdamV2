import react from 'react';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat'

const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#ffffff",
          borderRadius: 15,
          paddingHorizontal: 5,
          marginTop: 3,
          shadowColor: 'black',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5,
        }}
      />
    );
  };

  export default customtInputToolbar;