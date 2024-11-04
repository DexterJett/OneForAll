import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Text } from 'react-native';

import BookmarksScreen from '../screens/BookmarksScreen';
import PopularScreen from '../screens/PopularScreen';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';
import ChapterReadingNavigator from './ChapterReadingNavigator';
import ChapterList from '../components/ChapterList'; // Sicherstellen, dass ChapterList importiert ist

// Importiere die Bilder
import accountIcon from '../assets/anime kopf rot.png'; // Pfad zum Bild
import bookmarkIcon from '../assets/bookmarkIcon.png';
import popularIcon from '../assets/popularIcon.png';
import searchIcon from '../assets/searchIcon.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#121212', 
            height: 100,  // Erhöhe die Höhe der Tab-Leiste
          },
          tabBarLabelStyle: {
            fontSize: 14, // Vergrößere die Schriftgröße der Tab-Labels
          },
          tabBarIconStyle: {
            size: 30,  // Optionale Größe der Icons, falls nötig
          },
          tabBarActiveTintColor: '#ff4500', 
          tabBarInactiveTintColor: '#00bfff'
        }}
      >
        
        <Tab.Screen 
          name="Suchen" 
          component={SearchStack} 
          options={{ 
            tabBarIcon: ({ focused }) => (
              <Image 
                source={searchIcon} 
                style={{ width: 40, height: 40 }}  // Passe die Bildgröße an
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#ff4500' : '#00bfff', fontSize: 16 }}>Suchen</Text> // Passe die Textgröße an
            ),
          }} 
        />
        <Tab.Screen 
          name="Beliebte neue Titel" 
          component={PopularStack} 
          options={{ 
            tabBarIcon: ({ focused }) => (
              <Image 
                source={popularIcon} 
                style={{ width: 40, height: 40 }}  // Passe die Bildgröße an
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#ff4500' : '#00bfff', fontSize: 16 }}>Beliebt</Text> // Passe die Textgröße an
            ),
          }} 
        />
        <Tab.Screen 
          name="Lesezeichen" 
          component={BookmarksStack} 
          options={{ 
            tabBarIcon: ({ focused }) => (
              <Image 
                source={bookmarkIcon} 
                style={{ width: 40, height: 40 }}  // Passe die Bildgröße an
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#ff4500' : '#00bfff', fontSize: 16 }}>Lesezeichen</Text> // Passe die Textgröße an
            ),
          }} 
        />
        
        <Tab.Screen 
          name="Account" 
          component={AccountStack} 
          options={{ 
            tabBarIcon: ({ focused }) => (
              <Image 
                source={accountIcon} 
                style={{ width: 40, height: 40 }}  // Passe die Bildgröße an
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={{ color: focused ? '#ff4500' : '#00bfff', fontSize: 16 }}>Account</Text> // Passe die Textgröße an
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const StackNavigatorOptions = {
  headerStyle: { backgroundColor: '#121212' },
  headerTintColor: '#ff4500',
  headerTitleStyle: { color: '#ff4500' },
};

function BookmarksStack() {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions}>
      <Stack.Screen
        name="BookmarksScreen"
        component={BookmarksScreen}
        options={{ headerTitle: 'Lesezeichen' }}
      />
      <Stack.Screen
        name="ChapterList"
        component={ChapterList}
        options={{ headerTitle: 'Chapter List' }}
      />
      <Stack.Screen
        name="ChapterReading"
        component={ChapterReadingNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions}>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerTitle: 'Suchen' }}
      />
      <Stack.Screen
        name="ChapterList"
        component={ChapterList}
        options={{ headerTitle: 'Chapter List' }}
      />
      <Stack.Screen
        name="ChapterReading"
        component={ChapterReadingNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function PopularStack() {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions}>
      <Stack.Screen
        name="PopularScreen"
        component={PopularScreen}
        options={{ headerTitle: 'Beliebte neue Titel' }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerTitle: 'Suchen' }}
      />
      <Stack.Screen
        name="ChapterList"
        component={ChapterList}
        options={{ headerTitle: 'Chapter List' }}
      />
      <Stack.Screen
        name="ChapterReading"
        component={ChapterReadingNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions}>
      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{ headerTitle: 'Account' }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigation;
