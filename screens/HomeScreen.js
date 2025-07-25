import React from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import DeckCard from '../components/DeckCard';
import { useNavigation } from '@react-navigation/native';

const dummyDecks = [
  { id: '1', title: 'Spanish Basics', cards: 10 },
  { id: '2', title: 'React Concepts', cards: 15 },
  { id: '3', title: 'Science Quiz', cards: 8 },
];

export default function HomeScreen() {
  const navigation = useNavigation(); // ✅ must be inside the component

  return (
    <View style={styles.container}>
      <Button
        title="Add New Deck"
        onPress={() => navigation.navigate('AddDeck')}
      />
      <FlatList
        data={dummyDecks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeckCard
            title={item.title}
            cards={item.cards}
            onPress={() =>
              navigation.navigate('DeckDetail', {
                title: item.title,
                cards: item.cards,
              })
            }
          />
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
