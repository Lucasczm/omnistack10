import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";

import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import DevMarker from "../components/DevMarker";

function Main({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [techs, setTechs] = useState("");
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        const { latitude, longitude } = coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }
    loadInitialPosition();
    Keyboard.addListener("keyboardDidShow", ({ endCoordinates }) => {
      setKeyboardHeight(endCoordinates.height);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
  }, []);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("/devs");
      setDevs(response.data);
      console.log(response.data);
    }
    loadDevs();
  }, []);

  async function findDevs() {
    const { latitude, longitude } = currentRegion;
    const response = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    console.log(response.data);
    setDevs(response.data);
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView
        initialRegion={currentRegion}
        style={styles.map}
        onRegionChange={handleRegionChanged}
      >
        {devs.map(dev => (
          <DevMarker dev={dev} key={dev._id} navigation={navigation} />
        ))}
      </MapView>
      <View style={[styles.searchForm, { bottom: keyboardHeight + 20 }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          value={techs}
          onChangeText={setTechs}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.loadButton} onPress={findDevs}>
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  searchForm: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8E4DFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
export default Main;
