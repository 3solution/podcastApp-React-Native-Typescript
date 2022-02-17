import React from 'react';
import {Image, View, Text} from 'react-native';
import tw from '../modules/tailwind';

type Props = {
  image: string;
  title: string;
  author: string;
};
const DiscoverItem: React.FC<Props> = ({image, title, author}) => {
  return (
    <View style={tw`flex-row items-center flex-1`}>
      <View style={tw`w-14 h-14 mr-2`}>
        <Image
          style={tw.style('w-full h-full rounded-md')}
          source={{
            uri: image,
          }}
        />
      </View>
      <View style={tw`flex-1`}>
        <Text
          style={[tw.style('text-white text-sm pr-2')]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={tw.style('text-white text-opacity-60 text-xs pr-2')}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {author}
        </Text>
      </View>
    </View>
  );
};

export default DiscoverItem;
