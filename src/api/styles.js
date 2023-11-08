import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/*
import styles from '../api/styles';

<View style={styles.lineaContainer}></View>
<View style={styles.espacioContainer}></View>

*/

export default StyleSheet.create({
    msjContainer: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        margin: 4,
    },
    encabezadoInput: {
        marginBottom: 5,
        color: 'black',
        fontSize: 18,
        flex: 1,
        textAlign: 'left',
        paddingBottom: 5
    },
    encabezadoOutput: {
        marginBottom: 5,
        color: 'black',
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
        paddingBottom: 5,
    },
    inputTexto: {
        marginBottom: 20,
        color: 'black',
        paddingLeft: 18,
        paddingTop: 10,
        flex: 1,
        textAlign: 'left',
    },
    outputTexto: {
        marginBottom: 20,
        color: 'black',
        paddingRight: 18,
        paddingTop: 10,
        flex: 1,
        textAlign: 'right',
    },
    //-----------
    encabezadoInicial: {
        marginBottom: 5,
        color: 'black',
        fontSize: 18,
        marginBottom: 10,
        paddingTop: 10
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        color: 'black',
        paddingLeft: 18,
    },
    encabezado: {
        marginBottom: 5,
        color: 'black',
        fontSize: 18,
    },
    content: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        color: 'gray',
        paddingLeft: 18,
        paddingTop: 10
    },
    //-----------
    buttonContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: 'green',
        padding: 18,
        borderRadius: 5,
        margin: 2.5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'

    },
    buttonText2: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center'

    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 18,
        margin: 2.5,

    },
    lineaContainer3: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 10,
    },
    lineaContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 10
    },
    lineaContainer2: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        margin: 10,

    },
    espacioContainer: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingTop: 10,
    },
    //-----------
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    buttonContainerCenter: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 10,
    },
    //-----------
    inputPicker: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        alignContent: 'flex-start',
        justifyContent: 'center',
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

    //perfilUsuario
    containerPerfil: {
        backgroundColor: 'white',
    },
    rowPerfil: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    alingRowPerfil: {
        width: '45%',
        height: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin: 10
    },
    alingRowPerfilLeft: {
        width: '40%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft:10

    },
    alingRowPerfilRight: {
        width: '40%',
        alignItems: 'flex-start',

    },
    iconPerfil: {
        width: 20,
        height: 20,
        marginBottom: 10,
    },
    buttonPerfil: {
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 5,
        margin: 2.5,
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },
    buttonTextPerfil: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
    },

    content2: {
        color: 'black',
        marginStart: 18,
    },
    content3: {
        color: 'black',
        marginBottom: 5,
    },
    lineaVertical: {
        width: 1,
        borderBottomColor: 'black',
        borderWidth: 0.8,
        height: height * 0.05,

    },
    container3: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,

    },
    lineaContainer3: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 18,
    },
    lineaContainer4: {
        borderBottomColor: 'green',
        borderBottomWidth: 1,
        marginTop: 10,
        marginBottom: 10,

    },

    centeredText: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    lineaVertical2: {
        width: 1,
        borderBottomColor: 'black',
        borderWidth: 1,
        height: height * 0.03,
        marginLeft:15
    },
    espacioContainer2: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        marginTop: height * 0.15,
    },
    espacioContainer3: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        marginTop: height * 0.03,
    },
    centeredText2: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowPerfil2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,

    },
    centeredText3: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    alingRowPerfilRight2: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    alingRowPerfilLeft2: {
        width:'80%',
        justifyContent: 'flex-start'
    },

})