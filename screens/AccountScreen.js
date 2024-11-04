import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Importiere den Picker

const AccountScreen = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const getLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('@language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };
    getLanguage();
  }, []);

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    await AsyncStorage.setItem('@language', newLanguage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sprache wählen:</Text>
      <Picker
        selectedValue={language}
        style={{ height: 50, width: 200, color: '#fff' }}
        onValueChange={(itemValue) => changeLanguage(itemValue)}
      >
        <Picker.Item label="English" value="en" color="#fff"/>
        <Picker.Item label="Deutsch" value="de" color="#fff" />
        {/* Füge hier weitere Sprachen hinzu, falls gewünscht */}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#ff4500',
    fontSize: '18',
  },
});

export default AccountScreen;
