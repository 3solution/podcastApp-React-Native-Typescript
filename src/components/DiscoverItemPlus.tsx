import React from 'react';
import {View} from 'react-native';
import {PlusIcon} from 'react-native-heroicons/solid';
import tw from 'twrnc';

type Props = {
  image: string;
  title: string;
  author: string;
};
// const DiscoverItemPlus: React.FC<Props> = ({image, title, author}) => {
const DiscoverItemPlus: React.FC<Props> = ({}) => {
  return (
    <View>
      <PlusIcon
        style={tw.style('text-white text-xs text-opacity-60')}
        height={20}
        width={20}
      />
    </View>
  );
};

export default DiscoverItemPlus;
