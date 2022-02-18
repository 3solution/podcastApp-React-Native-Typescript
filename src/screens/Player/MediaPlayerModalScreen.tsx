import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import TrackPlayer, {
  Event,
  State,
  Capability,
  TrackType,
} from 'react-native-track-player';
import {
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player/lib/hooks';
import tw from '../../modules/tailwind';
import {SceneMap, TabBar} from 'react-native-tab-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import Slider from '@react-native-community/slider';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EpisodeContext} from '../../providers/EpisodeCommentProvider';
import {TabView} from 'react-native-tab-view';
import axios from 'axios';
import {API_HOSTING} from '@env';
import {ChevronDownIcon} from 'react-native-heroicons/solid';
import {
  PauseIcon,
  PlayIcon,
  ShareIcon,
  UploadIcon,
} from 'react-native-heroicons/outline';
import {UserContext} from '../../providers/UserProvider';
import {PodcastContext} from '../../providers/PodcastDetailProvider';
import Comment from '../../components/Comment';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackPrams';
import {useNavigation} from '@react-navigation/native';
// import RotateCCW from '../../assets/icons/arrow-clockwise.svg';
// import RotateCW from '../../assets/icons/arrow-clockwise.svg';
import {SvgUri} from 'react-native-svg';
type downloadTemp = {
  title: string;
  description: string;
  imgUrl: string;
  audioUrl: string;
  date: string;
  uuid: string;
  duration: number;
};
const songDetails = {
  id: '1',
  url: 'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
  title: 'The Greatest Song',
  album: 'Great Album',
  artist: 'A Great Dude',
  artwork: 'https://picsum.photos/300',
};

type authScreenProp = StackNavigationProp<
  RootStackParamList,
  'MediaPlayerModalScreen'
>;
export default function MediaPlayerModalScreen() {
  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
    });
    await TrackPlayer.add({
      // id: songDetails.id,
      url: playData?.audioUrl,
      title: playData?.title,
      artwork: playData?.imgUrl,
      // url: songDetails?.url,
      type: TrackType.Default,
      // title: songDetails?.title,
      // album: songDetails.album,
      // artist: songDetails.artist,
      // artwork: songDetails?.artwork,
    });
    return true;
  };
  function renderIcon() {
    if (isPlaying === 'buffering') {
      return <ActivityIndicator size={30} color="black" />;
    } else if (isPlaying === 'pause') {
      return <PlayIcon size={25} color="#000" />;
    } else if (isPlaying === 'play') {
      return <PauseIcon size={25} color="#000" />;
    }
  }
  const navigation = useNavigation<authScreenProp>();
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState('buffering');
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const {position, duration} = useProgress(250);

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
      setIsPlaying('pause');
    };
    startPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // this hook updates the value of the slider whenever the current position of the song changes

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, duration]);

  useTrackPlayerEvents([Event?.PlaybackState], (event: any) => {
    if (event.state === State?.Playing) {
      setIsPlaying('play');
    } else {
      setIsPlaying('pause');
    }
  });

  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer?.play();
      setIsPlaying('play');
    } else {
      TrackPlayer?.pause();
      setIsPlaying('pause');
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const timeControll = async (time: number) => {};
  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value: any) => {
    await TrackPlayer?.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {setMiniPlayer, playData, setPlayData} = useContext(EpisodeContext);

  const getPlayData = async () => {
    const temp = await AsyncStorage.getItem('playItem');
    if (temp != null) {
      setPlayData({...JSON.parse(temp)});
    }
  };

  useEffect(() => {
    getPlayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSleepTimeControll = () => {
    refRBSheetSleep.current?.close();
    refRBSheetSleepControll.current?.open();
  };

  const [timeCounter, setTimeCounter] = useState(0);
  const [sleepVisiblity, setSleepVisiblity] = useState(false);

  const sleepController = (time: number) => {
    refRBSheetSleep.current?.close();
    setTimeCounter(time);
    setSleepVisiblity(true);
  };

  const pauseAudio = () => {
    setSleepVisiblity(false);
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
  }, [timeCounter]);

  const FirstRoute = () => (
    <View style={tw`flex-1`}>
      <View style={tw`h-full pt-5`}>
        {/* <View style={tw`bg-red-400  pb-5 pt-2 bg-black  `}> */}
        <View style={tw`justify-center items-center`}>
          <Image
            style={tw`w-75 h-75 rounded`}
            source={{uri: playData?.imgUrl}}
          />
          <Text
            style={tw`px-4 text-white text-xl mt-10`}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {playData?.title}
          </Text>
          <Text
            style={tw`px-4 text-white text-opacity-70`}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {playData?.description}
          </Text>
        </View>
        <View>
          <Slider
            // style={styles.progressBar}
            style={tw` mt-2 w-85 mx-5`}
            thumbTintColor={'#fff'}
            minimumTrackTintColor={'pink'}
            maximumTrackTintColor="#8E9092"
            minimumValue={0}
            maximumValue={1}
            value={sliderValue}
            onSlidingStart={slidingStarted}
            onSlidingComplete={slidingCompleted}
          />
          {/* <Button
            label={isPlaying ? 'Pause' : 'Play'}
            action={onButtonPressed}
            isPending={!isTrackPlayerInit}
            type={'secondary'}
          /> */}

          <View style={tw`flex-row justify-between items-center`}>
            <TouchableOpacity
              onPress={() => {
                timeControll(-15);
              }}>
              <View style={tw`relative`}>
                {/* <RotateCCW style={tw`w-12 h-12`} /> */}
                <SvgUri
                  style={tw`w-12 h-12`}
                  uri="../../assets/icons/arrow-clockwise.svg"
                />
                <Text style={tw`text-white absolute left-3.5 top-3.5`}>15</Text>
              </View>
            </TouchableOpacity>
            <Pressable
              style={tw`mx-10 bg-white  justify-center items-center h-16 w-16 rounded-full`}
              onPress={onButtonPressed}>
              {renderIcon()}
            </Pressable>
            <TouchableOpacity
              onPress={() => {
                timeControll(15);
              }}>
              <View style={tw`relative`}>
                {/* <RotateCW style={tw`w-12 h-12`} /> */}
                <SvgUri
                  // style={tw`w-12 h-12`}
                  width="100%"
                  height="100%"
                  uri="../../assets/icons/arrow-clockwise.svg"
                />
                <Text style={tw`text-white absolute left-3.5 top-3.5`}>15</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={tw`mx-6 justify-end mt-10  w-10.3/12 h-13 flex-row bg-white bg-opacity-10 rounded-xl justify-between items-center`}>
          <TouchableOpacity onPress={() => refRBSheetRate.current?.open()}>
            <Text style={tw`ml-8 text-white text-opacity-60`}>{}x</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => refRBSheetSleep.current?.open()}>
            <View style={tw``}>
              <Image
                style={tw.style('w-7 h-7 opacity-60')}
                source={require('../../assets/icons/sleep.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => refRBSheetShare.current?.open()}>
            <ShareIcon style={tw`mr-8 text-white text-opacity-60`} />
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={refRBSheetRate}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={250}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#fff',
            },
            container: {
              backgroundColor: '#333',
            },
          }}>
          <View style={tw`items-center min-h-full min-w-full`}>
            <Text style={tw`mt-5 text-xl text-white`}>Playback Speed</Text>
            <View style={tw`mt-10 flex-row justify-between items-center`}>
              <Text style={tw`text-white`}>{}x</Text>
              <Slider
                style={tw` mt-2 w-65`}
                thumbTintColor={'#fa0'}
                minimumTrackTintColor={'#888'}
                maximumTrackTintColor={'#fff'}
                minimumValue={0.5}
                maximumValue={3.5}
                value={0}
                onSlidingComplete={async () => {}}
              />
              <Text style={tw` text-white`}>3.50x</Text>
            </View>
            <View style={tw`px-5 pt-10`}>
              <Button
                label="Save"
                action={() => {
                  refRBSheetRate.current?.close();
                }}
              />
            </View>
          </View>
        </RBSheet>
        <RBSheet
          ref={refRBSheetSleep}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={350}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#fff',
            },
            container: {
              backgroundColor: '#333',
            },
          }}>
          <View style={tw`items-center min-h-full min-w-full`}>
            <Text style={tw`my-2 text-xl text-white`}>Sleep Timer</Text>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  setSleepTimeControll();
                }}>
                <Text style={tw`text-white text-lg`}>Set minutes...</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  sleepController(15 * 60);
                }}>
                <Text style={tw`text-white text-lg`}>15 minutes</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  sleepController(30 * 60);
                }}>
                <Text style={tw`text-white text-lg`}>30 minutes</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  sleepController(60 * 60);
                }}>
                <Text style={tw`text-white text-lg`}>60 minutes</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  sleepController(0);
                }}>
                <Text style={tw`text-white text-lg`}>Near The End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        <RBSheet
          ref={refRBSheetSleepControll}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={300}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#fff',
            },
            container: {
              backgroundColor: '#333',
            },
          }}>
          <View style={tw`items-center min-h-full min-w-full`}>
            <Text style={tw`my-2 px-3 text-base text-white`}>
              Always fall asleep and forget which podcast you were listening to
              the next day? Use the "near the end" option to stop the podcast
              just before it ends.
            </Text>
            <View style={tw`mt-10 flex-row justify-between items-center`}>
              <Text style={tw`text-white`}>{}x</Text>
              <Slider
                style={tw` mt-2 w-65`}
                thumbTintColor={'#fa0'}
                minimumTrackTintColor={'#888'}
                maximumTrackTintColor={'#fff'}
                minimumValue={0}
                maximumValue={300}
                value={0}
              />
              <Text style={tw` text-white`}>5m</Text>
            </View>
            <View style={tw`px-5 pt-10`}>
              <Button
                label="Save"
                action={() => {
                  refRBSheetSleepControll.current?.close();
                }}
              />
            </View>
          </View>
        </RBSheet>
        <RBSheet
          ref={refRBSheetShare}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={250}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#fff',
            },
            container: {
              backgroundColor: '#333',
            },
          }}>
          <View style={tw`items-center min-h-full min-w-full`}>
            <Text style={tw`my-2 text-xl text-white`}>Sleep Timer</Text>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheetShare.current?.close();
                }}>
                <Text style={tw`text-white text-lg`}>Podcast</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheetShare.current?.close();
                }}>
                <Text style={tw`text-white text-lg`}>Episode</Text>
              </TouchableOpacity>
            </View>
            <View
              style={tw`pl-8 min-w-full border-b border-gray-500 h-14 justify-center`}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheetShare.current?.close();
                }}>
                <Text style={tw`text-white text-lg`}>
                  Position in episode{'  '}
                  <Text style={tw`text-white text-opacity-50 text-lg`}>
                    {}m {}s
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        {/* </View> */}
      </View>
    </View>
  );

  const {episodeDetail, setEpisodeDetail, miniPlayer} =
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
  const SecondRoute = () => (
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
        <View style={tw`mt-5 justify-end mb-3`}>
          <View
            style={tw.style(
              'rounded-lg px-1 pr-2 bg-white bg-opacity-10  flex-row items-center',
            )}>
            <TextInput
              style={tw.style('ml-2 text-white flex-1 text-sm text-opacity-80')}
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
      </View>
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Now Playing'},
    {key: 'second', title: 'Comments'},
  ]);
  const refRBSheetRate = useRef<RBSheet>();
  const refRBSheetSleep = useRef<RBSheet>();
  const refRBSheetSleepControll = useRef<RBSheet>();
  const refRBSheetShare = useRef<RBSheet>();

  return (
    <View style={tw`bg-black flex-1`}>
      <View style={tw`min-h-full min-w-full mb-4`}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
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
