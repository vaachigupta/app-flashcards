import AsyncStorage from '@react-native-async-storage/async-storage';

const DECKS_KEY = 'flashcards:decks';

// 🔹 Get all decks from storage
export const getDecks = async () => {
  try {
    const data = await AsyncStorage.getItem(DECKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load decks:', e);
    return [];
  }
};

// 🔹 Save all decks (used in context)
export const saveAllDecks = async (decks) => {
  try {
    await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  } catch (e) {
    console.error('Failed to save decks:', e);
  }
};

// 🔹 Add one new deck
export const saveDeck = async (newDeck) => {
  try {
    const existingDecks = await getDecks();
    const updatedDecks = [...existingDecks, newDeck];
    await saveAllDecks(updatedDecks);
  } catch (e) {
    console.error('Failed to save new deck:', e);
  }
};

// 🔹 Clear all decks
export const clearDecks = async () => {
  try {
    await AsyncStorage.removeItem(DECKS_KEY);
  } catch (e) {
    console.error('Failed to clear decks:', e);
  }
};
