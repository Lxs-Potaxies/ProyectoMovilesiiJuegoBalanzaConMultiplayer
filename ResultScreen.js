import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image, ScrollView } from "react-native";

// Lista de cubos con ID, color, e imagen
const cubos = [
  {
    id: "cubo1",
    color: "Azul",
    image: require("./assets/images/cubo1.png"),
  },
  {
    id: "cubo2",
    color: "Amarillo",
    image: require("./assets/images/cubo2.png"),
  },
  {
    id: "cubo3",
    color: "Verde",
    image: require("./assets/images/cubo3.png"),
  },
  {
    id: "cubo4",
    color: "Morado",
    image: require("./assets/images/cubo4.png"),
  },
  {
    id: "cubo5",
    color: "Rojo",
    image: require("./assets/images/cubo5.png"), // Este parece ser .jpg en tu código
  },
];

const ResultScreen = ({ route }) => {
  const { pesos } = route.params || {};

  const [inputs, setInputs] = useState({});
  const [resultados, setResultados] = useState({});
  const [mostrarFinal, setMostrarFinal] = useState(false);

  const handleChange = (id, valor) => {
    const number = parseInt(valor);

    // Verificamos si el valor es un número válido dentro del rango 1-20
    if (!isNaN(number) && number >= 1 && number <= 20) {
      setInputs((prev) => ({ ...prev, [id]: number }));
    } else if (valor === "") {
      // Permite borrar el campo
      setInputs((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const comprobar = () => {
    setResultados(pesos);

    setTimeout(() => {
      setMostrarFinal(true);
    }, 3000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Escribe los pesos de los cubos</Text>

      {cubos.map((cubo) => (
        <View key={cubo.id} style={styles.row}>
          <Image source={cubo.image} style={styles.cuboImage} />
          <Text style={styles.label}>{cubo.color}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="1-20"
            value={inputs[cubo.id]?.toString() || ""}
            onChangeText={(text) => handleChange(cubo.id, text)}
          />
        </View>
      ))}

      <View style={styles.button}>
        <Button title="Comprobar" onPress={comprobar} />
      </View>

      {Object.keys(resultados).length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Pesos reales:</Text>
          {cubos.map((cubo) => (
            <Text key={cubo.id}>
              Cubo {cubo.color}: {resultados[cubo.id]}
            </Text>
          ))}
        </View>
      )}

      {mostrarFinal && <Text style={styles.final}>🎉 Juego Terminado 🎉</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cuboImage: {
    width: 70, // Tamaño aumentado de la imagen
    height: 70,
    marginRight: 10,
  },
  label: {
    width: 80,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 5,
    width: 60,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    width: "60%",
  },
  resultContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  final: {
    marginTop: 20,
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
});

export default ResultScreen;