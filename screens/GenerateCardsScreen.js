import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, } from 'react-native';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

const GROQ_API_KEY = '';

export default function GenerateCardsScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { deckId } = route.params;
  const { isDark } = useAppTheme();

  const { decks, setDecks } = useDecks();
  const currentDeck = decks.find((d) => d.id === deckId);

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

  if (!currentDeck) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
        <Text style={[styles.error, { color: isDark ? '#fff' : 'red' }]}>Deck not found</Text>
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
From the following text, extract 3–5 flashcards in this JSON format:
[
  { "question": "...?", "answer": "..." },
  ...
]

Text:
${text}
        `.trim();

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });

        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content;
        if (raw) {
          const match = raw.match(/\[\s*{[\s\S]*?}\s*\]/);
          if (match) {
            aiCards = JSON.parse(match[0]).map((c) => ({ ...c, reviewed: false }));
            break;
          }
        }

        throw new Error('Empty or malformed GPT reply');
      } catch (e) {
        console.warn(`⚠️ GPT attempt #${attempt} failed: ${e.message}`);
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 500 * 2 ** (attempt - 1)));
        }
      }
    }

    if (!aiCards) {
      const lines = text.split('\n').filter((line) => line.includes('?'));
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
    navigation.replace('DeckDetail', {
      id: deckId,
      title: currentDeck.title,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
      <ScrollView style={{ flex: 1 }}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Paste Text to Generate Flashcards
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#2c2c2e' : '#fff',
              color: isDark ? '#fff' : '#000',
              borderColor: isDark ? '#444' : '#ccc',
            },
          ]}
          placeholder="Paste a paragraph here..."
          placeholderTextColor={isDark ? '#999' : '#888'}
          value={text}
          onChangeText={setText}
          multiline
        />
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color={isDark ? '#60a47dff' : 'blue'} />
      ) : (
        <TouchableOpacity
          style={[
            styles.generateButton,
            { backgroundColor: isDark ? '#cd6b60ff' : '#FFDAC1' },
          ]}
          onPress={handleGenerate}
        >
          <Text style={[styles.generateButtonText, { color: isDark ? '#fff' : '#111' }]}>
            Generate Cards
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 300,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  error: {
    padding: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  generateButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  generateButtonText: {
    fontFamily: 'InterBold',
    fontSize: 16,
  },
});
