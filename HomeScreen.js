import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from "react-native";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState("");

  const joinGame = () => {
    if (!playerName.trim()) {
      alert("Por favor ingresa un nombre de jugador.");
      return;
    }

    const playerData = {
      name: playerName,
      group: "A",
      turn: 1,
    };

    axios
      .post("http://192.168.0.15:3000/api/players", playerData)
      .then((response) => {
        console.log("Jugador agregado:", response.data);
        navigation.navigate("Game");
      })
      .catch((error) => {
        console.error(
          "Error al agregar jugador:",
          error.response ? error.response.data : error.message
        );
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎮 Juego de las Balanzas 🎮</Text>

      <View style={styles.rulesBox}>
        <Text style={styles.rulesTitle}>Reglas del Juego:</Text>
        <Text style={styles.rule}>
          🔹 El juego puede jugarse solo o contra un rival.
        </Text>
        <Text style={styles.rule}>
          🔹 Hay 5 cubos de colores: Amarillo, Rojo, Verde, Azul y Morado.
        </Text>
        <Text style={styles.rule}>
          🔹 A cada cubo se le asigna un peso aleatorio entre 2 y 20, sin repetir.
        </Text>
        <Text style={styles.rule}>
          🔹 Hay un total de 20 combinaciones posibles.
        </Text>
        <Text style={styles.rule}>
          🔹 Tienes 20 intentos para adivinar el peso de cada cubo.
        </Text>
        <Text style={styles.rule}>
          🔹 Al final, deberás escribir el peso que crees que tiene cada cubo.
        </Text>
        <Text style={styles.rule}>
          🔹 El jugador que más cubos acierte gana el juego.
        </Text>
        <Text style={styles.rule}>
          🏆 ¡Buena suerte!
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <Button title="Unirme al Juego" onPress={joinGame} />

      <Button
  title="Modo Multijugador Local"
  onPress={() => navigation.navigate("MultiplayerSetup")}/>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  rulesBox: {
    marginBottom: 30,
    backgroundColor: "#ecf0f1",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#34495e",
  },
  rule: {
    fontSize: 16,
    marginBottom: 8,
    color: "#2c3e50",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "100%",
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;
