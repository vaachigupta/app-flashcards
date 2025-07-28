import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

export default function EditCardScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { deckId, cardIndex } = params;

  const { decks, setDecks } = useDecks();
  const deck = decks.find((d) => d.id === deckId);
  const card = deck.cards[cardIndex];

  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);

  const handleSave = async () => {
    const updatedDecks = decks.map((deck) =>
      deck.id === deckId
        ? {
            ...deck,
            cards: deck.cards.map((c, i) =>
              i === cardIndex ? { question, answer } : c
            ),
          }
        : deck
    );
    setDecks(updatedDecks);
    await saveAllDecks(updatedDecks);
    Alert.alert('Card updated!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={question} onChangeText={setQuestion} placeholder="Question" />
      <TextInput style={styles.input} value={answer} onChangeText={setAnswer} placeholder="Answer" />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 6,
  },
});
