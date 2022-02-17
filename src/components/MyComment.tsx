import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {ChatAltIcon} from 'react-native-heroicons/solid';
import tw from '../modules/tailwind';

type Props = {
  name?: string;
  title?: string;
  vote?: number;
  time?: string;
  description?: string;
  action: Function;
};

const MyComment: React.FC<Props> = ({
  name,
  title,
  vote,
  description,
  action,
}) => {
  return (
    <View
      style={tw`mt-2 pb-1 border-l-0 border-r-0 border-t-0 border-b border-gray-800`}>
      <View style={tw`bg-black flex-row items-center mb-2`}>
        <ChatAltIcon style={tw`text-white text-opacity-50 mx-1`} width={18} />
        <Text style={tw`text-white text-12 mx-1`}>{name}</Text>
        <Text style={tw`text-white text-opacity-60 text-12 mx-1`}>
          commented on
        </Text>
        <TouchableOpacity onPress={() => action()}>
          <View style={tw`bg-black min-w-full py-1`}>
            <Text
              style={tw`text-white text-12 mx-1`}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={tw`bg-black flex-row`}>
        <Text style={tw`text-white text-12 mx-1`}>{name}</Text>
        <Text style={tw`text-white text-opacity-60 text-12 mx-1`}>
          {vote} vote{' '}
        </Text>
      </View>
      <Text style={tw`text-white text-xs mx-1`}>{description}</Text>
    </View>
  );
};

export default MyComment;
