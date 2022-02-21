import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import tw from '../../modules/tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_TOKEN, API_HOSTING } from '@env';
import { CogIcon, LogoutIcon } from 'react-native-heroicons/outline';
import { UserContext } from '../../providers/UserProvider';
import MyComment from '../../components/MyComment';
import { EpisodeContext } from '../../providers/EpisodeCommentProvider';
import { PodcastContext } from '../../providers/PodcastDetailProvider';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '../RootStackPrams';
import { MainBottomTabParamList } from './MainBottomTabParams';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import MiniPlayer from '../../components/MiniPlayer';

type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Main'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'Profile'>
>;
export default function Profile() {
  const navigation = useNavigation<HomeScreenProp>();
  const { setMiniPlayerPosition } = useContext(EpisodeContext);

  const FirstRoute = () => (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} />
  );

  const SecondRoute = () => (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw.style('pb-16')}>
        {myCommentList.length > 0 &&
          myCommentList.map((item, index: number) => (
            <View key={index}>
              <MyComment
                name={item?.owner?.username}
                title={item?.episode?.title ?? ''}
                vote={item?.voteCount}
                description={item?.content}
                action={() => goComment(item)}
              />
            </View>
          ))}
      </ScrollView>
    </View>
  );
  const ThirdRoute = () => (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw.style('pb-16')}>
        {myCommentList.length > 0 &&
          myCommentList
            .filter(item => item.parent_id)
            .map((item, index: number) => (
              <View key={index}>
                <MyComment
                  name={item?.owner?.username}
                  title={item?.episode?.title ?? ''}
                  vote={item?.voteCount}
                  description={item?.content}
                  action={() => goComment(item)}
                />
              </View>
            ))}
      </ScrollView>
    </View>
  );

  const ForthRoute = () => (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw.style('pb-16')}>
        <View style={tw`flex-row max-w-full flex-wrap pt-3`}>
          {podcastList.length > 0 &&
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
            ))}
        </View>
      </ScrollView>
    </View>
  );
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    forth: ForthRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'History' },
    { key: 'second', title: 'Comments' },
    { key: 'third', title: 'Replies' },
    { key: 'forth', title: 'Following' },
  ]);

  const { accessToken, setAccessToken, userInfo } = useContext(UserContext);
  const [isPending, setIsPending] = useState(false);
  const [isPendingProfile, setIsPendingProfile] = useState(false);
  const [myCommentList, setMyCommentList] = useState<Array<any>>([]);
  const { setEpisodeDetail } = useContext(EpisodeContext);
  const [podcastList, setPodcastList] = useState<Array<any>>([]);
  const { setPodcastDetail } = useContext(PodcastContext);

  const logoutFuc = async () => {
    try {
      console.log('logout start');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('refreshToken: ', refreshToken);
      console.log('accessToken: ', accessToken);

      setIsPending(true);
      const res = await axios.post(
        `${API_TOKEN}revoke`,
        {
          access_token: accessToken,
          client_id: 'public_web',
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      console.log('loguot ok');

      setIsPending(false);
      setAccessToken('');
      await AsyncStorage.setItem('accessToken', '');
      await AsyncStorage.setItem('refreshToken', '');
    } catch (error) {
      setIsPending(false);
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    try {
      setIsPendingProfile(true);
      const res = await axios.get(
        `${API_HOSTING}users/${userInfo.id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setMyCommentList(res.data);
      const res1 = await axios.get(`${API_HOSTING}followed`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPodcastList(res1.data);
      setIsPendingProfile(false);
    } catch (error: any) {
      setIsPendingProfile(false);
      if (error.toJSON().status == 401) {
        setAccessToken('');
        await AsyncStorage.setItem('accessToken', '');
        await AsyncStorage.setItem('refreshToken', '');
      }
      console.log(error);
    }
  };

  const goComment = async (item: any) => {
    // await AsyncStorage.setItem("episodeUuid", JSON.stringify(item));
    // setEpisodeDetail(JSON.stringify(item));
    // navigation.navigate('EpisodeComment');
  };

  const goEpisode = async (url: string) => {
    setPodcastDetail(url);
    navigation.navigate('PodcastDetail');
  };
  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View style={tw`bg-black`}>
        <View style={tw.style('pb-16 px-4 bg-black min-h-full pt-8 pb-12')}>
          <View style={tw`bg-black flex-row justify-between mb-2`}>
            <Text style={tw`text-white text-2xl font-bold `}>
              {userInfo?.username}
            </Text>
            <View style={tw`flex-row bg-black`}>
              <TouchableOpacity
                onPress={() => {
                  logoutFuc();
                }}>
                <View style={tw`bg-black items-center my-1.5 mx-4`}>
                  {isPending ? (
                    <ActivityIndicator color={'#ffffff'} />
                  ) : (
                    <LogoutIcon
                      style={tw`text-white text-opacity-70 items-center`}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SettingModalScreen');
                }}>
                <View style={tw`bg-black items-center my-1.5 `}>
                  <CogIcon style={tw`text-white text-opacity-70`} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`flex-row bg-black justify-between `}>
            <View style={tw`flex-row bg-black`}>
              <View style={tw`h-14 w-14 mr-2 rounded-full`}>
                <Image
                  style={tw.style('min-w-full min-h-full ')}
                  source={{
                    uri: userInfo?.avatar,
                  }}
                />
              </View>
              <View style={tw`bg-black flex justify-center items-center`}>
                <Text style={tw`text-white `}>@{userInfo?.username}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EditModalScreen');
              }}>
              <View
                style={tw`bg-black border-solid border-2 border-opacity-60 border-white rounded-2xl justify-center h-8 px-4 my-3 `}>
                <Text style={tw`text-white text-opacity-60`}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={tw`bg-black mt-4`}>
            <Text style={tw`text-white text-opacity-60 leading-5`}>
              The latest from me and my HQ. For recipes and more check out.
            </Text>
          </View>
          <View style={tw`min-h-full min-w-full my-4`}>
            {isPendingProfile ? (
              <View style={tw`bg-black mt-7`}>
                <ActivityIndicator color={'#ffffff'} size={'large'} />
              </View>
            ) : (
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={(props: any) => (
                  <TabBar
                    {...props}
                    style={tw`bg-black p-0 mx-0 w-full`}
                    indicatorStyle={tw`bg-blue-500`}
                    labelStyle={tw`text-10 text-left`}
                    tabStyle={tw`md:w-auto p-0`}
                  />
                )}
                swipeEnabled={false}
              />
            )}
          </View>
        </View>
      </View>
      <MiniPlayer position={true} />
    </>
  );
}
