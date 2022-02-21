import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from '../screens/main';
import AuthScreen from '../screens/auth';
import { RootStackParamList } from '../screens/RootStackPrams';
import 'react-native-gesture-handler';
import PodcastProvider from '../providers/PodcastDetailProvider';
import UserProvider from '../providers/UserProvider';
import EpisodeProvider from '../providers/EpisodeCommentProvider';
import LoginModalScreen from '../screens/auth/LoginModalScreen';
import SignupModalScreen from '../screens/auth/SignupModalScreen';
import Trending from '../screens/episode/Trending';
import Popular from '../screens/episode/Popular';
import PodcastDetail from '../screens/episode/PodcastDetail';
import EpisodeComment from '../screens/episode/EpisodeComment';
import EditModalScreen from '../screens/auth/EditModalScreen';
import SettingModalScreen from '../screens/auth/SettingModalScreen';
import MediaPlayerModalScreen from '../screens/Player/MediaPlayerModalScreen';
import { initializePlayer } from '../modules/appPlayer';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initializePlayer();
  }, []);

  return (
    <UserProvider>
      <PodcastProvider>
        <EpisodeProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen
                name="LoginModalScreen"
                component={LoginModalScreen}
                options={{
                  headerTitle: '',
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="SignupModalScreen"
                component={SignupModalScreen}
                options={{
                  headerTitle: '',
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="Trending"
                component={Trending}
                options={{
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="Popular"
                component={Popular}
                options={{
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="PodcastDetail"
                component={PodcastDetail}
                options={{
                  headerTitle: '',
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="EpisodeComment"
                component={EpisodeComment}
                options={{
                  headerTitle: '',
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="EditModalScreen"
                component={EditModalScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SettingModalScreen"
                component={SettingModalScreen}
                options={{
                  headerTitle: 'Setting',
                  headerStyle: { backgroundColor: 'black' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen
                name="MediaPlayerModalScreen"
                component={MediaPlayerModalScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
            {/* <MiniPlayer /> */}
          </NavigationContainer>
        </EpisodeProvider>
      </PodcastProvider>
    </UserProvider>
  );
}
