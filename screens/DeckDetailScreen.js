import React, { useLayoutEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  useRoute,
  useNavigation,
  StackActions,
} from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

export default function DeckDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  // Override header back button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          title="Back to Home"
          onPress={() => navigation.dispatch(StackActions.popToTop())}
        />
      ),
    });
  }, [navigation]);

  const { id, title } = route.params;
  const { decks, setDecks } = useDecks();

  const currentDeck = decks.find((deck) => deck.id === id) || { cards: [] };
  const cards = Array.isArray(currentDeck.cards) ? currentDeck.cards : [];

  // Delete the entire deck
  const handleDeleteDeck = () => {
    Alert.alert(
      'Delete Deck',
      'Are you sure you want to delete this deck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            (async () => {
              const updated = decks.filter((d) => d.id !== id);
              setDecks(updated);
              await saveAllDecks(updated);
              navigation.navigate('Home');
            })();
          },
        },
      ]
    );
  };

  // Delete a single card by index
  const handleDeleteCard = (cardIndex) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            (async () => {
              const updated = decks.map((deck) =>
                deck.id === id
                  ? {
                      ...deck,
                      cards: deck.cards.filter((_, i) => i !== cardIndex),
                    }
                  : deck
              );
              setDecks(updated);
              await saveAllDecks(updated);
            })();
          },
        },
      ]
    );
  };

  const reviewedCount = cards.filter((c) => c.reviewed).length;
  const reviewedPercent = cards.length > 0
    ? Math.round((reviewedCount / cards.length) * 100)
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{cards.length} cards</Text>

      <View style={{ marginVertical: 12 }}>
        <Text>Total Cards: {cards.length}</Text>
        <Text>Reviewed: {reviewedPercent}%</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="Add Card"
          onPress={() => navigation.navigate('AddCard', { deckId: id })}
        />
        <Button
          title="Generate Cards"
          onPress={() =>
            navigation.navigate('GenerateCards', { deckId: id })
          }
        />
        <Button
          title="Review Cards"
          onPress={() => navigation.navigate('Review', { deckId: id })}
        />
        <Button
          title="Delete Deck"
          color="red"
          onPress={handleDeleteDeck}
        />
       </View>

      {cards.map((item, idx) => (
        <View key={idx} style={styles.cardRow}>
          <View style={styles.cardText}>
            <Text style={styles.question}>Q: {String(item.question)}</Text>
            <Text style={styles.answer}>A: {String(item.answer)}</Text>
          </View>
          <Button
            title="Edit"
            onPress={() => navigation.navigate('EditCard', { deckId: id, cardIndex: idx })}
          />
          <Button
            title="Delete"
            color="red"
            onPress={() => handleDeleteCard(idx)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 12,
  },
  buttonGroup: {
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardText: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  question: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  answer: {
    color: '#555',
  },
});
