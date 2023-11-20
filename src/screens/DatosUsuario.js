import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import SelectorRueda from '../api/selectorRueda';


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
              <Text className="text-celeste font-bold text-sm text-center">Ahora puede tocar cada recuadro para modificar sus datos</Text>
            </View>
          )}
          {isEditing ? (
            <>
              <Text className="mb-3 text-gris text-lg font-bold">Primer Nombre:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setPnombre}
                value={pnombre}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Segundo Nombre:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setSnombre}
                value={snombre}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Primer Apellido:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setPapellido}
                value={papellido}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Segundo Apellido:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setSapellido}
                value={sapellido}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Alias:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setAlias}
                value={alias}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Género:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setGenero}
                value={genero}
              />
              <Text className="text-lg font-bold text-redcoral mb-2">Selecciona tu altura: </Text>
              <SelectorRueda rango={rangoTalla} titulo="Altura (cm)" onValueChange={setAltura} metrica='cm' />
              <Text className="text-lg font-bold text-redcoral mb-2">Selecciona tu peso: </Text>
              <SelectorRueda rango={rangoPeso} titulo="Peso (kg)" onValueChange={setPeso} metrica='kg' />
              <Text className="text-lg font-bold text-redcoral mb-2">Tu IMC es: </Text>
              <TextInput
                className="bg-beige h-10 pl-4 mb-5 rounded-md border-2 border-solid border-salmon"
                editable={false}
                value={imc}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Tipo de Sangre:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setTipo_sangre}
                value={tipo_sangre}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Fecha de Nacimiento:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setFecha_nacimiento}
                value={fecha_nacimiento}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Alergias:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setAlergias}
                value={alergias}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Cronico:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setCronico}
                value={cronico}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Donante:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setDonante}
                value={donante}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Limitación Física:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-3 text-rojoIntenso pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setLimitacion_fisica}
                value={limitacion_fisica}
              />
              <Text className="mb-3 text-gris text-lg font-bold">Toma Medicamentos:</Text>
              <TextInput
                className="h-10 border-b-2 border-negro mb-10 text-gris pl-4 bg-celeste shadow-md shadow-negro rounded-md placeholder:font-bold"
                onChangeText={setToma_medicamentos}
                value={toma_medicamentos}
              />

              <TouchableOpacity
                style={styles.rojoIntensoButton}
                onPress={() => { handlePress(), setShowMessage(false), setIsEditing(!isEditing) }}>
                <Text style={styles.celesteText}>{'Guardar cambios'}</Text>
              </TouchableOpacity>
              <View style={styles.espacioContainer2}></View>
              <TouchableOpacity
                style={styles.celesteButton}
                onPress={() => { setIsEditing(!isEditing), setShowMessage(false) }}
              >
                <Text style={styles.rojoIntensoText}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <View style={styles.lineaContainer}></View>

            </>
          ) : (
            <>
              <View className="flex-row self-center justify-center w-auto">
                <TouchableOpacity className="bg-rojoIntenso p-4 m-2 rounded-lg shadow-lg shadow-negro" onPress={() => { setShowMessage(true), setIsEditing(!isEditing) }}>
                  <Text className="self-center text-celeste font-bold text-lg">{'Modificar Datos Personales'}</Text>
                </TouchableOpacity>
              </View>
              <Text className="mb-3 mt-5 text-rojoIntenso text-lg font-bold">RUT:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.rut}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Primer Nombre:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.pnombre}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Segundo Nombre:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.snombre}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Primer Apellido:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.papellido}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Segundo Apellido:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.sapellido}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Alias:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.alias}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Género:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.genero}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Altura:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.altura}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Peso:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.peso}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">IMC:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.imc}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Tipo de Sangre:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.tipo_sangre}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Fecha de Nacimiento:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.fecha_nacimiento}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Alergias:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.alergias}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Cronico:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.cronico}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Donante:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.donante}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Limitación Física:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.limitacion_fisica}</Text>
              <Text className="mb-3 text-rojoIntenso text-lg font-bold">Toma Medicamentos:</Text>
              <Text className="mb-4 border-b border-dashed border-gris pb-2 text-negro font-semibold">{item.toma_medicamentos}</Text>
              <View style={styles.espacioContainer}>
              </View>
            </>
          )}
        </View>
      ))}
    </ScrollView>
  );
}