import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'; 
import GameScreen from './GameScreen'; 
import ResultScreen from './ResultScreen';
import MultiplayerScreen from './MultiplayerScreen'; 
import ResultMultiplayerScreen from './ResultMultiplayerScreen';
import MultiplayerSetupScreen from './MultiplayerSetUpScreen';
import TeamDisplayScreen from './TeamDisplayScreen';
import EliminationScreen from './EliminationScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="MultiplayerSetup" component={MultiplayerSetupScreen} />
        <Stack.Screen name="TeamDisplay" component={TeamDisplayScreen} />
        <Stack.Screen name="Multiplayer" component={MultiplayerScreen} />
        <Stack.Screen name="Elimination" component={EliminationScreen} />
        <Stack.Screen name="ResultMultiplayer" component={ResultMultiplayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
