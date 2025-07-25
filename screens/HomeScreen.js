import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import DeckCard from '../components/DeckCard';

const dummyDecks = [
  { id: '1', title: 'Spanish Basics', cards: 10 },
  { id: '2', title: 'React Concepts', cards: 15 },
  { id: '3', title: 'Science Quiz', cards: 8 },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyDecks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeckCard title={item.title} cards={item.cards} />
        )}
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
});
