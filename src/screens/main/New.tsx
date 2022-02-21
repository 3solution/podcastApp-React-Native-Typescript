import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import tw from 'twrnc';
import axios from 'axios';

import { API_HOSTING } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewReleaseItem from '../../components/NewReleaseItem';
import {
  ArrowCircleDownIcon,
  CloudDownloadIcon,
  PlayIcon,
} from 'react-native-heroicons/outline';
import { UserContext } from '../../providers/UserProvider';
import { EpisodeContext } from '../../providers/EpisodeCommentProvider';
// import * as FileSystem from 'expo-file-system';
import RNFS from 'react-native-fs';
import { PodcastContext } from '../../providers/PodcastDetailProvider';
import Button from '../../components/Button';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '../RootStackPrams';
import { MainBottomTabParamList } from './MainBottomTabParams';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import MiniPlayer from '../../components/MiniPlayer';
// import { openDatabase } from "";

type ListData = {
  [key: string]: any[];
};

type downloadTemp = {
  title: string;
  description: string;
  imgUrl: string;
  audioUrl: string;
  date: string;
  uuid: string;
  duration: number;
};

type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Main'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'New'>
>;
export default function New() {
  const navigation = useNavigation<HomeScreenProp>();
  const [newList, setNewList] = useState<ListData>({});
  const [isPending, setIsPending] = useState(false);
  const [isPendingLoadMore, setIsPendingLoadMore] = useState(false);
  const { accessToken, setAccessToken } = useContext(UserContext);
  const { setEpisodeDetail, setMiniPlayer, setMiniPlayerPosition } =
    useContext(EpisodeContext);
  const { download, setDownload } = useContext(PodcastContext);
  const [pageNum, setPageNum] = useState(2);
  // const [downloadList, setDownloadList] = useState<Array<any>>([]);
  // let downloadList = [];

  function stateIcon(state: any) {
    if (state == 0) {
      return (
        <ArrowCircleDownIcon
          style={tw.style('text-white h-6 w-6 text-blue-500')}
          height={25}
          width={25}
        />
      );
    } else if (state == 2) {
      return (
        <PlayIcon
          style={tw.style('text-white h-6 w-6 text-blue-500')}
          height={25}
          width={25}
        />
      );
    } else if (state == 1) {
      return (
        <CloudDownloadIcon
          style={tw.style('text-white h-6 w-6 text-gray-500')}
          height={25}
          width={25}
        />
      );
    }
  }
  const getListNew = async () => {
    try {
      setIsPending(true);
      const res = await axios.get(`${API_HOSTING}user/new-releases`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const listData: ListData = {};
      res.data.forEach((item: any) => {
        item.downloadState = 0;
        download.forEach((downloadedItem: any) => {
          if (item.uuid === downloadedItem.uuid) {
            item.downloadState = 2;
            return;
          }
        });
        const dateKey = format(new Date(item.pubDate.split(' ')[0]), 'PPP');
        if (listData[dateKey] !== undefined) {
          listData[dateKey].push(item);
        } else {
          listData[dateKey] = [item];
        }
      });
      setIsPending(false);
      setNewList(listData);
    } catch (error: any) {
      setIsPending(false);
      if (error.toJSON().status === 401) {
        setAccessToken('');
        await AsyncStorage.setItem('accessToken', '');
        await AsyncStorage.setItem('refreshToken', '');
      }
      setIsPending(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getListNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMiniPlayerPosition(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goEpisode = async (episode: any) => {
    await AsyncStorage.setItem('episodeUuid', JSON.stringify(episode));
    setEpisodeDetail(JSON.stringify(episode));
    navigation.navigate('EpisodeComment');
  };

  const downloadApply = async (item: any, groupKey: any, index: number) => {
    console.log('start download');
    if (item.downloadState == 0) {
      const downloadingTempList = { ...newList };
      downloadingTempList[groupKey][index].downloadState = 1;
      setNewList(downloadingTempList);

      const date = new Date().getDate(); //Current Date
      const month = new Date().getMonth() + 1; //Current Month
      const year = new Date().getFullYear(); //Current Year
      const hours = new Date().getHours(); //Current Hours
      const min = new Date().getMinutes(); //Current Minutes
      const sec = new Date().getSeconds(); //Current Seconds
      const time =
        year + '-' + month + '-' + date + '-' + hours + '-' + min + '-' + sec;

      console.log('RNFS.DocumentDirectoryPath: ', RNFS.DocumentDirectoryPath);
      const fileUri = `${RNFS.DocumentDirectoryPath}/${time}.mp3`;
      const options: RNFS.DownloadFileOptions = {
        fromUrl: item.enclosure.url,
        toFile: fileUri,
      };
      await RNFS.downloadFile(options).promise;
      console.log('download end');
      const downloadedTempList = { ...newList };
      downloadedTempList[groupKey][index].downloadState = 2;
      setNewList(downloadedTempList);

      const downloadTemp: downloadTemp = {
        title: item.title,
        description: item.description,
        imgUrl: item.image,
        audioUrl: fileUri,
        date: item.pubDate,
        uuid: item.uuid,
        duration: item.duration,
      };
      const downloadPrev = await AsyncStorage.getItem('downloadList');
      console.log('downloadPrev: ', downloadPrev);
      if (downloadPrev === null || downloadPrev === '') {
        await AsyncStorage.setItem(
          'downloadList',
          '[' + JSON.stringify(downloadTemp) + ']',
        );
        setDownload([downloadTemp]);
      } else {
        const temp = JSON.parse(downloadPrev);
        temp.push(downloadTemp);
        await AsyncStorage.setItem('downloadList', JSON.stringify(temp));
        setDownload(temp);
        console.log('temp: ', temp);
      }
      return;
    }
    if (item.downloadState == 2) {
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
    }
  };

  const loadMore = async (num: number) => {
    console.log('pageNum: ', num);
    try {
      setIsPendingLoadMore(true);
      const res = await axios.get(`${API_HOSTING}user/new-releases`, {
        params: {
          page: num,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const listData: ListData = {};
      res.data.forEach((item: any) => {
        item.downloadState = 0;
        download.forEach((downloadedItem: any) => {
          if (item.uuid === downloadedItem.uuid) {
            item.downloadState = 2;
            return;
          }
        });
        const dateKey = format(new Date(item.pubDate.split(' ')[0]), 'PPP');
        if (listData[dateKey] !== undefined) {
          listData[dateKey].push(item);
        } else {
          listData[dateKey] = [item];
        }
      });
      setNewList({ ...newList, ...listData });
      setIsPendingLoadMore(false);
      setPageNum(num + 1);
    } catch (error: any) {
      setIsPendingLoadMore(false);
      if (error.toJSON().status === 401) {
        setAccessToken('');
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
      }
      setIsPendingLoadMore(false);
      console.log(error);
    }
  };

  console.log('newTest');

  return (
    <View style={tw`mb-5`}>
      <View style={tw`h-6 bg-black`} />
      <ScrollView
        contentContainerStyle={tw.style(
          'pb-50 px-4 bg-black min-h-full pt-2 ',
        )}>
        <View style={tw`flex-row bg-black items-center mb-4`}>
          <Text style={tw`text-white text-xl font-bold `}>New Releases</Text>
        </View>
        <View style={tw``}>
          {isPending ? (
            <ActivityIndicator color={'#ffffff'} size={'large'} />
          ) : (
            Object.keys(newList).length > 0 &&
            Object.keys(newList).map((groupKey, gIndex: number) => (
              // <NewReleaseItem image={item.image} title={item.title} author={item.description} key={index} />
              <View
                key={gIndex}
                style={tw`border-l-0 border-r-0 border-t-0 border-b border-gray-800`}>
                <Text style={tw`text-white`}>{groupKey}</Text>
                {newList[groupKey].map((item, index: number) => (
                  <View
                    style={[
                      tw.style('flex-row py-1.3 justify-between items-center'),
                    ]}
                    key={`${groupKey}-${index}`}>
                    <TouchableOpacity
                      style={tw`flex-1`}
                      onPress={() => {
                        goEpisode(item);
                      }}>
                      <NewReleaseItem
                        image={item.image}
                        title={item.title}
                        description={item.description}
                      />
                    </TouchableOpacity>
                    <View style={tw`bg-black`}>
                      <TouchableOpacity
                        onPress={() => {
                          downloadApply(item, groupKey, index);
                        }}>
                        <View>
                          {/* <ArrowCircleDownIcon
                            style={tw.style("text-white h-6 w-6 text-blue-500")}
                            height={20}
                            width={20}
                          /> */}
                          {stateIcon(item.downloadState)}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
        <Button
          label={'Load more'}
          type={'thirdly'}
          isPending={isPendingLoadMore}
          action={() => loadMore(pageNum)}
        />
      </ScrollView>
      <MiniPlayer position={true} />
    </View>
  );
}
