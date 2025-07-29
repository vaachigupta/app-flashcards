import { useLayoutEffect } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation} from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

export default function DeckDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDark } = useAppTheme();
  const { id, title } = route.params;
  const { decks, setDecks } = useDecks();

  const currentDeck = decks.find((deck) => deck.id === id) || { cards: [] };
  const cards = Array.isArray(currentDeck.cards) ? currentDeck.cards : [];

  useLayoutEffect(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: isDark ? '#1e1d1dff' : '#ffffff',
        },
        headerTintColor: isDark ? '#ffffff' : '#000000',
        headerTitleStyle: {
          fontFamily: 'InterBold',
        },
      });
    }, [navigation, isDark]);

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
              navigation.replace('Home');
            })();
          },
        },
      ]
    );
  };

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
  const reviewedPercent =
    cards.length > 0
      ? Math.round((reviewedCount / cards.length) * 100)
      : 0;

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? '#1a181fff' : '#ffffff' }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
        {cards.length} cards
      </Text>

      <View style={{ marginVertical: 12 }}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          Total Cards: {cards.length}
        </Text>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>
          Reviewed: {reviewedPercent}%
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isDark ? '#60a47dff' : '#b8f2d0ff' }]}
          onPress={() => navigation.navigate('AddCard', { deckId: id })}
        >
          <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#111' }]}>Add Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isDark ? '#c0b540ff' : '#FFF4CC' }]}
          onPress={() => navigation.navigate('GenerateCards', { deckId: id })}
        >
          <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#111' }]}>Generate Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isDark ? '#4f83b4ff' : '#cae4ffff' }]}
          onPress={() => navigation.navigate('Review', { deckId: id })}
        >
          <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#111' }]}>Review Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isDark ? '#cd6b60ff' : '#fcb7b7ff' }]}
          onPress={handleDeleteDeck}
        >
          <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#111' }]}>Delete Deck</Text>
        </TouchableOpacity>
      </View>

      {cards.map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.cardRow,
            { backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0' },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.question, { color: isDark ? '#fff' : '#000' }]}>
              Q: {String(item.question)}
            </Text>
            <Text style={[styles.answer, { color: isDark ? '#aaa' : '#555' }]}>
              A: {String(item.answer)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditCard', { deckId: id, cardIndex: idx })}
          >
            <Text style={{ color: isDark ? '#9b7bd3ff' : '#9884fbff'}}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteCard(idx)}>
            <Text style={{ color: '#e16868ff' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontFamily: 'InterBold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'InterBold',
    fontSize: 15,
  },
  cardRow: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  question: {
    fontFamily: 'InterBold',
    fontSize: 15,
    marginBottom: 4,
  },
  answer: {
    fontFamily: 'Inter',
    fontSize: 14,
  },
});
