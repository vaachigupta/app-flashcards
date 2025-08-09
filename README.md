# QuizCraft – AI-Powered Flashcard Learning App

QuizCraft is a **React Native** mobile application designed to help learners revise efficiently through interactive flashcards.  
Users can manually create flashcards or generate them automatically using **Groq's LLaMA-3 AI model**, making revision faster and more personalized.


## Features

- **AI-Powered Card Generation**  
  Paste any block of text, and the app converts it into structured Q&A flashcards using Groq's LLaMA-3 API.

- **Manual Flashcard Creation**  
  Add, edit, and delete flashcards with ease.

- **Dark & Light Mode**  
  Fully theme-aware UI that adapts to the user’s preference.

- **Interactive Review Mode**  
  Flip animations for cards and thumbs up/down review logic — wrong answers are shown again for reinforcement.

- **Local Data Storage**  
  All decks and cards are stored offline using AsyncStorage.

- **Progress Tracking**  
  Track the number of reviewed cards during a session.


## Tech Stack

- **Frontend:** React Native (Expo)
- **State Management:** Context API
- **Storage:** AsyncStorage (Local persistent storage)
- **API:** Groq LLaMA-3 for AI-based flashcard generation
- **Navigation:** React Navigation


## User Flow

1. **Home Screen** – View all decks and create new ones.  
2. **Deck Detail Screen** – View cards in a deck, add manually, or generate via AI.  
3. **Generate Cards Screen** – Paste text and let AI create flashcards.  
4. **Review Mode** – Flip through flashcards, mark answers as correct/incorrect, and retry wrong ones.  


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vaachigupta/app-flashcards.git
   cd app-flashcards

2. Install dependencies:
   npm install

3. Start the Expo development server:
   npx expo start

4. Scan the QR code with the **Expo Go** app on your device to run it.


## Environment Variables

To use the AI flashcard generation feature, set up your **Groq API key**:
1. Create a .env file in the root directory.
2. Add:
   GROQ_API_KEY=your_api_key_here
3. Restart the Expo server.


## Future Improvements

- Add **cloud storage & authentication** for multi-device sync.

- Include **spaced repetition algorithm** for improved memory retention.

- Support **media-rich flashcards** with images and audio.

- Enhance AI with **customizable question complexity**.
