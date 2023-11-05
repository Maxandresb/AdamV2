// Importa las librerías necesarias
import { Alert, TextInput, Modal, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { Agenda, LocaleConfig } from "react-native-calendars"
import { db, mostarDB } from "../api/sqlite"
import { FontAwesome5 } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native'
import styles from '../api/styles';
import moment from 'moment';
import 'moment/locale/es';
import { scheduleRecordatorioNotification } from "../api/notificaciones";
import * as Notifications from 'expo-notifications';



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
    setModalDataVisible(true);
    console.log('recordatorioActual: ', recordatorioActual.current)

  }
  const cerrarModal = () => {
    console.log('CERRANDO MODAL EDIT RECORDATORIOS')
    setModalDataVisible(false);
    setIsEditing(false); // Establece el estado de edición a falso
  }
  const handleUpdateRecordatorio = () => {
    console.log('ACTUALIZANDO RECORDATORIO')
    // Aquí puedes poner la lógica para modificar el recordatorio 
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Recordatorios SET Titulo = ?, Descripcion = ?, Fecha = ?, Hora = ?, Dias = ? WHERE id = ?',
        [titulo, descripcion, fecha, hora, dias, recordatorioActual.current.id],
        (_, resultSet) => {
          console.log("Actualización exitosa!");
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
  }

  const DeletePress = (recordatorioActual) => {
    console.log('ELIMINANDO RECORDATORIO')
    console.log('recordatorioActual: ', recordatorioActual)
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
    console.log('ESTADO: ', recordatorio.Estado)
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
            (_, error) => reject('ERROR AL CAMBIAR EL ESTADO', error)
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
  const actualizarRecordatorio = async (db, id, campos) => {
    console.log('ACTUALIZANDO RECORDATORIO')
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Recordatorios SET Estado = ?, idNotificacion = ? WHERE id = ?',
          [campos.Estado, campos.idNotificacion, id],
          (_, result) => {
            console.log('RECORDATORIO ACTUALIZADO')
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



  // Función para manejar las notificaciones
  const manejarNotificaciones = async (recordatorio, db, scheduleRecordatorioNotification) => {
    console.log('MANEJANDO NOTIFICACIONES')
    try {
      console.log('recordatorio: ', recordatorio)
      if (recordatorio.Estado === ESTADO_INACTIVO) {
        console.log('CANCELANDO NOTIFICACION')
        await Notifications.cancelScheduledNotificationAsync(recordatorio.idNotificacion);
        let newidNotificacion = await actualizarRecordatorio(db, recordatorio.id, { Estado: ESTADO_INACTIVO, idNotificacion: null });
        console.log('newidNotificacion-cancelada: ', newidNotificacion)
        // Actualiza el idNotificacion en el objeto recordatorio
        recordatorio.idNotificacion = newidNotificacion;
        console.log('recordatorio con notificacion actualizada: ', recordatorio)
      } else {
        console.log('PROGRAMANDO NOTIFICACION')
        const { Descripcion, Dias, Fecha, Hora, Titulo } = recordatorio;
        console.log('Descripcion, Dias, Fecha, Hora, Titulo: ', Descripcion, Dias, Fecha, Hora, Titulo)
        const nuevoIdNotificacion = await scheduleRecordatorioNotification(recordatorio);
        let newidNotificacion = await actualizarRecordatorio(db, recordatorio.id, { Estado: ESTADO_ACTIVO, idNotificacion: nuevoIdNotificacion });
        console.log('newidNotificacion-nueva: ', newidNotificacion)
        // Actualiza el idNotificacion en el objeto recordatorio
        recordatorio.idNotificacion = newidNotificacion;
        console.log('recordatorio con notificacion actualizada: ', recordatorio)
      }
    } catch (error) {
      console.error('ERROR AL MANEJAR LAS NOTIFICACIONES:', error);
    }
  };


  // Función principal
  const handleCheckPress = async (recordatorio) => {
    console.log('**************************************************');
    console.log('MANEJANDO CHECK PRESS')
    console.log('recordatorio CHECK PRESS: ', recordatorio)
    try {
      const nuevoEstado = await cambiarEstadoRecordatorio(recordatorio, db);
      recordatorio.Estado = nuevoEstado;
      await obtenerRecordatoriosActualizados(db, setRecordatorios);
      await manejarNotificaciones(recordatorio, db, scheduleRecordatorioNotification);
      await obtenerRecordatoriosActualizados(db, setRecordatorios);
    } catch (error) {
      console.error('Error al manejar el cambio de estado del recordatorio:', error);
    }
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
                  <Text style={styles.encabezado}>Fecha:</Text>
                  <TextInput
                    style={styles.input}
                    value={fecha}
                    onChangeText={setFecha}
                  />
                  <Text style={styles.encabezado}>Hora:</Text>
                  <TextInput
                    style={styles.input}
                    value={hora}
                    onChangeText={setHora}
                  />
                  <Text style={styles.encabezado}>Dias:</Text>
                  <TextInput
                    style={styles.input}
                    value={dias}
                    onChangeText={setDias}
                  />
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
                  onPress={() => { setIsEditing(!isEditing), handleUpdateRecordatorio() }}
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
