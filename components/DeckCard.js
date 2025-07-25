import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DeckCard({ title, cards, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{cards} cards</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: 'gray',
  },
});
