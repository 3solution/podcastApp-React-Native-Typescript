import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import {MainBottomTabParamList} from './MainBottomTabParams';
import DetailsScreen from './DetailsScreen';

const BottomTab = createBottomTabNavigator<MainBottomTabParamList>();

export default function MainScreen() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Details" component={DetailsScreen} />
    </BottomTab.Navigator>
  );
}
