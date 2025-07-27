import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

export default function AddCardScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { deckId } = route.params;

  const { decks, setDecks } = useDecks();

  const handleAddCard = async () => {
    console.log('🔔 handleAddCard() called for deckId=', deckId);
    console.log("🟩 Adding card:", { question, answer });
    const updatedDecks = decks.map((deck) => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: Array.isArray(deck.cards) ? [...deck.cards, { question, answer }] : [{ question, answer }]
        };
      }
      return deck;
    });

    setDecks(updatedDecks);
    await saveAllDecks(updatedDecks); // ✅ persist new card
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Question</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
      />
      <Text style={styles.label}>Answer</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
      />
      <Button title="Add Card" onPress={handleAddCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});
