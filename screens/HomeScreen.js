/*
import React, { useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';
import DeckCard from '../components/DeckCard';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getDecks } from '../utils/storage';
import { useDecks } from '../context/DeckContext';

export default function HomeScreen() {
  const { decks, setDecks } = useDecks();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const loadDecks = async () => {
    try {
      const storedDecks = await getDecks();
      setDecks(storedDecks || []);
    } catch (err) {
      console.error('Failed to load decks:', err);
      setDecks([]);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadDecks();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Button
        title="Add New Deck"
        onPress={() => navigation.navigate('AddDeck')}
      />

      {decks.length === 0 ? (
        <Text style={styles.emptyText}>No decks yet. Add one!</Text>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DeckCard
              title={item.title}
              cards={item.cards.length}
              onPress={() =>
                navigation.navigate('DeckDetail', {
                  id: item.id,
                  title: item.title,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

*/

import React from 'react';
import { View, FlatList, StyleSheet, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import DeckCard from '../components/DeckCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { decks } = useDecks();

  return (
    <View style={styles.container}>
      <Button
        title="Add New Deck"
        onPress={() => navigation.navigate('AddDeck')}
      />

      {decks.length === 0 ? (
        <Text style={styles.emptyText}>No decks yet. Add one!</Text>
      ) : (
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 20 }}
          renderItem={({ item }) => (
            <DeckCard
              title={item.title}
              cards={item.cards.length}
              onPress={() =>
                navigation.navigate('DeckDetail', {
                  id: item.id,
                  title: item.title,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});
