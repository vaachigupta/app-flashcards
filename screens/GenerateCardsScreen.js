/* 
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

export default function GenerateCardsScreen() {
  const [text, setText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;

  const { decks, setDecks } = useDecks(); // ✅ use context
  const currentDeck = decks?.find((d) => d.id === deckId);

  if (!currentDeck)
    return <Text style={styles.error}>Deck not found</Text>;

  const handleGenerate = async () => {
    console.log('🔔 handleGenerate() text=', text.slice(0, 30));
    const lines = text.split('\n').filter((line) => line.includes('?'));
    const cards = lines.map((line) => {
      const [question, answer] = line.split('?');
      return {
        question: question.trim() + '?',
        answer: (answer || '').trim(),
      };
    });

    const updatedDecks = decks.map((deck) =>
      deck.id === deckId
        ? {
            ...deck,
            cards: Array.isArray(deck.cards)
              ? [...deck.cards, ...cards]
              : [...cards],
          }
        : deck
    );

    setDecks(updatedDecks);
    await saveAllDecks(updatedDecks);
    const generatedDeck = updatedDecks.find(d => d.id === deckId);
    navigation.navigate('DeckDetail', { id: deckId, title: generatedDeck?.title || 'Untitled Deck' });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Paste Text to Generate Flashcards</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Hola means? Hello"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Generate Cards" onPress={handleGenerate} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  error: {
    padding: 20,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

*/

/*
import React, { useState, useEffect } from 'react';
import {View, TextInput, Button, StyleSheet, ScrollView, Text, ActivityIndicator, Alert,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

const GEMINI_API_KEY = 'AIzaSyCkR9pDApCHqYWT9IPAkk0xRl4hDoGOhkY'; // ← Your valid API key

export default function GenerateCardsScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;

  const { decks, setDecks } = useDecks();
  const currentDeck = decks.find((d) => d.id === deckId);
  if (!currentDeck) return <Text style={styles.error}>Deck not found</Text>;

  // Optional: list models for debugging
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
        );
        const list = await res.json();
        console.log('🗒️ Available models:', JSON.stringify(list, null, 2));
      } catch (e) {
        console.error('🔴 ListModels error:', e);
      }
    })();
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) {
      return Alert.alert('Please paste some text first.');
    }

    setLoading(true);
    let aiCards;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const prompt = `
Generate 3–5 flashcards in the format:
[
  { "question": "...", "answer": "..." },
  ...
]
from this text:

"${text}"
`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: [{ text: prompt }],
              temperature: 0.7,
            }),
          }
        );
        const data = await res.json();
        console.log(`🔍 Gemini attempt #${attempt}:`, JSON.stringify(data, null, 2));

        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const match = raw.match(/\[.*?\]/s);
          if (match) {
            aiCards = JSON.parse(match[0]).map((c) => ({ ...c, reviewed: false }));
            break;
          }
        }
        throw new Error('Empty or malformed Gemini reply');
      } catch (e) {
        console.warn(`⚠️ Gemini attempt #${attempt} failed: ${e.message}`);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 500 * 2 ** (attempt - 1)));
        }
      }
    }

    if (!aiCards) {
      console.warn('⚠️ Falling back to manual parser');
      const lines = text.split('\n').filter((l) => l.includes('?'));
      aiCards = lines.map((line) => {
        const [q, a] = line.split('?');
        return {
          question: q.trim() + '?',
          answer: (a || '').trim(),
          reviewed: false,
        };
      });

      Alert.alert(
        'Using Fallback',
        aiCards.length
          ? `Created ${aiCards.length} cards manually.`
          : 'No cards generated; please add manually.'
      );
    }

    const updated = decks.map((deck) =>
      deck.id === deckId ? { ...deck, cards: [...deck.cards, ...aiCards] } : deck
    );
    setDecks(updated);
    await saveAllDecks(updated);
    setLoading(false);
    navigation.navigate('DeckDetail', { id: deckId });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.title}>Paste Text to Generate Flashcards</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste a paragraph here..."
          value={text}
          onChangeText={setText}
          multiline
        />
      </ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Generate Cards" onPress={handleGenerate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    height: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  error: { padding: 20, fontSize: 18, color: 'red', textAlign: 'center' },
});

*/

import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

const GEMINI_API_KEY = 'AIzaSyCkR9pDApCHqYWT9IPAkk0xRl4hDoGOhkY'; // ← Your API key

export default function GenerateCardsScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;

  const { decks, setDecks } = useDecks();
  const currentDeck = decks.find((d) => d.id === deckId);
  if (!currentDeck) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Deck not found</Text>
      </View>
    );
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      return Alert.alert('Please paste some text first.');
    }

    setLoading(true);
    let aiCards;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const prompt = `
From the following text, extract 3-5 flashcards in this JSON format:
[
  { "question": "...?", "answer": "..." },
  ...
]

Text:
${text}
        `.trim();

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }],
                },
              ],
            }),
          }
        );

        const data = await res.json();
        console.log(`🔍 Gemini attempt #${attempt}:`, JSON.stringify(data, null, 2));

        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const match = raw.match(/\[\s*{[\s\S]*?}\s*\]/); // Match JSON array
          if (match) {
            aiCards = JSON.parse(match[0]);
            break;
          }
        }

        throw new Error('Empty or malformed Gemini reply');
      } catch (e) {
        console.warn(`⚠️ Gemini attempt #${attempt} failed: ${e.message}`);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 500 * 2 ** (attempt - 1)));
        }
      }
    }

    // Fallback parser if AI fails
    if (!aiCards) {
      const lines = text.split('\n').filter((line) => line.includes('?'));
      aiCards = lines.map((line) => {
        const [q, a] = line.split('?');
        return {
          question: q.trim() + '?',
          answer: (a || '').trim(),
        };
      });
      Alert.alert(
        'Using Fallback',
        aiCards.length
          ? `Created ${aiCards.length} cards manually.`
          : 'No cards generated; please add manually.'
      );
    }

    const updated = decks.map((deck) =>
      deck.id === deckId ? { ...deck, cards: [...deck.cards, ...aiCards] } : deck
    );
    setDecks(updated);
    await saveAllDecks(updated);
    setLoading(false);
    navigation.navigate('DeckDetail', { id: deckId, title: currentDeck.title });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.title}>Paste Text to Generate Flashcards</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste a paragraph here..."
          value={text}
          onChangeText={setText}
          multiline
        />
      </ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Generate Cards" onPress={handleGenerate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    height: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  error: { padding: 20, fontSize: 18, color: 'red', textAlign: 'center' },
});
