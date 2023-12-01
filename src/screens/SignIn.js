import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Button, TextInput, View, Text, ScrollView, TouchableOpacity, TouchableHighlight, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import styles from '../api/styles';
import CustomAlert from '../api/customAlert';
import { useTailwind } from 'tailwind-rn';
import SelectorRueda from '../api/selectorRueda';

import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';
import * as Yup from 'yup';
import { Formik } from 'formik';


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

  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState('');

  const [isAlertVisible, setAlertVisible] = useState(false);

  const [initialAlert, setInitialAlert] = useState(true);
  const [saveAlert, setSaveAlert] = useState(false);
  const [saveAlergiaAlert, setSaveAlergiaAlert] = useState(false);
  const [savePatologiaAlert, setSavePatologiaAlert] = useState(false);
  const [saveLimitacionAlert, setSaveLimitacionAlert] = useState(false);
  const [saveMedicamentoAlert, setSaveMedicamentoAlert] = useState(false);
  const [invalidFormAlert, setInvalidFormAlert] = useState(false);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme)

  const [errors, setErrors] = useState({});


  ////VALIDACION DE LOS FORMULARIOS////
  
  const UserSchema = Yup.object().shape({
    rut: Yup.string()
    .max(10, 'El Rut debe presentar un máximo de 10 carácteres')
    .min(9, 'El Rut debe presentar un mínimo de 9 carácteres')
    .matches(/^\d{7,8}-[0-9kK]$/, 'El Rut debe tener el formato xxxxxxxx-x')
    //.matches(/^[0-9]+[kK]?$/, 'El Rut debe contener solo números y la letra K (mayúscula o minúscula)')
    .required('Este campo es obligatorio'),
    pnombre: Yup.string()
    .max(15, 'El primer nombre no debe sobrepasar los 15 carácteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÜü\s]+$/, 'El primer nombre no puede contener números ni caracteres especiales')
    .required('Este campo es obligatorio'),
    snombre: Yup.string()
    .max(15, 'El primer nombre no debe sobrepasar los 15 carácteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÜü\s]+$/, 'El segundo nombre no puede contener números ni caracteres especiales'),
    papellido: Yup.string()
    .max(15, 'El primer apellido no debe sobrepasar los 15 carácteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÜü\s]+$/, 'El primer apellido no puede contener números ni caracteres especiales')
    .required('Este campo es obligatorio'),
    sapellido: Yup.string()
    .max(15, 'El primer apellido no debe sobrepasar los 15 carácteres')
    .matches(/^[A-Za-zÁáÉéÍíÓóÚúÜü\s]+$/, 'El primer apellido no puede contener números ni caracteres especiales'),
    alias: Yup.string()
    .max(20, 'El alias no debe sobrepasar los 20 carácteres'),
    genero: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es obligatorio'),
    altura: Yup.number()
    .typeError('Debe ser un número')
    .required('Este campo es obligatorio'),
    peso: Yup.number()
    .typeError('Debe ser un número')
    .required('Este campo es obligatorio'),
    imc: Yup.string()
    .required('Este campo es obligatorio'),
    tipo_sangre: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es obligatorio'),
    fecha_nacimiento: Yup.date()
    .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro')
    .required('Este campo es obligatorio'),
    

  });

  const AlergiaSchema = Yup.object().shape({
    tipoAlergia: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
    alergeno: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
  });

  const PatologiaSchema = Yup.object().shape({
    tipoPatologia: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
    nombre_patologia: Yup.string()
    .required('Este campo es requerido'),
    transmisibilidad: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
    morbilidad_intensidad: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
  });

  const LimitacionSchema = Yup.object().shape({
    tipoLimitacion: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
    severidad: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
    origen_lim: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
    descripcion: Yup.string()
    .required('Este campo es requerido'),
  })

  const MedicamentoSchema = Yup.object().shape({
    nom_medicamento: Yup.string()
    .required('Este campo es requerido'),
    dosis: Yup.string()
    .required('Este campo es requerido'),
    periodicidad: Yup.string()
    .notOneOf([''], 'Por favor, selecciona una opción válida')
    .required('Este campo es requerido'),
  })


  const guardarDatosUsuario = (datosUsuario) => {
    db.transaction(tx => {
      console.log('Valores a insertar:', rut, pnombre, snombre, papellido, sapellido, alias, genero, altura, peso, imc, tipo_sangre, fecha_nacimiento, tieneAlergias, cronico, donante, limitacion_fisica, toma_medicamentos);
      tx.executeSql(
        'INSERT INTO Usuario (rut, pnombre, snombre, papellido, sapellido, alias, genero, altura, peso, imc, tipo_sangre, fecha_nacimiento, alergias, cronico, donante, limitacion_fisica, toma_medicamentos) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [datosUsuario.rut, datosUsuario.pnombre, datosUsuario.snombre, datosUsuario.papellido, datosUsuario.sapellido, datosUsuario.alias, datosUsuario.genero, datosUsuario.altura, datosUsuario.peso, datosUsuario.imc, datosUsuario.tipo_sangre, datosUsuario.fecha_nacimiento.toLocaleDateString(), datosUsuario.tieneAlergias, datosUsuario.cronico, datosUsuario.donante, datosUsuario.limitacion_fisica, datosUsuario.toma_medicamentos],
        (result) => { console.log('Insert usuario exitoso'); },
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

  // rangos de peso y altura
  const rangoTalla = Array.from({ length: 151 }, (_, i) => i + 150);
  const rangoPeso = Array.from({ length: 151 }, (_, i) => i + 30);


  
  // Calcula el IMC
  //useEffect((altura, peso) => {
  //  if (altura === '' && peso === '') {
  //    let msj = 'Debes seleccionar altura y peso primero'
  //    setImc(msj);
  //  } else if(altura === ''){
  //    let msj = 'Debes seleccionar altura primero'
  //    setImc(msj);
  //  } else if(peso === ''){
  //    let msj = 'Debes seleccionar peso primero'
  //    setImc(msj);
  //  } else if (altura && peso) {
  //    let imc = (peso / ((altura / 100) * (altura / 100))).toFixed(2);
  //    setImc(imc);
  //  } else {
  //    console.log('Error al calcular imc');
  //  }
  //}, [altura, peso]);



  /**///////////////////////////////////////////////////////////////////PANTALLA//////////////////////////////////////////////////////////////////////////////*/
  return (
    <ScrollView classname="container">
      <CustomAlert
        isVisible={initialAlert}
        onClose={() => setInitialAlert(false)}
        message='Ingrese sus datos personales'
      />
      <CustomAlert
        isVisible={saveAlert}
        onClose={() => {
          setSaveAlert(false)
          navigation.navigate('Principal');
        }
        }
        message='Datos guardados exitosamente'
      />
      <Formik
        initialValues={{ 
          rut: '',
          pnombre: '', 
          snombre: '', 
          papellido: '', 
          sapellido: '', 
          alias: '', 
          genero: '', 
          altura: '',
          peso: '',
          imc: '',
          tipo_sangre: '', 
          fecha_nacimiento: new Date(), 
          tieneAlergias: '', 
          cronico: '', 
          donante: '', 
          limitacion_fisica: '', 
          toma_medicamentos: ''

        }}

        validationSchema={UserSchema}
        onSubmit={(values) => {
          console.log(values.pnombre + ' ' + values.snombre);
          guardarDatosUsuario(values);
        }}
      >
        {(formikProps) => (
          <View style={styles.container} className='mt-5'>
          <Text style={styles.header}>Ingresa tu Rut: </Text>
          <TextInput
            style={[styles.input, {borderBottomColor: formikProps.touched.rut && formikProps.errors.rut ? 'red' : formikProps.touched.rut && formikProps.values.rut ? '#23a55a' : 'black'}]}
            placeholder="ej: 12345678-9"
            onChangeText={formikProps.handleChange('rut')}
            value={formikProps.values.rut}
            onBlur={formikProps.handleBlur('rut')}
          />
        
          <Text style={styles.formErrorText}>{formikProps.touched.rut && formikProps.errors.rut}</Text>
      
          <Text style={styles.header}>Ingresa tu primer nombre: </Text>
          <TextInput
            style={[styles.input, {borderBottomColor: formikProps.touched.pnombre && formikProps.errors.pnombre ? 'red' : formikProps.touched.pnombre && formikProps.values.pnombre ? '#23a55a' : 'black'}]}
            placeholder="Primer nombre"
            onChangeText={formikProps.handleChange('pnombre')}
            value={formikProps.values.pnombre}
            onBlur={formikProps.handleBlur('pnombre')}
          />
          
          <Text style={styles.formErrorText}>{formikProps.touched.pnombre && formikProps.errors.pnombre}</Text>
        
          <Text style={styles.header}>Ingresa tu segundo nombre: </Text>
          <TextInput
            style={[styles.input, {borderBottomColor: formikProps.touched.snombre && formikProps.errors.snombre ? 'red' : formikProps.touched.snombre && formikProps.values.snombre ? '#23a55a' : 'black'}]}
            placeholder="Segundo nombre"
            onChangeText={formikProps.handleChange('snombre')}
            value={formikProps.values.snombre}
            onBlur={formikProps.handleBlur('snombre')}
          />

          <Text style={styles.formErrorText}>{formikProps.touched.snombre && formikProps.errors.snombre}</Text>

          <Text style={styles.header}>Ingresa tu primer apellido: </Text>
          <TextInput
            style={[styles.input, {borderBottomColor: formikProps.touched.papellido && formikProps.errors.papellido ? 'red' : formikProps.touched.papellido && formikProps.values.papellido ? '#23a55a' : 'black'}]}
            placeholder="Primer apellido"
            onChangeText={formikProps.handleChange('papellido')}
            value={formikProps.values.papellido}
            onBlur={formikProps.handleBlur('papellido')}
          />

          <Text style={styles.formErrorText}>{formikProps.touched.papellido && formikProps.errors.papellido}</Text>

          <Text style={styles.header}>Ingresa tu segundo apellido: </Text>
          <TextInput
            style={[styles.input, {borderBottomColor: formikProps.touched.sapellido && formikProps.errors.sapellido ? 'red' : formikProps.touched.sapellido && formikProps.values.sapellido ? '#23a55a' : 'black'}]}
            placeholder="Segundo apellido"
            onChangeText={formikProps.handleChange('sapellido')}
            value={formikProps.values.sapellido}
            onBlur={formikProps.handleBlur('sapellido')}
          />

          <Text style={styles.formErrorText}>{formikProps.touched.sapellido && formikProps.errors.sapellido}</Text>

          <Text style={styles.header}>Ingresa tu  Alias: </Text>
          <TextInput
            style={[styles.input, {borderBottomColor: formikProps.touched.alias && formikProps.errors.alias ? 'red' : formikProps.touched.alias && formikProps.values.alias ? '#23a55a' : 'black'}]}
            placeholder="Alias"
            onChangeText={formikProps.handleChange('alias')}
            value={formikProps.values.alias}
            onBlur={formikProps.handleBlur('alias')}
          />

          <Text style={styles.formErrorText}>{formikProps.touched.alias && formikProps.errors.alias}</Text>

          <Text style={styles.header}>Indica tu genero: </Text>
          <View  style={[styles.inputPicker, {borderColor: formikProps.touched.genero && formikProps.errors.genero ? 'red' : formikProps.touched.genero && formikProps.values.genero ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.genero}
              onValueChange={(itemValue) => formikProps.setFieldValue('genero', itemValue)}
              onBlur={formikProps.handleBlur('genero')}
              
            >
              <Picker.Item label="Toca aqui para seleccionar una opción" value=""/>
              <Picker.Item label="Hombre" value="Hombre" />
              <Picker.Item label="Mujer" value="Mujer" />
              <Picker.Item label="No Binario" value="No Binario" />
              <Picker.Item label="Prefiero no decirlo" value="Prefiero no decirlo" />
            </Picker>
          </View>

          <Text style={styles.formErrorText}>{formikProps.touched.genero && formikProps.errors.genero}</Text>
          
          <Text style={styles.header}>Selecciona tu altura: </Text>
          <SelectorRueda rango={rangoTalla} titulo="Altura (cm)" onValueChange={(itemValue) => {formikProps.setFieldValue('altura', itemValue);}} metrica='cm'/>
  
          <Text style={styles.formErrorText}>{formikProps.touched.altura && formikProps.errors.altura}</Text>

          <Text style={styles.header}>Selecciona tu peso: </Text>
          <SelectorRueda style={{borderColor: formikProps.touched.peso && formikProps.errors.peso ? 'red' : formikProps.touched.peso && formikProps.values.peso ? '#23a55a' : 'black'}} rango={rangoPeso} titulo="Peso (kg)" onValueChange={(itemValue) => {formikProps.setFieldValue('peso', itemValue)}} metrica='kg' />

          <Text style={styles.formErrorText}>{formikProps.touched.peso && formikProps.errors.peso}</Text>  

          <Text style={styles.header}>Tu IMC es: </Text>
          <TextInput
            style={styles.inputIMC}
            editable={false}
            value={formikProps.values.imc}
            
          />

          {useEffect(() => {
            const { altura, peso } = formikProps.values;

            if (altura === '' && peso === '') {
              let msj = 'Debes seleccionar altura y peso primero'
              formikProps.setFieldValue('imc', msj);
            } else if(altura === '') {
              let msj = 'Debes seleccionar altura primero'
              formikProps.setFieldValue('imc', msj);
            } else if (peso === '') {
              let msj = 'Debes seleccionar peso primero'
              formikProps.setFieldValue('imc', msj);
            } else if (altura && peso) {
              const imc = (peso / ((altura / 100) * (altura / 100))).toFixed(2);
              formikProps.setFieldValue('imc', imc);
            }
          }, [formikProps.values.altura, formikProps.values.peso])}

          <Text style={styles.header}>Selecciona tu tipo de sangre: </Text>
          <View style={[styles.inputPicker, {borderColor: formikProps.touched.tipo_sangre && formikProps.errors.tipo_sangre ? 'red' : formikProps.touched.tipo_sangre && formikProps.values.tipo_sangre ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.tipo_sangre}
              onValueChange={(itemValue) => formikProps.setFieldValue('tipo_sangre', itemValue)}
              onBlur={formikProps.handleBlur('tipo_sangre')}
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

          <Text style={styles.formErrorText}>{formikProps.touched.tipo_sangre && formikProps.errors.tipo_sangre}</Text>

          <Text style={styles.header}>Selecciona tu fecha de nacimiento: </Text>
          <TouchableOpacity onPress={() => setShow(true)}>
            <TextInput
              style={[styles.inputfecha, {borderColor: formikProps.touched.fecha_nacimiento && formikProps.errors.fecha_nacimiento ? 'red' : formikProps.touched.fecha_nacimiento && formikProps.values.fecha_nacimiento ? '#23a55a' : 'black'}]}
              placeholder="Toca aqui para seleccionar una fecha de nacimiento"
              value={formikProps.values.fecha_nacimiento.toLocaleDateString()}
              editable={false}
              onBlur={formikProps.handleBlur('fecha_nacimiento')}
            />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={'date'}
              is24Hour={true}
              display="spinner"
              onChange={(event, selectedDate) => {
                setShow(false);
                formikProps.setFieldValue('fecha_nacimiento', selectedDate);
              }}

            />
          )}

          <Text style={styles.formErrorText}>{formikProps.touched.fecha_nacimiento && formikProps.errors.fecha_nacimiento}</Text>

          <Text style={styles.header}>Indica si posees o no alergias: </Text>
          <View style={[styles.inputPicker, {borderColor: formikProps.touched.tieneAlergias && formikProps.values.tieneAlergias ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.tieneAlergias}
              onValueChange={(itemValue) => {
                formikProps.setFieldValue('tieneAlergias', itemValue),
                setModalVisibleAlergias(itemValue === 'Sí')
                }}

              onBlur={formikProps.handleBlur('tieneAlergias')}
              
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
              <Formik 
              initialValues={{
                tipoAlergia: '',
                alergeno: ''
                
              }}

              validationSchema={AlergiaSchema}
              onSubmit={(values) => {
                //console.log('antes de resetear: ' + values.tipoAlergia + ' ' + values.alergeno);
                const nuevaAlergia = {tipo: values.tipoAlergia, alergeno: values.alergeno, rut: rut};
                setAlergias([...alergias, nuevaAlergia]);
                values.tipoAlergia = '';
                values.alergeno = '';
                //console.log('despues de resetear: ' + values.tipoAlergia + ' ' + values.alergeno);
                
              }}
              >
              {(alergiaFormikProps) => (
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.header}>Ingresa tu tipo de alergia:</Text>
                  <View style={[styles.inputPicker, {borderColor: alergiaFormikProps.touched.tipoAlergia && alergiaFormikProps.errors.tipoAlergia ? 'red' : alergiaFormikProps.touched.tipoAlergia && alergiaFormikProps.values.tipoAlergia ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={alergiaFormikProps.values.tipoAlergia}
                      onValueChange={(itemValue) => alergiaFormikProps.setFieldValue('tipoAlergia', itemValue)}
                      onBlur={alergiaFormikProps.handleBlur('tipoAlergia')}
                    >
                      <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                      <Picker.Item label="Alergenos" value="Alergenos" />
                      <Picker.Item label="Medicamentos" value="Medicamentos" />
                      <Picker.Item label="Alimentos" value="Alimentos" />
                    </Picker>
                  </View>
                  <CustomAlert
                    isVisible={saveAlergiaAlert}
                    onClose={() => {setSaveAlergiaAlert(false)}}
                    message='Alergia Ingresada exitosamente'
                  />

                  <Text style={styles.formErrorText}>{alergiaFormikProps.touched.tipoAlergia && alergiaFormikProps.errors.tipoAlergia}</Text>

                  <Text style={styles.header}>Ingresa tu alergeno:</Text>
                  <TextInput
                    style={[styles.input, {borderBottomColor: alergiaFormikProps.touched.alergeno && alergiaFormikProps.errors.alergeno ? 'red' : alergiaFormikProps.touched.alergeno && alergiaFormikProps.values.alergeno ? '#23a55a' : 'black'}]}
                    placeholderTextColor="gray"
                    placeholder="ej: Perros"
                    onChangeText={alergiaFormikProps.handleChange('alergeno')}
                    value={alergiaFormikProps.values.alergeno}
                    onBlur={alergiaFormikProps.handleBlur('alergeno')}
                  />

                  <Text style={styles.formErrorText}>{alergiaFormikProps.touched.alergeno && alergiaFormikProps.errors.alergeno}</Text>

                  <View style={styles.buttonContainerCenter}>
                    <TouchableOpacity style={styles.alertButton} onPress={() => {
                      alergiaFormikProps.validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          alergiaFormikProps.handleSubmit();
                          setSaveAlergiaAlert(true);
                          
                        } else {
                          setInvalidFormAlert(true);
                          alergiaFormikProps.submitForm();
                        }
                      })
                      }}>
                      <Text style={styles.alertButtonText}>Agregar nueva alergia</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alertCloseButton} onPress={() => {setModalVisibleAlergias(false);}}>
                      <Text style={styles.alertCloseButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                  
                </View>
              </View>)}
              </Formik>
              
            </Modal>
            <CustomAlert
              isVisible={isAlertVisible}
              onClose={() => setAlertVisible(false)}
              message='No haz ingresado tus alergias.'
            />
          </View>

          <Text style={styles.header}>Indica si posees o no patologias cronicas: </Text>
          <View style={[styles.inputPicker, {borderColor: formikProps.touched.cronico && formikProps.values.cronico ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.cronico}
              onValueChange={(itemValue) => {
                formikProps.setFieldValue('cronico', itemValue),
                setModalVisiblePatologias(itemValue === 'Sí')
              }}

              onBlur={formikProps.handleBlur('cronico')}
              
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

              <Formik
              initialValues={{
                tipoPatologia: '',
                nombre_patologia: '',
                transmisibilidad: '',
                morbilidad_intensidad: '',

              }}

              validationSchema={PatologiaSchema}
              onSubmit={(values) => {
                const nuevaPatologia = {tipoPatologia: values.tipoPatologia, nombre_patologia: values.nombre_patologia, transmisibilidad: values.transmisibilidad, morbilidad_intensidad: values.morbilidad_intensidad, rut: rut};
                setPatologias([...patologias, nuevaPatologia]);
                values.tipoPatologia = '';
                values.nombre_patologia = '';
                values.transmisibilidad = '';
                values.morbilidad_intensidad = '';
                
              }}
              >
              {(patologiaFormikProps) => (


              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.header}>Ingresa tu tipo de patologia:</Text>
                  <View style={[styles.inputPicker, {borderColor: patologiaFormikProps.touched.tipoPatologia && patologiaFormikProps.errors.tipoPatologia ? 'red' : patologiaFormikProps.touched.tipoPatologia && patologiaFormikProps.values.tipoPatologia ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={patologiaFormikProps.values.tipoPatologia}
                      onValueChange={(itemValue) => patologiaFormikProps.setFieldValue('tipoPatologia', itemValue)}
                      onBlur={patologiaFormikProps.handleBlur('tipoPatologia')}
                      
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

                  <CustomAlert
                    isVisible={savePatologiaAlert}
                    onClose={() => {setSavePatologiaAlert(false)}}
                    message='Patología Ingresada exitosamente'
                  />

                  <Text style={styles.formErrorText}>{patologiaFormikProps.touched.tipoPatologia && patologiaFormikProps.errors.tipoPatologia}</Text>

                  <Text style={styles.header}>Ingresa el nombre de tu patologia:</Text>
                  <TextInput
                    style={[styles.input, {borderBottomColor: patologiaFormikProps.touched.nombre_patologia && patologiaFormikProps.errors.nombre_patologia ? 'red' : patologiaFormikProps.touched.nombre_patologia && patologiaFormikProps.values.nombre_patologia ? '#23a55a' : 'black'}]}
                    placeholderTextColor="gray"
                    placeholder="ej: XXXXX"
                    onChangeText={patologiaFormikProps.handleChange('nombre_patologia')}
                    value={patologiaFormikProps.values.nombre_patologia}
                    onBlur={patologiaFormikProps.handleBlur('nombre_patologia')}
                  />

                  <Text style={styles.formErrorText}>{patologiaFormikProps.touched.nombre_patologia && patologiaFormikProps.errors.nombre_patologia}</Text>

                  <Text style={styles.header}>Indica la transmisibilidad de tu patologia:</Text>
                  <View style={[styles.inputPicker, {borderColor: patologiaFormikProps.touched.transmisibilidad && patologiaFormikProps.errors.transmisibilidad ? 'red' : patologiaFormikProps.touched.transmisibilidad && patologiaFormikProps.values.transmisibilidad ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={patologiaFormikProps.values.transmisibilidad}
                      onValueChange={(itemValue) => patologiaFormikProps.setFieldValue('transmisibilidad', itemValue)}
                      onBlur={patologiaFormikProps.handleBlur('transmisibilidad')}
                    >
                      <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                      <Picker.Item label="Patología crónica no transmisible" value="Patología crónica no transmisible" />
                      <Picker.Item label="Patología crónica transmisible" value="Patología crónica transmisible" />
                    </Picker>
                  </View>

                  <Text style={styles.formErrorText}>{patologiaFormikProps.touched.transmisibilidad && patologiaFormikProps.errors.transmisibilidad}</Text>

                  <Text style={styles.header}>Indica el nivel de morbilidad e intensidad de tu patologia:</Text>
                  <View style={[styles.inputPicker, {borderColor: patologiaFormikProps.touched.morbilidad_intensidad && patologiaFormikProps.errors.morbilidad_intensidad ? 'red' : patologiaFormikProps.touched.morbilidad_intensidad && patologiaFormikProps.values.morbilidad_intensidad ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={patologiaFormikProps.values.morbilidad_intensidad}
                      onValueChange={(itemValue) => patologiaFormikProps.setFieldValue('morbilidad_intensidad', itemValue)}
                      onBlur={patologiaFormikProps.handleBlur('morbilidad_intensidad')}
                    >
                      <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                      <Picker.Item label="Patología crónica de alto consumo" value="Patología crónica de alto consumo" />
                      <Picker.Item label="Patología crónica de bajo consumo" value="Patología crónica de bajo consumo" />
                    </Picker>
                  </View>

                  <Text style={styles.formErrorText}>{patologiaFormikProps.touched.morbilidad_intensidad && patologiaFormikProps.errors.morbilidad_intensidad}</Text>

                  <View style={styles.buttonContainerCenter}>
                    <TouchableOpacity style={styles.alertButton} onPress={() => {
                      patologiaFormikProps.validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          patologiaFormikProps.handleSubmit();
                          setSavePatologiaAlert(true);
                        } else {
                          setInvalidFormAlert(true);
                          patologiaFormikProps.submitForm();
                        }
                      })
                    }}>
                      <Text style={styles.alertButtonText}>Agregar Nueva Patología</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alertCloseButton} onPress={() => {setModalVisiblePatologias(false);}}>
                      <Text style={styles.alertCloseButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>)}
              
              </Formik>
            </Modal>
            <CustomAlert
              isVisible={isAlertVisible}
              onClose={() => setAlertVisible(false)}
              message='No haz ingresado tus patologias.'
            />
          </View>
          <Text style={styles.header}>Indica si eres o no donante: </Text>
          <View style={[styles.inputPicker, {borderColor: formikProps.touched.donante && formikProps.values.donante ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.donante}
              onValueChange={(itemValue) => formikProps.setFieldValue('donante', itemValue)}
              onBlur={formikProps.handleBlur('donante')}
            >
              <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
              <Picker.Item label="Sí" value="Sí" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          <Text style={styles.header}>Indica si posees o no limitaciones fisicas: </Text>
          <View style={[styles.inputPicker, {borderColor: formikProps.touched.limitacion_fisica && formikProps.values.limitacion_fisica ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.limitacion_fisica}
              onValueChange={(itemValue) => {
                formikProps.setFieldValue('limitacion_fisica', itemValue);
                setModalVisibleLimitaciones(itemValue === 'Sí');
              }}

              onBlur={formikProps.handleBlur('limitacion_fisica')}
              
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

              <Formik
              initialValues={{
                tipoLimitacion: '',
                severidad: '',
                origen_lim: '',
                descripcion: '',
              }}

              validationSchema={LimitacionSchema}
              onSubmit={(values) => {
                console.log(values.tipoLimitacion + ' - ' + values.severidad + ' - ' + values.origen_lim + ' - ' + values.descripcion);
                const nuevaLimitacion = {tipoLimitacion: values.tipoLimitacion, severidad: values.severidad, origen_lim: values.origen_lim, descripcion: values.descripcion, rut: rut};
                setLimitaciones([...limitaciones, nuevaLimitacion]);
                values.tipoLimitacion = '';
                values.severidad = '';
                values.origen_lim = '';
                values.descripcion = '';
              }}
              
              >
                {(limitacionFormikProps) => (
                  <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.header}>Indica tu tipo de limitacion fisica:</Text>
                  <View style={[styles.inputPicker, {borderColor: limitacionFormikProps.touched.tipoLimitacion && limitacionFormikProps.errors.tipoLimitacion ? 'red' : limitacionFormikProps.touched.tipoLimitacion && limitacionFormikProps.values.tipoLimitacion ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={limitacionFormikProps.values.tipoLimitacion}
                      onValueChange={(itemValue) => limitacionFormikProps.setFieldValue('tipoLimitacion', itemValue)}
                      onBlur={limitacionFormikProps.handleBlur('tipoLimitacion')}
                    >
                      <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                      <Picker.Item label="Motricidad" value="Motricidad" />
                      <Picker.Item label="Sensorial" value="Sensorial" />
                      <Picker.Item label="Mental" value="Mental" />
                    </Picker>
                  </View>

                  <Text style={styles.formErrorText}>{limitacionFormikProps.touched.tipoLimitacion && limitacionFormikProps.errors.tipoLimitacion}</Text>

                  <Text style={styles.header}>Indica tu nivel de severidad:</Text>
                  <View style={[styles.inputPicker, {borderColor: limitacionFormikProps.touched.severidad && limitacionFormikProps.errors.severidad ? 'red' : limitacionFormikProps.touched.severidad && limitacionFormikProps.values.severidad ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={limitacionFormikProps.values.severidad}
                      onValueChange={(itemValue) => limitacionFormikProps.setFieldValue('severidad', itemValue)}
                      onBlur={limitacionFormikProps.handleBlur('severidad')}
                    >
                      <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                      <Picker.Item label="Grave" value="Grave" />
                      <Picker.Item label="Moderada" value="Moderada" />
                      <Picker.Item label="Leve" value="Leve" />
                    </Picker>
                  </View>

                  <Text style={styles.formErrorText}>{limitacionFormikProps.touched.severidad && limitacionFormikProps.errors.severidad}</Text>

                  <Text style={styles.header}>Indica el origen de tu limitacion:</Text>
                  <View style={[styles.inputPicker, {borderColor: limitacionFormikProps.touched.origen_lim && limitacionFormikProps.errors.origen_lim ? 'red' : limitacionFormikProps.touched.origen_lim && limitacionFormikProps.values.origen_lim ? '#23a55a' : 'black'}]}>
                    <Picker
                      selectedValue={limitacionFormikProps.values.origen_lim}
                      onValueChange={(itemValue) => limitacionFormikProps.setFieldValue('origen_lim', itemValue)}
                      onBlur={limitacionFormikProps.handleBlur('origen_lim')}
                    >
                      <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                      <Picker.Item label="Adquirida" value="Adquirida" />
                      <Picker.Item label="Congénitas o de nacimiento" value="Congénitas o de nacimiento" />
                    </Picker>
                  </View>

                  <CustomAlert
                    isVisible={saveLimitacionAlert}
                    onClose={() => {setSaveLimitacionAlert(false)}}
                    message='Limitación Ingresada exitosamente'
                  />

                  <Text style={styles.formErrorText}>{limitacionFormikProps.touched.origen_lim && limitacionFormikProps.errors.origen_lim}</Text>

                  <Text style={styles.header}>Nombra o describe tu limitacion:</Text>
                  <TextInput
                    style={[styles.input, {borderBottomColor: limitacionFormikProps.touched.descripcion && limitacionFormikProps.errors.descripcion ? 'red' : limitacionFormikProps.touched.descripcion && limitacionFormikProps.values.descripcion ? '#23a55a' : 'black'}]}
                    placeholderTextColor="gray"
                    placeholder="ej: XXXXXX"
                    onChangeText={limitacionFormikProps.handleChange('descripcion')}
                    value={limitacionFormikProps.values.descripcion}
                    onBlur={limitacionFormikProps.handleBlur('descripcion')}
                  />

                  <Text style={styles.formErrorText}>{limitacionFormikProps.touched.descripcion && limitacionFormikProps.errors.descripcion}</Text>

                  <View style={styles.buttonContainerCenter}>
                    <TouchableOpacity style={styles.alertButton} onPress={() => {
                      limitacionFormikProps.validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          limitacionFormikProps.handleSubmit();
                          setSaveLimitacionAlert(true);
                        } else {
                          setInvalidFormAlert(true);
                          limitacionFormikProps.submitForm();
                        }
                      })
                    }}>
                      <Text style={styles.alertButtonText}>Agregar Nueva Limitación</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alertCloseButton} onPress={() => {setModalVisibleLimitaciones(false);}}>
                      <Text style={styles.alertCloseButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
                )}
                
              </Formik>
              
            </Modal>
            <CustomAlert
              isVisible={isAlertVisible}
              onClose={() => setAlertVisible(false)}
              message='No haz ingresado tus Limitaciones.'
            />
          </View>
          <Text style={styles.header}>Indica si tomas o no medicamentos: </Text>
          <View style={[styles.inputPicker, {borderColor: formikProps.touched.toma_medicamentos && formikProps.values.toma_medicamentos ? '#23a55a' : 'black'}]}>
            <Picker
              selectedValue={formikProps.values.toma_medicamentos}
              onValueChange={(itemValue) => {
                formikProps.setFieldValue('toma_medicamentos', itemValue);
                setModalVisibleMedicamentos(itemValue === 'Sí');
              }}

              onBlur={formikProps.handleBlur('toma_medicamentos')}
              
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
              <Formik
              initialValues={{
                nom_medicamento: '',
                dosis: '',
                periodicidad: '',
              }}

              validationSchema={MedicamentoSchema}
              onSubmit={(values) => {
                console.log(values.nom_medicamento + ' - ' + values.dosis + ' - ' + values.periodicidad);
                const nuevoMedicamento = { nom_medicamento: values.nom_medicamento, dosis: values.dosis, periodicidad: values.periodicidad, rut: rut};
                setMedicamentos([...medicamentos, nuevoMedicamento]);
                values.nom_medicamento = '';
                values.dosis = '';
                values.periodicidad = '';
              }}
              >
                {(medicamentoFormikProps) => (
                  <View style={styles.centeredView}>
                  <View className="px-4" style={styles.modalView}>
                    <Text style={styles.header}>Indica el nombre del medicamento:</Text>
                    <TextInput
                      style={[styles.input, {borderBottomColor: medicamentoFormikProps.touched.nom_medicamento && medicamentoFormikProps.errors.nom_medicamento ? 'red' : medicamentoFormikProps.touched.nom_medicamento && medicamentoFormikProps.values.nom_medicamento ? '#23a55a' : 'black'}]}
                      placeholderTextColor="gray"
                      placeholder="ej: XXXXXX"
                      onChangeText={medicamentoFormikProps.handleChange('nom_medicamento')}
                      value={medicamentoFormikProps.values.nom_medicamento}
                      onBlur={medicamentoFormikProps.handleBlur('nom_medicamento')}
                    />

                    <Text style={styles.formErrorText}>{medicamentoFormikProps.touched.nom_medicamento && medicamentoFormikProps.errors.nom_medicamento}</Text>

                    <Text style={styles.header}>Indica la dosis a ingerir:</Text>
                    <TextInput
                      style={[styles.input, {borderBottomColor: medicamentoFormikProps.touched.dosis && medicamentoFormikProps.errors.dosis ? 'red' : medicamentoFormikProps.touched.dosis && medicamentoFormikProps.values.dosis ? '#23a55a' : 'black'}]}
                      placeholderTextColor="gray"
                      placeholder="ej: XXXXXX"
                      onChangeText={medicamentoFormikProps.handleChange('dosis')}
                      value={medicamentoFormikProps.values.dosis}
                      onBlur={medicamentoFormikProps.handleBlur('dosis')}
                    />

                    <CustomAlert
                    isVisible={saveMedicamentoAlert}
                    onClose={() => {setSaveMedicamentoAlert(false)}}
                    message='Medicamento Ingresado exitosamente'
                    />

                    <Text style={styles.formErrorText}>{medicamentoFormikProps.touched.dosis && medicamentoFormikProps.errors.dosis}</Text>

                    <Text style={styles.header}>Indica cada cuanto debes tomar el medicamento:</Text>
                    <View style={[styles.inputPicker, {borderColor: medicamentoFormikProps.touched.periodicidad && medicamentoFormikProps.errors.periodicidad ? 'red' : medicamentoFormikProps.touched.periodicidad && medicamentoFormikProps.values.periodicidad ? '#23a55a' : 'black'}]}>
                      <Picker
                        selectedValue={medicamentoFormikProps.values.periodicidad}
                        onValueChange={(itemValue) => medicamentoFormikProps.setFieldValue('periodicidad', itemValue)}
                        onBlur={medicamentoFormikProps.handleBlur('periodicidad')}
                      >
                        <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                        <Picker.Item label="Cada 24 hrs (Una vez al dia)" value="Cada 24 hrs (Una vez al dia)" />
                        <Picker.Item label="Cada 12 hrs (Dos veces al dia)" value="Cada 12 hrs (Dos veces al dia)" />
                        <Picker.Item label="Cada 8 hrs (Tres veces al dia)" value="Cada 8 hrs (Tres veces al dia)" />
                        <Picker.Item label="Cada 6 hrs (Cuatro veces al dia)" value="Cada 6 hrs (Cuatro veces al dia)" />
                        <Picker.Item label="Cada 4 hrs (Seis veces al dia)" value="Cada 4 hrs (Seis veces al dia)" />
                      </Picker>
                    </View>

                    <Text style={styles.formErrorText}>{medicamentoFormikProps.touched.periodicidad && medicamentoFormikProps.errors.periodicidad}</Text>

                    <View style={styles.buttonContainerCenter}>
                      <TouchableOpacity style={styles.alertButton} onPress={() => {
                        medicamentoFormikProps.validateForm().then((errors) => {
                          if (Object.keys(errors).length === 0) {
                            medicamentoFormikProps.handleSubmit();
                            setSaveMedicamentoAlert(true);
                          } else {
                            setInvalidFormAlert(true);
                            medicamentoFormikProps.submitForm();
                          }
                        })
                      }}>
                        <Text style={styles.alertButtonText}>Agregar Nuevo Medicamento</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.alertCloseButton} onPress={() => {setModalVisibleMedicamentos(false);}}>
                        <Text style={styles.alertCloseButtonText}>Cerrar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                )}
                
              </Formik>
              
            </Modal>
            <CustomAlert
              isVisible={isAlertVisible}
              onClose={() => setAlertVisible(false)}
              message='No haz ingresado tus medicamentos.'
            />

            <CustomAlert
              isVisible={invalidFormAlert}
              onClose={() => setInvalidFormAlert(false)}
              message='Existen errores o datos por completar en el formulario, por favor completelo correctamente'
            />

          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              formikProps.validateForm().then((errors) => {
                if (Object.keys(errors).length === 0) {
                  formikProps.handleSubmit();
                } else {
                  //alert('Faltan datos por completar');
                  setInvalidFormAlert(true);
                  formikProps.submitForm();
                }
              })
            }}
          >
            <Text style={styles.secondaryText}>
            Guardar 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="mt-3"
            style={styles.closeButton}
            onPress={() => navigation.navigate('Saludo')} 
          >
            <Text style={styles.primaryText}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
        )}
      </Formik>
    </ScrollView >
  );
}
export default SignIn;
