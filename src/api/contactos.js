import * as Contacts from 'expo-contacts';

export async function obtenerContactosTelefono() {
  console.log('Solicitando permiso para leer contactos...');
  const { status } = await Contacts.requestPermissionsAsync();
  let contactos = [];
  if (status === 'granted') {
    console.log('Permiso concedido. Leyendo contactos...');
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers, Contacts.Fields.Addresses],
    });
    if (data.length > 0) {
      console.log(`Se encontraron ${data.length} contactos.`);
      contactos = data;
    } else {
      console.log('No se encontraron contactos.');
    }
  } else {
    console.log('Permiso para leer contactos no concedido.');
  }
  return contactos;
}
