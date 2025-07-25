import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function AddDeckScreen({ navigation }) {
  const [title, setTitle] = useState('');

  const handleAddDeck = () => {
    if (title.trim() !== '') {
      // Just for now: navigate to detail page after adding
      navigation.navigate('DeckDetail', { title, cards: 0 });
      setTitle('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Deck Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. History Quiz"
      />
      <Button title="Create Deck" onPress={handleAddDeck} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});
