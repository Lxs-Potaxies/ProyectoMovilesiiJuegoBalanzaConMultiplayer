// src/screens/EliminationScreen.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import CheckBox from '@react-native-community/checkbox';

const EliminationScreen = ({ route, navigation }) => {
  const { players, sessionId, pesos } = route.params;
  const [eliminados, setEliminados] = useState([]);

  const toggleEliminado = (id) => {
    setEliminados((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleContinuar = () => {
    const sobrevivientes = players.filter((p) => !eliminados.includes(p.id));
    navigation.navigate("ResultMultiplayer", {
      survivors: sobrevivientes,
      sessionId,
      pesos,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🗑️ Selecciona a los jugadores eliminados 🗑️</Text>
      {players.map((player) => (
        <View key={player.id} style={styles.row}>
          <CheckBox
            value={eliminados.includes(player.id)}
            onValueChange={() => toggleEliminado(player.id)}
          />
          <Text>{player.name}</Text>
        </View>
      ))}
      <Button title="Continuar" onPress={handleContinuar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
});

export default EliminationScreen;
