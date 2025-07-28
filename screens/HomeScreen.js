/*
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import DeckCard from '../components/DeckCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { decks } = useDecks();
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('alphabetical');
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'reviewed') {
      const aPct = a.cards.filter((c) => c.reviewed).length / (a.cards.length || 1);
      const bPct = b.cards.filter((c) => c.reviewed).length / (b.cards.length || 1);
      return bPct - aPct;
    }
    return 0;
  });

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder="Search decks..."
        placeholderTextColor={isDark ? '#999' : '#666'}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === 'alphabetical' && styles.activeSortButton,
          ]}
          onPress={() => setSortOption('alphabetical')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOption === 'alphabetical' && styles.activeSortButtonText,
            ]}
          >
            Sort A–Z
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === 'reviewed' && styles.activeSortButton,
          ]}
          onPress={() => setSortOption('reviewed')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOption === 'reviewed' && styles.activeSortButtonText,
            ]}
          >
            Sort Reviewed %
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedDecks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <DeckCard
            title={item.title}
            cards={item.cards.length}
            onPress={() =>
              navigation.navigate('DeckDetail', {
                id: item.id,
                title: item.title,
              })
            }
          />
        )}
      />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + (Platform.OS === 'android' ? 20 : 0) }]}
        onPress={() => navigation.navigate('AddDeck')}
      >
        <Text style={styles.fabText}>+ Add Deck</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe',
  },
  darkContainer: {
    backgroundColor: '#1e1e1e',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontFamily: 'Inter',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#2b2b2b',
    borderColor: '#555',
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  activeSortButton: {
    backgroundColor: '#007aff',
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#333',
  },
  activeSortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007aff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter',
  },
});
*/

import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { decks } = useDecks();
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('alphabetical');
  const scheme = useColorScheme();
  const [overrideDark, setOverrideDark] = useState(scheme === 'dark');
  const isDark = overrideDark;

  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortOption === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'reviewed') {
      const aPct = a.cards.filter((c) => c.reviewed).length / (a.cards.length || 1);
      const bPct = b.cards.filter((c) => c.reviewed).length / (b.cards.length || 1);
      return bPct - aPct;
    }
    return 0;
  });

  const pastelColors = ['#FFDDE1', '#D6F5E3', '#FFF4CC', '#DDEEFF']; // light
  const darkColors = ['#2F3E46', '#3D5A80', '#4A4E69', '#264653']; // better contrast dark
  const sortBtnActiveColor = isDark ? '#444C57' : '#E3F4F4';
  const sortBtnInactiveColor = isDark ? '#2c2c2c' : '#f0f0f0';
  const sortBtnTextColor = isDark ? '#fff' : '#333';
  const addBtnColor = isDark ? '#5A728A' : '#FFDAC1'; // pastel variant for light

  const getCardColor = (index) => {
    const colors = isDark ? darkColors : pastelColors;
    return colors[index % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#ffffff' }]}>
      <View style={styles.topRow}>
        <View style={[
          styles.searchBarContainer,
          { backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' }
        ]}>
          <TextInput
            style={[styles.input, { color: isDark ? '#eee' : '#333' }]}
            placeholder="Search decks"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons
            name="search"
            size={18}
            color={isDark ? '#aaa' : '#666'}
            style={{ marginRight: 10 }}
          />
        </View>

        <TouchableOpacity
          onPress={() => setOverrideDark((prev) => !prev)}
          style={[styles.toggleButton, { backgroundColor: isDark ? '#fff' : '#eee' }]}
        >
          <MaterialCommunityIcons
            name={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
            size={20}
            color={'#000'}
          />
          <Text style={styles.toggleText}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortOption('alphabetical')}>
          <Text style={[
            styles.sortBtn,
            {
              backgroundColor: sortOption === 'alphabetical' ? sortBtnActiveColor : sortBtnInactiveColor,
              color: sortBtnTextColor,
            }
          ]}>
            A–Z
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOption('reviewed')}>
          <Text style={[
            styles.sortBtn,
            {
              backgroundColor: sortOption === 'reviewed' ? sortBtnActiveColor : sortBtnInactiveColor,
              color: sortBtnTextColor,
            }
          ]}>
            Reviewed %
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedDecks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => {
          const cardColor = getCardColor(index);
          return (
            <View style={[styles.deckCard, { backgroundColor: cardColor }]}>
              <Text style={[styles.deckTitle, isDark && { color: '#fff' }]}>
                {item.title.toUpperCase()}
              </Text>
              <Text style={[styles.deckSubtitle, isDark && { color: '#ccc' }]}>
                {`${item.cards.length} CARDS`}
              </Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: addBtnColor }]}
        onPress={() => navigation.navigate('AddDeck')}
      >
        <Text style={[styles.fabText, { color: isDark ? '#fff' : '#333' }]}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontFamily: 'Inter',
    fontSize: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toggleText: {
    fontFamily: 'Inter',
    fontSize: 13,
    marginLeft: 6,
    color: '#000',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sortBtn: {
    fontSize: 15,
    fontFamily: 'Inter',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  deckCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  deckTitle: {
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 4,
    color: '#111',
  },
  deckSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#555',
  },
  fab: {
    position: 'absolute',
    bottom: 40, // ⬆️ moved up from 24 to avoid nav bar
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'InterBold',
  },
});
