import { StyleSheet } from 'react-native';

/*
import styles from '../api/styles';

<View style={styles.lineaContainer}></View>
<View style={styles.espacioContainer}></View>

*/

export default StyleSheet.create({
    msjContainer:{
        backgroundColor: '#a9a9a9',
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
        marginBottom: 20,
        color: '#efefef',
        paddingLeft: 18,
        paddingTop: 10,
        flex: 1,
        textAlign: 'left',
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
        borderBottomColor: '#000000',
        backgroundColor: '#cceaf5',
        borderBottomWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
        color: '#000000',
        fontWeight: 'bold',
        paddingLeft: 18,
        shadowColor: '#000000',
        shadowOffset: {width: -2, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 8
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

    rojoIntensoButton: {
        backgroundColor: '#ff3e45',
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
        backgroundColor: '#efefef',
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
        backgroundColor: '#efefef',
        padding: 20,
        borderRadius: 10,
        width: '90%'
    },
    header: {
        color: '#ff3e45',
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
        backgroundColor: '#cceaf5',
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
        backgroundColor: '#cceaf5',
        borderBlockColor: '#000000',
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 4},
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
        itemStyle: { paddingLeft: 0},
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
        backgroundColor: '#ff3e45',
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
        width: 120,
        paddingVertical: 15,
        marginTop: 10,
        backgroundColor: '#f5f1c4',
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
        color: '#fa614f',
        fontSize: 15,
        fontWeight: 'bold'
    },

    recordatorioContainer: {
        backgroundColor: "#fa614f"
    },

    customSendChat: {
        backgroundColor:'#000000',
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
        Color: '#ffffff',
        fontWeight: 'bold',
        alignSelf: 'center'
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
        
    }

})