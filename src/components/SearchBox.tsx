import React from 'react';
import { View, TextInput } from 'react-native';
import { SearchIcon } from 'react-native-heroicons/solid';
import tw from '../modules/tailwind';

type Props = {
  value: string;
  onChange: (text: string) => void;
  type: string;
  placeholder?: string;
};

const SearchBox: React.FC<Props> = ({
  placeholder = '',
  value,
  type = 'small',
  onChange,
}) => {
  return type === 'big' ? (
    <View
      style={tw.style(
        'rounded-lg px-4 bg-white bg-opacity-10 flex-row items-center',
      )}>
      <SearchIcon style={tw`text-white`} />
      <TextInput
        style={tw.style('ml-4 text-white flex-1')}
        placeholderTextColor={'#ffffff'}
        placeholder={placeholder}
        value={value}
        onChangeText={(text: string) => onChange(text)}
      />
    </View>
  ) : (
    <View
      style={tw.style('rounded-lg px-1 pr-2 bg-white bg-opacity-10 flex-row')}>
      <SearchIcon style={tw`mt-3 text-white text-opacity-60 flex-1`} />
      <TextInput
        style={tw.style('ml-2 text-white text-sm text-opacity-80')}
        placeholderTextColor={'#888888'}
        placeholder={placeholder}
        value={value}
        onChangeText={(text: string) => onChange(text)}
      />
    </View>
  );
};

export default SearchBox;
