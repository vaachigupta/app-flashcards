import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import DeckDetailScreen from './screens/DeckDetailScreen';
import AddDeckScreen from './screens/AddDeckScreen';
import GenerateCardsScreen from './screens/GenerateCardsScreen';
import AddCardScreen from './screens/AddCardScreen';
import ReviewScreen from './screens/ReviewScreen';
import EditCardScreen from './screens/EditCardScreen';

import { DeckProvider } from './context/DeckContext';
import { ThemeProvider } from './context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Regular.ttf'),
    InterBold: require('./assets/fonts/Inter-Bold.ttf'),
  });

  const scheme = useColorScheme();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Define a theme object
  const isDark = scheme === 'dark';
  const navTheme = isDark ? DarkTheme : DefaultTheme;
  const headerBg = isDark ? '#1a1a1a' : '#ffffff';
  const headerTextColor = isDark ? '#ffffff' : '#000000';

  return (
    <ThemeProvider>
      <DeckProvider>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTextColor,
                headerTitleStyle: {
                  fontFamily: 'InterBold',
                },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
              <Stack.Screen name="AddDeck" component={AddDeckScreen} />
              <Stack.Screen name="GenerateCards" component={GenerateCardsScreen} />
              <Stack.Screen name="AddCard" component={AddCardScreen} />
              <Stack.Screen name="Review" component={ReviewScreen} />
              <Stack.Screen name="EditCard" component={EditCardScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </DeckProvider>
    </ThemeProvider>
  );
}
