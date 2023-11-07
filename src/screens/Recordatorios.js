// Importa las librerías necesarias
import { Alert, TextInput, Modal, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { Agenda, LocaleConfig } from "react-native-calendars"
import { FontAwesome5 } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native'
import styles from '../api/styles';
import moment from 'moment';
import 'moment/locale/es';
import { scheduleRecordatorioNotification } from "../api/notificaciones";
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBoxRapido } from '../api/checkBoxRapido';
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('adamdb.db');

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';
// Define el componente RecordatorioItem y envuélvelo con React.memo
const RecordatorioItem = React.memo(({ recordatorio, abrirModal, handleCheckPress }) => {
  if (recordatorio) {
    for (item in recordatorio) {
      return (
        <View style={styles.lineaContainer2}>
          <View className="flex-row ">
            <View className="flex flex-2 py-10"><Text>{recordatorio.Hora}</Text></View>
            <View className="flex flex-1 px-3 py-2"><Text className=" py-2">{recordatorio.Titulo}</Text>
              <Text className=" py-2" >{recordatorio.Descripcion}</Text></View>
            {recordatorio.id ? (<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <TouchableOpacity style={{ padding: 5 }} onPress={() => abrirModal(recordatorio)}>
                <Text><FontAwesome5 name="edit" size={25} color="black" /></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 5, paddingLeft: 10 }} onPress={() => handleCheckPress(recordatorio)}>
                <Text><FontAwesome5 name="check" size={25} color={recordatorio.Estado === '0' ? 'black' : 'green'} /></Text>
              </TouchableOpacity>
            </View>
            ) : (<View />)}
          </View>
        </View>
      )
    }
  }
  else {
    return (<View />)
  }
});

// Define el componente Recordatorios
const Recordatorios = () => {
  // Inicializa el estado del componente
  const [recordatorios, setRecordatorios] = useState({})
  const [modalDataVisible, setModalDataVisible] = useState(false);
  const [modalCantidadVisible, setModalCantidadVisible] = useState(false);
  // Estado para controlar si estamos editando o no
  const [isEditing, setIsEditing] = useState(false);
  // Estado para los campos del recordatorio
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [dias, setDias] = useState("");
  const [recordatoriosFuturos, setRecordatoriosFuturos] = useState([]);
  const recordatorioActual = useRef(null);

  // Obtiene el estado de enfoque de la pantalla
  const isFocused = useIsFocused();
  // Define un efecto que se ejecuta cuando la pantalla está enfocada
  useEffect(() => {
    console.log('OBTENIENDO RECORDATORIOS DE LA BD')
    // Abre una transacción en la base de datos
    db.transaction(tx => {
      // Ejecuta una consulta SQL para obtener todos los recordatorios ordenados por fecha
      tx.executeSql('SELECT * FROM Recordatorios ORDER BY Fecha', null, (txObj, resultSet) => {
        // Procesa los resultados de la consulta
        let newRecordatorios = resultSet.rows._array
        // Agrupa los recordatorios por fecha
        let groupedData = newRecordatorios.reduce((acc, curr) => {
          if (!acc[curr.Fecha]) {
            acc[curr.Fecha] = [];
          }
          acc[curr.Fecha].push(curr);
          return acc;
        }, {});
        // Actualiza el estado con los nuevos recordatorios
        setRecordatorios(groupedData);
        moment.locale('es');
      });
    })
  }, [isFocused]); // Se ejecuta cada vez que cambia el estado de enfoque
  // Define cómo se renderiza cada recordatorio
  const renderRecordatorio = (recordatorio) => <RecordatorioItem recordatorio={recordatorio} abrirModal={abrirModal} handleCheckPress={handleCheckPress} />;
  // Define cómo se cargan los elementos para un mes específico
  const loadItems = (day) => {
    //console.log('CARGANDO ELEMENTOS DE UN MES')
    const items = recordatorios || {};
  };
  const abrirModal = (recordatorio) => {
    console.log('ABRIENDO MODAL EDIT RECORDATORIOS')
    setTitulo(recordatorio.Titulo);
    setDescripcion(recordatorio.Descripcion);
    setFecha(recordatorio.Fecha);
    setHora(recordatorio.Hora);
    setDias(recordatorio.Dias);
    recordatorioActual.current = recordatorio;
    date.current = obtenerFechaRecordatorio(recordatorio)
    time.current = recordatorio.Hora
    //si se modifica dias aca, se vuelve no definido al abrir el modal
    console.log('fecha obtenida al abir el modal: ', date.current)
    console.log('time obtenida en el modal: ', time.current)
    console.log('recordatorio obtenida en el modal: ', recordatorioActual.current)
    setModalDataVisible(true);
  }
  const cerrarModal = () => {
    console.log('CERRANDO MODAL EDIT RECORDATORIOS')
    setModalDataVisible(false);
    setIsEditing(false); // Establece el estado de edición a falso
  }

  const DeletePress = (recordatorioActual) => {
    console.log('ELIMINANDO RECORDATORIO')
    console.log('recordatorio en eliminar recordatorio: ', recordatorioActual)
    // Aquí puedes poner la lógica para eliminar el recordatorio 
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Recordatorios WHERE id = ?',
        [recordatorioActual.current.id],
        (_, resultSet) => {
          // Cancelar la notificación correspondiente
          console.log(`RECORDATORIO ID: ${recordatorioActual.current.id} ELIMINADO`)
          try {
            Notifications.cancelScheduledNotificationAsync(recordatorioActual.current.idNotificacion);
            console.log(`NOTIFICACION ID: ${recordatorioActual.current.idNotificacion}  ELIMINADA`)
          } catch (error) {
            console.log(`ERROR AL ELIMINAR NOTIFICACION ID: ${recordatorioActual.current.idNotificacion} DETALLE ERROR: `, error)
          }
          console.log('RECARGANDO RECORDATORIO')
          // Recargar datos
          tx.executeSql('SELECT * FROM Recordatorios ORDER BY Fecha', [], (_, { rows }) => {
            let newRecordatorios = rows._array
            let groupedData = newRecordatorios.reduce((acc, curr) => {
              if (!acc[curr.Fecha]) {
                acc[curr.Fecha] = [];
              }
              acc[curr.Fecha].push(curr);
              return acc;
            }, {});
            setRecordatorios(groupedData);
          });
        }
      );
    });
    // Cerrar el modal y resetear el estado
    setModalDataVisible(false);
    setIsEditing(false);
  }
  const handleDeletePress = (recordatorioActual) => {
    Alert.alert(
      "Eliminar Recordatorio",
      "¿Estás seguro de que quieres eliminar este recordatorio?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => DeletePress(recordatorioActual)
        }
      ]
    );
  };
  const obtenerRecordatoriosFuturos = () => {
    //console.log('OBTENIENDO RECORDATORIOS FUTUROS')
    let primerDiaProximoMes = moment().add(1, 'months').startOf('month').format('YYYY-MM-DD');
    let recordatoriosFuturos = Object.keys(recordatorios).filter(fecha => fecha >= primerDiaProximoMes);
    let cantidadRecordatoriosFuturos = recordatoriosFuturos.reduce((total, fecha) => {
      if (recordatorios[fecha]) {
        return total + recordatorios[fecha].length;
      }
      return total;
    }, 0);
    let cantRec;
    if (cantidadRecordatoriosFuturos === 0) {
      return ""
    } else if (cantidadRecordatoriosFuturos === 1) {
      cantRec = 'Tienes ' + cantidadRecordatoriosFuturos + ' recordatorio futuro'
    } else {
      cantRec = 'Tienes ' + cantidadRecordatoriosFuturos + ' recordatorios futuros'
    }
    return cantRec;
  }
  const handleShowRecordatoriosFuturos = () => {
    //console.log('MOSTRANDO DETALLE RECORDATORIOS FUTUROS')
    setModalCantidadVisible(true);
    let primerDiaProximoMes = moment().add(1, 'months').startOf('month').format('YYYY-MM-DD');
    let recordatoriosFuturosTemp = Object.keys(recordatorios).filter(fecha => fecha >= primerDiaProximoMes);
    setRecordatoriosFuturos(recordatoriosFuturosTemp);
  }
  const handleCloseModal = () => {
    console.log('CERRANDO MODAL DETALLE RECORDATORIOS FUTUROS')
    setModalCantidadVisible(false);
  }
  // Constantes para los estados del recordatorio
  const ESTADO_INACTIVO = '1';
  const ESTADO_ACTIVO = '0';

  // Función para cambiar el estado del recordatorio en la base de datos
  const cambiarEstadoRecordatorio = async (recordatorio, db) => {
    console.log('CAMBIANDO ESTADO DEL RECORDATORIO')
    console.log('estado actual del recordatorio: ', recordatorio.Estado)
    return new Promise((resolve, reject) => {
      const nuevoEstado = recordatorio.Estado === ESTADO_INACTIVO ? ESTADO_ACTIVO : ESTADO_INACTIVO;
      try {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE Recordatorios SET Estado = ? WHERE id = ?',
            [nuevoEstado, recordatorio.id],
            () => {
              console.log('ESTADO DEL RECORDATORIO CAMBIADO ')
              resolve(nuevoEstado)
            },
            (_, error) => reject('ERROR AL CAMBIAR EL ESTADO DEL RECORDATORIO', error)
          );
        });
      } catch (error) {
        reject(error);
      }
    });
  };


  // Función para agrupar los recordatorios por fecha
  const agruparRecordatoriosPorFecha = (recordatorios) => {
    console.log('AGRUPANDO RECORDATORIOS POR FECHA')
    return recordatorios.reduce((acumulador, registro) => {
      if (!acumulador[registro.Fecha]) {
        acumulador[registro.Fecha] = [];
      }
      acumulador[registro.Fecha].push(registro);
      return acumulador;
    }, {});
  };

  // Función para obtener los recordatorios actualizados de la base de datos
  const obtenerRecordatoriosActualizados = async (db, setRecordatorios) => {
    return new Promise((resolve, reject) => {
      try {
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM Recordatorios ORDER BY Fecha', [],
            (_, { rows }) => {
              console.log('OBTENIENDO RECORDATORIOS ACTUALIZADOS')
              const nuevosRecordatorios = rows._array;
              const recordatoriosAgrupados = agruparRecordatoriosPorFecha(nuevosRecordatorios);
              setRecordatorios(recordatoriosAgrupados);

              resolve();
            },
            (_, error) => {
              console.error('ERROR AL ACTUALIZAR LOS RECORDATORIOS', error)
              reject(error);
            }
          );
        });
      } catch (error) {
        reject(error);
      }

    });
  };

  // Función para actualizar el recordatorio en la base de datos
  const actualizarRecordatorio = async (id, campos) => {
    console.log('<ACTUALIZANDO RECORDATORIO>')
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Recordatorios SET Estado = ?, idNotificacion = ? WHERE id = ?',
          [campos.Estado, campos.idNotificacion, id],
          (_, result) => {
            console.log('</RECORDATORIO ACTUALIZADO>')
            // Realiza una operación de lectura para obtener el idNotificacion actualizado
            tx.executeSql(
              'SELECT idNotificacion FROM Recordatorios WHERE id = ?',
              [id],
              (_, result) => {
                // Resuelve la promesa con el idNotificacion actualizado
                resolve(result.rows.item(0).idNotificacion);
              },
              (_, error) => reject(error)
            );
          },
          (_, error) => reject(error)
        );
      });
    });
  };

  const cancelarNotificacion = async (recordatorio, estado) => {
    console.log('CANCELANDO NOTIFICACION CON IDNOTIFICACION:', recordatorio.idNotificacion)
    try {
      await Notifications.cancelScheduledNotificationAsync(recordatorio.idNotificacion);
      console.log('notificacion cancelada: ', recordatorio.idNotificacion)
    } catch (error) {
      console.log("idNotificacion error:", recordatorio.idNotificacion);
      console.log('error al cancelar notificacion: ', error)
    }
    try {
      let newidNotificacion = await actualizarRecordatorio(recordatorio.id, { Estado: estado, idNotificacion: null });
      console.log('idNotificacion-cancelada: ', newidNotificacion)
      recordatorio.idNotificacion = newidNotificacion;
      console.log('recordatorio con notificacion cancelada, actualizada: ', recordatorio)
    } catch (error) {
      console.log("idNotificacion error:", recordatorio.idNotificacion);
      console.log('error al actualizar recordatorio: ', error)
    }
  };

  const programarNotificacion = async (recordatorio) => {
    console.log('PROGRAMANDO NOTIFICACION RECORDATORIO: ', recordatorio.Titulo)
    let nuevoIdNotificacion = await scheduleRecordatorioNotification(recordatorio);
    let newidNotificacion = await actualizarRecordatorio(recordatorio.id, { Estado: ESTADO_ACTIVO, idNotificacion: nuevoIdNotificacion });
    console.log('newidNotificacion-programada: ', newidNotificacion)
    // Actualiza el idNotificacion en el objeto recordatorio
    recordatorio.idNotificacion = newidNotificacion;
    console.log('recordatorio con notificacion actualizada: ', recordatorio)
  }

  // Función para manejar las notificaciones
  const manejarNotificaciones = async (recordatorio) => {
    console.log('MANEJANDO NOTIFICACIONES')
    try {
      console.log('recordatorio en manejo de notificaciones: ', recordatorio)
      if (recordatorio.Estado === ESTADO_INACTIVO) {
        console.log('CANCELANDO NOTIFICACION =>')
        await cancelarNotificacion(recordatorio, ESTADO_INACTIVO)
      } else {
        console.log('PROGRAMANDO NOTIFICACION =>')
        const { Descripcion, Dias, Fecha, Hora, Titulo } = recordatorio;
        console.log('Descripcion, Dias, Fecha, Hora, Titulo: ', Descripcion, Dias, Fecha, Hora, Titulo)
        await programarNotificacion(recordatorio)
      }
    } catch (error) {
      console.error('ERROR AL MANEJAR LAS NOTIFICACIONES:', error);
    }
  };
  let checkDias;
  const handleUpdateRecordatorio = async (recordatorioActual) => {
    console.log('MODIFICANDO RECORDATORIO')
    if (isEditing === true) {
      console.log('recordatorioActual en actualizar recordatorio: ', recordatorioActual.current)
      await cancelarNotificacion(recordatorioActual.current, ESTADO_ACTIVO)
      await programarNotificacion(recordatorioActual.current)
      checkDias = diasSeleccionadosComoCadena()
      recordatorioActual.current.Dias = checkDias
      console.log('datos a actualizar: ', recordatorioActual.current.Titulo, recordatorioActual.current.Descripcion, recordatorioActual.current.Fecha, recordatorioActual.current.Hora, checkDias, recordatorioActual.current.id)
      // Actualiza el recordatorio en la base de datos con el nuevo idNotificacion
      return new Promise((resolve, reject) => {
        try {
          db.transaction(async tx => {
            tx.executeSql(
              'UPDATE Recordatorios SET Titulo = ?, Descripcion = ?, Fecha = ?, Hora = ?, Dias = ? WHERE id = ?',
              [recordatorioActual.current.Titulo, recordatorioActual.current.Descripcion, recordatorioActual.current.Fecha, recordatorioActual.current.Hora, checkDias, recordatorioActual.current.id],
              (_, resultSet) => {
                console.log("Actualización del recordatorio exitosa!");
                // Recargar datos
                tx.executeSql('SELECT * FROM Recordatorios ORDER BY Fecha', [], (_, { rows }) => {
                  let newRecordatorios = rows._array
                  let groupedData = newRecordatorios.reduce((acc, curr) => {
                    if (!acc[curr.Fecha]) {
                      acc[curr.Fecha] = [];
                    }
                    acc[curr.Fecha].push(curr);
                    return acc;
                  }, {});
                  setRecordatorios(groupedData)
                  resolve(console.log('RECORDATORIO MODIFICADO: ', recordatorioActual.current));
                }
                );
              }
            );
          });

        } catch (error) {
          console.error('ERROR AL ACTUALIZAR EL RECORDATORIO', error);
          reject(error);
        }
      });
    }
  }


  // Función principal
  const handleCheckPress = async (recordatorio) => {
    console.log('**************************************************');
    console.log('MANEJANDO CHECK PRESS')
    console.log('recordatorio CHECK PRESS: ', recordatorio)
    try {
      const nuevoEstado = await cambiarEstadoRecordatorio(recordatorio, db);
      recordatorio.Estado = nuevoEstado;
      await obtenerRecordatoriosActualizados(db, setRecordatorios);
      await manejarNotificaciones(recordatorio, db);
      await obtenerRecordatoriosActualizados(db, setRecordatorios);
    } catch (error) {
      console.error('Error al manejar el cambio de estado del recordatorio:', error);
    }
  };

  // CONGIFURACION DE MODALES INGRESO DE DATOS:
  //Fecha
  const date = useRef(null)
  const [showFecha, setShowFecha] = useState(false);

  const obtenerFechaRecordatorio = (recordatorio) => {
    console.log('OBTENIENDO FECHA DEL RECORDATORIO')
    //console.log('fecha: ', recordatorio.Fecha)
    // Convierte la fecha al formato 
    let [year, month, day] = recordatorio.Fecha.split('-').map(Number);
    let [hour, minute] = recordatorio.Hora.split(':').map(Number);
    // Obtener diferencia de zona horaria en MINUTOS, no horas
    let timezoneOffset = new Date().getTimezoneOffset();
    let timezoneOffsetInHours = timezoneOffset / 60;
    hour = hour - timezoneOffsetInHours;
    const fechaRecordatorio = new Date(year, month - 1, day, hour, minute);
    //console.log('fechaRecordatorio: ', fechaRecordatorio)
    //date.current = fechaFormateada
    //console.log('1-date.current: ', date.current)
    return fechaRecordatorio
  }
  const onChangeFecha = (event, selectedDate) => {
    console.log('ON CHANGE FECHA')
    const currentDate = selectedDate || date.current;
    date.current = currentDate;
    let fecActual = currentDate.toLocaleDateString()
    let partes = fecActual.split("/");
    let fecha1 = new Date(partes[2], partes[1] - 1, partes[0]);
    fecActual = fecha1.toISOString().split('T')[0];
    recordatorioActual.current.Fecha = fecActual;
    //console.log('currentDate', currentDate)
    //console.log('currentDate.toLocaleDateString()', currentDate.toLocaleDateString())

    setShowFecha(false);
  };
  const showDatepicker = () => {
    setShowFecha(true);
  };
  //Hora
  const [showTime, setShowTime] = useState(false);
  const time = useRef(null)

  const onChangeTime = (event, selectedTime) => {
    console.log('ON CHANGE TIME')
    const currentTime = selectedTime || time.current;
    time.current = currentTime;
    // Formatea la hora como una cadena HH:mm
    const formattedTime = currentTime.getHours().toString().padStart(2, '0') + ':' + currentTime.getMinutes().toString().padStart(2, '0');
    recordatorioActual.current.Hora = formattedTime;
    //console.log('currentTime', currentTime.toLocaleTimeString())
    //console.log('formattedTime', formattedTime)
    setShowTime(false);

  }
  const showTimepicker = () => {
    console.log('OBTENIENDO HORA DEL RECORDATORIO')
    // Parsea la hora del recordatorio actual en un objeto Date
    const [hour, minute] = recordatorioActual.current.Hora.split(':').map(Number);
    const now = new Date();
    time.current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    setShowTime(true);
  };
  //Dias
  const [showCheckBoxDias, setShowCheckBoxDias] = useState(false)
  const [diasSeleccionados, setDiasSeleccionados] = useState({
    Unico: false,
    Lunes: false,
    Martes: false,
    Miercoles: false,
    Jueves: false,
    Viernes: false,
    Sabado: false,
    Domingo: false
  });
  const toggleDia = (dia) => {
    setDiasSeleccionados((diasPrevios) => {
      let nuevosDias = { ...diasPrevios, [dia]: !diasPrevios[dia] };

      // Si el día seleccionado es 'Unico', deselecciona todos los demás días
      if (dia === 'Unico') {
        for (let key in nuevosDias) {
          if (key !== 'Unico') {
            nuevosDias[key] = false;
          }
        }
      }
      // Si se selecciona cualquier otro día, deselecciona 'Unico'
      else {
        nuevosDias['Unico'] = false;
      }

      return nuevosDias;
    });
  };

  const showCheckBox = () => {
    setShowCheckBoxDias(true);
  }
  const obtenerDiasSeleccionados = async (recordatorioActual) => {
    console.log('OBTENIENDO DIAS SELECCIONADOS')
    console.log('ODS => recordatorioActual: ', recordatorioActual)
    return new Promise((resolve, reject) => {
      try {
        if (modalDataVisible === true) {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT Dias FROM Recordatorios WHERE id = ?',
              [recordatorioActual.current.id],
              (_, { rows }) => {
                if (rows.length > 0) {
                  const diasrec = rows.item(0);
                  console.log('ODS:', diasrec)
                  // Divide la cadena de texto en un array de días
                  const diasArray = diasrec.Dias.split(', ');
                  // Crea un objeto con una propiedad para cada día de la semana
                  const dias = {
                    Unico: diasArray.includes('Unico'),
                    Lunes: diasArray.includes('Lunes'),
                    Martes: diasArray.includes('Martes'),
                    Miercoles: diasArray.includes('Miercoles'),
                    Jueves: diasArray.includes('Jueves'),
                    Viernes: diasArray.includes('Viernes'),
                    Sabado: diasArray.includes('Sabado'),
                    Domingo: diasArray.includes('Domingo')
                  };
                  resolve(dias);
                } else {
                  resolve('No existe recordatorio del cual obtener dias seleccionados');
                }
              },
              (_, error) => {
                console.error('Error al obtener los días seleccionados de la base de datos:', error);
                reject(error);
              }
            );
          });
        }
      } catch (error) {
        console.error('Error al obtener los días seleccionados de la base de datos:', error);
        reject(error);

      }
    });
  };


  useEffect(() => {
    cargarDiasSeleccionados(recordatorioActual);
  }, [modalDataVisible === true]);

  const cargarDiasSeleccionados = async (recordatorioActual) => {
    if (recordatorioActual && recordatorioActual.current) {
      const diasSeleccionadosbd = await obtenerDiasSeleccionados(recordatorioActual);
      setDiasSeleccionados(diasSeleccionadosbd);
    }
  };
  const diasSeleccionadosComoCadena = () => {
    // Crea un array con los nombres de los días que están seleccionados
    const dias = Object.keys(diasSeleccionados).filter(dia => diasSeleccionados[dia]);

    // Une los nombres de los días con comas para crear una cadena de texto
    return dias.join(', ');
  };


  // Renderiza el componente
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Agenda
          items={recordatorios}
          renderItem={renderRecordatorio}
          loadItemsForMonth={loadItems}
          renderEmptyData={loadItems}
          locale={"es"}
        />
        <TouchableOpacity onPress={handleShowRecordatoriosFuturos}>
          <View style={{ alignSelf: 'center', paddingBottom: 30 }}>
            <Text style={{ color: 'green', fontSize: 18 }}>
              {obtenerRecordatoriosFuturos()}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalCantidadVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ paddingBottom: 5, fontSize: 18 }}>Recordatorios futuros:</Text>
              {recordatoriosFuturos.map((fecha) => {
                let fechaMoment = moment(fecha);
                return (
                  <View key={fecha} style={{ padding: 5 }}>
                    <Text>Mes: {fechaMoment.format('MMMM')}</Text>
                    <Text>Año: {fechaMoment.format('YYYY')}</Text>
                    <Text>Cantidad de recordatorios: {recordatorios[fecha].length}</Text>
                    <View style={styles.lineaContainer}></View>
                  </View>
                );
              })}

              <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalDataVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {isEditing ? (
                <>
                  <Text style={styles.encabezadoInicial}>Titulo:</Text>
                  <TextInput
                    style={styles.input}
                    value={titulo}
                    onChangeText={setTitulo}
                  />
                  <Text style={styles.encabezado}>Descripcion:</Text>
                  <TextInput
                    style={styles.input}
                    value={descripcion}
                    onChangeText={setDescripcion}
                  />
                  <Text style={styles.encabezado}>Fecha: </Text>
                  <TouchableOpacity onPress={() => showDatepicker()}>
                    <TextInput
                      style={styles.inputfecha}
                      placeholder="Fecha"
                      value={date.current.toLocaleDateString()}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {showFecha && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date.current}
                      mode={'date'}
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeFecha}
                    />
                  )}
                  <Text style={styles.encabezado}>Hora:</Text>
                  <TouchableOpacity onPress={() => showTimepicker()}>
                    <TextInput
                      style={styles.input}
                      value={recordatorioActual.current.Hora}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {showTime && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={time.current}
                      mode={'time'}
                      is24Hour={true}
                      display="spinner"
                      onChange={onChangeTime}
                    />
                  )}
                  <Text style={styles.encabezado}>Dias:</Text>
                  <TouchableOpacity onPress={() => showCheckBox()}>
                    <TextInput
                      style={styles.input}
                      value={diasSeleccionadosComoCadena()}
                      editable={false}
                    />
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showCheckBoxDias}
                    onRequestClose={() => {
                      setShowCheckBoxDias(!showCheckBoxDias);
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <View style={styles.lineaContainer3}></View>
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Unico}
                          onCheck={() => toggleDia('Unico')}
                          title="Recordatorio único"
                        />
                        <View style={styles.espacioContainer}>
                          <Text style={styles.buttonText2}>O</Text>
                        </View>
                        <View style={styles.espacioContainer}></View>
                        <View style={styles.lineaContainer3}></View>
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Lunes}
                          onCheck={() => toggleDia('Lunes')}
                          title="Lunes"
                        />
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Martes}
                          onCheck={() => toggleDia('Martes')}
                          title="Martes"
                        />
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Miercoles}
                          onCheck={() => toggleDia('Miercoles')}
                          title="Miercoles"
                        />
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Jueves}
                          onCheck={() => toggleDia('Jueves')}
                          title="Jueves"
                        />
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Viernes}
                          onCheck={() => toggleDia('Viernes')}
                          title="Viernes"
                        />
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Sabado}
                          onCheck={() => toggleDia('Sabado')}
                          title="Sabado"
                        />
                        <CheckBoxRapido
                          isChecked={diasSeleccionados.Domingo}
                          onCheck={() => toggleDia('Domingo')}
                          title="Domingo"
                        />
                        <View style={styles.espacioContainer}></View>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => setShowCheckBoxDias(!showCheckBoxDias)}
                        >
                          <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>

                </>
              ) : (
                <>
                  <Text style={styles.encabezadoInicial}>Titulo:</Text>
                  <Text style={styles.content}>{recordatorioActual.current?.Titulo}</Text>
                  <Text style={styles.encabezado}>Descripcion:</Text>
                  <Text style={styles.content}>{recordatorioActual.current?.Descripcion}</Text>
                  <Text style={styles.encabezado}>Fecha:</Text>
                  <Text style={styles.content}>{recordatorioActual.current?.Fecha}</Text>
                  <Text style={styles.encabezado}>Hora:</Text>
                  <Text style={styles.content}>{recordatorioActual.current?.Hora}</Text>
                  <Text style={styles.encabezado}>Dias:</Text>
                  <Text style={styles.content}>{recordatorioActual.current?.Dias}</Text>
                </>
              )}

              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => { setIsEditing(!isEditing), await handleUpdateRecordatorio(recordatorioActual, scheduleRecordatorioNotification, db) }}
                >
                  <Text style={styles.buttonText}>
                    {isEditing ? 'Guardar recordatorio' : 'Modificar recordatorio'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePress(recordatorioActual)}
                >
                  <Text style={styles.buttonText}>
                    Eliminar recordatorio
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={cerrarModal} // Modificar esto
                >
                  <Text style={styles.buttonText}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

// Exporta el componente
export default Recordatorios
