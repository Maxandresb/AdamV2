import { StyleSheet } from 'react-native';

/*
import styles from '../api/styles';

<View style={styles.lineaContainer}></View>
<View style={styles.espacioContainer}></View>

*/

export default StyleSheet.create({
    msjContainer:{
        backgroundColor: '#f5f1c4',
        color: '#233050',
        borderColor: '#f9a79c',
        borderWidth: 1,
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
        color: '#fa614f',
        fontSize: 18,
        flex: 1,
        textAlign: 'left',
        paddingBottom: 5
    },
    encabezadoOutput: {
        marginBottom: 5,
        color: '#fa614f',
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
        paddingBottom: 5,
    },
    inputTexto: {
        marginBottom: 20,
        color: '#233050',
        paddingLeft: 18,
        paddingTop: 10,
        flex: 1,
        textAlign: 'left',
    },
    outputTexto: {
        marginBottom: 20,
        color: '#233050',
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
        borderColor: '#f9a79c',
        backgroundColor: '#f5f1c4',
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 10,
        color: '#233050',
        fontWeight: 'bold',
        paddingLeft: 18,
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
        color: '#233050',
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
    redcoralButton: {
        backgroundColor: '#fa614f',
        padding: 18,
        borderRadius: 5,
        margin: 2.5,
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5
    },

    damascoButton: {
        backgroundColor: '#fad9a0',
        padding: 10,
        borderRadius: 5,
        margin: 2.5,
        shadowColor: 'black',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5
    },

    buttonText: {
        color: '#fad9a0',
        fontWeight: 'bold',
        textAlign: 'center'

    },
    buttonText2: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'

    },
    deleteButton: {
        backgroundColor: '#233050',
        borderRadius: 5,
        padding: 18,
        margin: 2.5,

    },
    lineaContainer3: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 10,
    },

    deleteButtonText: {
        color: '#96b9f3',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    lineaContainer: {
        borderBottomColor: '#233050',
        borderBottomWidth: 1,
        marginTop: 20,
        marginBottom: 20,
    },
    lineaContainer2: {
        borderBottomColor: '#233050',
        borderBottomWidth: 1,
        margin: 10,

    },
    espacioContainer: {
        borderBottomColor: '#233050',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingTop: 10,
    },
    //-----------
    container: {
        flex: 1,
        backgroundColor: '#fad9a0',
        padding: 20,
    },
    container2: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingBottom: 30,

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

    },
    modalView: {
        backgroundColor: '#fa614f',
        padding: 20,
        borderRadius: 10,
        width: '90%'
    },
    header: {
        color: '#fad9a0',
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
        backgroundColor: '#233050',
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
        backgroundColor: '#f5f1c4',
        borderColor: '#f9a79c',
        borderWidth: 2,
        borderRadius: 5,
        marginBottom: 20,
        justifyContent: 'center',
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
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        color: 'gray',
        alignItems: 'flex-start',
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

    redcoralText: {
        color: '#fa614f',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    azulText: {
        color: '#96b9f3',
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
        backgroundColor: '#fa614f',
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
        color: '#fad9a0',
        marginBottom: 40,
        fontSize: 24,
        alignSelf: 'center'
    },

    alertButtonText: {
        color: '#fa614f',
        fontSize: 15,
        fontWeight: 'bold'
    },

})