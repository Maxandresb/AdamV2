import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const customChatMessage = props => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          marginBottom: 15,
          marginHorizontal: 10,
          backgroundColor: '#ff3e45',
          shadowColor: 'black',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 14

        },
        left: {
          marginBottom: 20,
          marginHorizontal: 10,
          backgroundColor: '#efefef',
          shadowColor: 'black',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 14
        },
      }}
      textStyle={{
        right: {
          color: '#ffffff',
          fontSize: 17
        },
        left: {
          color: '#000000',
          fontSize: 17
        },
      }}

      timeTextStyle={{
        right: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 13,
            marginTop: 12
          },
        left: {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 13,
            marginTop: 12
          },
      }}

    />
  );
};

export default customChatMessage;
