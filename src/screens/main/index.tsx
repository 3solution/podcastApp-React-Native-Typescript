import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainBottomTabParamList} from './MainBottomTabParams';
import {ViewGridIcon} from 'react-native-heroicons/solid';
import Discover from './Discover';
import {
  CloudDownloadIcon,
  RssIcon,
  SearchIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {UserContext} from '../../providers/UserProvider';
import Welcome from './Welcome';
import Podcast from './Podcast';
import New from './New';
import Download from './Download';
import Profile from './Profile';

const BottomTab = createBottomTabNavigator<MainBottomTabParamList>();

export default function MainScreen() {
  const {accessToken} = useContext(UserContext);
  return (
    <BottomTab.Navigator
      initialRouteName="Discover"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: Colors.dark.tint,
        tabBarStyle: {position: 'absolute', backgroundColor: 'black'},
        headerStyle: {backgroundColor: 'black'},
        headerShown: false,
        tabBarButton: [
          'Trending',
          'Popular',
          'PodcastDetail',
          'EpisodeComment',
        ].includes(route.name)
          ? () => null
          : undefined,
      })}>
      <BottomTab.Screen
        name="Podcasts"
        component={
          accessToken === '' || accessToken == null ? Welcome : Podcast
        }
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <ViewGridIcon color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Discover"
        component={Discover}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <SearchIcon color={color} />,
        }}
      />
      <BottomTab.Screen
        name="New"
        component={accessToken === '' || accessToken == null ? Welcome : New}
        options={{
          headerShown: false,
          headerTitleStyle: {color: 'white'},
          tabBarIcon: ({color}) => <RssIcon color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Downloads"
        component={Download}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <CloudDownloadIcon color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={
          accessToken === '' || accessToken == null ? Welcome : Profile
        }
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => <UserCircleIcon color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
