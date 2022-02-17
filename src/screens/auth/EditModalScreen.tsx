import {useContext, useEffect, useState} from 'react';
import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {Input, NativeBaseProvider} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import tw from '../../modules/tailwind';
import {ArrowLeftIcon, CheckIcon} from 'react-native-heroicons/outline';
import {UserContext} from '../../providers/UserProvider';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackPrams';

type authScreenProp = StackNavigationProp<
  RootStackParamList,
  'EditModalScreen'
>;

export default function EditModalScreen() {
  const navigation = useNavigation<authScreenProp>();

  const [nameValue, setNameValue] = useState<string>('');
  const [websiteValue, setWebsiteValue] = useState<string>('');
  const [bioValue, setBioValue] = useState<string>('');
  const [usernameValue, setUsernameValue] = useState<string>('');
  // const [userInfo, setUserInfo] = useState<ResposeInfo>({});
  const [validationValue, setValidationValue] = useState<boolean>(false);
  const {accessToken, userInfo} = useContext(UserContext);

  const getUserInfo = async () => {
    // const temp: any = await AsyncStorage.getItem("userInfo");
    // const userinfo = JSON.parse(temp);
    // setUserInfo(userinfo);
  };
  console.log('userInfo: ', userInfo);

  const editProfile = async () => {
    try {
      setValidationValue(true);
      if (nameValue === '' || validationValue === false) {
        return;
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [accessToken]);

  return (
    <NativeBaseProvider>
      <View style={tw`bg-black flex-1`}>
        <View style={tw`mt-9 mx-4 flex-row mb-8 justify-between`}>
          <View style={tw`flex-row`}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <ArrowLeftIcon style={tw`text-white mt-1`} />
              </TouchableOpacity>
            </View>
            <View style={tw``}>
              <Text style={tw`text-white mx-5 text-xl font-bold`}>
                Edit Profile
              </Text>
            </View>
          </View>
          <View style={tw``}>
            <TouchableOpacity
              onPress={() => {
                editProfile();
              }}>
              <CheckIcon style={tw`text-blue-400 mt-1 mr-2`} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`items-center justify-center`}>
          <View style={tw`h-18 w-18 mr-2 rounded-full bg-white`}>
            <Image
              style={tw.style('min-w-full min-h-full ')}
              source={{
                uri: userInfo.avatar,
              }}
            />
          </View>
        </View>
        <View style={tw`flex-row justify-center pt-1.3 `}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={tw`text-sm text-blue-400`}>
              {' '}
              Change profile photo{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tw`mt-8 mx-4`}>
          <Text style={tw`text-white text-xs text-opacity-60`}>Name</Text>
          <View style={tw` mr-1`}>
            <Input
              style={tw`text-white px-0 py-1 text-sm`}
              variant="underlined"
              placeholder="name"
              _light={{
                placeholderTextColor: 'blueGray.200',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              defaultValue={userInfo.username}
              onChangeText={(text: any) => {
                setNameValue(text);
              }}
              isInvalid={nameValue === '' && validationValue}
            />
          </View>
        </View>
        <View style={tw`mt-4 mx-4`}>
          <Text style={tw`text-white text-xs text-opacity-60`}>Username</Text>
          <View style={tw` mr-1`}>
            <Input
              style={tw`text-white px-0 py-1 text-sm`}
              variant="underlined"
              placeholder="username"
              _light={{
                placeholderTextColor: 'blueGray.200',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setUsernameValue(text);
              }}
            />
          </View>
        </View>
        <View style={tw`mt-2 mx-4`}>
          <View style={tw` mr-1`}>
            <Input
              style={tw`text-white px-0 py-1 text-sm`}
              variant="underlined"
              placeholder="Bio"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setBioValue(text);
              }}
            />
          </View>
        </View>
        <View style={tw`mt-2 mx-4`}>
          <View style={tw` mr-1`}>
            <Input
              style={tw`text-white px-0 py-1 text-sm`}
              variant="underlined"
              placeholder="Website"
              _light={{
                placeholderTextColor: 'blueGray.400',
              }}
              _dark={{
                placeholderTextColor: 'blueGray.50',
              }}
              onChangeText={(text: any) => {
                setWebsiteValue(text);
              }}
            />
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
}
