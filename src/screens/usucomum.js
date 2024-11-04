import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { db } from '../services/firebase/conf';
import { collection } from 'firebase/firestore';

const ContatoComum = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');

  const handleSubmit = async () => {
    const currentUserId = "userIdDoUsuarioLogado"; // Substitua pelo ID do usuário logado

    // Verificar número de contatos
    const snapshot = await collection(db, 'Contato de Emergência')
      .where('userId', '==', currentUserId)
      .get();

      if (snapshot.size >= 3) {
        Alert.alert("Limite de Contatos", "Você pode adicionar no máximo três contatos de emergência.");
        return;
      }

    // Adiciona o contato no Firebase
    await collection(db, 'Contato de Emergência').add({
      userId: 'currentUserId',  // Substitua pelo ID do usuário logado
      name,
      email,
      primaryPhone,
      secondaryPhone,
      type: 'comum',
    });

    Alert.alert('Obrigado', 'contato cadastrado!');
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      {/* Header Navbar */}
      <View style={styles.navbar}>
        {/* Botão de menu à esquerda */}
        <TouchableOpacity onPress={() => navigation.navigate('Contato')}>
          <MaterialIcons name="arrow-back-ios" size={30} color="#FFEDE3" />
        </TouchableOpacity>

        {/* Título central */}
        <Text style={styles.title}>Contato</Text>

        {/* Ícone de usuário à direita */}
        <Image source={require('../assets/borboleta.png')} style={styles.borboleta} />
      </View>

      <Text style={styles.subheader}>
        Cadastre uma pessoa próxima e de confiança para ser seu contato de emergência.
      </Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user-o" size={24} color="#641919" />
        <TextInput
          style={styles.input}
          placeholder="Nome*"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={24} color="#641919" />
        <TextInput
          style={styles.input}
          placeholder="Email*"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <SimpleLineIcons name="phone" size={24} color="#641919" />
        <TextInput
          style={styles.input}
          placeholder="Celular com DDD*"
          keyboardType="phone-pad"
          value={primaryPhone}
          onChangeText={setPrimaryPhone}
        />
      </View>

      <View style={styles.inputContainer}>
        <SimpleLineIcons name="phone" size={24} color="#641919" />
        <TextInput
          style={styles.input}
          placeholder="Outro Celular"
          keyboardType="phone-pad"
          value={secondaryPhone}
          onChangeText={setSecondaryPhone}
        />
      </View>

      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          • Para que esta pessoa se torne seu contato, é preciso que ela aceite o convite que será enviado no número ou e-mail do cadastro.
        </Text>
        <Text style={styles.instructions}>
          • Lembre-se de conversar com a pessoa antes de cadastrá-la. É importante que ela esteja ciente que receberá pedidos de socorro.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAE9E4',
  },
  navbar: {
    width: '100%', // Faz a navbar ocupar toda a largura
    height: 70, // Ajuste a altura se necessário
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#49070A',
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 36,
    color: '#FFEDE3',
    fontFamily: 'DMSerifDisplay_400Regular', // Certifique-se de carregar a fonte correta
  },
  subheader: {
    fontSize: 20,
    color: '#641919',
    marginBottom: 3,
    fontFamily: 'Inter_400Regular',
    marginStart: 32,
    marginVertical: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    borderColor: '#641919',
    borderWidth: 1,
    padding: 20,
    marginTop: 15,
    marginHorizontal: 23,
  },
  input: {
    flex: 1,
    marginHorizontal: 6,
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: '#49070A',
  },
  instructionsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#641919',
    marginBottom: 2,
    fontFamily: 'Inter_500Medium',
    marginStart: 35,
    marginVertical: 5,
    marginEnd: 28,
  },
  button: {
    backgroundColor: '#49070A',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 90,
  },
  buttonText: {
    color: '#FFEDE3',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  borboleta: {
    width: 55,
    height: 55,
    marginStart: 175,
    marginVertical: 2,
  },
});

export default ContatoComum;