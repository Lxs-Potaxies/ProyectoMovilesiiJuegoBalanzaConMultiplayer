// src/screens/MultiplayerSetupScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";

const MultiplayerSetupScreen = ({ navigation }) => {
  const [players, setPlayers] = useState(Array(10).fill(""));

  const handleNameChange = (index, name) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = name;
    setPlayers(updatedPlayers);
  };

  const handleContinue = () => {
    const allFilled = players.every((name) => name.trim() !== "");
    if (!allFilled) {
      Alert.alert("Todos los jugadores deben tener un nombre.");
      return;
    }

    // Generar equipos aleatorios
    const shuffled = [...players]
      .map((name) => ({ name, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((el, index) => ({ id: index + 1, name: el.name, group: Math.floor(index / 2) + 1 }));

    navigation.navigate("TeamDisplay", { players: shuffled });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎮 Configura los Jugadores 🎮</Text>
      {players.map((name, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Jugador ${index + 1}`}
          value={name}
          onChangeText={(text) => handleNameChange(index, text)}
        />
      ))}
      <Button title="Formar Equipos" onPress={handleContinue} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "90%",
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default MultiplayerSetupScreen;
