import { Linking } from 'react-native';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BuscarContactoEmergencia } from "../api/sqlite"



// Define la función para realizar una llamada
export function realizarLlamada(phoneNumber) {
  // Verifica si el dispositivo puede abrir URLs con el esquema 'tel'
  Linking.canOpenURL(`tel:${phoneNumber}`)
    .then((supported) => {
      if (!supported) {
        console.log('No se puede realizar la llamada: ' + phoneNumber);
      } else {
        // Abre la URL para realizar la llamada
        return Linking.openURL(`tel:${phoneNumber}`);
      }
    })
    .catch((error) => console.log('Ocurrió un error al intentar realizar la llamada', error));
}

export default function BuscarYMostrarContacto({ nombre, onContactoSeleccionado }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactos, setContactos] = useState([]);

  async function buscarContactoEmergencia(nombre) {
      let contactosEncontrados = await BuscarContactoEmergencia(nombre);
      if (contactosEncontrados.length > 1) {
          setContactos(contactosEncontrados);
          setModalVisible(true);
      }
  }

  useEffect(() => {
      buscarContactoEmergencia(nombre);
  }, []);

  return (
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
      >
          <View style={{ /* estilos para el contenedor del modal */ }}>
              {contactos.map((contacto, index) => (
                  <TouchableOpacity key={index} onPress={() => {
                      setModalVisible(false);
                      onContactoSeleccionado(contacto);
                  }}>
                      <Text>{contacto.nombreCompleto} ({contacto.alias}): {contacto.numero}</Text>
                  </TouchableOpacity>
              ))}
          </View>
      </Modal>
  );
}