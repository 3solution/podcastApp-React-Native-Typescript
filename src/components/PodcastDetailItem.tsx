import React from 'react';
import { View, Text } from 'react-native';
import tw from '../modules/tailwind';

type Props = {
  date: string;
  episode: number;
  title: string;
};
const PodcastDetailItem: React.FC<Props> = ({ date, episode, title }) => {
  return (
    <View style={tw`bg-black flex-row items-center flex-1`}>
      <View style={tw`bg-black justify-center mr-2`}>
        <Text
          style={tw`text-white text-10 w-10`}
          ellipsizeMode="tail"
          numberOfLines={2}>
          {date}
        </Text>
      </View>
      <View style={tw`flex-1 bg-black`}>
        <Text
          style={[tw.style('text-white text-sm pr-2')]}
          ellipsizeMode="tail"
          numberOfLines={2}>
          <Text style={tw`text-white text-opacity-60`}>EP{episode} </Text>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default PodcastDetailItem;
