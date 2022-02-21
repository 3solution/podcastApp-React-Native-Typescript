import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import tw from '../../modules/tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_HOSTING } from '@env';
import { SwitchVerticalIcon } from 'react-native-heroicons/solid';
import { PlayIcon } from 'react-native-heroicons/outline';
import SearchBox from '../../components/SearchBox';
import { format } from 'date-fns';
import PodcastDetailItem from '../../components/PodcastDetailItem';
import { UserContext } from '../../providers/UserProvider';
import { PodcastContext } from '../../providers/PodcastDetailProvider';
import { EpisodeContext } from '../../providers/EpisodeCommentProvider';
import useDebounce from '../../hooks/useDebounce';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackPrams';
import { useNavigation } from '@react-navigation/native';
import MiniPlayer from '../../components/MiniPlayer';

type downloadTemp = {
  title: string;
  description: string;
  imgUrl: string;
  audioUrl: string;
  date: string;
  uuid: string;
  duration: number;
};

type authScreenProp = StackNavigationProp<RootStackParamList, 'PodcastDetail'>;

export default function PodcastDetail() {
  const navigation = useNavigation<authScreenProp>();

  const [searchValue, setSearchValue] = useState<string>('');
  const [episodeList, setEpisodeList] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isPendingFollow, setIsPendingFollow] = useState(false);
  const { accessToken, setAccessToken } = useContext(UserContext);
  const {
    podcastDetail,
    setFollowing,
    following,
    podcastValue,
    setPodcastValue,
  } = useContext(PodcastContext);
  const {
    setEpisodeDetail,
    setMiniPlayer,
    setMiniPlayerPosition,
    miniPlayerPosition,
  } = useContext(EpisodeContext);
  const searchText = useDebounce(searchValue, 500);

  const getEpisodeList = async () => {
    try {
      setIsPending(true);
      const res = await axios.get(`${API_HOSTING}feed?url=${podcastDetail}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsPending(false);

      // setPodcastValue(res.data.podcast);
      setEpisodeList(res.data.episodes);
    } catch (error: any) {
      setIsPending(false);
      if (error.toJSON().status == 401) {
        setAccessToken('');
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getEpisodeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcastDetail]);

  const goEpisode = async (episode: any) => {
    // await AsyncStorage.setItem("episodeUuid", JSON.stringify(episode));
    setEpisodeDetail(JSON.stringify(episode));
    setMiniPlayerPosition(false);
    navigation.navigate('EpisodeComment');
  };

  const followPodcast = async (followed: boolean) => {
    console.log('followed: ', followed);
    try {
      setFollowing(following + 'follow');
      if (followed === true) {
        setIsPendingFollow(true);
        axios.delete(`${API_HOSTING}follow/${podcastValue.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPodcastValue((prev: any) => ({ ...prev, isFollowed: false }));
        setIsPendingFollow(false);
        // setFollow(["Follow", "bg-blue-500"]);
        // setFollow(["UnFollow", "bg-red-500"]);
      } else {
        setIsPendingFollow(true);
        axios.post(
          `${API_HOSTING}follow`,
          {
            feed: podcastDetail,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setPodcastValue((prev: any) => ({ ...prev, isFollowed: true }));
        setIsPendingFollow(false);
      }
    } catch (error: any) {
      setIsPendingFollow(false);
      console.log(error);
      if (error.toJSON().status == 401) {
        setAccessToken('');
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
      }
    }
  };

  const player = async (item: any) => {
    const downloadTemp: downloadTemp = {
      title: item.title,
      description: item.description,
      imgUrl: item.image,
      audioUrl: item.enclosure.url,
      date: item.pubDate,
      uuid: item.uuid,
      duration: item.duration,
    };
    await AsyncStorage.setItem('playItem', JSON.stringify(downloadTemp));
    setEpisodeDetail(JSON.stringify(downloadTemp));
    setMiniPlayer(false);
    await navigation.navigate('MediaPlayerModalScreen');
  };
  console.log('podcastDetail: ', podcastDetail);
  console.log('podcastdetailaa');

  return (
    <>
      <View style={tw.style('px-4 bg-black min-h-full mb-100')}>
        <View style={tw`bg-black min-h-full`}>
          <View style={tw`flex-row bg-black`}>
            <View style={tw`flex-row bg-black flex-1`}>
              <View style={tw`h-40 w-40 mr-3 rounded-xl`}>
                <Image
                  style={tw.style('min-w-full min-h-full ')}
                  source={{
                    uri: podcastValue?.image.url,
                  }}
                />
              </View>
              <View style={tw`bg-black flex-1 py-1`}>
                <Text
                  style={[tw.style('text-white text-3xl font-bold pr-2')]}
                  ellipsizeMode="tail"
                  numberOfLines={3}>
                  {podcastValue?.title}
                </Text>
                <Text
                  style={tw.style('text-white text-opacity-60 text-xs mt-1')}
                  ellipsizeMode="tail"
                  numberOfLines={2}>
                  {podcastValue?.author}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              followPodcast(podcastValue?.isFollowed);
            }}>
            <View
              style={tw.style(
                'rounded-2xl justify-center items-center h-6 w-25 px-4 mt-5',
                { 'bg-red-500': podcastValue?.isFollowed },
                { 'bg-blue-500': !podcastValue?.isFollowed },
              )}>
              {isPendingFollow ? (
                <ActivityIndicator color={'#ffffff'} size={'small'} />
              ) : (
                <Text style={tw`text-white text-xs`}>
                  {podcastValue?.isFollowed ? 'Unfollow' : 'Follow'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={tw`bg-black mt-3`}>
            <Text
              style={tw`text-white text-12 text-opacity-60 leading-5`}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {podcastValue?.description}
            </Text>
          </View>
          <View style={tw`bg-black justify-between items-center flex-row`}>
            <View style={tw` bg-black  w-40 mt-5 `}>
              <SearchBox
                type="small"
                placeholder="Search episodes"
                value={searchValue}
                onChange={(text: string) => setSearchValue(text)}
              />
            </View>
            <View
              style={tw`bg-black flex-row items-center justify-center pt-4`}>
              <Text style={tw`text-white mr-2 text-12`}>
                {episodeList.length} EPISODES
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <SwitchVerticalIcon style={tw`text-white`} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`flex-1 bg-black mt-3`}>
            <ScrollView contentContainerStyle={tw.style('pb-26  bg-black')}>
              {isPending ? (
                <ActivityIndicator color={'#ffffff'} size={'large'} />
              ) : (
                <View style={tw`bg-black`}>
                  {episodeList.length > 0 &&
                    episodeList
                      .filter(item =>
                        item.title
                          .toLowerCase()
                          .includes(searchText.toLowerCase()),
                      )
                      .map((episode, index: number) => (
                        <View
                          style={tw`bg-black flex-row justify-between items-center border-l-0 border-r-0 border-t-0 border-b border-gray-800`}
                          key={index}>
                          <TouchableOpacity
                            style={tw`flex-1`}
                            onPress={() => {
                              goEpisode(episode);
                            }}>
                            <PodcastDetailItem
                              date={format(
                                new Date(episode.pubDate.split(' ')[0]),
                                'PPP',
                              )}
                              title={episode.title}
                              episode={episode.episode}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              player(episode);
                            }}>
                            <View
                              style={tw`bg-black ml-5 justify-center items-center`}>
                              <PlayIcon
                                style={tw.style(
                                  'text-white h-6 w-6 text-blue-500',
                                )}
                                height={20}
                                width={20}
                              />
                              <Text style={tw`text-white text-10`}>
                                {Math.ceil(episode.duration / 60)}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
      <MiniPlayer position={false} />
    </>
  );
}
