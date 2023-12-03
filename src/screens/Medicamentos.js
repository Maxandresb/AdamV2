import React, { useEffect, useState, useRef, useContext } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomAlert from '../api/customAlert';
import { obtenerRut } from "../api/sqlite"
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import { programarNotificacionMedica as programarNotificacionMedica } from "../api/notificaciones";
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from "react-native-safe-area-context";
import getStyles from '../api/styles';
import {colors} from '../api/theme';
import { ThemeContext } from '../api/themeContext';
import { useIsFocused } from '@react-navigation/native';

import { useIsFocused } from '@react-navigation/native';
const db = SQLite.openDatabase('adamdb.db');

const Medicamento = ({ medicamento, isEditing, pressUpdate, pressDelete, setCurrentMedicamentoId, setMedicamentos, medicamentos, obtenerMedicamentosDeDB }) => {
    const [currentMedicamento, setCurrentMedicamento] = useState(medicamento);
    const [hora, setHora] = useState(new Date());
    const [mostrarHora, setMostrarHora] = useState(false);
    const [periodicidad2, setPeriodicidad2] = useState(medicamento.periodicidad);
    const [horarios, setHorarios] = useState([]);
    const isFocused = useIsFocused();

    // ********** MANEJO DE CHECK ***********
    const ESTADO_INACTIVO = '0';
    const ESTADO_ACTIVO = '1';
    let estadoActualizar;

    useEffect(() => {
        try {
            let estadoActualizar = medicamento.estadoNotificacion
            setMedicamentos(prevMedicamentos =>
                prevMedicamentos.map(med =>
                    med.id === medicamento.id ? { ...med, estadoNotificacion: estadoActualizar } : med
                )
            );
        } catch (error) {
            console.error('ERROR AL ACTUALIZAR ESTADO DE LA NOTIFICACION EN PANTALLA:', error);

        }

    }, []);

    const actualizarMedicamento = async (id, campos) => {
        console.log('ACTUALIZANDO MEDICAMENTO =>')
        console.log('campos: ', campos)
        //cambiar idNotificacion si existe
        if (campos.idNotificacion) {
            const cadena = campos.idNotificacion.join(',');
            campos.idNotificacion = cadena
            console.log('cadena: ', cadena)
        }
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Medicamentos SET estadoNotificacion = ?, idNotificacion = ? WHERE id = ?',
                    [campos.estadoNotificacion, campos.idNotificacion, id],
                    (_, result) => {
                        console.log('=> MEDICAMENTO ACTUALIZADO')
                        // Realiza una operación de lectura para obtener el idNotificacion actualizado
                        tx.executeSql(
                            'SELECT * FROM Medicamentos WHERE id = ?',
                            [id],
                            (_, result) => {
                                console.log('medicamento dsps de actualizar idNotif y estadoNotif: ', result.rows.item(0));
                                // Resuelve la promesa con el idNotificacion actualizado
                                resolve(result.rows.item(0).idNotificacion);
                            },
                            (_, error) => reject(error)
                        );
                    },
                    (_, error) => reject(error)
                );
            }, (error) => {
                console.error("Error en la transacción update campos tabla medicamentos de la base de datos: ", error);
            });
        });
    };


    const cancelarNotificacion = async (medicamento, estado) => {
        console.log('=> CANCELANDO NOTIFICACION CON IDNOTIFICACION:', medicamento)
        if (medicamento.idNotificacion === null) {
            console.log('NOTIFICACION AUN NO CREADA');
            return;
        } else {
            //cancelar notificaciones
            const ids = medicamento.idNotificacion.split(',');
            const cantidad = ids.length;
            console.log("Cantidad de ids:", cantidad);
            console.log(`\n\ ***** \n\ `);
            if (cantidad > 1) {
                // Convertimos la cadena en un array separando por comas
                const idNotificacionArray = medicamento.idNotificacion.split(',');

                // Recorremos el array resultante
                idNotificacionArray.forEach(async (id) => {
                    console.log('ID de Notificación:', id);
                    // Aquí puedes realizar acciones con cada ID de notificación, por ejemplo, enviar notificaciones, realizar operaciones, etc.
                    try {
                        await Notifications.cancelScheduledNotificationAsync(id);
                        console.log('1-notificacion cancelada: ', id)
                    } catch (error) {
                        console.log("1-idNotificacion error:", id);
                        console.log('1-error al cancelar notificacion: ', error)
                    }
                });
            } else {
                try {
                    await Notifications.cancelScheduledNotificationAsync(medicamento.idNotificacion);
                    console.log('1-notificacion cancelada: ', medicamento.idNotificacion)
                } catch (error) {
                    console.log("1-idNotificacion error:", medicamento.idNotificacion);
                    console.log('1-error al cancelar notificacion: ', error)
                }
            }
            console.log(` `);
            //eliminar el idnotificacion y cambiar estado de la notificacion
            if (estado === 'eliminar') {
                console.log('NOTIFICACION CANCELADA Antes de eliminar medicamento');
            } else {
                try {
                    let newidNotificacion = await actualizarMedicamento(medicamento.id, { estadoNotificacion: estado, idNotificacion: null });
                    console.log('2-idNotificacion-cancelada: ', newidNotificacion)
                    medicamento.idNotificacion = newidNotificacion;
                    medicamento.estadoNotificacion = '0'
                    console.log('2-medicamento con notificacion cancelada, actualizada: ', medicamento)
                } catch (error) {
                    console.log("2-idNotificacion error:", medicamento.idNotificacion);
                    console.log('2-error al actualizar recordatorio: ', error)
                }
                try {
                    setMedicamentos(prevMedicamentos =>
                        prevMedicamentos.map(med =>
                            med.id === medicamento.id ? { ...med, estadoNotificacion: medicamento.estadoNotificacion } : med
                        )
                    );
                } catch (error) {
                    console.error('ERROR AL ACTUALIZAR ESTADO DE LA NOTIFICACION EN PANTALLA:', error);

                }
            }
        }
    };

    const programarNotificacion = async (medicamento) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('PROGRAMANDO NOTIFICACION MEDICAMENTO => ', medicamento.medicamento);
                let nuevoIdNotificacion = await programarNotificacionMedica({ medicamento });
                console.log(`\n\ ***** \n\ `);
                console.log('ids de notificaciones obtenidas: ', nuevoIdNotificacion);
                console.log(`\n\ ***** \n\ `);
                let newidNotificacion = await actualizarMedicamento(medicamento.id, { estadoNotificacion: ESTADO_ACTIVO, idNotificacion: nuevoIdNotificacion });
                console.log('newidNotificacion-programada: ', newidNotificacion);

                // Actualizar el objeto medicamento
                medicamento.idNotificacion = newidNotificacion;
                medicamento.estadoNotificacion = ESTADO_ACTIVO;
                console.log('medicamento con notificacion actualizada: ', medicamento);
                resolve(medicamento);
            } catch (error) {
                reject(error);
            }
        });
    };

    const manejarNotificaciones = async (medicamento) => {
        console.log('*****************************************************************')
        console.log('MANEJANDO NOTIFICACIONES')

        try {
            console.log('medicamento en manejo de notificaciones: ', medicamento)
            if (medicamento.estadoNotificacion === ESTADO_ACTIVO) {
                console.log(`\n\ ***** \n\ `);
                console.log('CANCELANDO NOTIFICACION =>')
                console.log('estado notificacion antes de pasar a funcion cancelar: ', medicamento.estadoNotificacion);
                estadoActualizar = ESTADO_INACTIVO;
                await cancelarNotificacion(medicamento, ESTADO_INACTIVO)

            } else {
                console.log(`\n\ ***** \n\ `);
                console.log('PROGRAMANDO NOTIFICACION =>')
                estadoActualizar = ESTADO_ACTIVO
                await programarNotificacion(medicamento)
            }
        } catch (error) {
            console.error('ERROR AL MANEJAR LAS NOTIFICACIONES:', error);
        }
        try {
            console.log(`\n\ ***** \n\ `);
            console.log('NUEVO ESTADO: ', estadoActualizar);
            medicamento.estadoNotificacion = estadoActualizar;
            console.log('actualizando estado de la notificacion en pantalla');
            setMedicamentos(prevMedicamentos =>
                prevMedicamentos.map(med =>
                    med.id === medicamento.id ? { ...med, estadoNotificacion: estadoActualizar } : med
                )
            );
            console.log(`\n\ ***** \n\ `);
        } catch (error) {
            console.error('ERROR AL ACTUALIZAR ESTADO DE LA NOTIFICACION EN PANTALLA:', error);

        }
    };
    // ********** MANEJO DE CAMBIOS EN PERIODICIDAD U HORARIOS***********
    const calcularHorarios = (hora, periodicidad) => {
        /*console.log('CALCULANDO HORARIOS');
        console.log('hora obtenida: ', hora);
        console.log('periodicidad obtenida: ', periodicidad);*/

        const periodos = {
            'Cada 24 hrs (Una vez al dia)': 24,
            'Cada 12 hrs (Dos veces al dia)': 12,
            'Cada 8 hrs (Tres veces al dia)': 8,
            'Cada 6 hrs (Cuatro veces al dia)': 6,
            'Cada 4 hrs (Seis veces al dia)': 4,
        };
        const hours = periodos[periodicidad];
        if (!hours) return [];
        const horarios = [];
        let currentTime = new Date(hora.getTime());
        for (let i = 0; i < 24; i += hours) {
            horarios.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            currentTime.setHours(currentTime.getHours() + hours);
        }
        //console.log('Horarios calculados:', horarios);
        return horarios;
    };

    const obtenerHora = (horarios) => {
        let horariosArray = horarios.split("  ");
        let primeraHora = horariosArray[0];
        console.log('primeraHora: ', primeraHora)
        let [horaMinuto, ampm] = primeraHora.split(" ");
        let [hora, minuto] = horaMinuto.split(":");
        let fechaPrimeraHora = new Date();
        fechaPrimeraHora.setHours(parseInt(hora));
        // Convertir PM a AM y viceversa
        if (ampm === 'p.m.') {
            hora.setHours(hora.getHours() + 12); // Convierte de PM a formato de 24 horas
        } else {
            hora.setHours(hora.getHours() - 12); // Convierte de AM a formato de 24 horas
        }
        fechaPrimeraHora.setMinutes(parseInt(minuto));
        return hora
    }

    useEffect(() => {
        if (medicamento.horarios === '') {
            setHora(new Date());
        } else {
            let horariosArray = medicamento.horarios.split("  ");
            let primeraHora = horariosArray[0];
            let [horaMinuto, ampm] = primeraHora.split(" ");
            let [horaPrimer, minuto] = horaMinuto.split(":");
            let hora = new Date();
            hora.setHours(parseInt(horaPrimer));
            // Convertir PM a AM y viceversa
            if (ampm === 'p.m.') {
                hora.setHours(hora.getHours() + 12); // Convierte de PM a formato de 24 horas
            } else {
                hora.setHours(hora.getHours() - 12); // Convierte de AM a formato de 24 horas
            }
            hora.setMinutes(parseInt(minuto));
            setHora(hora);
            const horariosCalculados = calcularHorarios(hora, periodicidad2);
            setHorarios(horariosCalculados);
        }
    }, [currentMedicamento.horarios, medicamento.horarios, periodicidad2]);
    let horariosCalculados;
    const manejarCambioHora = (horaSeleccionada) => {
        const horaActualizada = horaSeleccionada || hora;
        setHora(horaActualizada);
        horariosCalculados = calcularHorarios(horaActualizada, periodicidad2);
        medicamento.horarios = horariosCalculados
        currentMedicamento.horarios = horariosCalculados.join(" ")
        setHorarios(horariosCalculados);
        manejarCambio('horarios', horariosCalculados.join(" "));
    };


   

    const manejarCambioPeriodicidad = (valor) => {
        setPeriodicidad2(valor);
        horariosCalculados = calcularHorarios(hora, valor);
        setHorarios(horariosCalculados);
        medicamento.horarios = horariosCalculados
        manejarCambio('horarios', horariosCalculados.join(" "));
    };
    const manejarCambio = (clave, valor) => {
        setCurrentMedicamento(current => ({
            ...current,
            [clave]: valor
        }));

        if (clave === 'hora') {
            manejarCambioHora(valor);
        }

        if (clave === 'periodicidad') {
            manejarCambioPeriodicidad(valor);
        }
    };

    const onChangeTime2 = (event, selectedTime) => {
        if (selectedTime) {
            setHora(selectedTime);
            setHorarios(calcularHorarios(selectedTime, periodicidad2));
        }
        setMostrarHora(false);
    };

    const abrirHora = () => {
        setMostrarHora(true);
    };

    // ********** MANEJO DE ELIMINAR MEDICAMENTO ***********
    const pressEliminarMedicamento = () => {
        Alert.alert(
            "Eliminar Medicamento",
            "¿Estás seguro de que quieres eliminar este medicamento?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        await cancelarNotificacion(medicamento, 'eliminar'),
                            pressDelete(medicamento.id)
                    }
                }
            ]
        );
    };


    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        <View className="mt-2">
            {isEditing ? (
                <>
                    <Text style={styles.encabezado}>Medicamento:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.medicamento}
                        onChangeText={(val) => manejarCambio('medicamento', val)}
                    />
                    <Text style={styles.encabezado}>Dosis:</Text>
                    <TextInput
                        style={styles.input}
                        value={currentMedicamento.dosis}
                        onChangeText={(val) => manejarCambio('dosis', val)}
                    />
                    <Text style={styles.encabezado}>Periodicidad:</Text>
                    <View style={styles.inputIMC}>
                        <Picker
                            selectedValue={currentMedicamento.periodicidad}
                            onValueChange={(itemValue) => manejarCambio('periodicidad', itemValue)}
                        >
                            <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                            <Picker.Item label="Cada 24 hrs (Una vez al dia)" value="Cada 24 hrs (Una vez al dia)" />
                            <Picker.Item label="Cada 12 hrs (Dos veces al dia)" value="Cada 12 hrs (Dos veces al dia)" />
                            <Picker.Item label="Cada 8 hrs (Tres veces al dia)" value="Cada 8 hrs (Tres veces al dia)" />
                            <Picker.Item label="Cada 6 hrs (Cuatro veces al dia)" value="Cada 6 hrs (Cuatro veces al dia)" />
                            <Picker.Item label="Cada 4 hrs (Seis veces al dia)" value="Cada 4 hrs (Seis veces al dia)" />
                        </Picker>
                    </View>
                    <Text style={styles.encabezado} className="text-center">Indica la hora en la que comenzaras a ingerir el medicamento:</Text>
                    <TouchableOpacity onPress={abrirHora}>
                        <TextInput
                            style={styles.horaInputMedicamento}
                            value={hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {mostrarHora && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={hora}
                            mode={'time'}
                            is24Hour={true}
                            display="spinner"
                            onChange={onChangeTime2}
                        />
                    )}
                    <Text style={styles.encabezado} className="text-center">
                        {periodicidad2 === 'Cada 24 hrs (Una vez al dia)'
                            ? 'La alarma de este medicamento se programara a esta hora:'
                            : 'Las alarmas de este medicamento se programaran a estas horas:'}
                    </Text>
                    <View className="flex-0 mb-3 mx-5 rounded-md placeholder:text-azulnegro pl-3" style={{backgroundColor: activeColors.secondary, borderWidth: 2, borderColor: activeColors.quinary}}>
                        {horarios.map((time, index) => (
                            <Text className="text-center text-azulnegro  text-lg " key={index}>{time}</Text>
                        ))}
                    </View>
                </>
            ) : (
                <>
                    <View className="flex-row " style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.header} className="ml-5">Estado del medicamento: </Text>
                            <Text style={styles.content} className="ml-5">{currentMedicamento.medicamento}</Text>
                        </View>
                        <TouchableOpacity style={{ paddingRight: 15 }} onPress={() => manejarNotificaciones(medicamento)}>
                            <Text><FontAwesome5 name="check" size={25} color={medicamento.estadoNotificacion === '0' ? 'black' : 'green'} /></Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.header} className="ml-5">Medicamento:</Text>
                    <Text style={styles.content} className="ml-5">{currentMedicamento.medicamento}</Text>
                    <Text style={styles.header} className="ml-5">Dosis:</Text>
                    <Text style={styles.content} className="ml-5">{currentMedicamento.dosis}</Text>
                    <Text style={styles.header} className="ml-5">Periodicidad:</Text>
                    <Text style={styles.content} className="ml-5">{currentMedicamento.periodicidad}</Text>
                    <Text style={styles.header} className="ml-5">Horarios a notificar:</Text>
                    <Text style={styles.content} className="ml-5">{horarios.join("  ")}</Text>
                </>
            )}

            <View className="flex-row self-center justify-around w-full mt-3">
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={async () => {
                        try {
                            pressUpdate(medicamento.id, { ...currentMedicamento, horarios: horarios.join(" ") })
                        } catch (error) {
                            console.error('ERROR AL ACTUALIZAR MEDICAMENTO:', error);
                        }
                        try {
                            await cancelarNotificacion(medicamento, ESTADO_INACTIVO)
                        } catch (error) {
                            console.error('ERROR AL CANCELAR NOTIFICACION AL GUARDAR MODIFICACION:', error);
                        }
                        try {
                            medicamento.estadoNotificacion = '0'
                            console.log('actualizando estado de la notificacion en pantalla');
                            setMedicamentos(prevMedicamentos =>
                                prevMedicamentos.map(med =>
                                    med.id === medicamento.id ? { ...med, estadoNotificacion: '0' } : med
                                )
                            );
                        } catch (error) {
                            console.error('ERROR AL ACTUALIZAR ESTADO DE LA NOTIFICACION EN PANTALLA:', error);

                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {isEditing ? 'Guardar cambios' : 'Modificar Medicamento'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={pressEliminarMedicamento}
                >
                    <Text style={styles.buttonText2}>
                        Eliminar Medicamento
                    </Text>
                </TouchableOpacity>
            </View>
            {isEditing ? (
                <>
                    <View style={styles.espacioContainer2}></View>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {
                            try {
                                medicamento.estadoNotificacion = '0'
                                console.log('actualizando estado de la notificacion en pantalla');
                                setMedicamentos(prevMedicamentos =>
                                    prevMedicamentos.map(med =>
                                        med.id === medicamento.id ? { ...med, estadoNotificacion: '0' } : med
                                    )
                                );
                            } catch (error) {
                                console.error('ERROR AL ACTUALIZAR ESTADO DE LA NOTIFICACION EN PANTALLA:', error);

                            }
                            setCurrentMedicamentoId(null)
                        }}
                    >
                        <Text style={styles.buttonText2}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </>
            ) : null}
            <View style={styles.lineaContainer}>
            </View>

        </View>
    );
};


const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [currentMedicamentoId, setCurrentMedicamentoId] = useState(null);

    const [modalVisibleMedicamentos, setModalVisibleMedicamentos] = useState(false);
    const [nomMedicamento, setNomMedicamento] = useState('');
    const [dosis, setDosis] = useState('');
    const [periodicidad, setPeriodicidad] = useState('');
    const [horarios, setHorarios] = useState('');
    const [saveMedicamentoAlert, setSaveMedicamentoAlert] = useState(false);

    const [isAlertVisible, setAlertVisible] = useState(false);


    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) =>
                setMedicamentos(rows._array)
            ), (error) => {
                console.error("Error en la transacción de la base de datos: ", error);
            };
        }), (error) => {
            console.error("Error en la transacción de la base de datos: ", error);
        };
    }, []);

    const pressShowAgregarMedicamento = () => {
        setModalVisibleMedicamentos(true);
    };

    const pressUpdate = (id, medicamento) => {
        if (currentMedicamentoId === id) {
            // Actualizar medicamento 
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE Medicamentos SET medicamento = ?, dosis = ?, periodicidad = ?, horarios = ? WHERE id = ?',
                    [medicamento.medicamento, medicamento.dosis, medicamento.periodicidad, medicamento.horarios, id],
                    (_, resultSet) => {
                        console.log("Actualización exitosa!");
                        // Recargar datos
                        tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) => {
                            setMedicamentos(rows._array)
                            setCurrentMedicamentoId(null); // finalizo edición aquí para evitar asincronía
                        });
                    },
                    (error) => {
                        console.error("Error en la transacción update tabla medicamentos de la base de datos: ", error);
                    }
                );
            });
        } else {
            // Iniciar edición
            setCurrentMedicamentoId(id);
            let timesArray = medicamento.horarios.split("  ");
            setHorarios(timesArray);
        }
    };

    const pressDelete = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM Medicamentos WHERE id = ?',
                [id],
                (_, resultSet) => {
                    console.log("Eliminación exitosa!");
                    // Recargar datos
                    tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) =>
                        setMedicamentos(rows._array)
                    );
                }
            );
        });
    };
    const agregarMedicamento = async () => {
        try {
            let estadoNotificacion = '0'
            let usuario_rut = await obtenerRut();
            let times = calculateTimes();
            let timesString = times.join("  "); // Convertir el array a una cadena
            console.log('1-datos a insertar: ', nomMedicamento, dosis, periodicidad, timesString, usuario_rut);
            return new Promise((resolve, reject) => {
                console.log('DENTRO DE LA PROMESA MEDICAMENTOS')
                db.transaction(tx => {
                    console.log('Dentro de la ejecucion de la  consulta');
                    try {
                        tx.executeSql(
                            'INSERT INTO Medicamentos (medicamento, dosis, periodicidad, horarios, estadoNotificacion, usuario_rut) VALUES (?, ?, ?, ?, ?, ?)',
                            [nomMedicamento, dosis, periodicidad, timesString, estadoNotificacion, usuario_rut],
                            (_, resultSet) => {
                                console.log("Inserción medicamento exitosa!");
                                // Recargar datos
                                tx.executeSql('SELECT * FROM Medicamentos', [], (_, { rows }) => {
                                    setMedicamentos(rows._array);
                                    resolve(resultSet);
                                });
                            },
                            (_, error) => {
                                console.log("Error al insertar medicamento: ", error);
                                reject(error);
                            }
                        );
                    } catch (error) {
                        console.error("Error en try agregarMedicamento: ", error);
                        reject(error);
                    }

                }, (error) => {
                    console.error("Error en la transacción de la base de datos: ", error);
                })
                // Resetear los estados
                setNomMedicamento('');
                setDosis('');
                setPeriodicidad('');
            });
        } catch (error) {
            console.error("Error en try agregarMedicamento: ", error);
        }
    };

    //Horarios medicamento
    const [hora, setHora] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || hora;
        setHora(currentTime);
        setShowTime(false);
    };
    const showTimepicker = () => {
        setHora(new Date()); // Actualiza la hora al momento de abrir el modal
        setShowTime(true);
    };
    //Calcular horas del dia segun periodicidad
    const calculateTimes = () => {
        const periodos = {
            'Cada 24 hrs (Una vez al dia)': 24,
            'Cada 12 hrs (Dos veces al dia)': 12,
            'Cada 8 hrs (Tres veces al dia)': 8,
            'Cada 6 hrs (Cuatro veces al dia)': 6,
            'Cada 4 hrs (Seis veces al dia)': 4,
        };
        const hours = periodos[periodicidad];
        if (!hours) return [];
        const times = [];
        let currentTime = new Date(hora.getTime());
        for (let i = 0; i < 24; i += hours) {
            times.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            currentTime.setHours(currentTime.getHours() + hours);
        }
        return times;
    };
    let times = calculateTimes(hora)


    const {theme} = useContext(ThemeContext);
    const styles = getStyles(theme);
    let activeColors = colors[theme.mode];

    return (
        
        <ScrollView className="flex-1 bg-grisClaro px-5 pt-3">
            <SafeAreaView>
            <View>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={pressShowAgregarMedicamento} // Agregar esto
                >
                    <Text style={styles.buttonText}>
                        Agregar un nuevo medicamento
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineaContainer}></View>
            <View><Text>
    Para asegurar que todo funcione bien, simplemente toca la notificación que aparece para cada medicamento.
  </Text>
  <Text>
    Lamentamos cualquier inconveniente.
  </Text></View>
            <View style={styles.lineaContainer}></View>
            {medicamentos.map(medicamento => (
                <Medicamento
                    key={medicamento.id}
                    medicamento={medicamento}
                    isEditing={currentMedicamentoId === medicamento.id}
                    pressUpdate={pressUpdate}
                    pressDelete={pressDelete}
                    setCurrentMedicamentoId={setCurrentMedicamentoId}
                    setMedicamentos={setMedicamentos}
                    medicamentos={medicamentos}
                />
            ))}

            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleMedicamentos}
                onRequestClose={() => {
                    setAlertVisible(true);
                    setModalVisibleMedicamentos(false);
                }}
            >
                <View className="flex-1 justify-center items-center px-3 bg-fondoOscurecido">
                    <View style={styles.modalView}>
                        <Text style={styles.encabezado}>Indica el nombre del medicamento:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setNomMedicamento(text)}
                            value={nomMedicamento}
                        />
                        <Text style={styles.encabezado}>Indica la dosis a ingerir:</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="gray"
                            placeholder="ej: XXXXXX"
                            onChangeText={text => setDosis(text)}
                            value={dosis}
                        />

                        <CustomAlert
                          isVisible={saveMedicamentoAlert}
                          onClose={() => {setSaveMedicamentoAlert(false)}}
                          message='Medicamento Ingresado exitosamente'
                        />

                        <Text style={styles.encabezado}>Indica cada cuanto debes tomar el medicamento:</Text>
                        <View style={styles.inputPicker}>
                            <Picker
                                selectedValue={periodicidad}
                                onValueChange={(itemValue) => setPeriodicidad(itemValue)}
                            >
                                <Picker.Item label="Toca aqui para seleccionar una opción" value="" />
                                <Picker.Item label="Cada 24 hrs (Una vez al dia)" value="Cada 24 hrs (Una vez al dia)" />
                                <Picker.Item label="Cada 12 hrs (Dos veces al dia)" value="Cada 12 hrs (Dos veces al dia)" />
                                <Picker.Item label="Cada 8 hrs (Tres veces al dia)" value="Cada 8 hrs (Tres veces al dia)" />
                                <Picker.Item label="Cada 6 hrs (Cuatro veces al dia)" value="Cada 6 hrs (Cuatro veces al dia)" />
                                <Picker.Item label="Cada 4 hrs (Seis veces al dia)" value="Cada 4 hrs (Seis veces al dia)" />
                            </Picker>
                        </View>
                        <Text style={styles.encabezado} className="text-center">Indica la hora en la que comenzaras a ingerir el medicamento:</Text>
                        <TouchableOpacity onPress={showTimepicker}>
                            <TextInput
                                style={styles.horaInputMedicamento}
                                value={hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                editable={false}
                            />
                        </TouchableOpacity>
                        {showTime && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={hora}
                                mode={'time'}
                                is24Hour={true}
                                display="spinner"
                                onChange={onChangeTime}
                                times={times}
                            />
                        )}
                        {hora && periodicidad ? (
                            <>
                                <Text style={styles.encabezado} className="text-center">
                                    {periodicidad === 'Cada 24 hrs (Una vez al dia)'
                                        ? 'La alarma de este medicamento se programara a esta hora:'
                                        : 'Las alarmas de este medicamento se programaran a estas horas:'}
                                </Text>
                                <View className="mb-3 mx-5 border-2 rounded-md placeholder:text-azulnegro" style={{borderColor: activeColors.quinary, backgroundColor: activeColors.secondary}}>
                                    {times.map((time, index) => (
                                        <Text className="text-center text-azulnegro  text-lg " key={index}>{time}</Text>
                                    ))}
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.encabezado} className="text-center">{'Aqui veras la o las horas en las el medicamento debe ser administrado'}</Text>
                            </>
                        )}
                        <View className="flex-row self-center justify-around w-full mt-5">
                            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setModalVisibleMedicamentos(false) }}>
                                <Text style={styles.buttonText2}>
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryButton}
                                onPress={async () => {
                                    try {
                                        await agregarMedicamento();
                                        setSaveMedicamentoAlert(true);
                                    } catch (error) {
                                        console.error("Error en agregarMedicamento: ", error);
                                    }
                                }}>
                                <Text style={styles.buttonText}>
                                    Agregar nuevo medicamento
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setAlertVisible(false)}
                message='No haz ingresado tus medicamentos.'
            />
        </ScrollView>
    );
};
export default Medicamentos;