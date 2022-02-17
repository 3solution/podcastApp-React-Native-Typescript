import React, {useState, useContext, useEffect} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  View,
  TextInput,
} from 'react-native';
import tw from '../../modules/tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_HOSTING} from '@env';
import {ChevronDownIcon} from 'react-native-heroicons/solid';
import {PlayIcon, ShareIcon, UploadIcon} from 'react-native-heroicons/outline';
import {UserContext} from '../../providers/UserProvider';
import {EpisodeContext} from '../../providers/EpisodeCommentProvider';
import {PodcastContext} from '../../providers/PodcastDetailProvider';
import Comment from '../../components/Comment';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackPrams';
import {useNavigation} from '@react-navigation/native';

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

export default function EpisodeComment() {
  const navigation = useNavigation<authScreenProp>();
  const {episodeDetail, setMiniPlayer, setEpisodeDetail, miniPlayer} =
    useContext(EpisodeContext);
  const {accessToken, setAccessToken} = useContext(UserContext);
  const {podcastDetail} = useContext(PodcastContext);

  const [isPendingComment, setIsPendingComment] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [commentText, setCommentText] = useState<string>('');
  const [commentList, setCommentList] = useState<Array<any>>([]);
  const episodeValue = JSON.parse(episodeDetail);

  const getEpisodeInfo = async () => {
    try {
      setIsPendingComment(true);
      const res = await axios.get(
        `${API_HOSTING}episodes/${episodeValue.uuid}/comments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setCommentList(res.data);
      setIsPendingComment(false);
    } catch (error) {
      setIsPendingComment(false);
      console.log(error);
    }
  };

  const postComment = async () => {
    try {
      setIsPending(true);
      const res = await axios.post(
        `${API_HOSTING}episodes/${episodeValue.uuid}/comments`,
        {
          content: commentText,
          feed: podcastDetail,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setIsPending(false);
      console.log('start postcomment');
      setCommentText('');
      setCommentList(prev => [...prev, res.data]);
      console.log('newcomment: ', res.data);
    } catch (error: any) {
      setIsPending(false);
      console.log(error);
      if (error.toJSON().status == 401) {
        setAccessToken('');
        await AsyncStorage.setItem('accessToken', '');
        await AsyncStorage.setItem('refreshToken', '');
      }
    }
  };

  const replyComment = async () => {};

  const voteUp = (index: number, vote: string | null, id: string) => {
    try {
      console.log('up');
      if (vote === 'up') {
        axios.delete(`${API_HOSTING}vote/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const tempList = [...commentList];
        tempList[index].userVote = null;
        tempList[index].voteCount--;
        setCommentList(tempList);
      } else {
        axios.post(
          `${API_HOSTING}vote/${id}`,
          {
            type: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const tempList = [...commentList];
        tempList[index].userVote = 'up';
        tempList[index].voteCount += vote === 'down' ? 2 : 1;
        setCommentList(tempList);
      }
    } catch (error: any) {
      console.log(error);
      if (error.toJSON().status == 401) {
        setAccessToken('');
        AsyncStorage.setItem('accessToken', '');
        AsyncStorage.setItem('refreshToken', '');
      }
    }
  };

  const voteDown = (index: number, vote: string | null, id: string) => {
    try {
      if (vote === 'down') {
        axios.delete(`${API_HOSTING}vote/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const tempList = [...commentList];
        tempList[index].userVote = null;
        tempList[index].voteCount++;
        setCommentList(tempList);
      } else {
        axios.post(
          `${API_HOSTING}vote/${id}`,
          {
            type: false,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const tempList = [...commentList];
        tempList[index].userVote = 'down';
        tempList[index].voteCount -= vote === 'up' ? 2 : 1;
        setCommentList(tempList);
      }
    } catch (error: any) {
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

  useEffect(() => {
    getEpisodeInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeDetail]);
  // console.log("episodeValue: ", episodeValue);
  return (
    <View style={tw.style('  bg-black min-h-full flex-row justify-center')}>
      <View style={tw`bg-black min-h-full w-11/12`}>
        <View style={tw`flex-row bg-black`}>
          <View style={tw`flex-row bg-black flex-1`}>
            <View style={tw`h-20 w-20 mr-3 rounded-xl`}>
              <Image
                style={tw.style('min-w-full min-h-full ')}
                source={{
                  uri: episodeValue?.image,
                }}
              />
            </View>
            <View style={tw`bg-black flex-1 py-1`}>
              <Text
                style={[tw.style('text-white text-xl font-bold pr-2')]}
                ellipsizeMode="tail"
                numberOfLines={3}>
                {episodeValue?.title}
              </Text>
              <Text
                style={tw.style('text-white text-opacity-60 text-xs mt-1')}
                ellipsizeMode="tail"
                numberOfLines={2}>
                {episodeValue?.author}
              </Text>
            </View>
          </View>
        </View>
        <View style={tw`bg-black mt-3`}>
          <Text
            style={tw`text-white text-12 text-opacity-60 leading-5`}
            ellipsizeMode="tail"
            numberOfLines={2}>
            {episodeValue?.description}
          </Text>
        </View>
        <View
          style={tw`flex-row my-5 w-12/12 bg-black justify-center items-center border-l-0 border-r-0 border-t border-b border-gray-800 py-2`}>
          <TouchableOpacity
            onPress={() => {
              player(episodeValue);
            }}>
            <PlayIcon style={tw`text-blue-500 mr-5`} />
          </TouchableOpacity>
          <Text
            style={tw`text-white px-5 text-opacity-60 w-32`}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {episodeValue?.pubDate?.split(' ')[0]}
            {episodeValue?.date?.split(' ')[0]}{' '}
          </Text>
          <Text style={tw`text-white px-5 text-opacity-60`}>
            {Math.ceil(episodeValue?.duration / 60)}m
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <View style={tw`pl-5 bg-black flex-row items-center`}>
              <ShareIcon
                style={tw`text-white text-opacity-60`}
                width={20}
                height={20}
              />
              <Text style={tw`text-white text-opacity-60`}> Share</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <View
            style={tw`bg-gray-900 flex-row justify-center items-center w-30`}>
            <Text style={tw`text-white text-opacity-60 mr-1 text-12`}>
              BEST COMMENT
            </Text>
            <ChevronDownIcon style={tw`text-white text-opacity-60`} />
          </View>
        </TouchableOpacity>
        <View style={tw`flex-1 bg-black`}>
          <ScrollView contentContainerStyle={tw.style('pb-16  bg-black pt-3')}>
            {isPendingComment ? (
              <ActivityIndicator color={'#ffffff'} size={'large'} />
            ) : (
              commentList.length > 0 &&
              commentList.map((item, index: number) => (
                <View
                  key={index}
                  style={tw`border-l border-r-0 border-t-0 border-b-0 border-gray-800 bg-black pl-3 py-1`}>
                  <Comment
                    name={item?.owner?.username}
                    text={item?.content}
                    follow={item?.voteCount}
                    actionReply={() => replyComment()}
                    actionUp={() => voteUp(index, item?.userVote, item?.id)}
                    actionDown={() => voteDown(index, item?.userVote, item?.id)}
                  />
                  {item?.childs?.length > 0 &&
                    item?.childs.map((chItem: any, chIndex: number) => (
                      <View
                        key={chIndex}
                        style={tw`border-l border-r-0 border-t-0 border-b-0 border-gray-800 bg-black pl-3 py-1`}>
                        <Comment
                          name={chItem?.owner?.username}
                          text={chItem?.content}
                          follow={chItem?.voteCount}
                          actionUp={() =>
                            voteUp(chIndex, chItem?.userVote, chItem?.id)
                          }
                          actionDown={() =>
                            voteDown(chIndex, chItem?.userVote, chItem?.id)
                          }
                        />
                      </View>
                    ))}
                </View>
              ))
            )}
          </ScrollView>
        </View>
        {miniPlayer ? (
          <View style={tw`mt-5 justify-end mb-28`}>
            <View
              style={tw.style(
                'rounded-lg px-1 pr-2 bg-white bg-opacity-10  flex-row items-center',
              )}>
              <TextInput
                style={tw.style(
                  'ml-2 text-white flex-1 text-sm text-opacity-80',
                )}
                placeholderTextColor={'#888888'}
                placeholder="comment"
                scrollEnabled
                multiline={true}
                numberOfLines={3}
                value={commentText}
                onChangeText={(text: string) => setCommentText(text)}
              />
              <TouchableOpacity
                onPress={() => {
                  postComment();
                }}>
                {isPending ? (
                  <ActivityIndicator color={'#ffffff'} size={'small'} />
                ) : (
                  <UploadIcon
                    style={tw`mt-0.5 text-white text-opacity-60 bg-opacity-40`}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={tw`mt-5 justify-end mb-15`}>
            <View
              style={tw.style(
                'rounded-lg px-1 pr-2 bg-white bg-opacity-10  flex-row items-center',
              )}>
              <TextInput
                style={tw.style(
                  'ml-2 text-white flex-1 text-sm text-opacity-80',
                )}
                placeholderTextColor={'#888888'}
                placeholder="comment"
                scrollEnabled
                multiline={true}
                numberOfLines={2}
                value={commentText}
                onChangeText={(text: string) => setCommentText(text)}
              />
              <TouchableOpacity
                onPress={() => {
                  postComment();
                }}>
                {isPending ? (
                  <ActivityIndicator color={'#ffffff'} size={'small'} />
                ) : (
                  <UploadIcon
                    style={tw`mt-0.5 text-white text-opacity-60 bg-opacity-40`}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
