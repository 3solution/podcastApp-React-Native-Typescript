import {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DiscoverItem from '../../components/DiscoverItem';
import tw from 'twrnc';
import axios from 'axios';
import {ArrowLeftIcon, PlusIcon} from 'react-native-heroicons/solid';
import {API_HOSTING} from '@env';
import {PodcastContext} from '../../providers/PodcastDetailProvider';
import {CheckIcon} from 'react-native-heroicons/outline';
import {UserContext} from '../../providers/UserProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {RootStackParamList} from '../RootStackPrams';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
type authScreenProp = StackNavigationProp<RootStackParamList, 'Popular'>;

export default function Popular() {
  const navigation = useNavigation<authScreenProp>();

  const [popularList, setPopularList] = useState<Array<any>>([]);
  const [isPendingTrend, setIsPendingPopular] = useState(false);
  const {setPodcastDetail} = useContext(PodcastContext);
  const {setFollowing, following} = useContext(PodcastContext);
  const {accessToken, setAccessToken} = useContext(UserContext);

  function followIcon(state: any) {
    if (state === false || state === null) {
      return (
        <PlusIcon
          style={tw.style('text-white text-opacity-60')}
          height={20}
          width={20}
        />
      );
    } else if (state === true) {
      return (
        <CheckIcon style={tw.style('text-green-300')} height={20} width={20} />
      );
    }
  }

  const getListAllPopular = async () => {
    setIsPendingPopular(true);
    try {
      const res = await axios.get(`${API_HOSTING}populars`, {
        params: {
          'per-page': 20,
        },
      });
      setIsPendingPopular(false);
      setPopularList(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getListAllPopular();
  }, []);
  const goPodcastDetail = async (url: string) => {
    setPodcastDetail(url);
    navigation.navigate('PodcastDetail');
  };
  const followPodcast = async (followed: boolean, item: any) => {
    console.log('item: ', item);
    console.log('followed: ', followed);
    try {
      if (followed === false) {
        // setIsPendingFollow(true);
        axios.post(
          `${API_HOSTING}follow`,
          {
            feed: item.feedUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        // axios.delete(`${API_HOSTING}follow/${item.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });
        console.log('followed');
      }
      setFollowing(following + ' follow');
    } catch (error: any) {
      console.log(error);
      if (error.toJSON().status == 401) {
        setAccessToken('');
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
      }
    }
  };
  return (
    <View style={tw`pb-3 bg-black`}>
      <ScrollView
        contentContainerStyle={tw.style('pb-26 px-4 bg-black min-h-full')}>
        {isPendingTrend ? (
          <ActivityIndicator color={'#ffffff'} size={'large'} />
        ) : (
          popularList.length > 0 &&
          popularList.map((item, index: number) => (
            // <DiscoverItem image={item.image.url} title={item.title} author={item.author} key={index} />
            <View
              key={index}
              style={tw`border-l-0 border-r-0 border-t-0 border-b border-gray-800 `}>
              <View
                style={[
                  tw.style('flex-row py-1.3 justify-between items-center'),
                ]}>
                <TouchableOpacity
                  style={tw`flex-1`}
                  onPress={() => {
                    goPodcastDetail(item.feedUrl);
                  }}>
                  <DiscoverItem
                    image={item.image.url}
                    title={item.title}
                    author={item.description}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    followPodcast(item.isFollowed, item);
                  }}>
                  <View>{followIcon(item.isFollowed)}</View>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
