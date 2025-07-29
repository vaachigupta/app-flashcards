import { useState, useRef, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDecks } from '../context/DeckContext';
import { saveAllDecks } from '../utils/storage';
import { useTheme as useAppTheme } from '../context/ThemeContext';

export default function ReviewScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { deckId } = params;
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


  const deck = decks.find((d) => d.id === deckId);
  const [index, setIndex] = useState(0);
  const [wrongCards, setWrongCards] = useState([]);
  const [reviewPhase, setReviewPhase] = useState('initial');
  const [flipped, setFlipped] = useState(false);

  const reviewList = reviewPhase === 'initial' ? deck?.cards || [] : wrongCards;
  const animatedValue = useRef(new Animated.Value(0)).current;

  let currentValue = 0;
  animatedValue.addListener(({ value }) => (currentValue = value));

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (currentValue >= 90) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
      setFlipped(false);
    } else {
      Animated.timing(animatedValue, {
        toValue: 180,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
      setFlipped(true);
    }
  };

  const card = reviewList[index];

  const handleResponse = async (correct) => {
    if (!correct) setWrongCards((prev) => [...prev, card]);

    const updatedDecks = decks.map((d) =>
      d.id === deckId
        ? {
            ...d,
            cards: d.cards.map((c) =>
              c.question === card.question ? { ...c, reviewed: correct } : c
            ),
          }
        : d
    );
    setDecks(updatedDecks);
    await saveAllDecks(updatedDecks);

    if (index < reviewList.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    } else {
      if (reviewPhase === 'initial' && wrongCards.length > 0) {
        alert('Retrying incorrect cards...');
        setReviewPhase('retry');
        setIndex(0);
        setFlipped(false);
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }).start();
      } else {
        alert('Review Complete!');
        navigation.goBack();
      }
    }
  };

  if (!deck || !reviewList.length) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000' }}>No cards to review.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a181fff' : '#ffffff' }]}>
      <Text style={[styles.progressText, { color: isDark ? '#aaa' : '#555' }]}>Card {index + 1} of {reviewList.length}</Text>

      <View style={styles.cardWrapper}>
        <Animated.View
          style={[styles.card, {
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
            transform: [{ rotateY: frontInterpolate }],
            zIndex: flipped ? 0 : 1,
          }]}
        >
          <Text style={[styles.cardText, { color: isDark ? '#fff' : '#000' }]}>Q: {card.question}</Text>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, {
            backgroundColor: isDark ? '#3a3a3a' : '#f0f0f0',
            transform: [{ rotateY: backInterpolate }],
            zIndex: flipped ? 1 : 0,
            position: 'absolute',
            top: 0,
          }]}
        >
          <Text style={[styles.cardText, { color: isDark ? '#fff' : '#000' }]}>A: {card.answer}</Text>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.revealButton, { backgroundColor: isDark ? '#cd6b60ff' : '#FFDAC1' }]}
        onPress={flipCard}
      >
        <Text style={[styles.revealText, { color: isDark ? '#fff' : '#000' }]}>{flipped ? 'Show Question' : 'Show Answer'}</Text>
      </TouchableOpacity>

      {flipped && (
        <View style={styles.responseButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: isDark ? '#df5040ff' : '#e49b9bff' }]}
            onPress={() => handleResponse(false)}
          >
            <Ionicons name="thumbs-down" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: isDark ? '#2eae65ff' : '#96d2afff' }]}
            onPress={() => handleResponse(true)}
          >
            <Ionicons name="thumbs-up" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: 'Inter',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    padding: 24,
  },
  cardBack: {
    position: 'absolute',
  },
  cardText: {
    fontFamily: 'InterBold',
    fontSize: 18,
  },
  revealButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  revealText: {
    fontFamily: 'InterBold',
    fontSize: 15,
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  iconButton: {
    padding: 14,
    borderRadius: 50,
  },
});
