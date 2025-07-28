import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';

const GEMINI_API_KEY = ''; // ← Your API key

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
