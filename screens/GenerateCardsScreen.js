import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

export default function GenerateCardsScreen() {
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;

  const { decks, setDecks } = useDecks(); // ✅ use context
  const currentDeck = decks?.find((d) => d.id === deckId);

  if (!currentDeck)
    return <Text style={styles.error}>Deck not found</Text>;

  const handleGenerate = async () => {
    console.log('🔔 handleGenerate() text=', text.slice(0, 30));
    const lines = text.split('\n').filter((line) => line.includes('?'));
    const cards = lines.map((line) => {
      const [question, answer] = line.split('?');
      return {
        question: question.trim() + '?',
        answer: (answer || '').trim(),
      };
    });

    const updatedDecks = decks.map((deck) =>
      deck.id === deckId
        ? {
            ...deck,
            cards: Array.isArray(deck.cards)
              ? [...deck.cards, ...cards]
              : [...cards],
          }
        : deck
    );

    setDecks(updatedDecks);
    await saveAllDecks(updatedDecks);
    const generatedDeck = updatedDecks.find(d => d.id === deckId);
    navigation.navigate('DeckDetail', { id: deckId, title: generatedDeck?.title || 'Untitled Deck' });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Paste Text to Generate Flashcards</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Hola means? Hello"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Generate Cards" onPress={handleGenerate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  error: {
    padding: 20,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
