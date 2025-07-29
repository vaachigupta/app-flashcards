import { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveDeck } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

export default function AddDeckScreen() {
  const [title, setTitle] = useState('');
  const navigation = useNavigation();
  const { decks, setDecks } = useDecks();
  const { isDark } = useTheme();

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

  const handleAddDeck = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('Please enter a valid deck title');
      return;
    }

    const newDeck = {
      id: Date.now().toString(),
      title: trimmed,
      cards: [],
    };

    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    await saveDeck(newDeck);
    setTitle('');
    navigation.replace('Home');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
      <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>
        Enter Deck Title
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#333',
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
          },
        ]}
        placeholder="e.g. History Quiz"
        placeholderTextColor={isDark ? '#aaa' : '#878787'}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? '#cd6b60ff' : '#FFDAC1' },
        ]}
        onPress={handleAddDeck}
      >
        <Text style={[styles.buttonText, { color: isDark ? '#fff' : '#333' }]}>
          Create Deck
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontFamily: 'InterBold',
    fontSize: 20,
    marginBottom: 12,
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
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'InterBold',
    fontSize: 16,
  },
});
