import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { PauseIcon, PlayIcon } from 'react-native-heroicons/outline';
import TrackPlayer from 'react-native-track-player';
import { RootStackParamList } from '../screens/RootStackPrams';
import tw from '../modules/tailwind';
import { EpisodeContext } from '../providers/EpisodeCommentProvider';

type authScreenProp = StackNavigationProp<
  RootStackParamList,
  'MediaPlayerModalScreen'
>;
type Props = {
  position: boolean;
};
const MiniPlayer: React.FC<Props> = ({ position }) => {
  const navigation = useNavigation<authScreenProp>();

  const {
    miniPlayer,
    setMiniPlayer,
    playData,
    isPlaying,
    setIsPlaying,
    miniPlayerPosition,
    setMiniPlayerPosition,
  } = useContext(EpisodeContext);

  useEffect(() => {
    setMiniPlayerPosition(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function RenderIcon() {
    if (isPlaying === 'buffering') {
      return <ActivityIndicator size={30} color="white" />;
    } else if (isPlaying === 'pause') {
      return <PlayIcon width={50} height={50} color="#fff" />;
    } else if (isPlaying === 'play') {
      return <PauseIcon width={50} height={50} color="#fff" />;
    }
    return null;
  }

  const onButtonPressed = async () => {
    if (isPlaying === 'pause') {
      setIsPlaying('play');
      TrackPlayer.play();
    } else if (isPlaying === 'play') {
      setIsPlaying('pause');
      TrackPlayer.pause();
    }
    console.log('Button clicked');
    let newPosition = await TrackPlayer.getPosition();
    console.log(newPosition);
  };

  const goPlayer = () => {
    setMiniPlayer(false);
    navigation.navigate('MediaPlayerModalScreen');
  };
  useEffect(() => {
    TrackPlayer.pause();
  }, []);

  return (
    <>
      {miniPlayer === true && (
        <View
          style={tw`bg-black absolute h-15 w-12/12 ${
            position ? 'bottom-1/14' : 'bottom-0'
          }`}>
          <View
            style={tw`px-2 bg-white bg-opacity-10 h-full w-12/12 flex-row justify-between items-center `}>
            <TouchableOpacity
              onPress={() => {
                goPlayer();
              }}>
              <View style={tw` mr-2 flex-row items-center w-10/12`}>
                <Image
                  style={tw.style('w-12 h-12 rounded-md')}
                  source={{
                    uri: playData?.imgUrl,
                    // "https://i.pinimg.com/originals/d9/7a/ba/d97abaa3ecc0d3aeb48fe80bd0538557.jpg",
                  }}
                />
                <View style={tw`mx-2`}>
                  <Text
                    style={[tw.style('text-white text-sm')]}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {playData?.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <Pressable
              style={tw` bg-white bg-opacity-10  justify-center items-center h-10 w-10 border border-white rounded-full`}
              onPress={() => {
                onButtonPressed();
              }}>
              <RenderIcon />
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default MiniPlayer;
