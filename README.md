jj
# SkulBell

A modern academic lecture manager and reminder app built with React Native and Expo.

## Overview
SkulBell helps students organize, track, and get reminders for their lectures. Easily view today's schedule, add new lectures, see all upcoming classes, and customize reminders and appearance settings.

## Features
- **Today Screen:** View today's lectures and their status (upcoming, completed, etc.).
- **All Lectures:** List, search, and filter all lectures by day or course.
- **Add Lecture:** Add new lectures with details like course, time, location, and instructor.
- **Calendar:** Visual calendar to see lectures by date.
- **Reminders:** Set and customize reminders for lectures (before, after, review, homework, study session).
- **Settings:** Customize appearance (theme, font size), manage reminders, export/sync data.

## Screenshots
*Add your screenshots here*

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation
1. Clone the repository or download the project files.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
   Or use:
   - `npm run android` to run on Android
   - `npm run ios` to run on iOS
   - `npm run web` to run in the browser

4. Scan the QR code in the terminal with the [Expo Go](https://expo.dev/client) app on your device to preview.

## Project Structure
- `App.js` – Main entry, navigation setup
- `screens/` – All main screens (Today, All Lectures, Add, Calendar, Settings, Reminders)
- `components/` – Reusable UI components (e.g., TimePicker, LectureForm)
- `utils/` – Utility functions (notifications, storage)
- `styles/` – Global styles
- `storage/` – Lecture storage logic

## Tech Stack
- **React Native** (with Expo)
- **React Navigation** (stack and bottom tabs)
- **Async Storage** for persistence
- **Expo Notifications** for reminders
- **UI Libraries:** react-native-paper, vector-icons, linear-gradient, etc.

## Dependencies
See `package.json` for the full list. Key dependencies include:
- `expo`, `react`, `react-native`
- `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`
- `expo-notifications`, `@expo/vector-icons`, `react-native-paper`, etc.

## License
This project is licensed under the 0BSD License.
