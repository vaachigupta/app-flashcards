import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DeckDetailScreen from './screens/DeckDetailScreen';
import AddDeckScreen from './screens/AddDeckScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
        <Stack.Screen name="AddDeck" component={AddDeckScreen} />
        {/* You'll add more screens here later like CreateDeck, ViewDeck, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
