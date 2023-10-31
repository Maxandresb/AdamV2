import React, { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Text, ScrollView, TouchableOpacity, TouchableHighlight, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';

const db = SQLite.openDatabase('adamdb.db');

const SignIn = ({ navigation }) => {

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
  const [toma_medicamentos, setTomaMedicamentos] = useState('');
  const [tipoAlergia, setTipoAlergia] = useState('');
  const [alergeno, setAlergeno] = useState('');
  const [alergias, setAlergias] = useState([]);
  const [tipoPatologia, setTipoPatologia] = useState('');
  const [nombre_patologia, setNomPatologia] = useState('');
  const [transmisibilidad, setTransmisibilidad] = useState('');
  const [morbilidad_intensidad, setMorbilidadIntensidad] = useState('');
  const [patologias, setPatologias] = useState([]);
  const [tipoLimitacion, setTipoLimitacion] = useState('');
  const [severidad, setSeveridad] = useState('');
  const [origen_lim, setOrigenLim] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [limitaciones, setLimitaciones] = useState([]);
  const [nom_medicamento, setNomMedicamento] = useState('');
  const [dosis, setDosis] = useState('');
  const [periodicidad, setPeriodicidad] = useState('');
  const [medicamentos, setMedicamentos] = useState([]);

  const [isAlertVisible, setAlertVisible] = useState(false);

  const [initialAlert, setInitialAlert] = useState(true);
  const [saveAlert, setSaveAlert] = useState(false);

  const guardarDatosUsuario = () => {
    db.transaction(tx => {
      console.log('Valores a insertar:', rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, tieneAlergias, cronico, donante, limitacion_fisica, toma_medicamentos);
      tx.executeSql(
        'INSERT INTO Usuario (rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, alergias, cronico, donante, limitacion_fisica, toma_medicamentos) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [rut, pnombre, snombre, papellido, sapellido, alias, genero, tipo_sangre, fecha_nacimiento, tieneAlergias, cronico, donante, limitacion_fisica, toma_medicamentos],
        (result) => { console.log('Insert exitoso!'); },
        (_, error) => {
          console.log('Error en insert:', error);

          if (error.code === 'SQLITE_CONSTRAINT') {
            console.log('El Rut ya existe!');
          } else {
            console.log('Otro error:', error.message);
          }
        }
      );
    }, errorTx => {
      console.log('Error en la transacción:', errorTx);
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
    // Guarda las Patologias
    patologias.forEach(patologia => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO PatologiasCronicas (tipo_patologia, nombre_patologia, transmisibilidad, morbilidad_intensidad, usuario_rut) values (?, ?, ?, ?, ?)',
          [patologia.tipoPatologia, patologia.nombre_patologia, patologia.transmisibilidad, patologia.morbilidad_intensidad, rut],
          () => { },
          (_, error) => console.log('Error al insertar datos en la tabla Patologias:', error)
        );
      });
    });
    // Guarda las Limitaciones
    limitaciones.forEach(limitacion => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO Limitaciones (tipo_lim, severidad_lim, origen_lim, descripcion_lim, usuario_rut) values (?, ?, ?, ?, ?)',
          [limitacion.tipoLimitacion, limitacion.severidad, limitacion.origen_lim, limitacion.descripcion, rut],
          () => { },
          (_, error) => console.log('Error al insertar datos en la tabla Limitaciones:', error)
        );
      });
    });
    // Guarda los Medicamentos
    medicamentos.forEach(medicamento => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO Medicamentos (medicamento, dosis, periodicidad, usuario_rut) values (?, ?, ?, ?)',
          [medicamento.nom_medicamento, medicamento.dosis, medicamento.periodicidad, rut],
          () => { },
          (_, error) => console.log('Error al insertar datos en la tabla Medicamentos:', error)
        );
      });
    });
    console.log('DATOS DEL USUARIO Y ALERGIAS INGRESADOS CORRECTAMENTE')
    // Mostrar alerta al guardar
    setSaveAlert(true);
    
  }
  //datepicker para fec_nac
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setFechaNacimiento(currentDate.toLocaleDateString());
  };
  const showDatepicker = () => {
    setShow(true);
  };
  // mostrar formulario en caso de tener alergias, limitaciones fisicas o patologias cronicas
  const [modalVisibleAlergias, setModalVisibleAlergias] = useState(false);
  const [modalVisiblePatologias, setModalVisiblePatologias] = useState(false);
  const [modalVisibleLimitaciones, setModalVisibleLimitaciones] = useState(false);
  const [modalVisibleMedicamentos, setModalVisibleMedicamentos] = useState(false);
  // Actualiza el estado de las alergias y decide si mostrar la ventana
  const handleAlergiasChange = (itemValue) => {
    setTieneAlergias(itemValue);
    setModalVisibleAlergias(itemValue === 'Sí');
  };
  const agregarAlergia = () => {
    const nuevaAlergia = { tipo: tipoAlergia, alergeno: alergeno, rut: rut };
    setAlergias([...alergias, nuevaAlergia]);
    setTipoAlergia('');
    setAlergeno('');
  };
  // Actualiza el estado de las patologias y decide si mostrar la ventana
  const handlePatologiaChange = (itemValue) => {
    setCronico(itemValue);
    setModalVisiblePatologias(itemValue === 'Sí');
  };
  const agregarPatologia = () => {
    const nuevaPatologia = { tipoPatologia: tipoPatologia, nombre_patologia: nombre_patologia, transmisibilidad: transmisibilidad, morbilidad_intensidad: morbilidad_intensidad, rut: rut };
    setPatologias([...patologias, nuevaPatologia]);
    setTipoPatologia('');
    setNomPatologia('');
    setTransmisibilidad('');
    setMorbilidadIntensidad('');
  };
  // Actualiza el estado de las limitaciones y decide si mostrar la ventana
  const handleLimitacionesChange = (itemValue) => {
    setLimitacionFisica(itemValue);
    setModalVisibleLimitaciones(itemValue === 'Sí');
  };
  const agregarLimitacion = () => {
    const nuevaLimitacion = { tipoLimitacion: tipoLimitacion, severidad: severidad, origen_lim: origen_lim, descripcion: descripcion, rut: rut };
    setLimitaciones([...limitaciones, nuevaLimitacion]);
    setTipoLimitacion('');
    setSeveridad('');
    setDescripcion('');
    setOrigenLim('');
  };
  // Actualiza el estado de las limitaciones y decide si mostrar la ventana
  const handleMedicamentosChange = (itemValue) => {
    setTomaMedicamentos(itemValue);
    setModalVisibleMedicamentos(itemValue === 'Sí');
  };
  const agregarMedicamento = () => {
    const nuevoMedicamento = { nom_medicamento: nom_medicamento, dosis: dosis, periodicidad: periodicidad, rut: rut };
    setMedicamentos([...medicamentos, nuevoMedicamento]);
    setNomMedicamento('');
    setDosis('');
    setPeriodicidad('');
  };
  return (
    <ScrollView style={styles.container}>
      <CustomAlert
        isVisible={initialAlert}
        onClose={() => setInitialAlert(false)}
        message='Ingresa tus datos personales'
      />
      <CustomAlert
        isVisible={saveAlert}
        onClose={() => 
          {setSaveAlert(false)
          navigation.navigate('Principal');}
        }
        message='Contactos guardados exitosamente'
      />
      <View style={styles.container2}>
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
            transparent={true}
            visible={modalVisibleAlergias}
            onRequestClose={() => {
              setAlertVisible(true);
              setModalVisibleAlergias(false);
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
                      setModalVisibleAlergias(false);
                      agregarAlergia();
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <CustomAlert
            isVisible={isAlertVisible}
            onClose={() => setAlertVisible(false)}
            message='No haz ingresado tus alergias.'
          />
        </View>
        <Text style={styles.header}>Indica si posees o no patologias cronicas: </Text>
        <View style={styles.inputPicker}>
          <Picker
            selectedValue={cronico}
            onValueChange={handlePatologiaChange}
            style={styles.inputPicker2}
          >
            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
            <Picker.Item label="Sí" value="Sí" />
            <Picker.Item label="No" value="No" />
          </Picker>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisiblePatologias}
            onRequestClose={() => {
              setAlertVisible(true);
              setModalVisiblePatologias(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Ingresa tu tipo de patologia:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={tipoPatologia}
                    onValueChange={(itemValue) => setTipoPatologia(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Patologías crónicas cardiovasculares" value="Patologías crónicas cardiovasculares" />
                    <Picker.Item label="Patologías crónicas respiratorias" value="Patologías crónicas respiratorias" />
                    <Picker.Item label="Patologías crónicas digestivas" value="Patologías crónicas digestivas" />
                    <Picker.Item label="Patologías crónicas endocrinas" value="Patologías crónicas endocrinas" />
                    <Picker.Item label="Patologías crónicas musculoesqueléticas" value="Patologías crónicas musculoesqueléticas" />
                    <Picker.Item label="Patologías crónicas neurológicas" value="Patologías crónicas neurológicas" />
                    <Picker.Item label="Patologías crónicas oncológicas" value="Patologías crónicas oncológicas" />
                    <Picker.Item label="Otras Patologías crónicas" value="Otras Patologías crónicas" />
                  </Picker>
                </View>
                <Text style={styles.header}>Ingresa el nombre de tu patologia:</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="gray"
                  placeholder="ej: XXXXX"
                  onChangeText={text => setNomPatologia(text)}
                  value={nombre_patologia}
                />
                <Text style={styles.header}>Indica la transmisibilidad de tu patologia:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={transmisibilidad}
                    onValueChange={(itemValue) => setTransmisibilidad(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Patología crónica no transmisible" value="Patología crónica no transmisible" />
                    <Picker.Item label="Patología crónica transmisible" value="Patología crónica transmisible" />
                  </Picker>
                </View>
                <Text style={styles.header}>Indica el nivel de morbilidad e intensidad de tu patologia:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={morbilidad_intensidad}
                    onValueChange={(itemValue) => setMorbilidadIntensidad(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Patología crónica de alto consumo" value="Patología crónica de alto consumo" />
                    <Picker.Item label="Patología crónica de bajo consumo" value="Patología crónica de bajo consumo" />
                  </Picker>
                </View>
                <View style={styles.buttonContainerCenter}>
                  <Button
                    title="Agregar Nueva Patología"
                    color="green"
                    onPress={() => {
                      agregarPatologia();
                    }}
                  />
                </View>
                <View style={styles.buttonContainerCenter}>
                  <Button
                    title="Listo"
                    color="green"
                    onPress={() => {
                      setModalVisiblePatologias(false);
                      agregarPatologia();
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <CustomAlert
            isVisible={isAlertVisible}
            onClose={() => setAlertVisible(false)}
            message='No haz ingresado tus patologias.'
          />
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
            onValueChange={handleLimitacionesChange}
            style={styles.inputPicker2}
          >
            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
            <Picker.Item label="Sí" value="Sí" />
            <Picker.Item label="No" value="No" />
          </Picker>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleLimitaciones}
            onRequestClose={() => {
              setAlertVisible(true);
              setModalVisibleLimitaciones(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Indica tu tipo de limitacion fisica:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={tipoLimitacion}
                    onValueChange={(itemValue) => setTipoLimitacion(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Motricidad" value="Motricidad" />
                    <Picker.Item label="Sensorial" value="Sensorial" />
                    <Picker.Item label="Mental" value="Mental" />
                  </Picker>
                </View>
                <Text style={styles.header}>Indica tu nivel de severidad:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={severidad}
                    onValueChange={(itemValue) => setSeveridad(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Grave" value="Grave" />
                    <Picker.Item label="Moderada" value="Moderada" />
                    <Picker.Item label="Leve" value="Leve" />
                  </Picker>
                </View>
                <Text style={styles.header}>Indica el origen de tu limitacion:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={origen_lim}
                    onValueChange={(itemValue) => setOrigenLim(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Adquirida" value="Adquirida" />
                    <Picker.Item label="Congénitas o de nacimiento" value="Congénitas o de nacimiento" />
                  </Picker>
                </View>
                <Text style={styles.header}>Nombra o describe tu limitacion:</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="gray"
                  placeholder="ej: XXXXXX"
                  onChangeText={text => setDescripcion(text)}
                  value={descripcion}
                />
                <View style={styles.buttonContainerCenter}>
                  <Button
                    title="Agregar Nueva Limitacion"
                    color="green"
                    onPress={() => {
                      agregarLimitacion();
                    }}
                  />
                </View>
                <View style={styles.buttonContainerCenter}>
                  <Button
                    title="Listo"
                    color="green"
                    onPress={() => {
                      setModalVisibleLimitaciones(false);
                      agregarLimitacion();
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <CustomAlert
            isVisible={isAlertVisible}
            onClose={() => setAlertVisible(false)}
            message='No haz ingresado tus Limitaciones.'
          />
        </View>
        <Text style={styles.header}>Indica si tomas o no medicamentos: </Text>
        <View style={styles.inputPicker}>
          <Picker
            selectedValue={toma_medicamentos}
            onValueChange={handleMedicamentosChange}
            style={styles.inputPicker2}
          >
            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
            <Picker.Item label="Sí" value="Sí" />
            <Picker.Item label="No" value="No" />
          </Picker>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleMedicamentos}
            onRequestClose={() => {
              setAlertVisible(true);
              setModalVisibleMedicamentos(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.header}>Indica el nombre del medicamento:</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="gray"
                  placeholder="ej: XXXXXX"
                  onChangeText={text => setNomMedicamento(text)}
                  value={nom_medicamento}
                />
                <Text style={styles.header}>Indica la dosis a ingerir:</Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="gray"
                  placeholder="ej: XXXXXX"
                  onChangeText={text => setDosis(text)}
                  value={dosis}
                />
                <Text style={styles.header}>Indica cada cuanto debes tomar el medicamento:</Text>
                <View style={styles.inputPicker}>
                  <Picker
                    selectedValue={periodicidad}
                    onValueChange={(itemValue) => setPeriodicidad(itemValue)}
                    style={styles.inputPicker2}
                  >
                    <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                    <Picker.Item label="Cada 24 hrs (Una vez al dia)" value="Cada 24 hrs (Una vez al dia)" />
                    <Picker.Item label="Cada 12 hrs (Dos veces al dia)" value="Cada 12 hrs (Dos veces al dia)" />
                    <Picker.Item label="Cada 8 hrs (Tres veces al dia)" value="Cada 8 hrs (Tres veces al dia)" />
                    <Picker.Item label="Cada 6 hrs (Cuatro veces al dia)" value="Cada 6 hrs (Cuatro veces al dia)" />
                    <Picker.Item label="Cada 4 hrs (Seis veces al dia)" value="Cada 4 hrs (Seis veces al dia)" />
                  </Picker>
                </View>
                <View style={styles.buttonContainerCenter}>
                  <Button
                    title="Agregar Nuevo Medicamento"
                    color="green"
                    onPress={() => {
                      agregarMedicamento();
                    }}
                  />
                </View>
                <View style={styles.buttonContainerCenter}>
                  <Button
                    title="Listo"
                    color="green"
                    onPress={() => {
                      setModalVisibleMedicamentos(false);
                      agregarMedicamento();
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <CustomAlert
            isVisible={isAlertVisible}
            onClose={() => setAlertVisible(false)}
            message='No haz ingresado tus medicamentos.'
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={guardarDatosUsuario} 
        >
          <Text style={styles.buttonText}>
          Guardar 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => navigation.navigate('Saludo')} 
        >
          <Text style={styles.buttonText}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
export default SignIn;
