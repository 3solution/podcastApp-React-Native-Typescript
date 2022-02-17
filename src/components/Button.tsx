import React from 'react';
import {TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import tw from '../modules/tailwind';

type Props = {
  label: string;
  action: Function;
  isPending?: boolean;
  type?: 'primary' | 'secondary' | 'thirdly';
};

const Button: React.FC<Props> = ({
  label,
  action,
  isPending = false,
  type = 'primary',
}) => {
  return (
    <TouchableOpacity onPress={() => action()} disabled={isPending}>
      <View
        style={tw.style(
          'rounded items-center justify-center h-10 ',
          {
            'bg-indigo-600 min-w-full': type === 'primary',
          },
          {
            'bg-gray-600 min-w-full': type === 'secondary',
          },
          {
            'bg-gray-600 w-30 ml-25 mt-5': type === 'thirdly',
          },
        )}>
        {isPending ? (
          <ActivityIndicator size={'large'} color={'#ffffff'} />
        ) : (
          <Text style={tw`text-white font-bold text-base my-2 `}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
