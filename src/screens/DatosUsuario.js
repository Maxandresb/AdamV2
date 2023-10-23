import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';

const db = SQLite.openDatabase('adamdb.db');

export default function DatosUsuario() {
  const [data, setData] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [rut, setRut] = useState('');
  const [pnombre, setPnombre] = useState('');
  const [snombre, setSnombre] = useState('');
  const [papellido, setPapellido] = useState('');
  const [sapellido, setSapellido] = useState('');
  const [alias, setAlias] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo_sangre, setTipo_sangre] = useState('');
  const [fecha_nacimiento, setFecha_nacimiento] = useState('');
  const [alergias, setAlergias] = useState('');
  const [cronico, setCronico] = useState('');
  const [donante, setDonante] = useState('');
  const [limitacion_fisica, setLimitacion_fisica] = useState('');
  const [toma_medicamentos, setToma_medicamentos] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [isAlertVisible, setAlertVisible] = useState(false);

  const loadUserData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Usuario',
        [],
        (_, { rows: { _array } }) => {
          setData(_array);
          // Inicializa los estados con los datos del usuario
          if (_array.length > 0) {
            const user = _array[0];
            setRut(user.rut);
            setPnombre(user.pnombre);
            setSnombre(user.snombre);
            setPapellido(user.papellido);
            setSapellido(user.sapellido);
            setAlias(user.alias);
            setGenero(user.genero);
            setTipo_sangre(user.tipo_sangre);
            setFecha_nacimiento(user.fecha_nacimiento);
            setAlergias(user.alergias);
            setCronico(user.cronico);
            setDonante(user.donante);
            setLimitacion_fisica(user.limitacion_fisica);
            setToma_medicamentos(user.toma_medicamentos);
          }
        }
      );
    });
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handlePress = () => {
    if (isEditing) {
      // Actualizar la base de datos
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Usuario SET rut = ?, pnombre = ?, snombre = ?, papellido = ?, sapellido = ?, alias = ?, genero = ?, tipo_sangre = ?, fecha_nacimiento = ?, alergias = ?, cronico = ?, donante = ?, limitacion_fisica = ?, toma_medicamentos = ? WHERE rut = ?',
          [rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, alergias, cronico, donante, limitacion_fisica, toma_medicamentos, rut],
          (_, resultSet) => {
            console.log("Actualización exitosa!");
            loadUserData(); // Vuelve a cargar los datos del usuario después de actualizar
            setShowMessage(false); // Oculta el mensaje después de guardar los cambios
          },
          (_, error) => {
            console.log("Error al actualizar los datos: " + error);
            return true; // Detiene la propagación del error
          }
        );
      });
    } else {
      setShowMessage(true); // Muestra el mensaje cuando se empieza a editar
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container}>
      {data.map((item, index) => (
        <View style={styles.viewStyle} key={index}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => { setShowMessage(true), handlePress() }}>
              <Text style={styles.buttonText}>{isEditing ? 'Guardar cambios' : 'Modificar Datos Personales'}</Text>
            </TouchableOpacity>
          </View>
          {showMessage && isEditing && (
            <View style={styles.messageBox}>
              <Text>Ahora puedes tocar cada recuadro para modificar tus datos</Text>
            </View>
          )}
          {isEditing ? (
            <>
              <Text style={styles.encabezado}>RUT:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setRut}
                value={rut}
              />
              <Text style={styles.encabezado}>Primer Nombre:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPnombre}
                value={pnombre}
              />
              <Text style={styles.encabezado}>Segundo Nombre:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setSnombre}
                value={snombre}
              />
              <Text style={styles.encabezado}>Primer Apellido:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPapellido}
                value={papellido}
              />
              <Text style={styles.encabezado}>Segundo Apellido:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setSapellido}
                value={sapellido}
              />
              <Text style={styles.encabezado}>Alias:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setAlias}
                value={alias}
              />
              <Text style={styles.encabezado}>Género:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setGenero}
                value={genero}
              />
              <Text style={styles.encabezado}>Tipo de Sangre:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setTipo_sangre}
                value={tipo_sangre}
              />
              <Text style={styles.encabezado}>Fecha de Nacimiento:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setFecha_nacimiento}
                value={fecha_nacimiento}
              />
              <Text style={styles.encabezado}>Alergias:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setAlergias}
                value={alergias}
              />
              <Text style={styles.encabezado}>Cronico:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setCronico}
                value={cronico}
              />
              <Text style={styles.encabezado}>Donante:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setDonante}
                value={donante}
              />
              <Text style={styles.encabezado}>Limitación Física:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setLimitacion_fisica}
                value={limitacion_fisica}
              />
              <Text style={styles.encabezado}>Toma Medicamentos:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setToma_medicamentos}
                value={toma_medicamentos}
              />
              <View style={styles.espacioContainer}>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.encabezado}>RUT:</Text>
              <Text style={styles.content}>{item.rut}</Text>
              <Text style={styles.encabezado}>Primer Nombre:</Text>
              <Text style={styles.content}>{item.pnombre}</Text>
              <Text style={styles.encabezado}>Segundo Nombre:</Text>
              <Text style={styles.content}>{item.snombre}</Text>
              <Text style={styles.encabezado}>Primer Apellido:</Text>
              <Text style={styles.content}>{item.papellido}</Text>
              <Text style={styles.encabezado}>Segundo Apellido:</Text>
              <Text style={styles.content}>{item.sapellido}</Text>
              <Text style={styles.encabezado}>Alias:</Text>
              <Text style={styles.content}>{item.alias}</Text>
              <Text style={styles.encabezado}>Género:</Text>
              <Text style={styles.content}>{item.genero}</Text>
              <Text style={styles.encabezado}>Tipo de Sangre:</Text>
              <Text style={styles.content}>{item.tipo_sangre}</Text>
              <Text style={styles.encabezado}>Fecha de Nacimiento:</Text>
              <Text style={styles.content}>{item.fecha_nacimiento}</Text>
              <Text style={styles.encabezado}>Alergias:</Text>
              <Text style={styles.content}>{item.alergias}</Text>
              <Text style={styles.encabezado}>Cronico:</Text>
              <Text style={styles.content}>{item.cronico}</Text>
              <Text style={styles.encabezado}>Donante:</Text>
              <Text style={styles.content}>{item.donante}</Text>
              <Text style={styles.encabezado}>Limitación Física:</Text>
              <Text style={styles.content}>{item.limitacion_fisica}</Text>
              <Text style={styles.encabezado}>Toma Medicamentos:</Text>
              <Text style={styles.content}>{item.toma_medicamentos}</Text>
              <View style={styles.espacioContainer}>
            </View>
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}