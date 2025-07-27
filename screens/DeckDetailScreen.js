/*
import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext'; // ✅ import context

export default function DeckDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, title } = route.params; // ✅ only get ID and title from navigation

  const { decks, setDecks } = useDecks(); // ✅ get decks from context

  const currentDeck = decks?.find((deck) => deck.id === id);
  if (!currentDeck) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Deck not found</Text>
      </View>
    );
  }


  const cards = currentDeck.cards || [];

  const handleDelete = () => {
    Alert.alert(
      'Delete Deck',
      'Are you sure you want to delete this deck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log('🔔 deleting deck', id);
            const updatedDecks = decks.filter((deck) => deck.id !== id);
            setDecks(updatedDecks);
            await saveAllDecks(updatedDecks); // ✅ await allowed now
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{cards.length} cards</Text>

      <Button
        title="Add Card"
        onPress={() => navigation.navigate('AddCard', { deckId: id })}
      />

      <Button
        title="Generate Cards from Text"
        onPress={() => navigation.navigate('GenerateCards', { deckId: id })}
      />

      <Button title="Delete Deck" color="red" onPress={handleDelete} />

      <FlatList
        data={cards}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }} // ✅ adds scroll spacing
        renderItem={({ item }) => {
          const questionText =
            typeof item.question === 'string'
              ? item.question
              : JSON.stringify(item.question);

          const answerText =
            typeof item.answer === 'string'
              ? item.answer
              : JSON.stringify(item.answer);

          return (
            <View style={styles.card}>
              <Text style={styles.question}>Q: {questionText}</Text>
              <Text style={styles.answer}>A: {answerText}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  question: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  answer: {
    color: '#555',
  },
});

*/

import { useLayoutEffect } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Alert,} from 'react-native';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

export default function DeckDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button title="Back to Home" onPress={() => navigation.dispatch(StackActions.popToTop())} />
      ),
    });
  }, [navigation]);

  const { id, title } = route.params;
  const { decks, setDecks } = useDecks();

  const currentDeck = decks.find((deck) => deck.id === id) || { cards: [] };
  const cards = Array.isArray(currentDeck.cards) ? currentDeck.cards : [];

  const handleDelete = () => {
    Alert.alert(
      'Delete Deck',
      'Are you sure you want to delete this deck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // wrap the async logic inside an IIFE
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


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{cards.length} cards</Text>

      <View style={styles.buttonGroup}>
        <Button
          title="Add Card"
          onPress={() =>
            navigation.navigate('AddCard', { deckId: id })
          }
        />
        <Button
          title="Generate Cards"
          onPress={() =>
            navigation.navigate('GenerateCards', { deckId: id })
          }
        />
        <Button
          title="Delete Deck"
          color="red"
          onPress={handleDelete}
        />
      </View>

      {cards.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.question}>Q: {String(item.question)}</Text>
          <Text style={styles.answer}>A: {String(item.answer)}</Text>
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
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  question: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  answer: {
    color: '#555',
  },
});
