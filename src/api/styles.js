import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 18,
        margin: 2.5,

    },
    lineaContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingTop: 10,
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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

})