import {useContext, useEffect, useState} from 'react';
import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Input, NativeBaseProvider} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import tw from '../../modules/tailwind';
import axios from 'axios';
import {API_ACCOUNT} from '@env';

import {emailValidation} from '../../modules/validation';
import {KeyIcon, MailIcon, UserIcon} from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import Button from '../../components/Button';
import {UserContext} from '../../providers/UserProvider';
import {RootStackParamList} from '../RootStackPrams';
import {StackNavigationProp} from '@react-navigation/stack';

type ResposeInfo = {
  id?: string;
  username?: string;
  avatar?: any;
  showHistory?: boolean;
};

type charCountType = {
  [key: string]: number;
};

const countChar = (str: string) => {
  const counts: charCountType = {};
  for (const s of str) {
    if (counts[s]) {
      counts[s]++;
    } else {
      counts[s] = 1;
    }
  }
  return counts;
};

type authScreenProp = StackNavigationProp<
  RootStackParamList,
  'SignupModalScreen'
>;

export default function SignupModalScreen() {
  const navigation = useNavigation<authScreenProp>();

  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confrimPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [validationValue, setValidationValue] = useState<boolean>(false);
  const [entropyValue, setEntorpyValue] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);
  const {setAccessToken} = useContext(UserContext);
  const passwordComplex = () => {
    let entropy: number = 0;
    let frequency: number = 0;
    const counts = countChar(passwordValue);
    const size: number = Object.keys(counts).length;
    Object.keys(counts).forEach(char => {
      frequency = counts[char] / size;
      entropy -= (frequency * Math.log(frequency)) / Math.log(2);
    });
    setEntorpyValue(entropy);
  };

  const postSignupData = async () => {
    try {
      console.log(emailValidation(emailValue));
      setValidationValue(true);
      if (
        usernameValue === '' ||
        emailValidation(emailValue) === null ||
        passwordValue.length < 7 ||
        passwordValue.length > 64 ||
        entropyValue < 1.8 ||
        confrimPasswordValue !== passwordValue
      ) {
        console.log('signup error');
        return;
      }
      console.log('emailValue: ', emailValue);
      console.log('passwordValue: ', passwordValue);
      console.log('usernameValue: ', usernameValue);

      setIsPending(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await axios.post(`${API_ACCOUNT}signup`, {
        client_id: 'public_web',
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
      });

      const res1 = await axios.post(`${API_ACCOUNT}login`, {
        client_id: 'public_web',
        login: usernameValue,
        password: passwordValue,
        remember: 'true',
      });
      setIsPending(false);

      await AsyncStorage.setItem('accessToken', res1.data.access_token);
      setAccessToken(res1.data.access_token);
      await AsyncStorage.setItem('refreshToken', res1.data.refresh_token);
      navigation.goBack();
    } catch (error) {
      setIsPending(false);
      console.log(error);
    }
  };

  useEffect(() => {
    passwordComplex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordValue]);

  return (
    <NativeBaseProvider>
      <View style={tw`bg-black flex-1 px-4`}>
        <View style={tw`items-center justify-center mt-10`}>
          <Text style={tw`mt-3 text-3xl font-bold text-white`}>Signup</Text>
        </View>
        <View style={tw`flex-row justify-center pt-1.3 `}>
          <Text style={tw`text-white`}>Already have account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginModalScreen')}>
            <Text style={tw`font-bold text-white`}> Login </Text>
          </TouchableOpacity>
        </View>

        {/* Username or Email Input Field */}
        <View style={tw`mt-8`}>
          <View style={tw`mt-2.5 mr-1`}>
            <Input
              style={tw`text-white`}
              InputLeftElement={<UserIcon style={tw`text-white`} />}
              variant="underlined"
              placeholder="Username"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setUsernameValue(text);
              }}
              isInvalid={usernameValue === '' && validationValue}
            />
          </View>
        </View>

        {/* Username or Email Input Field */}
        <View style={tw`mt-3`}>
          <View style={tw`mt-2.5 mr-1`}>
            <Input
              style={tw`text-white`}
              InputLeftElement={<MailIcon style={tw`text-white`} />}
              variant="underlined"
              placeholder="Email"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setEmailValue(text);
              }}
              isInvalid={
                emailValidation(emailValue) === null && validationValue
              }
            />
          </View>
        </View>

        {/* Password Input Field */}
        <View style={tw`mt-3`}>
          <View style={tw`mt-2.5 mr-1`}>
            <Input
              style={tw`text-white`}
              InputLeftElement={<KeyIcon style={tw`text-white`} />}
              variant="underlined"
              secureTextEntry={true}
              placeholder="Password (at least 6 characters)"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setPasswordValue(text);
              }}
              isInvalid={
                (passwordValue.length < 7 ||
                  passwordValue.length > 64 ||
                  entropyValue < 1.8) &&
                validationValue
              }
            />
          </View>
        </View>

        {/* Password Input Field */}
        <View style={tw`mt-3`}>
          <View style={tw`mt-2.5 mr-1`}>
            <Input
              style={tw`text-white`}
              InputLeftElement={<KeyIcon style={tw`text-white`} />}
              variant="underlined"
              secureTextEntry={true}
              placeholder="Confirm Password"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setConfirmPasswordValue(text);
              }}
              isInvalid={
                confrimPasswordValue !== passwordValue && validationValue
              }
            />
          </View>
        </View>
        <View style={tw`mt-8`}>
          <Button
            label={'REGISTER NOW'}
            action={() => {
              postSignupData();
            }}
            isPending={isPending}
          />
        </View>
      </View>
    </NativeBaseProvider>
  );
}
