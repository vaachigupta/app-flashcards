import { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

export default function EditCardScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { deckId, cardIndex } = params;

  const { isDark } = useAppTheme();
  const { decks, setDecks } = useDecks();
  const deck = decks.find((d) => d.id === deckId);
  const card = deck.cards[cardIndex];

  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);

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
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>QUESTION</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#000',
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
          },
        ]}
        placeholder="Edit question"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={question}
        onChangeText={setQuestion}
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>ANSWER</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#000',
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
          },
        ]}
        placeholder="Edit answer"
        placeholderTextColor={isDark ? '#aaa' : '#666'}
        value={answer}
        onChangeText={setAnswer}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? '#60a47dff' : '#D6F5E3' },
        ]}
        onPress={handleSave}
      >
        <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#111' }]}>
          Save Changes
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontFamily: 'InterBold',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    fontFamily: 'Inter',
    fontSize: 16,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'InterBold',
    fontSize: 16,
  },
});
