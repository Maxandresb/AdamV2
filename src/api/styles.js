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
    let activeColors = useTheme(theme);

    return StyleSheet.create({
        msjContainer: {
            backgroundColor: activeColors.secondary,
            color: activeColors.tertiary,
            padding: 10,
            borderRadius: 10,
            margin: 4,
            shadowColor: '#000000',
            shadowOffset: { width: -2, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 8
        },
        encabezadoInput: {
            marginBottom: 5,
            color: activeColors.primary,
            fontSize: 18,
            flex: 1,
            textAlign: 'left',
            paddingBottom: 5
        },
        encabezadoOutput: {
            marginBottom: 5,
            color: activeColors.tertiary,
            fontSize: 18,
            flex: 1,
            textAlign: 'right',
            paddingBottom: 5,
        },
        inputTexto: {
            marginBottom: 20,
            color: activeColors.primary,
            paddingLeft: 18,
            paddingTop: 10,
            flex: 1,
            textAlign: 'left',
        },
        outputTexto: {
            marginBottom: 20,
            color: activeColors.tertiary,
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
            color: '#000000',
            fontWeight: 'bold',
            paddingLeft: 18,
            shadowColor: '#000000',
            shadowOffset: { width: -2, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 8
        },
        encabezado: {
            marginTop: 0,
            color: activeColors.primary,
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
            paddingTop: 10
        },
        content: {
            height: 40,
            borderWidth: 0,
            marginBottom: 0,
            color: activeColors.tertiary,
            fontSize: 16,
            paddingLeft: 3,
            paddingTop: 10
        },

        userDataContent: {
            marginBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: activeColors.tertiary,
            borderStyle: 'dashed',
            paddingBottom: 8,
            color: activeColors.tertiary,
            fontWeight: '600',
            marginTop: 8
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
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        rojoIntensoButton: {
            backgroundColor: '#ff3e45',
            padding: 18,
            borderRadius: 5,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        buttonText: {
            color: activeColors.secondary,
            fontWeight: 'bold',
            textAlign: 'center'
    
        },
        buttonText2: {
            color: activeColors.primary,
            fontWeight: 'bold',
            textAlign: 'center'
    
        },
        deleteButton: {
            backgroundColor: activeColors.secondary,
            borderRadius: 5,
            padding: 18,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
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
            color: activeColors.tertiary,
            //backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 10,
           
    
        },
    
        content4: {
            backgroundColor: activeColors.quaternary,
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 10,
            alignItems:'center',

        },

        content4Container: {
            backgroundColor: activeColors.quaternary,
            padding: 20,
            borderRadius: 6,
            marginTop: 12,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },

        textContent4:{
            color: activeColors.primary,
        },
    
        content3: {
            color: activeColors.primary
        },
    
        deleteButtonText: {
            color: '#96b9f3',
            fontWeight: 'bold',
            textAlign: 'center',
    
        },
    
        lineaContainer: {
            borderBottomColor: activeColors.quinary,
            borderBottomWidth: 1,
            marginTop: 20,
            marginBottom: 20,
            borderStyle: 'dashed'
        },
        lineaContainer2: {
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            margin: 10,
    
        },
        lineaContainer4: {
            borderBottomColor: '#000000',
            borderBottomWidth: 1,
            marginLeft: 10,
            marginRight: 10,
    
        },
        espacioContainer: {
            borderBottomColor: activeColors.tertiary, //gris
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
            backgroundColor: activeColors.tertiary,
            padding: 10,
            borderRadius: 8,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5

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
            shadowOffset: { width: -2, height: 4 },
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
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
        },
    
        //-----------
        inputPicker: {
            height: 45,
            backgroundColor: activeColors.secondary,
            borderBlockColor: '#000000',
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 20,
            justifyContent: 'center',
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            color: '#000000'
        },
    
        pickerItem: {
            color: "#96b9f3",
            backgroundColor: "#fa614f",
        },
    
        inputfecha: {
            height: 40,
            borderColor: 'black',
            borderWidth: 1,
            marginBottom: 20,
            color: 'gray',
            paddingLeft: 18,
        },
        inputPicker2: {
            height: 40,
            borderBlockEndColor: 'black',
            borderBlockEndWidth: 1,
            marginBottom: 20,
            color: '#000000',
            alignItems: 'center',
            textAlignments: 0,
            itemStyle: { paddingLeft: 0 },
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
            backgroundColor: activeColors.primary,
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
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
        },
    
        alertButton: {
            flexDirection: "row",
            minwidth: 120,
            paddingVertical: 15,
            paddingHorizontal: 12,
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
    
        alertText: {
            color: '#cceaf5',
            marginBottom: 40,
            fontSize: 24,
            alignSelf: 'center',
            fontWeight: 'bold'
        },
    
        alertButtonText: {
            color: activeColors.secondary,
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
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            justifyContent: 'center'
    
    
        },
    
        customSendButtonText: {
            color: activeColors.secondary,
            fontWeight: 'bold',
            alignSelf: 'center'

        },
    
        verticalButtonsContainer: {
            width: '100%',
            marginTop: 15,
        },
    
        textContainer: {
            marginTop: 12,
            backgroundColor: activeColors.secondary, //celeste
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 20,
            
        },

        previousTextContainer: {
            marginTop: 12,
            backgroundColor: activeColors.quaternary, //celeste
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: 20,
        },
    
        rowPerfil2: {
            backgroundColor: activeColors.primary, //rojoIntenso
            borderRadius: 10,
    
        },
    
        buttonPerfil: {
            backgroundColor: activeColors.primary,
            borderRadius: 15,
            height: 35,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            justifyContent: 'center',
            marginTop: 12
    
        },
    
        buttonTextPerfil: {
            color: activeColors.senary, //celeste
            alignSelf: 'center',
            fontWeight: 'bold'
    
        },
        selectedText: {
            color: '#cceaf5',
            backgroundColor: activeColors.quaternary,
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 10,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
    
        },

        unselectedText: {
            backgroundColor: activeColors.quaternary,
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginVertical: 10,
            //shadowColor: 'black',
            //shadowOffset: { width: -2, height: 4 },
            //shadowOpacity: 0.2,
            //shadowRadius: 3,
            //elevation: 5
        },

        tituloContainer: {
            fontWeight: '600',
            color: activeColors.senary
        },

        datoSeleccionado: {
            color: activeColors.secondary,
            fontWeight: '600',
            marginTop: 20
        },

        espacioContainer2: {
            marginTop: 10,
            paddingTop: 10,
        },
        celesteButton2: {
            backgroundColor: '#cceaf5',
            padding: 18,
            borderRadius: 5,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            marginLeft:20,
            marginRight:20
        },
        c2:{
            width:'70%',
            marginLeft:0,
            alignItems:'flex-start',
            alignContent:'flex-start',
            alignSelf:'flex-start'
        },
        containerDeslizable: {
            width:'30%',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderWidth: 2,
            borderColor: activeColors.quinary,
            height:30
          },
          switchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          switchOption: {
            width: '50%',
            height: 26.4,
            justifyContent: 'center',
            alignItems: 'center',
          },
          selectedOption: {
            backgroundColor: activeColors.secondary,
          },
          switchText: {
            color: activeColors.primary,
            fontWeight: 'bold',
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

          secondaryText: {
            color: activeColors.secondary,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            lineHeight: 28,
            paddingHorizontal: 10
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

          primaryText: {
            color: activeColors.primary,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            lineHeight: 28,
            paddingHorizontal: 10
          },

          formErrorText: {
            color: 'red',
            textAlign: 'left',
            fontSize: 14,
            marginBottom: 20
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

          alertCloseButtonText: {
            color: activeColors.primary,
            fontSize: 15,
            fontWeight: 'bold'
        },

        inputIMC: {
            height: 45,
            backgroundColor: activeColors.secondary,
            borderColor: activeColors.quinary,
            borderWidth: 2,
            borderRadius: 5,
            marginBottom: 20,
            justifyContent: 'center',
            paddingLeft: 20,
            shadowColor: 'black',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            color: activeColors.quinary
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

        secondaryButton: {
            backgroundColor: activeColors.secondary,
            padding: 18,
            borderRadius: 5,
            margin: 2.5,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5
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

        chatTopButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 6

        },

        chatTopButton: {
            backgroundColor: activeColors.tertiary,
            height: 50,
            width: 150,
            borderRadius: 8,
            shadowColor: 'black',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 5,
            justifyContent: 'center'
        },

        chatTopButtonText: {
            color: activeColors.senary,
            fontWeight: 'bold',
            textAlign: 'center',
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

        seguimientoDolenciaHeader: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 12,
            paddingLeft: 20,
            color: activeColors.tertiary
        },

        seguimientoFormHeader: {
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            paddingBottom: 12,
            marginTop: 12,
            color: activeColors.primary
        },

        horaInputMedicamento: {
            marginTop: 5,
            backgroundColor: activeColors.secondary,
            height: 48,
            marginBottom: 12,
            marginHorizontal: 20,
            borderWidth: 2,
            borderColor: activeColors.quinary,
            borderRadius: 6,     
            paddingLeft: 12,
            color: activeColors.quinary
        }
        
    
    })
}

export default getStyles;