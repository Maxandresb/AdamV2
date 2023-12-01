import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {colors} from '../api/theme';




const useTheme = (theme) => {
  return colors[theme.mode];
}


const customChatMessage = (props, theme) => {
  let activeColors = useTheme(theme);
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          minWidth: 100,
          marginBottom: 15,
          marginHorizontal: 10,
          backgroundColor: activeColors.primary,
          shadowColor: 'black',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 14

        },
        left: {
          minWidth: 100,
          marginBottom: 20,
          marginHorizontal: 10,
          backgroundColor: activeColors.quaternary,
          shadowColor: 'black',
          shadowOffset: {width: -2, height: 4},
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 14
        },
      }}
      textStyle={{
        right: {
          color: activeColors.senary,
          fontSize: 17
        },
        left: {
          color: activeColors.quinary,
          fontSize: 17
        },
      }}

      timeTextStyle={{
        right: {
            color: activeColors.senary,
            fontWeight: 'bold',
            fontSize: 13,
            marginTop: 12
          },
        left: {
            color: activeColors.quinary,
            fontWeight: 'bold',
            fontSize: 13,
            marginTop: 12
          },
      }}

    />
  );
};

export default customChatMessage;
