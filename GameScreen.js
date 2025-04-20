import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 Importar hook

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
    weights.add(Math.floor(Math.random() * 19) + 2); // 2 a 20
  }
  return Array.from(weights);
};

const GameScreen = () => {
  const navigation = useNavigation(); // 👈 Usar el hook
  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);
  const [cubos, setCubos] = useState([]);
  const [selectedPlatillo, setSelectedPlatillo] = useState(null);
  const [gameResult, setGameResult] = useState("");
  const [attempts, setAttempts] = useState(20);
  const [balanzaImage, setBalanzaImage] = useState(require("./assets/images/balanza.png"));
  const [pesoCubos, setPesoCubos] = useState({});

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
  }, []);

  // 👇 Redirigir a ResultScreen si los intentos llegan a 0
  useEffect(() => {
    if (attempts === 0) {
      setTimeout(() => {
        navigation.navigate("Result", { pesos: pesoCubos }); // Puedes enviar datos si quieres
      }, 2000); // Esperar 2 segundos para mostrar el último pesaje
    }
  }, [attempts]);

  const selectPlatillo = (platillo) => {
    setSelectedPlatillo(platillo);
  };

  const placeCuboInPlatillo = (cubo) => {
    if (!selectedPlatillo) {
      setGameResult("Por favor, selecciona un platillo primero.");
      return;
    }

    if (group1.includes(cubo) || group2.includes(cubo)) return;

    if (selectedPlatillo === "left") {
      setGroup1((prev) => [...prev, cubo]);
    } else {
      setGroup2((prev) => [...prev, cubo]);
    }

    setGameResult("");
  };

  const makeWeighing = () => {
    if (attempts <= 0 || group1.length === 0 || group2.length === 0) return;

    const pesoGrupo1 = group1.reduce((acc, cubo) => acc + cubo.weight, 0);
    const pesoGrupo2 = group2.reduce((acc, cubo) => acc + cubo.weight, 0);

    if (pesoGrupo1 > pesoGrupo2) {
      setBalanzaImage(require("./assets/images/balanza-izquierda.jpg"));
    } else if (pesoGrupo2 > pesoGrupo1) {
      setBalanzaImage(require("./assets/images/balanza-derecha.png"));
    } else {
      setBalanzaImage(require("./assets/images/balanza.png"));
    }

    setAttempts((prev) => prev - 1);

    setTimeout(() => {
      setGroup1([]);
      setGroup2([]);
      setBalanzaImage(require("./assets/images/balanza.png"));
    }, 2000);
  };

  const isButtonDisabled = group1.length === 0 || group2.length === 0 || attempts <= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Juego de la Balanza</Text>
      <Text>Intentos restantes: {attempts}</Text>
      <Text>{gameResult}</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balanza</Text>
        <Image source={balanzaImage} style={styles.balanzaImage} />
      </View>

      <View style={styles.platilloContainer}>
        <TouchableOpacity onPress={() => selectPlatillo("left")}>
          <Text>Platillo Izquierdo</Text>
          <View style={styles.platillo}>
            {group1.map((cubo) => (
              <Image key={cubo.id} source={cubo.image} style={styles.cuboImage} />
            ))}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => selectPlatillo("right")}>
          <Text>Platillo Derecho</Text>
          <View style={styles.platillo}>
            {group2.map((cubo) => (
              <Image key={cubo.id} source={cubo.image} style={styles.cuboImage} />
            ))}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cubosContainer}>
        <Text>Cubos disponibles</Text>
        <View style={styles.cubos}>
          {cubos.map((cubo) => {
            const enUso = group1.includes(cubo) || group2.includes(cubo);
            if (!enUso) {
              return (
                <TouchableOpacity key={cubo.id} onPress={() => placeCuboInPlatillo(cubo)}>
                  <Image source={cubo.image} style={styles.cuboImage} />
                </TouchableOpacity>
              );
            }
            return null;
          })}
        </View>
      </View>

      <Button
        title="Realizar Pesaje"
        onPress={makeWeighing}
        disabled={isButtonDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  balanceContainer: {
    marginVertical: 20,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanzaImage: {
    width: 200,
    height: 200,
  },
  platilloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  platillo: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    margin: 10,
  },
  cuboImage: {
    width: 50,
    height: 50,
    margin: 5,
  },
  cubosContainer: {
    marginVertical: 20,
  },
  cubos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default GameScreen;
