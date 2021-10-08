import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import ShoppingList from './ShoppingList';
import ShopingListContent from './ShopingListContent';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ShoppingList" component={ShoppingList} />
        <Stack.Screen name="ShopingListContent" component={ShopingListContent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}