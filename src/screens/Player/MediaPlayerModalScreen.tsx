import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import tw from '../../modules/tailwind';
import { SceneMap, TabBar } from 'react-native-tab-view';
import { EpisodeContext } from '../../providers/EpisodeCommentProvider';
import { TabView } from 'react-native-tab-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackPrams';
import { useNavigation } from '@react-navigation/native';
import PlayerTabView from './component/PlayerTabView';
import CommentTapView from './component/CommentTapView';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';

type authScreenProp = StackNavigationProp<
  RootStackParamList,
  'MediaPlayerModalScreen'
>;
export default function MediaPlayerModalScreen() {
  const navigation = useNavigation<authScreenProp>();
  const layout = useWindowDimensions();

  const {
    setMiniPlayer,
    sleepVisiblity,
    setSleepVisiblity,
    timeCounter,
    setTimeCounter,
    isPlaying,
    setIsPlaying,
  } = useContext(EpisodeContext);
  const [index, setIndex] = useState(0);

  const pauseAudio = () => {
    setSleepVisiblity(false);
    setTimeCounter(0);
  };

  const routes = [
    { key: 'first', title: 'Now Playing' },
    { key: 'second', title: 'Comments' },
  ];

  const renderScene = SceneMap({
    first: PlayerTabView,
    second: CommentTapView,
  });

  const goBack = () => {
    if (isPlaying === 'play') {
      setMiniPlayer(true);
    } else {
      setMiniPlayer(false);
    }
    setIsPlaying('pause');
    navigation.goBack();
  };
  useEffect(() => {
    if (timeCounter <= 1) {
      pauseAudio();
      setTimeCounter(0);
      return;
    }
    const temp = setInterval(() => {
      setTimeCounter(prev => prev - 1);
    }, 1000);
    return () => {
      clearInterval(temp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeCounter]);
  console.log('modal player');

  return (
    <View style={tw`bg-black flex-1`}>
      <View style={tw`my-3 px-5 bg-black min-w-full flex-row items-center`}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}>
          <ArrowLeftIcon style={tw`text-white`} width={25} height={25} />
        </TouchableOpacity>
        <Text style={tw`ml-7 text-white text-xl font-bold`}>Music Player</Text>
      </View>
      <View style={tw`min-h-full min-w-full mb-4`}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={tw`bg-black p-0 mx-0 w-full`}
              indicatorStyle={tw`bg-blue-500`}
              labelStyle={tw`text-sm text-left`}
              tabStyle={tw`md:w-auto p-0`}
            />
          )}
          swipeEnabled={false}
        />
      </View>
      {sleepVisiblity === true && (
        <View style={tw` h-full min-w-full  absolute items-center`}>
          <TouchableOpacity
            onPress={() => {
              pauseAudio();
            }}>
            <View
              style={tw`bg-black bg-opacity-40 items-center h-full min-w-full`}>
              <Text style={tw`text-white mt-15`}>Sleep Timer</Text>
              <Text style={tw`text-white text-5xl mt-30`}>
                {Math.floor(timeCounter / 60)} : {Math.floor(timeCounter % 60)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
