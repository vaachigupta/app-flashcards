import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';
import { Ionicons } from '@expo/vector-icons'; // install if not already

export default function ReviewScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { deckId } = params;
  const { decks, setDecks } = useDecks();

  const deck = decks.find((d) => d.id === deckId);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrongCards, setWrongCards] = useState([]);
  const [reviewPhase, setReviewPhase] = useState('initial'); // or 'retry'

  const reviewList =
    reviewPhase === 'initial' ? deck?.cards || [] : wrongCards;

  if (!deck || !reviewList.length) {
    return (
      <View style={styles.center}>
        <Text>No cards to review.</Text>
      </View>
    );
  }

  const card = reviewList[index];

  const handleResponse = async (correct) => {
    if (!correct) {
      setWrongCards((prev) => [...prev, card]);
    }

    const updatedDecks = decks.map((d) =>
      d.id === deckId
        ? {
            ...d,
            cards: d.cards.map((c) =>
              c.question === card.question
                ? { ...c, reviewed: correct }
                : c
            ),
          }
        : d
    );
    setDecks(updatedDecks);
    await saveAllDecks(updatedDecks);

    // Move to next card
    if (index < reviewList.length - 1) {
      setIndex(index + 1);
      setShowAnswer(false);
    } else {
      if (reviewPhase === 'initial' && wrongCards.length > 0) {
        Alert.alert('Retry', 'Reviewing the cards you got wrong.');
        setReviewPhase('retry');
        setIndex(0);
        setShowAnswer(false);
      } else {
        Alert.alert('Review Complete', 'All cards reviewed!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Q: {card.question}</Text>

      {showAnswer ? (
        <Text style={styles.answer}>A: {card.answer}</Text>
      ) : (
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setShowAnswer(true)}
        >
          <Text style={styles.showText}>Show Answer</Text>
        </TouchableOpacity>
      )}

      {showAnswer && (
        <View style={styles.responseButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: '#ffdddd' }]}
            onPress={() => handleResponse(false)}
          >
            <Ionicons name="thumbs-down" size={32} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: '#ddffdd' }]}
            onPress={() => handleResponse(true)}
          >
            <Ionicons name="thumbs-up" size={32} color="green" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  answer: {
    fontSize: 20,
    marginVertical: 20,
    color: 'green',
  },
  showButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  showText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    padding: 16,
    borderRadius: 50,
  },
});
