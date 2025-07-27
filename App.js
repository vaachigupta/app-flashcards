import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import DeckDetailScreen from './screens/DeckDetailScreen';
import AddDeckScreen from './screens/AddDeckScreen';
import GenerateCardsScreen from './screens/GenerateCardsScreen';
import AddCardScreen from './screens/AddCardScreen';

import { DeckProvider } from './context/DeckContext'; // ✅ wrap your app in this

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DeckProvider> {/* ✅ Global state context wrapper */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
          <Stack.Screen name="AddDeck" component={AddDeckScreen} />
          <Stack.Screen name="GenerateCards" component={GenerateCardsScreen} />
          <Stack.Screen name="AddCard" component={AddCardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DeckProvider>
  );
}
