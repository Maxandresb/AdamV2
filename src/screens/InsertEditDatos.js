import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  const [alergias, setAlergias] = useState('');
  const [cronico, setCronico] = useState('');
  const [donante, setDonante] = useState('');
  const guardarDatosUsuario = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Usuario (rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, alergias, cronico, donante) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, alergias, cronico, donante],
        () =>{}, 
        (_, error) => console.log('Error al insertar datos en la tabla Usuario:', error)
      );
    });
    console.log('DATOS DEL USUARIO INGRESADOS CORRECTAMENTE')
  }


  
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
      <Picker
        selectedValue={genero}
        onValueChange={(itemValue) => setGenero(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
        <Picker.Item label="Hombre" value="Hombre" />
        <Picker.Item label="Mujer" value="Mujer" />
        <Picker.Item label="No Binario" value="No Binario" />
        <Picker.Item label="Prefiero no decirlo" value="Prefiero no decirlo" />
      </Picker>
      <Text style={styles.header}>Selecciona tu tipo de sangre: </Text>
      <Picker
        selectedValue={tipo_sangre}
        onValueChange={(itemValue) => setTipoSangre(itemValue)}
        style={styles.input}
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
      <Text style={styles.header}>Selecciona tu fecha de nacimiento: </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="gray"
        placeholder="Fecha de nacimiento"
        onChangeText={text => setFechaNacimiento(text)}
        value={fecha_nacimiento}
      />
      <Text style={styles.header}>Indica si posees o no alergias: </Text>
      <Picker
        selectedValue={alergias}
        onValueChange={(itemValue) => setAlergias(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
        <Picker.Item label="Sí" value="Sí" />
        <Picker.Item label="No" value="No" />
      </Picker>
      <Text style={styles.header}>Indica si posees o no patologias cronicas: </Text>
      <Picker
        selectedValue={cronico}
        onValueChange={(itemValue) => setCronico(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
        <Picker.Item label="Sí" value="Sí" />
        <Picker.Item label="No" value="No" />
      </Picker>
      <Text style={styles.header}>Selecciona si eres o no donante: </Text>
      <Picker
        selectedValue={donante}
        onValueChange={(itemValue) => setDonante(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
        <Picker.Item label="Sí" value="Sí" />
        <Picker.Item label="No" value="No" />
      </Picker>

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
      paddingLeft: 5,
    },
    buttonContainer: {
      width: '50%',
      alignSelf: 'flex-end',
      marginBottom: 30,
    },
});
export default InsertEdirDatos;

