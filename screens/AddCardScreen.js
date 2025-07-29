import { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

export default function AddCardScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { deckId } = route.params;
  const { decks, setDecks } = useDecks();
  const { isDark } = useAppTheme();

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

  const handleAddCard = async () => {
    const updatedDecks = decks.map((deck) => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: Array.isArray(deck.cards)
            ? [...deck.cards, { question, answer }]
            : [{ question, answer }],
        };
      }
      return deck;
    });

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
            color: isDark ? '#fff' : '#333',
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
          },
        ]}
        placeholder="Enter question"
        placeholderTextColor={isDark ? '#aaa' : '#878787'}
        value={question}
        onChangeText={setQuestion}
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>ANSWER</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#333',
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
          },
        ]}
        placeholder="Enter answer"
        placeholderTextColor={isDark ? '#aaa' : '#878787'}
        value={answer}
        onChangeText={setAnswer}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? '#cd6b60ff' : '#FFDAC1' },
        ]}
        onPress={handleAddCard}
      >
        <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#333' }]}>
          Add Card
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 45,
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'InterBold',
    fontSize: 16,
  },
});
