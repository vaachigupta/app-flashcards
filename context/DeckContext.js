import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeckContext = createContext();

export const DeckProvider = ({ children }) => {
  const [decks, setDecks] = useState([]);

  // Load decks on first mount
  useEffect(() => {
    const loadDecks = async () => {
      try {
        const data = await AsyncStorage.getItem('decks');
        if (data) {
          setDecks(JSON.parse(data));
        } else {
          // Set default decks only if none exist
          setDecks([
            {
              id: '1',
              title: 'Spanish Basics',
              cards: [
                { question: 'Hola means?', answer: 'Hello' },
                { question: 'Gracias?', answer: 'Thank you' },
              ],
            },
            {
              id: '2',
              title: 'React Concepts',
              cards: [],
            },
          ]);
        }
      } catch (e) {
        console.error('Failed to load decks:', e);
      }
    };

    loadDecks();
  }, []);

  // Save to AsyncStorage whenever decks change
  useEffect(() => {
    AsyncStorage.setItem('decks', JSON.stringify(decks));
  }, [decks]);

  return (
    <DeckContext.Provider value={{ decks, setDecks }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDecks = () => useContext(DeckContext);
