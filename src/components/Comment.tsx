import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  DotsVerticalIcon,
  ReplyIcon,
} from 'react-native-heroicons/solid';
import tw from '../modules/tailwind';

type Props = {
  // url?: string;
  name?: string;
  text?: string;
  time?: string;
  follow?: number;
  actionReply?: Function;
  actionUp: Function;
  actionDown: Function;
};

const Comment: React.FC<Props> = ({
  // url,
  name,
  text,
  follow = 0,
  actionReply,
  actionUp,
  actionDown,
}) => {
  return (
    <View>
      <View style={tw`bg-black flex-row`}>
        {/* <Image
          style={tw.style("h-5 w-5 mr-2 rounded-full")}
          source={{
            uri: url
          }}
        /> */}
        <Text style={tw`text-white text-opacity-70 text-12 mr-1`}>{name}</Text>
        <Text style={tw`text-white text-opacity-50 text-12`} />
      </View>
      <Text style={tw`text-white text-opacity-80`}>{text}</Text>
      <View style={tw`bg-black flex-row  justify-end mx-2 items-center`}>
        <DotsVerticalIcon
          style={tw`text-white text-opacity-60 mx-2`}
          width={15}
          height={20}
        />
        {actionReply && (
          <TouchableOpacity onPress={() => actionReply()}>
            <ReplyIcon
              style={tw`text-white text-opacity-60 mx-2`}
              width={15}
              height={20}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => actionUp()}>
          <ArrowSmUpIcon
            style={tw`text-white text-opacity-60 ml-4 `}
            width={20}
            height={20}
          />
        </TouchableOpacity>
        <Text style={tw`text-white text-opacity-60`}>{follow}</Text>
        <TouchableOpacity onPress={() => actionDown()}>
          <ArrowSmDownIcon
            style={tw`text-white text-opacity-60 `}
            width={20}
            height={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comment;
