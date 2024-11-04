import React, { useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import BackgroundActions from 'react-native-background-actions'


const HomeScreen = ({ navigation }) => {
  const [watchId, setWatchId] = useState()
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: -23.55052, // Valor inicial genérico
    longitude: -46.633308, // Valor inicial genérico
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      startBackgroundService()

      // Atualiza a região do mapa
      setRegion({
        latitude: location.destiny.geometry.location.lat,
        longitude: location.destiny.geometry.location.lng,
        latitudeDelta: 0.01, // Ajusta o zoom do mapa
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permissão para acessar a localização foi negada');
      return;
    }

    startBackgroundService()

    setRegion({
      latitude:location.destiny.geometry.location.lat,
      longitude: location.destiny.geometry.location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  let text = 'Esperando pela localização...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.destiny.geometry.location.lat}, Longitude: ${location.destiny.geometry.location.lng}`;
  }

  function startTracking() {
    const id = Geolocation.watchPosition(
      (position) => {
        console.log('Posição recuperada'+JSON.stringify(position));
        setLocation(position);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 2,  // Atualiza quando o usuário se move 10 metros
        interval: 2000,  // Atualiza a cada 10 segundos
        fastestInterval: 2000,  // Tempo mínimo entre as atualizações
        showsBackgroundLocationIndicator: true,
      }
    )
    setWatchId(id);
  }


  const startBackgroundService = async () => {
    try {
      await BackgroundActions.start(startTracking, options)
      console.log('Background tracking started');
    } catch (error) {
      console.log('Error starting background service:', error);
    }
  }

  const options = {
    taskName: 'Nome da notificação',
    taskTitle: 'Título da notificação',
    taskDesc: 'Agora o aplicativo da Yasmin está em segundo plano',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    parameters: {
        delay: 1000,
    },
}

const fechatudo = () => {
	Geolocation.clearWatch(watchId)
	BackgroundActions.stop()
}

  return (
    <View style={styles.container}>
      <Button title="Atualizar Localização" onPress={handleGetLocation} />
      <Button title="Parar Localização" onPress={fechatudo} />
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.destiny.geometry.location.lat,
              longitude: location.destiny.geometry.location.lng,
            }}
            title="Você está aqui"
          />
        )}
      </MapView>

      <View style={styles.container2}>
      <Text style={styles.texto}> Você ainda não tem contatos de emergência Lipa’s! Convide pessoas de confiança usuários Lipa’s  </Text>
       <TouchableOpacity style={styles.convida} onPress={() => navigation.navigate('Botao Pânico')}> 
        <Text style={styles.textconvida}> Convidar </Text>
       </TouchableOpacity>
       </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FFEDE3',
    width: '100%',
    height: '100%',
  },
  home: {
    color: '#FFEDE3',
    fontSize: 40,
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  borboleta: {
    width: 50,
    height: 50,
    marginLeft: 'auto',
    marginRight: 5,
  },  
  map: {
    width: '100%',
    height: '100%',
  },
  text: {
    margin: 10,
    textAlign: 'center',
    color: '#04c4e1',
  },
  container2: {
    backgroundColor: '#FFEDE3',
    width: '100%',
    height: 450,
    borderWidth: 2,
    borderColor: '#640F1480',
    marginTop: 420,
    borderRadius: 50,
    position: 'absolute',
    
  },
  texto: {
    width: 320,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#49070A',
    marginLeft: 'auto',
    marginHorizontal: 'auto',
    marginTop: 100,
    textAlign: 'center',
  },
  convida: {
    width: 150,
    height: 30,
    borderWidth: 1.5,
    borderColor:"#49070A",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto', 
  },
  textconvida: {
    fontFamily: 'Inter_700Bold', 
    fontSize: 16, 
    color: '#49070A', 
  },
});

export default HomeScreen;



