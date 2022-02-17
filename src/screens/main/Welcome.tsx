import {Text, View} from 'react-native';
// import { Text, View } from '../components/Themed';
import tw from '../../modules/tailwind';
import Button from '../../components/Button';
import React from 'react';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackPrams';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainBottomTabParamList} from './MainBottomTabParams';

type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Main'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'Welcome'>
>;

export default function Welcome() {
  const navigation = useNavigation<HomeScreenProp>();
  return (
    <View
      style={tw.style(
        'bg-black',
        'flex-1',
        'items-center',
        'justify-center',
        'px-4',
      )}>
      <Text style={tw`text-white font-bold text-2xl mb-3`}>
        Welcome to Podcast
      </Text>
      <Text style={tw`text-white text-center text-opacity-60 mb-9`}>
        Join podcast to store your podcasts, and comment on episodes.
      </Text>
      <View style={tw`mb-4`}>
        <Button
          label="Register"
          action={() => {
            navigation.navigate('SignupModalScreen');
          }}
        />
      </View>
      <Button
        label="Login"
        action={() => {
          navigation.navigate('LoginModalScreen');
        }}
        type="secondary"
      />
    </View>
  );
}
