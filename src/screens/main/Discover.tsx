import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import tw from '../../modules/tailwind';
import axios from 'axios';

// import {RootTabScreenProps} from '../../types';
import DiscoverItem from '../../components/DiscoverItem';
import {API_HOSTING} from '@env';
import SearchBox from '../../components/SearchBox';
import useDebounce from '../../hooks/useDebounce';
import {PlusIcon} from 'react-native-heroicons/solid';
import {PodcastContext} from '../../providers/PodcastDetailProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../providers/UserProvider';
import {CheckIcon} from 'react-native-heroicons/outline';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackPrams';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainBottomTabParamList} from './MainBottomTabParams';

type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Main'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'Discover'>
>;
export default function Discover() {
  const navigation = useNavigation<HomeScreenProp>();
  const [discoverTrendsList, setDiscoverTrendsList] = useState<Array<any>>([]);
  const [discoverPopularList, setDiscoverPopularList] = useState<Array<any>>(
    [],
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const searchText = useDebounce(searchValue, 500);
  const [searchResultList, setSearchResultList] = useState<Array<any>>([]);
  const [isPendingTrend, setIsPendingTrend] = useState(false);
  const [isPendingPopular, setIsPendingPopular] = useState(false);
  const [isPendingSearch, setIsPendingSearch] = useState(false);
  const {setPodcastDetail, setDownload} = useContext(PodcastContext);
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
    } else if (state == true) {
      return (
        <CheckIcon style={tw.style('text-green-300')} height={20} width={20} />
      );
    }
  }

  const getListTrend = () => {
    setIsPendingTrend(true);
    axios
      .get(`${API_HOSTING}trends`, {
        params: {
          'per-page': 12,
        },
      })
      .then(res => {
        setIsPendingTrend(false);
        setDiscoverTrendsList(res.data);
      });
  };

  const getListPopular = () => {
    setIsPendingPopular(true);
    axios
      .get(`${API_HOSTING}populars`, {
        params: {
          'per-page': 12,
        },
      })
      .then(res => {
        setIsPendingPopular(false);
        setDiscoverPopularList(res.data);
      });
  };

  const getListDownload = async () => {
    const downloadPrev = await AsyncStorage.getItem('downloadList');
    if (downloadPrev === null || downloadPrev === '') {
      setDownload([]);
    } else {
      setDownload(JSON.parse(downloadPrev));
    }
  };
  const getListSearchResult = async () => {
    setIsPendingSearch(true);
    try {
      const res = await axios.get(`${API_HOSTING}search`, {
        params: {
          term: searchText,
        },
      });
      setIsPendingSearch(false);
      setSearchResultList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListTrend();
    getListPopular();
    getListDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchText !== '') {
      getListSearchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const goPodcastDetail = async (url: string) => {
    setPodcastDetail(url);
    navigation.navigate('PodcastDetail');
  };

  const followPodcast = async (followed: boolean, item: any) => {
    // console.log("item: ", item);
    // console.log("followed: ", followed);
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
    <View style={tw`pb-3`}>
      <View style={tw`h-6 bg-black`} />
      <ScrollView
        contentContainerStyle={tw.style('pb-30 px-4 bg-black min-h-full pt-3')}>
        <SearchBox
          type="big"
          placeholder="Search Podcasts"
          value={searchValue}
          onChange={(text: string) => setSearchValue(text)}
        />
        {searchText === '' ? (
          <View>
            <View style={tw`flex-row justify-between mb-2 mt-4`}>
              <Text style={tw`text-white text-xl font-bold `}>Trending</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Trending');
                }}>
                <Text style={tw`text-blue-600 text-opacity-90 text-sm `}>
                  SHOW ALL
                </Text>
              </TouchableOpacity>
            </View>
            {isPendingTrend ? (
              <ActivityIndicator color={'#ffffff'} size={'large'} />
            ) : (
              discoverTrendsList.length > 0 &&
              discoverTrendsList.slice(0, 4).map((item, index: number) => (
                <View
                  key={index}
                  style={tw`border-l-0 border-r-0 border-t-0 border-b border-gray-800`}>
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
            <View style={tw`flex-row justify-between mb-2 mt-7`}>
              <Text style={tw`text-white text-xl font-bold `}>Popular</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Popular');
                }}>
                <Text style={tw`text-blue-600 text-opacity-90 text-sm `}>
                  SHOW ALL
                </Text>
              </TouchableOpacity>
            </View>
            {isPendingPopular ? (
              <ActivityIndicator color={'#ffffff'} size={'large'} />
            ) : (
              discoverPopularList.length > 0 &&
              discoverPopularList.slice(0, 4).map((item, index: number) => (
                <View
                  key={index}
                  style={tw`border-l-0 border-r-0 border-t-0 border-b border-gray-800`}>
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
          </View>
        ) : isPendingSearch ? (
          <ActivityIndicator color={'#ffffff'} size={'large'} />
        ) : (
          searchResultList.length > 0 &&
          searchResultList.map((item, index: number) => (
            <View
              key={index}
              style={tw`border-l-0 border-r-0 border-t-0 border-b border-gray-800`}>
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
      {/* <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          animated={true}
          backgroundColor="#bbb"
        />
        <Text style={{ color: "#fff" }}>
          Demonstration of Status Bar from Alarmy's app
        </Text>
      </SafeAreaView> */}
    </View>
  );
}
