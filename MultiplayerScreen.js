// src/screens/MultiplayerScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Button, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

const cuboImages = [
  require("./assets/images/cubo1.png"),
  require("./assets/images/cubo2.png"),
  require("./assets/images/cubo3.png"),
  require("./assets/images/cubo4.png"),
  require("./assets/images/cubo5.png"),
];

const generateRandomWeights = () => {
  const weights = new Set();
  while (weights.size < 5) {
    weights.add(Math.floor(Math.random() * 19) + 2);
  }
  return Array.from(weights);
};

const MultiplayerScreen = ({ route, navigation }) => {
  const { players } = route.params;
  const [turn, setTurn] = useState(1);
  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [cubos, setCubos] = useState([]);
  const [selectedPlatillo, setSelectedPlatillo] = useState(null);
  const [balanzaImage, setBalanzaImage] = useState(require("./assets/images/balanza.png"));
  const [attempts, setAttempts] = useState(20);
  const [pesoCubos, setPesoCubos] = useState({});
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const pesos = generateRandomWeights();
    const nuevosCubos = cuboImages.map((img, index) => ({
      id: index + 1,
      image: img,
      weight: pesos[index],
    }));
    setCubos(nuevosCubos);

    const mapaPesos = {};
    nuevosCubos.forEach((cubo) => {
      mapaPesos[`cubo${cubo.id}`] = cubo.weight;
    });
    setPesoCubos(mapaPesos);

    axios.post("http://192.168.0.15:3000/api/multiplayer/session", { players })
      .then(res => setSessionId(res.data.sessionId))
      .catch(err => console.error("Error al crear sesión:", err));
  }, []);

  const selectPlatillo = (platillo) => {
    setSelectedPlatillo(platillo);
  };

  const placeCuboInPlatillo = (cubo) => {
    if (!selectedPlatillo) return;
    if (group1.includes(cubo) || group2.includes(cubo)) return;

    if (selectedPlatillo === "left") {
      setGroup1([...group1, cubo]);
    } else {
      setGroup2([...group2, cubo]);
    }
  };

  const makeWeighing = () => {
    if (group1.length === 0 || group2.length === 0) return;

    const peso1 = group1.reduce((acc, c) => acc + c.weight, 0);
    const peso2 = group2.reduce((acc, c) => acc + c.weight, 0);

    if (peso1 > peso2) {
      setBalanzaImage(require("./assets/images/balanza-izquierda.jpg"));
    } else if (peso2 > peso1) {
      setBalanzaImage(require("./assets/images/balanza-derecha.png"));
    } else {
      setBalanzaImage(require("./assets/images/balanza.png"));
    }

    axios.post("http://192.168.0.15:3000/api/multiplayer/move", {
      sessionId,
      playerId: turn,
      action: `Pesaje de ${peso1} vs ${peso2}`,
    });

    setTimeout(() => {
      setGroup1([]);
      setGroup2([]);
      setBalanzaImage(require("./assets/images/balanza.png"));

      if (turn === 10) {
        setAttempts((prev) => prev - 1);
        if (attempts - 1 === 0) {
          navigation.navigate("Elimination", {
            players,
            sessionId,
            pesos: pesoCubos,
          });
        }
        setTurn(1);
      } else {
        setTurn(turn + 1);
      }
    }, 2000);
  };

  const player = players.find((p) => p.id === turn);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Turno de: {player?.name} (Grupo {player?.group})</Text>
      <Text style={styles.subtitle}>Intentos restantes: {attempts}</Text>
      <Image source={balanzaImage} style={styles.balanzaImage} />

      <View style={styles.platillos}>
        <TouchableOpacity onPress={() => selectPlatillo("left")}>\n          <Text>Platillo Izquierdo</Text>
          <View style={styles.platillo}>{group1.map(c => <Image key={c.id} source={c.image} style={styles.cuboImage} />)}</View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => selectPlatillo("right")}>\n          <Text>Platillo Derecho</Text>
          <View style={styles.platillo}>{group2.map(c => <Image key={c.id} source={c.image} style={styles.cuboImage} />)}</View>
        </TouchableOpacity>
      </View>

      <Text>Cubos disponibles</Text>
      <View style={styles.cubosContainer}>
        {cubos.map((cubo) => {
          const enUso = group1.includes(cubo) || group2.includes(cubo);
          return !enUso ? (
            <TouchableOpacity key={cubo.id} onPress={() => placeCuboInPlatillo(cubo)}>
              <Image source={cubo.image} style={styles.cuboImage} />
            </TouchableOpacity>
          ) : null;
        })}
      </View>

      <Button title="Realizar Pesaje" onPress={makeWeighing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  balanzaImage: { width: 200, height: 200, marginBottom: 20 },
  platillos: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  platillo: { width: 100, height: 100, borderWidth: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#eee", margin: 10 },
  cubosContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginVertical: 20 },
  cuboImage: { width: 50, height: 50, margin: 5 },
});

export default MultiplayerScreen;
