import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Input, NativeBaseProvider } from 'native-base';
import { KeyIcon, UserIcon } from 'react-native-heroicons/solid';
import tw from '../../modules/tailwind';
import axios from 'axios';
import { API_ACCOUNT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';
import { UserContext } from '../../providers/UserProvider';
import { RootStackParamList } from '../RootStackPrams';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { EpisodeContext } from '../../providers/EpisodeCommentProvider';
import MiniPlayer from '../../components/MiniPlayer';
import Toast from 'react-native-toast-message';

type authScreenProp = StackNavigationProp<
  RootStackParamList,
  'LoginModalScreen'
>;

export default function LoginModalScreen() {
  const navigation = useNavigation<authScreenProp>();

  const { setAccessToken } = useContext(UserContext);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [validationValue, setValidationValue] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { setMiniPlayerPosition, miniPlayerPosition } =
    useContext(EpisodeContext);

  const PostLoginData = async () => {
    try {
      setValidationValue(true);
      if (usernameValue === '' || passwordValue === '') {
        console.log('press login button');
        // Toast.show({
        //   position: 'top',
        //   type: 'error',
        //   text1: 'input username ro password',
        // });
        return;
      }
      setIsPending(true);

      const res = await axios.post(`${API_ACCOUNT}login`, {
        client_id: 'public_web',
        login: usernameValue,
        password: passwordValue,
        remember: 'true',
      });
      // Toast.show({
      //   position: 'top',
      //   type: 'error',
      //   text1: 'incorrect username or password',
      // });
      setIsPending(false);
      navigation.goBack();
      setAccessToken(res.data.access_token);
      AsyncStorage.setItem('accessToken', res.data.access_token);
      AsyncStorage.setItem('refreshToken', res.data.refresh_token);
    } catch (error) {
      setIsPending(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setMiniPlayerPosition(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [miniPlayerPosition]);

  return (
    <>
      <NativeBaseProvider>
        <View style={tw`bg-black flex-1 px-4`}>
          <View style={tw`items-center justify-center mt-20`}>
            <Text style={tw`mt-3 text-3xl font-bold text-white`}>Login</Text>
          </View>
          <View style={tw`flex-row justify-center pt-1.3 `}>
            <Text style={tw`text-white`}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignupModalScreen')}>
              <Text style={tw`font-bold text-white`}> Sign up</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`mt-8`}>
            <Input
              color={'white'}
              InputLeftElement={<UserIcon style={tw`text-white`} />}
              variant="underlined"
              placeholder="Username or Email"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.500',
              }}
              onChangeText={(text: any) => {
                setUsernameValue(text);
              }}
              isInvalid={usernameValue === '' && validationValue}
            />
          </View>
          <View style={tw`mt-5`}>
            <Input
              color={'white'}
              InputLeftElement={<KeyIcon style={tw`text-white`} />}
              variant="underlined"
              secureTextEntry={true}
              placeholder="Password"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setPasswordValue(text);
              }}
              isInvalid={passwordValue === '' && validationValue}
            />
          </View>
          <View style={tw`mt-8`}>
            <Button
              label={'LOGIN'}
              action={() => PostLoginData()}
              isPending={isPending}
            />
          </View>
        </View>
        <Toast />
        <MiniPlayer position={false} />
      </NativeBaseProvider>
    </>
  );
}
