import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, ScrollView, TouchableOpacity, TouchableHighlight, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('adamdb.db');

const InsertEdirDatos = () => {

  const [rut, setRut] = useState('');
  const [pnombre, setPNombre] = useState('');
  const [snombre, setSNombre] = useState('');
  const [papellido, setPApellido] = useState('');
  const [sapellido, setSApellido] = useState('');
  const [alias, setAlias] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo_sangre, setTipoSangre] = useState('');
  const [fecha_nacimiento, setFechaNacimiento] = useState('');
  const [tieneAlergias, setTieneAlergias] = useState('');
  const [cronico, setCronico] = useState('');
  const [donante, setDonante] = useState('');
  const [limitacion_fisica, setLimitacionFisica] = useState('');

  const [tipoAlergia, setTipoAlergia] = useState('');
  const [alergeno, setAlergeno] = useState('');
  const [alergias, setAlergias] = useState([]);


  const guardarDatosUsuario = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Usuario (rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, alergias, cronico, donante, limitacion_fisica) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, alergias, cronico, donante, limitacion_fisica],
        () => { },
        (_, error) => console.log('Error al insertar datos en la tabla Usuario:', error)
      );
    });
    // Guarda las alergias
    alergias.forEach(alergia => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO Alergias (tipo, alergeno, usuario_rut) values (?, ?, ?)',
          [alergia.tipo, alergia.alergeno, rut],
          () => { },
          (_, error) => console.log('Error al insertar datos en la tabla Alergias:', error)
        );
      });
    });

    console.log('DATOS DEL USUARIO Y ALERGIAS INGRESADOS CORRECTAMENTE')
  }

  //datepicker para fec_nac
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  // mostrar formulario en caso de tener alergias, limitaciones fisicas o patologias cronicas
  const [modalVisible, setModalVisible] = useState(false);

  // Actualiza el estado de las alergias y decide si mostrar la ventana
  const handleAlergiasChange = (itemValue) => {
    setTieneAlergias(itemValue);
    setModalVisible(itemValue === 'Sí');
  };

  const agregarAlergia = () => {
    const nuevaAlergia = { tipo: tipoAlergia, alergeno: alergeno, rut: rut };
    setAlergias([...alergias, nuevaAlergia]);
    setTipoAlergia('');
    setAlergeno('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ingresa tu Rut: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="ej: 12345678-9"
        onChangeText={text => setRut(text)}
        value={rut}
      />
      <Text style={styles.header}>Ingresa tu primer nombre: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Primer nombre"
        onChangeText={text => setPNombre(text)}
        value={pnombre}
      />
      <Text style={styles.header}>Ingresa tu segundo nombre: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Segundo nombre"
        onChangeText={text => setSNombre(text)}
        value={snombre}
      />
      <Text style={styles.header}>Ingresa tu  primer apellido: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Primer apellido"
        onChangeText={text => setPApellido(text)}
        value={papellido}
      />
      <Text style={styles.header}>Ingresa tu segundo apellido: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Segundo apellido"
        onChangeText={text => setSApellido(text)}
        value={sapellido}
      />
      <Text style={styles.header}>Ingresa tu  Alias: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Alias"
        onChangeText={text => setAlias(text)}
        value={alias}
      />
      <Text style={styles.header}>Indica tu genero: </Text>
      <View style={styles.inputPicker}>
        <Picker
          selectedValue={genero}
          onValueChange={(itemValue) => setGenero(itemValue)}
          style={styles.inputPicker2}
        >
          <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
          <Picker.Item label="Hombre" value="Hombre" />
          <Picker.Item label="Mujer" value="Mujer" />
          <Picker.Item label="No Binario" value="No Binario" />
          <Picker.Item label="Prefiero no decirlo" value="Prefiero no decirlo" />
        </Picker>
      </View>
      <Text style={styles.header}>Selecciona tu tipo de sangre: </Text>
      <View style={styles.inputPicker}>
        <Picker
          selectedValue={tipo_sangre}
          onValueChange={(itemValue) => setTipoSangre(itemValue)}
          style={styles.inputPicker2}
        >
          <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
          <Picker.Item label="O Positivo" value="O Positivo" />
          <Picker.Item label="O Negativo" value="O Negativo" />
          <Picker.Item label="A Positivo" value="A Positivo" />
          <Picker.Item label="A Negativo" value="A Negativo" />
          <Picker.Item label="B Positivo" value="B Positivo" />
          <Picker.Item label="B Negativo" value="B Negativo" />
          <Picker.Item label="AB Positivo" value="AB Positivo" />
          <Picker.Item label="AB Negativo" value="AB Negativo" />

        </Picker>
      </View>
      <Text style={styles.header}>Selecciona tu fecha de nacimiento: </Text>
      <TouchableOpacity onPress={() => setShow(true)}>
        <TextInput
          style={styles.inputfecha}
          placeholder="Fecha de nacimiento"
          value={date.toLocaleDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
      <Text style={styles.header}>Indica si posees o no alergias: </Text>
      <View style={styles.inputPicker}>
        <Picker
          selectedValue={tieneAlergias}
          onValueChange={handleAlergiasChange}
          style={styles.inputPicker2}
        >
          <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
          <Picker.Item label="Sí" value="Sí" />
          <Picker.Item label="No" value="No" />
        </Picker>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('No haz ingresado tus alergias.');
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.header}>Ingresa tu tipo de alergia:</Text>
              <View style={styles.inputPicker}>
                <Picker
                  selectedValue={tipoAlergia}
                  onValueChange={(itemValue) => setTipoAlergia(itemValue)}
                  style={styles.inputPicker2}
                >
                  <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                  <Picker.Item label="Alergenos" value="Alergenos" />
                  <Picker.Item label="Medicamentos" value="Medicamentos" />
                  <Picker.Item label="Alimentos" value="Alimentos" />
                </Picker>
              </View>
              <Text style={styles.header}>Ingresa tu alergeno:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="ej: Perros"
                onChangeText={text => setAlergeno(text)}
                value={alergeno}
              />
              <View style={styles.buttonContainerCenter}>
                <Button
                  title="Agregar Nueva alergia"
                  color="green"
                  onPress={() => {
                    agregarAlergia();
                  }}
                />
              </View>
              <View style={styles.buttonContainerCenter}>
                <Button
                  title="Listo"
                  color="green"
                  onPress={() => {
                    setModalVisible(false);
                    agregarAlergia();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

      </View>
      <Text style={styles.header}>Indica si posees o no patologias cronicas: </Text>
      <View style={styles.inputPicker}>
        <Picker
          selectedValue={cronico}
          onValueChange={(itemValue) => setCronico(itemValue)}
          style={styles.inputPicker2}
          itemStyle={{ textAlign: 'left', textAlignments: 'left', textAlignmentsVertical: 'center' }}
        >
          <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
          <Picker.Item label="Sí" value="Sí" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>
      <Text style={styles.header}>Indica si eres o no donante: </Text>
      <View style={styles.inputPicker}>
        <Picker
          selectedValue={donante}
          onValueChange={(itemValue) => setDonante(itemValue)}
          style={styles.inputPicker2}
        >
          <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
          <Picker.Item label="Sí" value="Sí" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>
      <Text style={styles.header}>Indica si posees o no limitaciones fisicas: </Text>
      <View style={styles.inputPicker}>
        <Picker
          selectedValue={limitacion_fisica}
          onValueChange={(itemValue) => setLimitacionFisica(itemValue)}
          style={styles.inputPicker2}
        >
          <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
          <Picker.Item label="Sí" value="Sí" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Guardar Datos"
          color="green"
          onPress={guardarDatosUsuario}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  modalView: {
    marginHorizontal: '10%',
  },
  header: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    color: 'black',
    paddingLeft: 18,
  },
  inputfecha: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    color: 'gray',
    paddingLeft: 18,
  },
  inputPicker: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    alignContent: 'flex-start',
    justifyContent: 'center', // Asegúrate de que el texto esté centrado verticalmente
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
  buttonContainer: {
    width: '50%',
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  buttonContainerCenter: {
    width: '50%',
    alignSelf: 'center',
    marginBottom: 30,
  },
});
export default InsertEdirDatos;

