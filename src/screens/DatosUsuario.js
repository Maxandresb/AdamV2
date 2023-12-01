import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import SelectorRueda from '../api/selectorRueda';
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';

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

  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState('');

  const {theme, updateTheme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];

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
            setAltura(user.altura);
            setPeso(user.peso);
            setImc(user.imc);
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
          'UPDATE Usuario SET pnombre = ?, snombre = ?, papellido = ?, sapellido = ?, alias = ?, genero = ?, altura = ?, peso = ?, imc = ?, tipo_sangre = ?, fecha_nacimiento = ?, alergias = ?, cronico = ?, donante = ?, limitacion_fisica = ?, toma_medicamentos = ? WHERE rut = ?',
          [pnombre, snombre, papellido, sapellido, alias, genero, altura, peso, imc, tipo_sangre, fecha_nacimiento, alergias, cronico, donante, limitacion_fisica, toma_medicamentos, rut],
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

  // rangos de peso y altura
  const rangoTalla = Array.from({ length: 151 }, (_, i) => i + 150);
  const rangoPeso = Array.from({ length: 151 }, (_, i) => i + 30);

  // Calcula el IMC
  useEffect(() => {
    if (altura === '' && peso === '') {
      let msj = 'Debes seleccionar altura y peso primero'
      setImc(msj);
    } else if(altura === ''){
      let msj = 'Debes seleccionar altura primero'
      setImc(msj);
    } else if(peso === ''){
      let msj = 'Debes seleccionar peso primero'
      setImc(msj);
    } else if (altura && peso) {
      let imc = (peso / ((altura / 100) * (altura / 100))).toFixed(2);
      setImc(imc);
    } else {
      console.log('Error al calcular imc');
    }
  }, [altura, peso]);
  
  return (
    <ScrollView className="flex-1 p-5 bg-grisClaro">
      {data.map((item, index) => (
        <View key={index}>
          {showMessage && isEditing && (
            <View className="bg-negro py-4 mb-4 rounded-full shadow-lg shadow-negro">
              <Text style={styles.buttonText}>Ahora puede tocar cada recuadro para modificar sus datos</Text>
            </View>
          )}
          {isEditing ? (
            <>
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
              <Text style={styles.encabezado}>Selecciona tu altura: </Text>
              <SelectorRueda rango={rangoTalla} titulo="Altura (cm)" onValueChange={setAltura} metrica='cm' />
              <Text style={styles.encabezado}>Selecciona tu peso: </Text>
              <SelectorRueda rango={rangoPeso} titulo="Peso (kg)" onValueChange={setPeso} metrica='kg' />
              <Text style={styles.encabezado}>Tu IMC es: </Text>
              <TextInput
                style={styles.inputIMC}
                editable={false}
                value={imc}
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

              <TouchableOpacity
                className="mt-5"
                style={styles.primaryButton}
                onPress={() => { handlePress(), setShowMessage(false), setIsEditing(!isEditing) }}>
                <Text style={styles.buttonText}>{'Guardar cambios'}</Text>
              </TouchableOpacity>
              <View style={styles.espacioContainer2}></View>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => { setIsEditing(!isEditing), setShowMessage(false) }}
              >
                <Text style={styles.buttonText2}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <View style={styles.lineaContainer}></View>

            </>
          ) : (
            <>
              <View className="flex-row self-center justify-center w-auto">
                <TouchableOpacity style={styles.primaryButton} onPress={() => { setShowMessage(true), setIsEditing(!isEditing) }}>
                  <Text style={styles.secondaryText}>{'Modificar Datos Personales'}</Text>
                </TouchableOpacity>
              </View>
              <Text className="mt-10" style={styles.header}>RUT:</Text>
              <Text style={styles.userDataContent}>{item.rut}</Text>
              <Text style={styles.header}>Primer Nombre:</Text>
              <Text style={styles.userDataContent}>{item.pnombre}</Text>
              <Text style={styles.header}>Segundo Nombre:</Text>
              <Text style={styles.userDataContent}>{item.snombre}</Text>
              <Text style={styles.header}>Primer Apellido:</Text>
              <Text style={styles.userDataContent}>{item.papellido}</Text>
              <Text style={styles.header}>Segundo Apellido:</Text>
              <Text style={styles.userDataContent}>{item.sapellido}</Text>
              <Text style={styles.header}>Alias:</Text>
              <Text style={styles.userDataContent}>{item.alias}</Text>
              <Text style={styles.header}>Género:</Text>
              <Text style={styles.userDataContent}>{item.genero}</Text>
              <Text style={styles.header}>Altura:</Text>
              <Text style={styles.userDataContent}>{item.altura}</Text>
              <Text style={styles.header}>Peso:</Text>
              <Text style={styles.userDataContent}>{item.peso}</Text>
              <Text style={styles.header}>IMC:</Text>
              <Text style={styles.userDataContent}>{item.imc}</Text>
              <Text style={styles.header}>Tipo de Sangre:</Text>
              <Text style={styles.userDataContent}>{item.tipo_sangre}</Text>
              <Text style={styles.header}>Fecha de Nacimiento:</Text>
              <Text style={styles.userDataContent}>{item.fecha_nacimiento}</Text>
              <Text style={styles.header}>Alergias:</Text>
              <Text style={styles.userDataContent}>{item.alergias}</Text>
              <Text style={styles.header}>Cronico:</Text>
              <Text style={styles.userDataContent}>{item.cronico}</Text>
              <Text style={styles.header}>Donante:</Text>
              <Text style={styles.userDataContent}>{item.donante}</Text>
              <Text style={styles.header}>Limitación Física:</Text>
              <Text style={styles.userDataContent}>{item.limitacion_fisica}</Text>
              <Text style={styles.header}>Toma Medicamentos:</Text>
              <Text style={styles.userDataContent}>{item.toma_medicamentos}</Text>
              <View style={styles.espacioContainer}>
              </View>
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}