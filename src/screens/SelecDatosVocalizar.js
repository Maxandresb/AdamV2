
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
import styles from '../api/styles';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { obtenerRut } from "../api/sqlite"
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';


const db = SQLite.openDatabase('adamdb.db');
const PatologiaCronica = ({ index, patologia, showPatologia, pressPatologia, patologias, pressSelectPatologia }) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];
  return (
    <View>
      {showPatologia && (
        <>
          <TouchableOpacity
            style={patologia.Nombre_patologia.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectPatologia(index, 'Nombre_patologia')}
          >
            <Text style={styles.content3}>{'Nombre enfermedad:'}</Text>
            <Text style={styles.content2}>{patologia.Nombre_patologia.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={patologia.Tipo_de_patologia.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectPatologia(index, 'Tipo_de_patologia')}
          >
            <Text style={styles.content3}>{'Tipo de enfermedad:'}</Text>
            <Text style={styles.content2}>{patologia.Tipo_de_patologia.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={patologia.Transmisibilidad.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectPatologia(index, 'Transmisibilidad')}
          >
            <Text style={styles.content3}>{'Transmisibilidad:'}</Text>
            <Text style={styles.content2}>{patologia.Transmisibilidad.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={patologia.Morbilidad_o_intensidad.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectPatologia(index, 'Morbilidad_o_intensidad')}
          >
            <Text style={styles.content3}>{'Morbilidad:'}</Text>
            <Text style={styles.content2}>{patologia.Morbilidad_o_intensidad.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          {patologias.length > 1 ? (
            <>
              <View style={styles.lineaContainer4}></View>
            </>
          ) : null}
        </>
      )}
    </View>
  )
}
const Medicamento = ({ index, medicamento, showMedicamento, pressMedicamento, medicamentos, pressSelectMedicamento }) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];
  return (
    <View>
      {showMedicamento && (
        <>
          <TouchableOpacity
            style={medicamento.Medicamento.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectMedicamento(index, 'Medicamento')}
          >
            <Text style={styles.content3}>{'Nombre medicamento:'}</Text>
            <Text style={styles.content2}>{medicamento.Medicamento.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={medicamento.Dosis.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectMedicamento(index, 'Dosis')}
          >
            <Text style={styles.content3}>{'Dosis:'}</Text>
            <Text style={styles.content2}>{medicamento.Dosis.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={medicamento.Periodicidad.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectMedicamento(index, 'Periodicidad')}
          >
            <Text style={styles.content3}>{'Frecuencia:'}</Text>
            <Text style={styles.content2}>{medicamento.Periodicidad.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          {medicamentos.length > 1 ? (
            <>
              <View style={styles.lineaContainer4}></View>
            </>
          ) : null}
        </>
      )}
    </View>
  )
}
const Alergia = ({ index, alergia, showAlergia, pressAlergia, alergias, pressSelectAlergia }) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];
  return (
    <View>
      {showAlergia && (
        <>
          <TouchableOpacity
            style={alergia.Tipo_de_alergia.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectAlergia(index, 'Tipo_de_alergia')}
          >
            <Text style={styles.content3}>{'Tipo de alergia:'}</Text>
            <Text style={styles.content2}>{alergia.Tipo_de_alergia.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={alergia.Alergeno.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectAlergia(index, 'Alergeno')}
          >
            <Text style={styles.content3}>{'Alergeno:'}</Text>
            <Text style={styles.content2}>{alergia.Alergeno.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          {alergias.length > 1 ? (
            <>
              <View style={styles.lineaContainer4}></View>
            </>
          ) : null}
        </>
      )}
    </View>
  )
}
const Limitacion = ({ index, limitacion, showLimitacion, pressLimitacion, limitaciones, pressSelectLimitacion }) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];
  return (
    <View>
      {showLimitacion && (
        <>
          <TouchableOpacity
            style={limitacion.Tipo_de_limitacion.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectLimitacion(index, 'Tipo_de_limitacion')}
          >
            <Text style={styles.content3}>{'Tipo de limitación:'}</Text>
            <Text style={styles.content2}>{limitacion.Tipo_de_limitacion.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={limitacion.Severidad_de_la_limitacion.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectLimitacion(index, 'Severidad_de_la_limitacion')}
          >
            <Text style={styles.content3}>{'Severidad:'}</Text>
            <Text style={styles.content2}>{limitacion.Severidad_de_la_limitacion.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={limitacion.Origen_de_la_limitacion.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectLimitacion(index, 'Origen_de_la_limitacion')}
          >
            <Text style={styles.content3}>{'Origen:'}</Text>
            <Text style={styles.content2}>{limitacion.Origen_de_la_limitacion.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={limitacion.Descripcion_de_la_limitacion.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectLimitacion(index, 'Descripcion_de_la_limitacion')}
          >
            <Text style={styles.content3}>{'Descripción:'}</Text>
            <Text style={styles.content2}>{limitacion.Descripcion_de_la_limitacion.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          {limitaciones.length > 1 ? (
            <>
              <View style={styles.lineaContainer4}></View>
            </>
          ) : null}
        </>
      )}
    </View>
  )
}
//ccrear componente usuario
const Usuario = ({ index, usuario, showUsuario, pressUsuario, pressSelectUsuario }) => {
  const {theme, updateTheme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];
  return (
    <View>
      {showUsuario && (
        <>
          <TouchableOpacity
            style={usuario.Rut.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Rut')}
          >
            <Text style={styles.content3}>{'Rut:'}</Text>
            <Text style={styles.content2}>{usuario.Rut.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Primer_nombre.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Primer_nombre')}
          >
            <Text style={styles.content3}>{'Primer nombre:'}</Text>
            <Text style={styles.content2}>{usuario.Primer_nombre.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Segundo_nombre.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Segundo_nombre')}
          >
            <Text style={styles.content3}>{'Segundo nombre:'}</Text>
            <Text style={styles.content2}>{usuario.Segundo_nombre.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Primer_apellido.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Primer_apellido')}
          >
            <Text style={styles.content3}>{'Primer apellido:'}</Text>
            <Text style={styles.content2}>{usuario.Primer_apellido.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Segundo_apellido.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Segundo_apellido')}
          >
            <Text style={styles.content3}>{'Segundo apellido:'}</Text>
            <Text style={styles.content2}>{usuario.Segundo_apellido.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Alias.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Alias')}
          >
            <Text style={styles.content3}>{'Alias:'}</Text>
            <Text style={styles.content2}>{usuario.Alias.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Genero.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Genero')}
          >
            <Text style={styles.content3}>{'Género:'}</Text>
            <Text style={styles.content2}>{usuario.Genero.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Altura.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Altura')}
          >
            <Text style={styles.content3}>{'Altura:'}</Text>
            <Text style={styles.content2}>{usuario.Altura.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Peso.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Peso')}
          >
            <Text style={styles.content3}>{'Peso:'}</Text>
            <Text style={styles.content2}>{usuario.Peso.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.IMC.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'IMC')}
          >
            <Text style={styles.content3}>{'IMC:'}</Text>
            <Text style={styles.content2}>{usuario.IMC.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Tipo_de_sangre.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Tipo_de_sangre')}
          >
            <Text style={styles.content3}>{'Tipo de sangre:'}</Text>
            <Text style={styles.content2}>{usuario.Tipo_de_sangre.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Fecha_de_nacimiento.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Fecha_de_nacimiento')}
          >
            <Text style={styles.content3}>{'Fecha de nacimiento:'}</Text>
            <Text style={styles.content2}>{usuario.Fecha_de_nacimiento.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Edad.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Edad')}
          >
            <Text style={styles.content3}>{'Edad:'}</Text>
            <Text style={styles.content2}>{usuario.Edad.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
          <TouchableOpacity
            style={usuario.Es_donante.isSelected ? styles.selectedText : styles.unselectedText}
            onPress={() => pressSelectUsuario(index, 'Es_donante')}
          >
            <Text style={styles.content3}>{'Donante:'}</Text>
            <Text style={styles.content2}>{usuario.Es_donante.valor}</Text>
          </TouchableOpacity>
          <View style={styles.lineaContainer3}></View>
        </>
      )}
    </View>
  )
}
const ComponenteLlenado = ({ patologias, medicamentos, alergias, limitaciones, showUsuario, showPatologia, showMedicamento, showAlergia, showLimitacion }) => {
  <View>
    {((patologias.length > 1 && medicamentos.length === 0 && alergias.length === 0 && limitaciones.length === 0) ||
      (medicamentos.length > 1 && patologias.length === 0 && alergias.length === 0 && limitaciones.length === 0) ||
      (alergias.length > 1 && patologias.length === 0 && medicamentos.length === 0 && limitaciones.length === 0) ||
      (limitaciones.length > 1 && patologias.length === 0 && medicamentos.length === 0 && alergias.length === 0)) ? (
      <>
        {(showUsuario || showPatologia || showMedicamento || showAlergia || showLimitacion) ? (
          <></>
        ) : null}
      </>
    ) : (patologias.length === 0 && medicamentos.length === 0 && alergias.length === 0 && limitaciones.length === 0) ? (
      <View style={styles.espacioContainer5}></View>
    ) : null}

  </View>
}

export default function SelecDatosVocalizar({ navigation }) {
  const [data, setData] = useState([]);
  const [fecha_nacimiento, setFecha_nacimiento] = useState('');
  const [showUsuario, setShowUsuario] = useState(false);
  const [rutUsuario, setRutUsuario] = useState('')
  const obtenerDatosUsuario = async () => {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM Usuario',
            [],
            (_, { rows: { _array } }) => {
              setRutUsuario(_array[0].rut)
              const edadUsuario = calcularEdad(_array[0].fecha_nacimiento)
              const datosUserConSeleccion = _array.map(usuario => ({
                ...usuario,
                Rut: { valor: usuario.rut, isSelected: false },
                Primer_nombre: { valor: usuario.pnombre, isSelected: false },
                Segundo_nombre: { valor: usuario.snombre, isSelected: false },
                Primer_apellido: { valor: usuario.papellido, isSelected: false },
                Segundo_apellido: { valor: usuario.sapellido, isSelected: false },
                Alias: { valor: usuario.alias, isSelected: false },
                Genero: { valor: usuario.genero, isSelected: false },
                Altura: { valor: usuario.altura, isSelected: false },
                Peso: { valor: usuario.peso, isSelected: false },
                IMC: { valor: usuario.imc, isSelected: false },
                Tipo_de_sangre: { valor: usuario.tipo_sangre, isSelected: false },
                Fecha_de_nacimiento: { valor: usuario.fecha_nacimiento, isSelected: false },
                Edad: { valor: edadUsuario, isSelected: false },
                Es_donante: { valor: usuario.donante, isSelected: false },

              }))
              setData(datosUserConSeleccion);
              resolve()
            },
            (_, error) => { reject('ERROR AL OBTENER LOS DATOS DEL USUARIO', error) }
          );
        });
      } catch (error) {
        reject('ERROR AL OBTENER LOS DATOS DEL USUARIO', error)
      }
    })
  }
  const pressUsuario = () => {
    setShowUsuario(!showUsuario)
  }
  const datosUsuarioSeleccionados = useRef([]);
  const pressSelectUsuario = (index, campo) => {
    const newDatosUsuario = [...data];
    newDatosUsuario[index][campo].isSelected = !newDatosUsuario[index][campo].isSelected;
    setData(newDatosUsuario);
    // Actualiza datosUsuarioSeleccionados
    datosUsuarioSeleccionados.current = newDatosUsuario.flatMap(usuario =>
      Object.entries(usuario).flatMap(([key, value]) =>
        value.isSelected ? [{ [key]: value.valor }] : []
      )
    );
  }
  const [patologias, setPatologias] = useState([]);
  const [showPatologia, setShowPatologia] = useState(false);
  const obtenerPatologias = async () => {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(async tx => {
          tx.executeSql(
            'SELECT * FROM PatologiasCronicas',
            [],
            (_, { rows: { _array } }) => {
              // Añadimos la propiedad isSelected a cada patología
              const patologiasConSeleccion = _array.map(patologia => ({
                ...patologia,
                Nombre_patologia: { valor: patologia.nombre_patologia, isSelected: false },
                Tipo_de_patologia: { valor: patologia.tipo_patologia, isSelected: false },
                Transmisibilidad: { valor: patologia.transmisibilidad, isSelected: false },
                Morbilidad_o_intensidad: { valor: patologia.morbilidad_intensidad, isSelected: false },
              }));
              setPatologias(patologiasConSeleccion);
              resolve()
            },
            (_, error) => { reject('ERROR AL OBTENER LAS PATOLOGIAS', error) }
          );
        });
      } catch (error) {
        reject('ERROR AL OBTENER LAS PATOLOGIAS', error)
      }
    })
  }
  const pressPatologia = () => {
    setShowPatologia(!showPatologia)
  }
  const patologiasSeleccionadas = useRef([]);
  const pressSelectCampoPatologia = (index, campo) => {
    const newPatologias = [...patologias];
    newPatologias[index][campo].isSelected = !newPatologias[index][campo].isSelected;
    setPatologias(newPatologias);
    // Actualiza patologiasSeleccionadas
    patologiasSeleccionadas.current = newPatologias.flatMap(patologia =>
      Object.entries(patologia).flatMap(([key, value]) =>
        value.isSelected ? [{ [key]: value.valor }] : []
      )
    );
  }
  const [medicamentos, setMedicamentos] = useState([]);
  const [showMedicamento, setShowMedicamento] = useState(false);
  const obtenerMedicamentos = async () => {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(async tx => {
          tx.executeSql(
            'SELECT * FROM Medicamentos',
            [],
            (_, { rows: { _array } }) => {
              const medicamentosConSeleccion = _array.map(medicamento => ({
                ...medicamento,
                Medicamento: { valor: medicamento.medicamento, isSelected: false },
                Dosis: { valor: medicamento.dosis, isSelected: false },
                Periodicidad: { valor: medicamento.periodicidad, isSelected: false },
              }));
              setMedicamentos(medicamentosConSeleccion);
              resolve()
            },
            (_, error) => { reject('ERROR AL OBTENER LOS MEDICAMENTOS', error) }
          );
        });
      } catch (error) {
        reject('ERROR AL OBTENER LOS MEDICAMENTOS', error)
      }
    })
  }
  const pressMedicamento = () => {
    setShowMedicamento(!showMedicamento)
  }
  const medicamentosSeleccionados = useRef([]);
  const pressSelectMedicamento = (index, campo) => {
    const newMedicamentos = [...medicamentos];
    newMedicamentos[index][campo].isSelected = !newMedicamentos[index][campo].isSelected;
    setMedicamentos(newMedicamentos);
    // Actualiza medicamentosSeleccionadas
    medicamentosSeleccionados.current = newMedicamentos.flatMap(medicamento =>
      Object.entries(medicamento).flatMap(([key, value]) =>
        value.isSelected ? [{ [key]: value.valor }] : []
      )
    );
  }
  const [alergias, setAlergias] = useState([]);
  const [showAlergia, setShowAlergia] = useState(false);
  const obtenerAlergias = async () => {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(async tx => {
          tx.executeSql(
            'SELECT * FROM Alergias',
            [],
            (_, { rows: { _array } }) => {
              const alergiasConSeleccion = _array.map(alergia => ({
                ...alergia,
                Tipo_de_alergia: { valor: alergia.tipo, isSelected: false },
                Alergeno: { valor: alergia.alergeno, isSelected: false },
              }));
              setAlergias(alergiasConSeleccion);
              resolve()
            },
            (_, error) => { reject('ERROR AL OBTENER LAS ALERGIAS', error) }
          );
        });
      } catch (error) {
        reject('ERROR AL OBTENER LAS ALERGIAS', error)
      }
    })
  }
  const pressAlergia = () => {
    setShowAlergia(!showAlergia)
  }
  //AlergiasSeleccionadas
  const alergiasSeleccionadas = useRef([]);
  const pressSelectAlergia = (index, campo) => {
    const newAlergias = [...alergias];
    newAlergias[index][campo].isSelected = !newAlergias[index][campo].isSelected;
    setAlergias(newAlergias);
    // Actualiza alergiasSeleccionadas
    alergiasSeleccionadas.current = newAlergias.flatMap(alergia =>
      Object.entries(alergia).flatMap(([key, value]) =>
        value.isSelected ? [{ [key]: value.valor }] : []
      )
    );
  }


  const [limitaciones, setLimitaciones] = useState([]);
  const [showLimitacion, setShowLimitacion] = useState(false)
  const obtenerLimitaciones = async () => {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(async tx => {
          tx.executeSql(
            'SELECT * FROM Limitaciones',
            [],
            (_, { rows: { _array } }) => {
              const limitacionesConSeleccion = _array.map(limitacion => ({
                ...limitacion,
                Tipo_de_limitacion: { valor: limitacion.tipo_lim, isSelected: false },
                Severidad_de_la_limitacion: { valor: limitacion.severidad_lim, isSelected: false },
                Origen_de_la_limitacion: { valor: limitacion.origen_lim, isSelected: false },
                Descripcion_de_la_limitacion: { valor: limitacion.descripcion_lim, isSelected: false },
              }));
              setLimitaciones(limitacionesConSeleccion);
              resolve()
            },
            (_, error) => { reject('ERROR AL OBTENER LAS LIMITACIONES', error) }
          );
        });
      } catch (error) {
        reject('ERROR AL OBTENER LAS LIMITACIONES', error)
      }
    })
  }
  const pressLimitacion = () => {
    setShowLimitacion(!showLimitacion)
  }
  const limitacionesSeleccionadas = useRef([]);
  const pressSelectLimitacion = (index, campo) => {
    const newLimitaciones = [...limitaciones];
    newLimitaciones[index][campo].isSelected = !newLimitaciones[index][campo].isSelected;
    setLimitaciones(newLimitaciones);
    // Actualiza limitacionesSeleccionadas
    limitacionesSeleccionadas.current = newLimitaciones.flatMap(limitacion =>
      Object.entries(limitacion).flatMap(([key, value]) =>
        value.isSelected ? [{ [key]: value.valor }] : []
      )
    );
  }
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log('ACTUALIZANDO DATOS PANTALLA SDV');
      obtenerDatosUsuario();
      obtenerPatologias();
      obtenerMedicamentos();
      obtenerAlergias();
      obtenerLimitaciones();
    }
  }, [isFocused]);
  function calcularEdad(fechaNacimiento) {
    const hoy = moment();
    const nacimiento = moment(fechaNacimiento, "DD/MM/YYYY");
    const edad = hoy.diff(nacimiento, 'years');
    return edad;
  }
  function transformKey(key) {
    // Reemplaza los guiones bajos por espacios
    let newKey = key.replace(/_/g, ' ');
    // Convierte la primera letra a mayúscula y el resto a minúscula
    newKey = newKey.charAt(0).toUpperCase() + newKey.slice(1).toLowerCase();
    return newKey;
  }
  /*useEffect(() => {
    console.log('patologiasSeleccionadas: ', patologiasSeleccionadas.current)
  }, [patologiasSeleccionadas.current]);
  useEffect(() => {
    console.log('medicamentosSeleccionados: ', medicamentosSeleccionados.current)
  }, [medicamentosSeleccionados.current]);
  useEffect(() => {
    console.log('alergiasSeleccionadas: ', alergiasSeleccionadas.current)
  }, [alergiasSeleccionadas.current]);
  useEffect(() => {
    console.log('limitacionesSeleccionadas: ', limitacionesSeleccionadas.current)
  }, [limitacionesSeleccionadas.current]);
  useEffect(() => {
    console.log('datosUsuarioSeleccionados: ', datosUsuarioSeleccionados.current)
  }, [datosUsuarioSeleccionados.current]);*/
  const rutRef = useRef(null)



  const guardarDatos = async (usuario_rut) => {
    try {
      return new Promise((resolve, reject) => {

        const datosGuardados = [
          ...datosUsuarioSeleccionados.current,
          ...patologiasSeleccionadas.current,
          ...medicamentosSeleccionados.current,
          ...alergiasSeleccionadas.current,
          ...limitacionesSeleccionadas.current
        ].map(dato =>
          Object.entries(dato).map(([key, value]) =>
            `${transformKey(key)}: ${value}`
          ).join('\n')
        ).join('\n\n');

        db.transaction(async tx => {
          tx.executeSql(
            'SELECT * FROM Configuracion WHERE usuario_rut = ?',
            [usuario_rut],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                // Si ya existe un registro para el usuario, actualiza los datos
                tx.executeSql(
                  'UPDATE Configuracion SET DatosSeleccionados = ? WHERE usuario_rut = ?',
                  [datosGuardados, usuario_rut],
                  () => console.log('Datos a vocalizar actualizados correctamente'),
                  (_, error) => { reject(error), console.log('Error al actualizar los datos:', error) }
                );
              } else {
                // Si no existe un registro para el usuario, inserta los datos
                tx.executeSql(
                  'INSERT INTO Configuracion (DatosSeleccionados, usuario_rut) VALUES (?, ?)',
                  [datosGuardados, usuario_rut],
                  () => console.log('Datos a vocalizar insertados correctamente'),
                  (_, error) => { reject(error), console.log('Error al insertar los datos a vocalizar:', error) }
                );
              }
            },
            (_, error) => { reject(error), console.log('Error al obtener los datos a vocalizar :', error) }
          );
          await obtenerImplementarRut();
          resolve()
        });
      })
    } catch (error) {
      console.error('Error al guardar los datos a vocalizar', error);
      reject(error)
    }
  }

  const [datosPrevios, setDatosPrevios] = useState('')
  const [existenPrevios, setExistenPrevios] = useState(false)
  const [mostrarPrevios, setMostrarPrevios] = useState(false)

  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  let activeColors = colors[theme.mode];

  const obtenerImplementarRut = async () => {
    try {
      rutRef.current = await obtenerRut();
      obtenerDatosPreviosSelec(rutRef.current)
    } catch (error) {

    }
  }


  const obtenerDatosPreviosSelec = (rutUsuario) => {
    //console.log('OBTENIENDO DATOS MEDICOS PREVIOS DEL RUT: ', rutUsuario);
    return new Promise((resolve, reject) => {
      try {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM Configuracion WHERE usuario_rut = ?',
            [rutUsuario],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                const datosPreviosSelec = _array[0].DatosSeleccionados;
                setDatosPrevios(datosPreviosSelec);
                if (datosPreviosSelec === null) {
                  setExistenPrevios(false);
                } else {
                  setExistenPrevios(true);
                }
              } else {
                console.log('No se encontraron datos previos a vocalizar');
              }
              resolve()
            },
            (_, error) => { reject(error), console.log('Error al obtener los datos al obtener datos previos a vocalizar:', error) }
          );
        });
      } catch (error) {
        console.log('Error al obtener los datos al obtener datos previos a vocalizar:', error)
        reject(error)

      }
    })
  }

  /*console.log('--showUsuario:', showUsuario);
  console.log('showPatologia:', showPatologia);
  console.log('showMedicamento:', showMedicamento);
  console.log('showAlergia:', showAlergia);
  console.log('--showLimitacion:', showLimitacion);*/

  return (
    <ScrollView style={styles.container}>


      <View className="p-10" style={{backgroundColor: activeColors.quaternary}}>
        <View style={styles.containerDatosSeleccionados}>
          {mostrarPrevios ? (
            <>
              {existenPrevios ? (
                <>
                  <Text style={styles.tituloContainer}>Datos Seleccionados previamente:</Text>
                  <View style={styles.previousTextContainer}>
                    <Text style={{color: activeColors.tertiary}}>{datosPrevios}</Text>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.tituloContainer}>No existen datos previos</Text>
                </>
              )}
            </>
          ) : (
            <>
              {datosUsuarioSeleccionados.current.length > 0 || patologiasSeleccionadas.current.length > 0 || medicamentosSeleccionados.current.length > 0 || alergiasSeleccionadas.current.length > 0 || limitacionesSeleccionadas.current.length > 0 ? (
                <>

                  <Text style={styles.tituloContainer}>En este orden se vera y leera tu informacion:</Text>
                  {datosUsuarioSeleccionados.current.map((dato, index) => (
                    <View style={styles.textContainer} key={index}>
                      {Object.entries(dato).map(([key, value]) => (
                        <Text style={{color: activeColors.tertiary}} key={index}>{`${transformKey(key)}: ${value}`}</Text>
                      ))}
                    </View>
                  ))}
                  {patologiasSeleccionadas.current.map((patologia, index) => (
                    <View style={styles.textContainer} key={index}>
                      {Object.entries(patologia).map(([key, value]) => (
                        <Text key={index}>{`${transformKey(key)}: ${value}`}</Text>
                      ))}
                    </View>
                  ))}
                  {medicamentosSeleccionados.current.map((medicamento, index) => (
                    <View style={styles.textContainer} key={index}>
                      {Object.entries(medicamento).map(([key, value]) => (
                        <Text key={index}>{`${transformKey(key)}: ${value}`}</Text>
                      ))}
                    </View>
                  ))}
                  {alergiasSeleccionadas.current.map((alergia, index) => (
                    <View style={styles.textContainer} key={index}>
                      {Object.entries(alergia).map(([key, value]) => (
                        <Text key={index}>{`${transformKey(key)}: ${value}`}</Text>
                      ))}
                    </View>
                  ))}
                  {limitacionesSeleccionadas.current.map((limitacion, index) => (
                    <View style={styles.textContainer} key={index}>
                      {Object.entries(limitacion).map(([key, value]) => (
                        <Text key={index}>{`${transformKey(key)}: ${value}`}</Text>
                      ))}
                    </View>
                  ))}

                </>
              ) : (
                <Text style={styles.tituloContainer}>Aún no has seleccionado datos</Text>
              )}
            </>
          )}
        </View>
        <View style={styles.espacioContainer}></View>
        <View style={styles.container3}>
          <TouchableOpacity
            style={styles.buttonPerfil}
            onPress={() => { obtenerImplementarRut(), setMostrarPrevios(!mostrarPrevios) }}
          >
            <Text style={styles.buttonTextPerfil}>
              {mostrarPrevios ? 'Mostrar seleccion actual' : 'Mostrar datos seleccionado anteriormente'}
            </Text>
          </TouchableOpacity>
          <View style={styles.espacioContainer}></View>
          <TouchableOpacity
            style={styles.buttonPerfil}
            onPress={async () => { await guardarDatos(rutUsuario) }}
          >
            <Text style={styles.buttonTextPerfil}>Guardar seleccion actual</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.espacioContainer}></View>
        <View style={styles.container3}>
          {showUsuario ? (
            <>
              <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressUsuario()}>
                <Text style={styles.buttonTextPerfil}>{showUsuario ? 'Ocultar datos personales' : 'Mostar datos personales'}</Text>
              </TouchableOpacity>
              <View style={styles.espacioContainer} ></View>
              {data.map((usuario, index) => (
                <Usuario
                  key={index}
                  index={index}
                  usuario={usuario}
                  showUsuario={showUsuario}
                  pressUsuario={pressUsuario}
                  usuarios={data}
                  pressSelectUsuario={pressSelectUsuario}
                />
              ))}
              {showUsuario && (
                <>
                  <View style={styles.espacioContainer} ></View>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Datos de usuario' }), setShowUsuario(!showUsuario) }}>
                    <Text style={styles.buttonText2}>Modificar datos</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressUsuario()}>
                <Text style={styles.buttonTextPerfil}>{showUsuario ? 'Ocultar datos personales' : 'Mostar datos personales'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.espacioContainer}></View>
        <View style={styles.container3}>
          {patologias.length > 0 ? (
            <>
              {!showPatologia ? (
                <>
                  {patologias.length > 1 ? (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressPatologia()}>
                        <Text style={styles.buttonTextPerfil}>{showPatologia ? `Ocultar enfermedades` : `Mostar ${patologias.length} enfermedades`}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressPatologia()}>
                        <Text style={styles.buttonTextPerfil}>{showPatologia ? 'Ocultar enfermedades' : 'Mostar una enfermedad'}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressPatologia()}>
                    <Text style={styles.buttonTextPerfil}>{showPatologia ? 'Ocultar enfermedades' : 'Mostar enfermedades'}</Text>
                  </TouchableOpacity>
                  <View style={styles.espacioContainer} ></View>
                </>
              )}
            </>
          ) : null}
          {patologias.length > 0 ? (
            <>
              {patologias.map((patologia, index) => (
                <PatologiaCronica
                  key={index}
                  index={index}
                  patologia={patologia}
                  showPatologia={showPatologia}
                  pressPatologia={pressPatologia}
                  patologias={patologias}
                  pressSelectPatologia={pressSelectCampoPatologia}
                />
              ))}
              {showPatologia && (
                <>
                  <View style={styles.espacioContainer} ></View>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Patologias' }), setShowPatologia(!showPatologia) }}>
                    <Text style={styles.buttonText2}>Añadir o modificar enfermedades</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View>
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Patologias' }), setShowPatologia(!showPatologia) }}
                >
                  <View>
                    <Text style={styles.textContent4}>{'No tienes enfermedades registradas'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={activeColors.tertiary} />
                  </View>
                </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.espacioContainer}></View>
        <View style={styles.container3}>
          {medicamentos.length > 0 ? (
            <>
              {!showMedicamento ? (
                <>
                  {medicamentos.length > 1 ? (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressMedicamento()}>
                        <Text style={styles.buttonTextPerfil}>{showMedicamento ? `Ocultar medicamentos` : `Mostar ${medicamentos.length} medicamentos`}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressMedicamento()}>
                        <Text style={styles.buttonTextPerfil}>{showMedicamento ? 'Ocultar medicamentos' : 'Mostar un medicamento'}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressMedicamento()}>
                    <Text style={styles.buttonTextPerfil}>{showMedicamento ? 'Ocultar medicamentos' : 'Mostar medicamentos'}</Text>
                  </TouchableOpacity>
                  <View style={styles.espacioContainer} ></View>
                </>
              )}
            </>
          ) : null}
          {medicamentos.length > 0 ? (
            <>

              {medicamentos.map((medicamento, index) => (
                <Medicamento
                  key={index}
                  index={index}
                  medicamento={medicamento}
                  showMedicamento={showMedicamento}
                  pressMedicamento={pressMedicamento}
                  medicamentos={medicamentos}
                  pressSelectMedicamento={pressSelectMedicamento}
                />
              ))}
              {showMedicamento && (
                <>
                  <View style={styles.espacioContainer} ></View>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Medicamentos' }), setShowMedicamento(!showMedicamento) }}>
                    <Text style={styles.buttonText2}>Añadir o modificar medicamentos</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View >
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Medicamentos' }), setShowMedicamento(!showMedicamento) }}                >
                  <View>
                    <Text style={styles.textContent4}>{'No tienes medicamentos registrados'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={activeColors.tertiary} />
                  </View>
                </TouchableOpacity>
              </View>
          )}

        </View>
        <View style={styles.espacioContainer}></View>
        <View style={styles.container3}>
          {alergias.length > 0 ? (
            <>
              {!showAlergia ? (
                <>
                  {alergias.length > 1 ? (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressAlergia()}>
                        <Text style={styles.buttonTextPerfil}>{showAlergia ? `Ocultar alergias` : `Mostar ${alergias.length} alergias`}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressAlergia()}>
                        <Text style={styles.buttonTextPerfil}>{showAlergia ? 'Ocultar alergias' : 'Mostar una alergia'}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressAlergia()}>
                    <Text style={styles.buttonTextPerfil}>{showAlergia ? 'Ocultar alergias' : 'Mostar alergias'}</Text>
                  </TouchableOpacity>
                  <View style={styles.espacioContainer} ></View>
                </>
              )}
            </>
          ) : null}
          {alergias.length > 0 ? (
            <>

              {alergias.map((alergia, index) => (
                <Alergia
                  key={index}
                  index={index}
                  alergia={alergia}
                  showAlergia={showAlergia}
                  pressAlergia={pressAlergia}
                  alergias={alergias}
                  pressSelectAlergia={pressSelectAlergia}
                />
              ))}
              {showAlergia && (
                <>
                  <View style={styles.espacioContainer} ></View>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Alergias' }), setShowAlergia(!showAlergia) }}>
                    <Text style={styles.buttonText2}>Añadir o modificar alergias</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View>
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Alergias' }), setShowAlergia(!showAlergia) }}
                >
                  <View>
                    <Text style={styles.textContent4}>{'No tienes alergias registradas'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={activeColors.tertiary} />
                  </View>
                </TouchableOpacity>
              </View>
          )}

        </View>
        <View style={styles.espacioContainer}></View>
        <View style={styles.container3}>
          {limitaciones.length > 0 ? (
            <>
              {!showLimitacion ? (
                <>
                  {limitaciones.length > 1 ? (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressLimitacion()}>
                        <Text style={styles.buttonTextPerfil}>{showLimitacion ? `Ocultar limitaciones` : `Mostar ${limitaciones.length} limitaciones`}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressLimitacion()}>
                        <Text style={styles.buttonTextPerfil}>{showLimitacion ? `Ocultar limitaciones` : `Mostar una limitacion`}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressLimitacion()}>
                    <Text style={styles.buttonTextPerfil}>{showLimitacion ? 'Ocultar limitaciones' : 'Mostar limitaciones'}</Text>
                  </TouchableOpacity>
                  <View style={styles.espacioContainer} ></View>
                </>
              )}
            </>
          ) : null}
          {limitaciones.length > 0 ? (
            <>
              {limitaciones.map((limitacion, index) => (
                <Limitacion
                  key={index}
                  index={index}
                  limitacion={limitacion}
                  showLimitacion={showLimitacion}
                  pressLimitacion={pressLimitacion}
                  limitaciones={limitaciones}
                  pressSelectLimitacion={pressSelectLimitacion}
                />
              ))}
              {showLimitacion && (
                <>
                  <View style={styles.espacioContainer} ></View>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Limitacion fisica' }), setShowLimitacion(!showLimitacion) }}>
                    <Text style={styles.buttonText2}>Añadir o modificar limitaciones</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View>
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Limitacion fisica' }), setShowLimitacion(!showLimitacion) }}
                >
                  <View>
                    <Text style={styles.textContent4}>{'No tienes limitaciones registradas'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={activeColors.tertiary} />
                  </View>
                </TouchableOpacity>
              </View>
          )}

        </View>
        <ComponenteLlenado
          patologias={patologias}
          medicamentos={medicamentos}
          alergias={alergias}
          limitaciones={limitaciones}
          showUsuario={showUsuario}
          showPatologia={showPatologia}
          showMedicamento={showMedicamento}
          showAlergia={showAlergia}
          showLimitacion={showLimitacion}
        />
        {(!showUsuario && !showPatologia && !showMedicamento && !showAlergia && !showLimitacion) ? (
          <>
            <View style={styles.espacioContainer6}></View>
          </>
        ) : null}
      </View>

    </ScrollView>
  )
}
