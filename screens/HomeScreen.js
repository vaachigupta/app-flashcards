import { useState, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../context/DeckContext';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { decks } = useDecks();
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('alphabetical');
  const { isDark, toggleTheme } = useAppTheme();

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
  const darkColors = [ '#be6d9fff', '#60a47dff', '#c0b540ff', '#4f83b4ff']
  const sortBtnActiveColor = isDark ? '#cd6b60ff' : '#FFDAC1';
  const sortBtnInactiveColor = isDark ? '#3a3a3a' : '#f0f0f0';
  const sortBtnTextColor = isDark ? '#fff' : '#333';
  const addBtnColor = isDark ? '#cd6b60ff' : '#FFDAC1'; 

  const getCardColor = (index) => {
    const colors = isDark ? darkColors : pastelColors;
    return colors[index % colors.length];
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
      <View style={styles.topRow}>
        <View style={[
          styles.searchBarContainer,
          { backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0' }
        ]}>
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#333' }]}
            placeholder="Search decks"
            placeholderTextColor={isDark ? '#aaa' : '#878787'}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons
            name="search"
            size={18}
            color={isDark ? '#fff' : '#333'}
            style={{ marginRight: 10 }}
          />
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
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
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DeckDetail', {
                  id: item.id,
                  title: item.title,
                })
              }
              style={[styles.deckCard, { backgroundColor: getCardColor(index) }]}
            >
              <Text style={[styles.deckTitle, { color: isDark ? '#ffffff' : '#111' }]}>
                {item.title.toUpperCase()}
              </Text>
              <Text style={[styles.deckSubtitle, { color: isDark ? '#ffffffff' : '#555' }]}>
                {`${item.cards.length} CARDS`}
              </Text>
            </TouchableOpacity>
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
