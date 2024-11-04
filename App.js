import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigation from './navigation/AppNavigation';

export default function App() {
  return (
    <MenuProvider>
      <AppNavigation />
    </MenuProvider>
  );
}
