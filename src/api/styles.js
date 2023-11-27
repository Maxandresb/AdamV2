import { StyleSheet } from 'react-native';
import {colors} from './theme';
import { useContext } from 'react';
import { ThemeContext } from './themeContext';

/*
import styles from '../api/styles';

<View style={styles.lineaContainer}></View>
<View style={styles.espacioContainer}></View>

*/
const useTheme = (theme) => {
    return colors[theme.mode];
}

const getStyles = (theme) => {
    //const {theme} = useContext(ThemeContext);
    let activeColors = useTheme(theme);

    return StyleSheet.create({
        msjContainer:{
            width: 320,
            backgroundColor: activeColors.secondary,
            color: '#cceaf5',
            padding: 10,
            borderRadius: 10,
            margin: 4,
            shadowColor: '#000000',
            shadowOffset: {width: -2, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 8
        },
        encabezadoInput: {
            marginBottom: 5,
            color: '#cceaf5',
            fontSize: 18,
            flex: 1,
            textAlign: 'left',
            paddingBottom: 5
        },
        encabezadoOutput: {
            marginBottom: 5,
            color: '#cceaf5',
            fontSize: 18,
            flex: 1,
            textAlign: 'right',
            paddingBottom: 5,
        },
        inputTexto: {
            color: activeColors.quinary,
            backgroundColor: activeColors.secondary,
            paddingLeft: 18,
            paddingTop: 10,
            textAlign: 'left',
            fontWeight: 'bold',
            flex: 1
        },
        outputTexto: {
            marginBottom: 20,
            color: '#efefef',
            paddingRight: 18,
            paddingTop: 10,
            flex: 1,
            textAlign: 'right',
        },
        //-----------
        encabezadoInicial: {
            marginTop: 15,
            color: "#fa614f",
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            paddingTop: 10
        },
        input: {
            height: 45,
            borderBottomColor: activeColors.quinary,
            backgroundColor: activeColors.secondary,
            borderBottomWidth: 2,
            borderRadius: 5,
            marginBottom: 10,
            color: activeColors.quinary,
            fontWeight: 'bold',
            paddingLeft: 18,
            shadowColor: '#000000',
            shadowOffset: {width: -2, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 8,
            
        },
        encabezado: {
            marginTop: 0,
            color: "#fa614f",
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            paddingTop: 10
        },
        content: {
            height: 40,
            borderWidth: 0,
            marginBottom: 0,
            color: '#000000',
            paddingLeft: 3,
            paddingTop: 10
        },
        //-----------
        buttonContainer: {
            marginTop: 20,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        celesteButton: {
            backgroundColor: '#cceaf5',
            padding: 18,
            borderRadius: 5,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        primaryButton: {
            backgroundColor: activeColors.primary,
            padding: 18,
            borderRadius: 5,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        buttonText: {
            color: '#cceaf5',
            fontWeight: 'bold',
            textAlign: 'center'
    
        },
        buttonText2: {
            color: '#ff3e45',
            fontWeight: 'bold',
            textAlign: 'center'
    
        },
        deleteButton: {
            backgroundColor: '#cceaf5',
            borderRadius: 5,
            padding: 18,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
    
        },
        lineaContainer3: {
            borderBottomColor: 'a9a9a9',
            borderBottomWidth: 1,
            marginTop: 10,
            backgroundColor: '#a9a9a9'
        },
    
        content2: {
            color: '#cceaf5',
            backgroundColor: '#a9a9a9',
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 10,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
    
        },
    
        content3: {
            color: '#ff3e45'
        },
    
        deleteButtonText: {
            color: '#96b9f3',
            fontWeight: 'bold',
            textAlign: 'center',
            
        },
    
        lineaContainer: {
            borderBottomColor: '#a9a9a9',
            borderBottomWidth: 1,
            marginTop: 20,
            marginBottom: 20,
        },
        lineaContainer2: {
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            margin: 10,
    
        },
        espacioContainer: {
            borderBottomColor: '#a9a9a9', //gris
            borderBottomWidth: 1,
            marginTop: 10,
            paddingTop: 10,
            marginBottom: 10
        },
        //-----------
        container: {
            flex: 1,
            backgroundColor: activeColors.quaternary,
            padding: 20,
        },
        container2: {
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: 30,
            paddingBottom: 30,
    
        },
    
        containerDatosSeleccionados: {
            backgroundColor: '#a9a9a9'
        },
    
        scrollDatosVocalizar: {
            height: '100%',
            backgroundColor: '#efefef'
        },
    
        containerDatosVocalizar: {
            flex: 1,
            backgroundColor: '#efefef',
            padding: 30,
            height: '100%'
        },
    
        buttoningresar: {
            backgroundColor: 'green',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10
        },
        //-----------
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            paddingVertical: '18%',
            paddingVertical: 100
    
        },
        modalView: {
            backgroundColor: activeColors.quaternary,
            padding: 20,
            borderRadius: 10,
            width: '90%'
        },
        header: {
            color: activeColors.primary,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10
        },
        buttonContainerCenter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignSelf: 'center',
            marginTop: 15,
        },
    
        closeButton: {
            backgroundColor: activeColors.secondary,
            margin: 2.5,
            padding: 18,
            justifyContent: 'center',
            borderRadius: 5,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        grisButton: {
            backgroundColor: '#a9a9a9',
            margin: 2.5,
            padding: 10,
            justifyContent: 'center',
            borderRadius: 5,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        //-----------
        inputPicker: {
            height: 45,
            backgroundColor: activeColors.secondary,
            borderBlockColor: activeColors.quinary,
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 10,
            justifyContent: 'center',
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            color: activeColors.quinary
        },
    
        pickerItem: {
            color: "#96b9f3",
            backgroundColor: "#fa614f",
        },
    
        inputfecha: {
            height: 45,
            backgroundColor: activeColors.secondary,
            borderEndColor: activeColors.quinary,
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 10,
            color: activeColors.quinary,
            paddingLeft: 18,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
        },
        inputPicker2: {
            height: 20,
            borderBlockEndColor: 'black',
            borderBlockEndWidth: 1,
            marginBottom: 20,
            color: '#000000',
            alignItems: 'center',
            textAlignments: 0,
            itemStyle: { height: 10},
            paddingLeft: 0,
        },
        buttonCInsert: {
            width: '50%',
            alignSelf: 'flex-end',
            marginBottom: 30,
        },
        titulo: {
            marginBottom: 10,
            color: 'black',
            fontSize: 24,
            textAlign: 'center'
        },
        viewStyle: {
            marginTop: 0,
        },
        messageBox: {
            backgroundColor: '#DDDDDD',
            padding: 10,
            marginBottom: 10,
        },
        //------------ recordatorio:
    
        item: {
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
        },
        emptyDate: {
            height: 15,
            flex: 1,
            paddingTop: 30
        },
        tabnavigator: {
            backgroundColor: "#fa614f"
        },
    
        rojoIntensoText: {
            color: '#ff3e45',
            textAlign: 'center',
            fontWeight: 'bold'
        },
    
        celesteText: {
            color: '#cceaf5',
            textAlign: 'center',
            fontWeight: 'bold'
        },
    
        negroText: {
            color: '#000000',
            textAlign: 'center',
            fontWeight: 'bold'
        },
    
        alertFondo: {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            paddingHorizontal: 40,
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
    
        alertContainer: {
            backgroundColor: activeColors.primary,
            padding: 15,
            borderRadius: 15,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
        },
    
        alertButton: {
            flexDirection: "row",
            minwidth: 120,
            paddingVertical: 15,
            marginTop: 10,
            backgroundColor: activeColors.primary,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            borderRadius: 10,
            justifyContent: 'center',
            alignSelf: 'center'
        },

        alertCloseButton: {
            flexDirection: "row",
            width: 120,
            paddingVertical: 15,
            marginTop: 10,
            backgroundColor: activeColors.secondary,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            borderRadius: 10,
            justifyContent: 'center',
            alignSelf: 'center'
        },
    
        alertText: {
            color: activeColors.secondary,
            marginBottom: 40,
            fontSize: 24,
            alignSelf: 'center',
            fontWeight: 'bold'
        },
    
        alertButtonText: {
            color: activeColors.secondary,
            fontSize: 15,
            fontWeight: 'bold',
            marginHorizontal: 10
        },

        alertCloseButtonText: {
            color: activeColors.primary,
            fontSize: 15,
            fontWeight: 'bold'
        },
    
        recordatorioContainer: {
            backgroundColor: "#fa614f"
        },
    
        customSendChat: {
            backgroundColor: activeColors.quinary,
            width: 60,
            height: 35,
            alignSelf: 'center',
            borderRadius: 8,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            
            
        },
    
        customSendButtonText: {
            color: activeColors.secondary,
            fontWeight: 'bold',
            alignSelf: 'center',
            textAlign: 'center',
            marginBottom: 9
        },
    
        verticalButtonsContainer: {
            width: '100%',
            marginTop: 15,
        },
    
        textContainer: {
            backgroundColor: '#cceaf5' //celeste
        },
    
        rowPerfil2: {
            backgroundColor: '#ff3e45', //rojoIntenso
            borderRadius: 10,
            
        },
    
        buttonPerfil: {
            backgroundColor: '#ff3e45',
            borderRadius: 15,
            height: 35,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            justifyContent: 'center',
            marginTop: 12
            
        },
    
        buttonTextPerfil: {
            color: '#cceaf5', //celeste
            alignSelf: 'center',
            
        },
        selectedText: {
            color: '#cceaf5',
            backgroundColor: '#cceaf5',
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 10,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
    
        },
    
        changeThemeColorButton: {
            weight: 224,
            height: 48,
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: activeColors.primary,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
    
        },

        isActiveChangeThemeButton: {
            weight: 224,
            height: 48,
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: activeColors.tertiary,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },

        cardButton: {
            width: 150,
            height: 200 ,
            justifyContent: 'center',
            borderRadius: 8,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            backgroundColor: activeColors.primary

        },

        primaryText: {
            color: activeColors.primary,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            lineHeight: 28,
            paddingHorizontal: 10
            
        },

        secondaryText: {
            color: activeColors.secondary,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            lineHeight: 28,
            paddingHorizontal: 10
            
        },

        saludoHeader: {
            textAlign: 'center',
            fontSize: 36,
            fontWeight: 'bold',
            color: activeColors.primary
        },

        saludoSubHeader: {
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 16,
            color: activeColors.tertiary

        },

        saludoLema: {
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginHorizontal: 8,
            paddingTop: 0,
            fontStyle: 'italic',
            position: 'relative',
            bottom: 40
        },

        mensajeProcesamiento: {
            backgroundColor: activeColors.quinary,
            color: activeColors.senary,
            textAlign: 'center',
            borderRadius: 9999,
            marginVertical: 8,
            paddingVertical: 8,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5

        },

        iniciarGrabacionButton: {
            backgroundColor: activeColors.secondary,
            width: 80,
            height: 80,
            marginVertical: 12,
            borderRadius: 9999,
            justifyContent: 'center',
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5

        },

        detenerGrabacionButton: {
            backgroundColor: activeColors.primary,
            width: 80,
            height: 80,
            marginVertical: 12,
            borderRadius: 9999,
            justifyContent: 'center',
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },

        formErrorText: {
            color: 'red',
            textAlign: 'left',
            fontSize: 14,
            marginBottom: 20
        }
    
    })
};

export default getStyles;