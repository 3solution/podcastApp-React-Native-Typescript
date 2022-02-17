import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
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
import {ShareIcon} from 'react-native-heroicons/outline';
import RBSheet from 'react-native-raw-bottom-sheet';
import Slider from '@react-native-community/slider';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EpisodeContext} from '../../providers/EpisodeCommentProvider';
import {TabView} from 'react-native-tab-view';
// const songDetails = {
//   id: '1',
//   url: 'https://audio-previews.elements.envatousercontent.com/files/103682271/preview.mp3',
//   title: 'The Greatest Song',
//   album: 'Great Album',
//   artist: 'A Great Dude',
//   artwork: 'https://picsum.photos/300',
// };
export default function MediaPlayerModalScreen() {
  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
    TrackPlayer.registerPlaybackService(() => require('../service.ts'));

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
      type: TrackType.Default,
      title: playData?.title,
      // album: songDetails.album,
      // artist: songDetails.artist,
      artwork: playData?.imgUrl,
    });
    return true;
  };
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const {position, duration} = useProgress(250);

  useEffect(() => {
    const startPlayer = async () => {
      let isInit = await trackPlayerInit();
      setIsTrackPlayerInit(isInit);
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

  useTrackPlayerEvents([Event?.PlaybackState], event => {
    if (event.state === State?.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  });

  const onButtonPressed = () => {
    if (!isPlaying) {
      TrackPlayer?.play();
      setIsPlaying(true);
    } else {
      TrackPlayer?.pause();
      setIsPlaying(false);
    }
  };

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

  const pauseAudio = () => {};

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
            minimumValue={0}
            maximumValue={1}
            value={sliderValue}
            minimumTrackTintColor="#111000"
            maximumTrackTintColor="#000000"
            onSlidingStart={slidingStarted}
            onSlidingComplete={slidingCompleted}
            thumbTintColor="#000"
          />
          <Button
            label={isPlaying ? 'Pause' : 'Play'}
            action={onButtonPressed}
            isPending={!isTrackPlayerInit}
            type={'secondary'}
          />
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

  const SecondRoute = () => (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw.style('pb-16')}>{}</ScrollView>
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
              labelStyle={tw`text-10 text-left`}
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
