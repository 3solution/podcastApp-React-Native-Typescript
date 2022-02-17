import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {format} from 'date-fns';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewReleaseItem from '../../components/NewReleaseItem';
import {PlayIcon} from 'react-native-heroicons/outline';
import {EpisodeContext} from '../../providers/EpisodeCommentProvider';
import {PodcastContext} from '../../providers/PodcastDetailProvider';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../RootStackPrams';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainBottomTabParamList} from './MainBottomTabParams';
type ListData = {
  [key: string]: any[];
};
type HomeScreenProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'Main'>,
  BottomTabNavigationProp<MainBottomTabParamList, 'Downloads'>
>;
export default function Download() {
  const navigation = useNavigation<HomeScreenProp>();
  const [isPending] = useState(false);
  const {setEpisodeDetail, setMiniPlayer} = useContext(EpisodeContext);
  const {download} = useContext(PodcastContext);
  const [downloadList, setDownloadList] = useState<ListData>({});

  const getDownloadList = async () => {
    const downloadPrev = await AsyncStorage.getItem('downloadList');
    if (downloadPrev === null || downloadPrev === '') {
      setDownloadList({});
    } else {
      const temp = JSON.parse(downloadPrev);
      const listData: ListData = {};
      temp.forEach((item: any) => {
        const dateKey = format(new Date(item.date.split(' ')[0]), 'PPP');
        if (listData[dateKey] !== undefined) {
          listData[dateKey].push(item);
        } else {
          listData[dateKey] = [item];
        }
      });
      setDownloadList(listData);
    }
  };
  useEffect(() => {
    getDownloadList();
  }, [download]);

  const goEpisode = async (episode: any) => {
    await AsyncStorage.setItem('episodeUuid', JSON.stringify(episode));
    setEpisodeDetail(JSON.stringify(episode));
    navigation.navigate('EpisodeComment');
  };

  const goPlayer = async (item: any) => {
    await AsyncStorage.setItem('playItem', JSON.stringify(item));
    setEpisodeDetail(JSON.stringify(item));
    setMiniPlayer(false);
    await navigation.navigate('MediaPlayerModalScreen');
  };

  return (
    <View style={tw`pb-3`}>
      <View style={tw`h-6 bg-black`} />
      <ScrollView
        contentContainerStyle={tw.style('pb-30 px-4 bg-black min-h-full pt-2')}>
        <View style={tw`flex-row bg-black items-center mb-4`}>
          <Text style={tw`text-white text-xl font-bold `}>Downloads</Text>
        </View>
        <View style={tw``}>
          {isPending ? (
            <ActivityIndicator color={'#ffffff'} size={'large'} />
          ) : (
            Object.keys(downloadList).length > 0 &&
            Object.keys(downloadList).map((groupKey, gIndex: number) => (
              // <NewReleaseItem image={item.image} title={item.title} author={item.description} key={index} />
              <View
                key={gIndex}
                style={tw`border-l-0 border-r-0 border-t-0 border-b border-gray-800`}>
                <Text style={tw`text-white`}>{groupKey}</Text>
                {downloadList[groupKey].map((item, index: number) => (
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
                        image={item.imgUrl}
                        title={item.title}
                        description={item.description}
                      />
                    </TouchableOpacity>
                    <View style={tw`bg-black`}>
                      <TouchableOpacity
                        onPress={() => {
                          goPlayer(item);
                        }}>
                        <View>
                          <PlayIcon
                            style={tw.style('text-white h-6 w-6 text-blue-500')}
                            height={25}
                            width={25}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
