// src/screens/TeamDisplayScreen.js
import React from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

const TeamDisplayScreen = ({ route, navigation }) => {
  const { players } = route.params;

  const grouped = players.reduce((acc, player) => {
    const group = acc.find((g) => g.group === player.group);
    if (group) {
      group.members.push(player);
    } else {
      acc.push({ group: player.group, members: [player] });
    }
    return acc;
  }, []);

  const handleStart = () => {
    navigation.navigate("Multiplayer", { players });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧑‍🤝‍🧑 Equipos Formados 🧑‍🤝‍🧑</Text>
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.group.toString()}
        renderItem={({ item }) => (
          <View style={styles.groupBox}>
            <Text style={styles.groupTitle}>Grupo {item.group}</Text>
            {item.members.map((m) => (
              <Text key={m.id} style={styles.member}>{m.name}</Text>
            ))}
          </View>
        )}
      />
      <Button title="Iniciar Juego" onPress={handleStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  groupBox: { marginBottom: 20, alignItems: "center" },
  groupTitle: { fontSize: 18, fontWeight: "bold" },
  member: { fontSize: 16 },
});

export default TeamDisplayScreen;
