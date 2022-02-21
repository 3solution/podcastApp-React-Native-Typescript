import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import React, { useEffect, useContext, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { PauseIcon, PlayIcon, ShareIcon } from 'react-native-heroicons/outline';
import RBSheet from 'react-native-raw-bottom-sheet';
import TrackPlayer, { TrackType, useProgress } from 'react-native-track-player';
import Button from '../../../components/Button';
import { EpisodeContext } from '../../../providers/EpisodeCommentProvider';
import tw from '../../../modules/tailwind';

const PlayerTabView = () => {
  const { position, duration } = useProgress(1000);
  const {
    playData,
    setPlayData,
    setSleepVisiblity,
    setTimeCounter,
    isPlaying,
    setIsPlaying,
  } = useContext(EpisodeContext);

  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [timeSelectedCounter, setTimeSelectedCounter] = useState(0);
  const [rate, setRate] = useState(1);
  const refRBSheetRate = useRef<RBSheet>();
  const refRBSheetSleep = useRef<RBSheet>();
  const refRBSheetSleepControll = useRef<RBSheet>();
  const refRBSheetShare = useRef<RBSheet>();

  function RenderIcon() {
    if (isPlaying === 'buffering') {
      return <ActivityIndicator size={30} color="black" />;
    } else if (isPlaying === 'pause') {
      return <PlayIcon width={50} height={50} color="#000" />;
    } else if (isPlaying === 'play') {
      return <PauseIcon width={50} height={50} color="#000" />;
    }
    return null;
  }

  const trackPlayerInit = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add({
      url: playData.audioUrl,
      title: playData.title,
      artwork: playData.imgUrl,
      album: playData.title,
      artist: playData.description,
      type: TrackType.Default,
    });
  };

  const getPlayData = async () => {
    const temp = await AsyncStorage.getItem('playItem');
    if (temp != null) {
      setPlayData({ ...JSON.parse(temp) });
    }
  };

  // useTrackPlayerEvents([Event?.PlaybackState], (event: any) => {
  //   if (event.state === State?.Playing) {
  //     if (isPlaying === 'pause') {
  //       setIsPlaying('play');
  //     }
  //   } else {
  //     if (isPlaying === 'play') {
  //       setIsPlaying('pause');
  //     }
  //   }
  // });

  const onButtonPressed = () => {
    if (isPlaying === 'pause') {
      setIsPlaying('play');
      TrackPlayer.play();
    } else if (isPlaying === 'play') {
      setIsPlaying('pause');
      TrackPlayer.pause();
    }
    console.log('Button clicked');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const timeControll = async (time: number) => {
    let newPosition = await TrackPlayer.getPosition();
    let duration = await TrackPlayer.getDuration();
    newPosition += time;
    if (newPosition > duration) {
      newPosition = duration;
    }
    if (newPosition < 0) {
      newPosition = 0;
    }
    TrackPlayer.seekTo(newPosition);
  };

  const slidingStarted = () => {
    setIsSeeking(true);
  };

  const slidingCompleted = async (value: any) => {
    await TrackPlayer?.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };

  const setSleepTimeControll = () => {
    refRBSheetSleep.current?.close();
    refRBSheetSleepControll.current?.open();
  };

  const sleepController = (time: number) => {
    refRBSheetSleep.current?.close();
    setSleepVisiblity(true);
    setTimeCounter(time);
  };

  const sleepUserController = () => {
    setSleepVisiblity(true);
    refRBSheetSleepControll.current?.close();
  };
  const setSelectTimeCounter = async (value: any) => {
    setTimeSelectedCounter(value);
    setTimeCounter(value);
  };
  const setPlaySpeed = async (value: any) => {
    TrackPlayer.setRate(value);
    setRate(value);
  };
  useEffect(() => {
    getPlayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playData) {
      setIsPlaying('pause');
      trackPlayerInit();
      TrackPlayer.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playData]);

  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, duration]);
  console.log('player');

  return (
    <View style={tw`flex-1`}>
      <View style={tw`h-full pt-5`}>
        {/* <View style={tw`bg-red-400  pb-5 pt-2 bg-black  `}> */}
        <View style={tw`justify-center items-center`}>
          <Image
            style={tw`w-75 h-75 rounded`}
            source={{ uri: playData?.imgUrl }}
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
          <View style={tw`flex-row justify-between items-center mx-15 mt-5`}>
            <TouchableOpacity
              onPress={() => {
                timeControll(-15);
              }}>
              <View style={tw`relative`}>
                {/* <RotateCCW style={tw`w-12 h-12`} /> */}
                <Image
                  style={tw.style('w-12 h-12 opacity-80')}
                  source={require('../../assets/icons/arrow-counter-clockwise.png')}
                />
                <Text style={tw`text-white absolute left-3.5 top-3.5`}>15</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`mx-10 bg-white justify-center items-center rounded-full`}
              onPress={onButtonPressed}>
              <RenderIcon />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                timeControll(15);
              }}>
              <View style={tw`relative`}>
                {/* <RotateCW style={tw`w-12 h-12`} /> */}
                <Image
                  style={tw.style('w-12 h-12 opacity-80')}
                  source={require('../../assets/icons/arrow-clockwise.png')}
                />
                <Text style={tw`text-white absolute left-3.5 top-3.5`}>15</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={tw`mx-6 justify-end mt-10  w-10.3/12 h-13 flex-row bg-white bg-opacity-10 rounded-xl justify-between items-center`}>
          <TouchableOpacity onPress={() => refRBSheetRate.current?.open()}>
            <Text style={tw`ml-8 text-white text-opacity-60`}>
              {rate.toFixed(2)}x
            </Text>
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
              <Text style={tw`text-white`}>{rate.toFixed(2)}x</Text>
              <Slider
                style={tw` mt-2 w-65`}
                thumbTintColor={'#fa0'}
                minimumTrackTintColor={'#888'}
                maximumTrackTintColor={'#fff'}
                minimumValue={0.5}
                maximumValue={3.5}
                value={rate}
                onSlidingComplete={setPlaySpeed}
              />
              <Text style={tw` text-white`}>3.5x</Text>
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
              <Text style={tw`text-white`}>
                {Math.floor(timeSelectedCounter)}s
              </Text>
              <Slider
                style={tw` mt-2 w-65`}
                thumbTintColor={'#fa0'}
                minimumTrackTintColor={'#888'}
                maximumTrackTintColor={'#fff'}
                minimumValue={0}
                maximumValue={300}
                value={0}
                onSlidingComplete={setSelectTimeCounter}
              />
              <Text style={tw` text-white`}>5m</Text>
            </View>
            <View style={tw`px-5 pt-10`}>
              <Button
                label="Save"
                action={() => {
                  sleepUserController();
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
            <Text style={tw`my-2 text-xl text-white`}>Share</Text>
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
};

export default PlayerTabView;
