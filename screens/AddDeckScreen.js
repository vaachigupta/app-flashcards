import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveDeck } from '../utils/storage';

export default function AddDeckScreen() {
  const [title, setTitle] = useState('');
  const navigation = useNavigation();
  const { decks, setDecks } = useDecks(); // ✅ context

  const handleAddDeck = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Please enter a valid deck title');
      return;
    }

    const newDeck = {
      id: Date.now().toString(),
      title: trimmed,
      cards: [],
    };

    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    await saveDeck(newDeck); // ✅ save to async storage
    setTitle('');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Deck Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. History Quiz"
      />
      <Button title="Create Deck" onPress={handleAddDeck} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});
