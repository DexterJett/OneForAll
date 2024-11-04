import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import ChapterImages from '../components/ChapterImages';

const Stack = createStackNavigator();

function ChapterReadingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChapterImages"
        component={ChapterImages}
        options={({ navigation }) => ({
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#ff4500',
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Text style={styles.buttonText}>Zurück</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    padding: 10,
  },
  buttonText: {
    color: '#ff4500',
    fontSize: 16,
  },
});

export default ChapterReadingNavigator;
