import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image, ScrollView } from "react-native";
import axios from "axios";

// Cubos con imágenes
const cubos = [
  { id: "cubo1", color: "Azul", image: require("./assets/images/cubo1.png") },
  { id: "cubo2", color: "Amarillo", image: require("./assets/images/cubo2.png") },
  { id: "cubo3", color: "Verde", image: require("./assets/images/cubo3.png") },
  { id: "cubo4", color: "Morado", image: require("./assets/images/cubo4.png") },
  { id: "cubo5", color: "Rojo", image: require("./assets/images/cubo5.png") },
];

const ResultMultiplayerScreen = ({ route }) => {
  const { pesos, survivors, sessionId } = route.params;
  const [inputs, setInputs] = useState({});
  const [mostrarFinal, setMostrarFinal] = useState(false);
  const [resultadoEnviado, setResultadoEnviado] = useState(false);

  const handleChange = (playerId, cuboId, value) => {
    const parsed = parseInt(value);
    setInputs((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [cuboId]: !isNaN(parsed) && parsed >= 1 && parsed <= 20 ? parsed : "",
      },
    }));
  };

  const enviarResultados = () => {
    const finalData = survivors.map((player) => ({
      playerId: player.id,
      weights: inputs[player.id],
    }));

    axios.put("http://192.168.0.15:3000/api/multiplayer/finalize", {
      sessionId,
      inputs: finalData,
    }).then(() => {
      setMostrarFinal(true);
      setResultadoEnviado(true);
    }).catch((err) => {
      console.error("Error al enviar datos finales:", err);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Escribe tus pesos finales</Text>

      {survivors.map((player) => (
        <View key={player.id} style={styles.playerBox}>
          <Text style={styles.playerName}>{player.name}</Text>
          {cubos.map((cubo) => (
            <View key={cubo.id} style={styles.row}>
              <Image source={cubo.image} style={styles.cuboImage} />
              <TextInput
                style={styles.input}
                placeholder="1-20"
                keyboardType="numeric"
                onChangeText={(text) => handleChange(player.id, cubo.id, text)}
                value={inputs[player.id]?.[cubo.id]?.toString() || ""}
              />
            </View>
          ))}
        </View>
      ))}

      {!resultadoEnviado && (
        <Button title="Enviar Resultados" onPress={enviarResultados} />
      )}

      {mostrarFinal && (
        <View style={styles.resultado}>
          <Text style={styles.success}>🎉 Datos registrados correctamente 🎉</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  playerBox: { marginBottom: 30, borderBottomWidth: 1, paddingBottom: 10 },
  playerName: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cuboImage: { width: 50, height: 50, marginRight: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    width: 60,
    textAlign: "center",
  },
  resultado: { marginTop: 20, alignItems: "center" },
  success: { color: "green", fontSize: 18, fontWeight: "bold" },
});

export default ResultMultiplayerScreen;
