import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from '../api/styles';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-multi-selectbox/src/components/Icon';



const db = SQLite.openDatabase('adamdb.db');

const PatologiaCronica = ({ patologia, showPatologia, pressPatologia, patologias }) => {
  return (
    <View>
      {showPatologia && (
        <>
          <Text style={styles.content3}>{'Nombre enfermedad:'}</Text>
          <Text style={styles.content2}>{patologia.nombre_patologia}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Tipo de enfermedad:'}</Text>
          <Text style={styles.content2}>{patologia.tipo_patologia}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Transmisibilidad:'}</Text>
          <Text style={styles.content2}>{patologia.transmisibilidad}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Morbilidad:'}</Text>
          <Text style={styles.content2}>{patologia.morbilidad_intensidad}</Text>
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
const Medicamentos = ({ medicamento, showMedicamento, pressMedicamento, medicamentos }) => {
  return (
    <View>
      {showMedicamento && (
        <>
          <Text style={styles.content3}>{'Nombre medicamento:'}</Text>
          <Text style={styles.content2}>{medicamento.medicamento}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Dosis:'}</Text>
          <Text style={styles.content2}>{medicamento.dosis}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Frecuencia:'}</Text>
          <Text style={styles.content2}>{medicamento.periodicidad}</Text>
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

const Alergias = ({ alergia, showAlergia, pressAlergia, alergias }) => {
  return (
    <View>
      {showAlergia && (
        <>
          <Text style={styles.content3}>{'Tipo de alergia:'}</Text>
          <Text style={styles.content2}>{alergia.tipo}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Alergeno:'}</Text>
          <Text style={styles.content2}>{alergia.alergeno}</Text>
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

const Limitaciones = ({ limitacion, showLimitacion, pressLimitacion, limitaciones }) => {
  return (
    <View>
      {showLimitacion && (
        <>
          <Text style={styles.content3}>{'Tipo de limitación:'}</Text>
          <Text style={styles.content2}>{limitacion.tipo_lim}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Severidad:'}</Text>
          <Text style={styles.content2}>{limitacion.severidad_lim}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Origen:'}</Text>
          <Text style={styles.content2}>{limitacion.origen_lim}</Text>
          <View style={styles.lineaContainer3}></View>
          <Text style={styles.content3}>{'Descripción:'}</Text>
          <Text style={styles.content2}>{limitacion.descripcion_lim}</Text>
          <View style={styles.lineaContainer3}></View>
          {limitaciones.length > 1 ? (
            <>
              <View style={styles.lineaContainer4}></View>
            </>
          ) : null}
        </>
      )
      }
    </View>
  )
}

export default function Perfil({ navigation }) {
  const [data, setData] = useState([]);
  const [rut, setRut] = useState('');
  const [pnombre, setPnombre] = useState('');
  const [snombre, setSnombre] = useState('');
  const [papellido, setPapellido] = useState('');
  const [sapellido, setSapellido] = useState('');
  const [alias, setAlias] = useState('');
  const [genero, setGenero] = useState('');
  const [tipo_sangre, setTipo_sangre] = useState('');
  const [fecha_nacimiento, setFecha_nacimiento] = useState('');
  const [tieneAlergias, setTieneAlergias] = useState('');
  const [cronico, setCronico] = useState('');
  const [donante, setDonante] = useState('');
  const [limitacion_fisica, setLimitacion_fisica] = useState('');
  const [toma_medicamentos, setToma_medicamentos] = useState('');

  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [imc, setImc] = useState('');

  const obtenerDatosUsuario = async () => {
    return new Promise((resolve, reject) => {
      try {
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
                setTieneAlergias(user.alergias);
                setCronico(user.cronico);
                setDonante(user.donante);
                setLimitacion_fisica(user.limitacion_fisica);
                setToma_medicamentos(user.toma_medicamentos);
                resolve()
              }
            },
            (_, error) => { reject('ERROR AL OBTENER LOS DATOS DEL USUARIO', error) }
          );
        });
      } catch (error) {
        reject('ERROR AL OBTENER LOS DATOS DEL USUARIO', error)
      }
    })

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
              setPatologias(_array);
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
              setMedicamentos(_array);
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
              setAlergias(_array);
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
              setLimitaciones(_array);
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

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      obtenerDatosUsuario();
      console.log('data: ', data)
      obtenerPatologias();
      obtenerMedicamentos();
      obtenerAlergias();
      obtenerLimitaciones();
      console.log('limitaciones: ', limitaciones)

    }
  }, [isFocused]);

  function calcularEdad(fechaNacimiento) {
    const hoy = moment();
    const nacimiento = moment(fechaNacimiento, "DD/MM/YYYY");
    const edad = hoy.diff(nacimiento, 'years');
    return edad;
  }

  const edad = calcularEdad(fecha_nacimiento);



  return (
    <ScrollView contentContainerStyle={styles.containerPerfil}>
      {data.map((item, index) => (
        <View style={styles.container} key={index}>
          <View className="bg-blanco p-5 shadow-lg shadow-negro rounded-md">
            <TouchableOpacity className="bg-rojoIntenso h-10  mt-5 rounded-lg justify-center shadow-lg shadow-negro" onPress={() => navigation.navigate('PerfilNested', { screen: 'Datos de usuario' })}>
              <Text className="text-celeste text-center font-bold py-3">Modificar datos</Text>
            </TouchableOpacity>
            <View style={styles.espacioContainer2}></View>
            <Text style={styles.content3}>{'Nombre completo:'}</Text>
            <Text style={styles.content2}>{item.pnombre}{' '}{item.snombre}{' '}{item.papellido}{' '}{item.sapellido} </Text>

            <View style={styles.lineaContainer}></View>
            <Text style={styles.content3}>{'Alias:'}</Text>
            <Text style={styles.content2}>{item.alias} </Text>
            <Text style={styles.content3}>{'Genero:'}</Text>
            <Text style={styles.content2}>{item.genero}</Text>

            <View style={styles.lineaContainer}></View>
            <Text style={styles.content3}>{'Altura:'}</Text>
            <Text style={styles.content2}>{altura + ' cm'}</Text>
            <Text style={styles.content3}>{'Peso:'}</Text>
            <Text style={styles.content2}>{peso + ' kg'}</Text>
            <Text style={styles.content3}>{'IMC:'}</Text>
            <Text style={styles.content2}>{imc}</Text>

            <View style={styles.lineaContainer}></View>
            <Text style={styles.content3}>{'Fecha de nacimiento:'}</Text>
            <Text style={styles.content2}>{item.fecha_nacimiento}</Text>
            <Text style={styles.content3}>{'Edad:'}</Text>
            <Text style={styles.content2}>{edad}</Text>

            <View style={styles.lineaContainer}></View>
            <Text style={styles.content3}>{'Tipo de Sangre:'}</Text>
            <Text style={styles.content2}>{item.tipo_sangre}</Text>
            <Text style={styles.content3}>{'Donante de organos:'}</Text>
            <Text style={styles.content2}>{item.donante}</Text>

            <View style={styles.lineaContainer}></View>

          </View>

          <View style={styles.lineaContainer}></View>
          <View className="bg-blanco p-5 shadow-lg shadow-negro rounded-md">
            {patologias.length > 0 ? (
              <>
                {showPatologia && (
                  <>
                    <TouchableOpacity className="mb-5" style={styles.celesteButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Patologias' }), setShowPatologia(!showPatologia) }}>
                      <Text style={styles.rojoIntensoText}>Añadir o modificar enfermedades</Text>
                    </TouchableOpacity>

                  </>
                )}
                {patologias.map((patologia, index) => (
                  <PatologiaCronica
                    key={index}
                    patologia={patologia}
                    showPatologia={showPatologia}
                    pressPatologia={pressPatologia}
                    patologias={patologias}
                  />
                ))}
              </>
            ) : (
              <View>
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Patologias' }), setShowPatologia(!showPatologia) }}
                >
                  <View>
                    <Text style={styles.textCeleste}>{'No tienes enfermedades registradas'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={'#ff3e45'} />
                  </View>
                </TouchableOpacity>
              </View>


            )}
            {patologias.length > 0 ? (
              <>
                {!showPatologia ? (
                  <>
                    {patologias.length > 1 ? (
                      <>

                        <Text style={styles.content2}>{`Tienes ${patologias.length} enfermedades registradas`}</Text>

                        <TouchableOpacity className="bg-rojoIntenso" onPress={() => pressPatologia()}>
                          <Text className="text-center text-rojoIntenso">{showPatologia ? 'Ocultar enfermedades' : 'Mostar enfermedades'}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>

                        <Text style={styles.content2}>{`Tienes una enfermedad registrada`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressPatologia()}>
                          <Text style={styles.buttonTextPerfil}>{showPatologia ? 'Ocultar enfermedades' : 'Mostar enfermedades'}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                ) : (
                  <>

                    <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressPatologia()}>
                      <Text style={styles.buttonTextPerfil}>{showPatologia ? 'Ocultar enfermedades' : 'Mostar enfermedades'}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : null}

          </View>

          <View style={styles.espacioContainer}></View>
          <View className="bg-blanco p-5 shadow-lg shadow-negro rounded-md">
            {medicamentos.length > 0 ? (
              <>
                {showMedicamento && (
                  <>
                    <TouchableOpacity className="mb-5" style={styles.celesteButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Medicamentos' }), setShowMedicamento(!showMedicamento) }}>
                      <Text style={styles.rojoIntensoText}>Añadir o modificar medicamentos</Text>
                    </TouchableOpacity>

                  </>
                )}
                {medicamentos.map((medicamento, index) => (
                  <Medicamentos
                    key={index}
                    medicamento={medicamento}
                    showMedicamento={showMedicamento}
                    pressMedicamento={pressMedicamento}
                    medicamentos={medicamentos}
                  />
                ))}
              </>
            ) : (
              <View >
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Medicamentos' }), setShowMedicamento(!showMedicamento) }}                >
                  <View>
                    <Text style={styles.textCeleste}>{'No tienes medicamentos registrados'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={'#ff3e45'} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {medicamentos.length > 0 ? (
              <>
                {!showMedicamento ? (
                  <>
                    {medicamentos.length > 1 ? (
                      <>

                        <Text style={styles.content2}>{`Tienes ${medicamentos.length} medicamentos registrados`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressMedicamento()}>
                          <Text style={styles.buttonTextPerfil}>{showMedicamento ? 'Ocultar medicamentos' : 'Mostar medicamentos'}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>

                        <Text style={styles.content2}>{`Tienes un medicamento registrado`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressMedicamento()}>
                          <Text style={styles.buttonTextPerfil}>{showMedicamento ? 'Ocultar medicamentos' : 'Mostar medicamentos'}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                ) : (
                  <>

                    <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressMedicamento()}>
                      <Text style={styles.buttonTextPerfil}>{showMedicamento ? 'Ocultar medicamentos' : 'Mostar medicamentos'}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : null}

          </View>

          <View style={styles.espacioContainer}></View>
          <View className="bg-blanco p-5 shadow-lg shadow-negro rounded-md">
            {alergias.length > 0 ? (
              <>
                {showAlergia && (
                  <>
                    <TouchableOpacity className="mb-5" style={styles.celesteButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Alergias' }), setShowAlergia(!showAlergia) }}>
                      <Text style={styles.rojoIntensoText}>Añadir o modificar alergias</Text>
                    </TouchableOpacity>

                  </>
                )}
                {alergias.map((alergia, index) => (
                  <Alergias
                    key={index}
                    alergia={alergia}
                    showAlergia={showAlergia}
                    pressAlergia={pressAlergia}
                    alergias={alergias}
                  />
                ))}
              </>
            ) : (
              <View>
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Alergias' }), setShowAlergia(!showAlergia) }}
                >
                  <View>
                    <Text style={styles.textCeleste}>{'No tienes alergias registradas'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={'#ff3e45'} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {alergias.length > 0 ? (
              <>
                {!showAlergia ? (
                  <>
                    {alergias.length > 1 ? (
                      <>

                        <Text style={styles.content2}>{`Tienes ${alergias.length} alergias registradas`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressAlergia()}>
                          <Text style={styles.buttonTextPerfil}>{showAlergia ? 'Ocultar alergias' : 'Mostar alergias'}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>

                        <Text style={styles.content2}>{`Tienes una alergia registrada`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressAlergia()}>
                          <Text style={styles.buttonTextPerfil}>{showAlergia ? 'Ocultar alergias' : 'Mostar alergias'}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                ) : (
                  <>

                    <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressAlergia()}>
                      <Text style={styles.buttonTextPerfil}>{showAlergia ? 'Ocultar alergias' : 'Mostar alergias'}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : null}
          </View>

          <View style={styles.lineaContainer}></View>
          <View className="bg-blanco p-5 shadow-lg shadow-negro rounded-md">
            {limitaciones.length > 0 ? (
              <>
                {showLimitacion && (
                  <>
                    <TouchableOpacity className="mb-5" style={styles.celesteButton} onPress={() => { navigation.navigate('PerfilNested', { screen: 'Limitacion fisica' }), setShowLimitacion(!showLimitacion) }}>
                      <Text style={styles.rojoIntensoText}>Añadir o modificar limitaciones</Text>
                    </TouchableOpacity>

                  </>
                )}
                {limitaciones.map((limitacion, index) => (
                  <Limitaciones
                    key={index}
                    limitacion={limitacion}
                    showLimitacion={showLimitacion}
                    pressLimitacion={pressLimitacion}
                    limitaciones={limitaciones}
                  />
                ))}
              </>
            ) : (

              <View>
                <TouchableOpacity
                  className={'flex-row  justify-around w-full mt-3'}
                  style={styles.content4}
                  onPress={() => { navigation.navigate('PerfilNested', { screen: 'Limitacion fisica' }), setShowLimitacion(!showLimitacion) }}
                >
                  <View>
                    <Text style={styles.textCeleste}>{'No tienes limitaciones registradas'}</Text>
                  </View>
                  <View >
                    <FontAwesome5 name="plus" size={25} color={'#ff3e45'} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {limitaciones.length > 0 ? (
              <>
                {!showLimitacion ? (
                  <>
                    {limitaciones.length > 1 ? (
                      <>
                        <View style={styles.espacioContainer}></View>
                        <Text style={styles.content2}>{`Tienes ${limitaciones.length} limitaciones registradas`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressLimitacion()}>
                          <Text style={styles.buttonTextPerfil}>{showLimitacion ? 'Ocultar limitaciones' : 'Mostar limitaciones'}</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>

                        <Text style={styles.content2}>{`Tiene una limitación registrada`}</Text>

                        <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressLimitacion()}>
                          <Text style={styles.buttonTextPerfil}>{showLimitacion ? 'Ocultar limitaciones' : 'Mostar limitaciones'}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                ) : (
                  <>

                    <TouchableOpacity style={styles.buttonPerfil} onPress={() => pressLimitacion()}>
                      <Text style={styles.buttonTextPerfil}>{showLimitacion ? 'Ocultar limitaciones' : 'Mostar limitaciones'}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : null}
          </View>

          <TouchableOpacity className="mt-5" style={styles.rojoIntensoButton} onPress={() => navigation.navigate('PerfilNested', { screen: 'Contactos de emergencia' })}>
            <Text style={styles.celesteText}>Gestionar Contactos</Text>
          </TouchableOpacity>
        </View>
      ))}
      {((patologias.length === 1 && medicamentos.length === 0 && alergias.length === 0 && limitaciones.length === 0) ||
        (medicamentos.length === 1 && patologias.length === 0 && alergias.length === 0 && limitaciones.length === 0) ||
        (alergias.length === 1 && patologias.length === 0 && medicamentos.length === 0 && limitaciones.length === 0) ||
        (limitaciones.length === 1 && patologias.length === 0 && medicamentos.length === 0 && alergias.length === 0)) ? (
        <View style={styles.espacioContainer3}></View>
      ) : (patologias.length === 0 && medicamentos.length === 0 && alergias.length === 0 && limitaciones.length === 0) ? (
        <View style={styles.espacioContainer2}></View>
      ) : null}

    </ScrollView>
  );
}

