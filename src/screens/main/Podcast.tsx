import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {} from 'react-native-heroicons/outline';
import React, {useContext, useEffect, useState} from 'react';

import tw from 'twrnc';
import axios from 'axios';

import {API_HOSTING} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../providers/UserProvider';
import {PodcastContext} from '../../providers/PodcastDetailProvider';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../RootStackPrams';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainBottomTabParamList} from './MainBottomTabParams';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Main'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'Podcasts'>
>;
export default function Podcast() {
  const navigation = useNavigation<HomeScreenProp>();
  const [podcastList, setPodcastList] = useState<Array<any>>([]);
  const [isPending, setIsPending] = useState(false);
  const {accessToken, setAccessToken} = useContext(UserContext);
  const {setPodcastDetail, following} = useContext(PodcastContext);

  const getListFollow = async () => {
    try {
      setIsPending(true);
      const res = await axios.get(`${API_HOSTING}followed`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsPending(false);
      setPodcastList(res.data);
    } catch (error: any) {
      setIsPending(false);
      if (error.toJSON().status === 401) {
        setAccessToken('');
        await AsyncStorage.setItem('accessToken', '');
        await AsyncStorage.setItem('refreshToken', '');
      }
    }
  };
  useEffect(() => {
    getListFollow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, following]);

  const goEpisode = async (url: string) => {
    setPodcastDetail(url);
    navigation.navigate('PodcastDetail');
  };

  console.log('podcasttest');

  return (
    <View style={tw`pb-1`}>
      <View style={tw`h-2 bg-black`} />
      <ScrollView
        contentContainerStyle={tw.style('pb-26 px-4 bg-black min-h-full pt-2')}>
        <View style={tw`flex-row bg-black items-center mb-4`}>
          <Text style={tw`text-white text-xl font-bold `}>Podcasts</Text>
        </View>
        <View style={tw`flex-row max-w-full flex-wrap`}>
          {isPending ? (
            <View style={tw`min-w-full justify-center items-center`}>
              <ActivityIndicator color={'#ffffff'} size={'large'} />
            </View>
          ) : (
            podcastList.length > 0 &&
            podcastList.map((item, index: number) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => {
                    goEpisode(item.feedUrl);
                  }}>
                  <View style={tw`h-20 w-20 border-white`}>
                    <Image
                      style={tw.style('w-full h-full rounded-md')}
                      source={{
                        uri: item.image.url,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
