import {useContext, useEffect, useState} from 'react';
import React from 'react';
import {Text, View, TouchableOpacity, Switch} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import tw from '../../modules/tailwind';
import axios from 'axios';
import {API_HOSTING} from '@env';
import {SpeakerphoneIcon, UserCircleIcon} from 'react-native-heroicons/outline';
import {UserContext} from '../../providers/UserProvider';

export default function SettingModalScreen() {
  // const [nameValue, setNameValue] = useState<string>('');
  // const [websiteValue, setWebsiteValue] = useState<string>('');
  // const [bioValue, setBioValue] = useState<string>('');
  // const [usernameValue, setUsernameValue] = useState<string>('');
  // const [validationValue, setValidationValue] = useState<boolean>(false);
  const [isEnabledDelete, setIsEnabledDelete] = useState(false);
  const [isEnabledStream, setIsEnabledStream] = useState(false);
  const [isEnabledHistory, setIsEnabledHistory] = useState(false);
  const {accessToken, userInfo} = useContext(UserContext);

  const deleteToggleSwitch = async () => {
    try {
      if (isEnabledDelete === false) {
        setIsEnabledDelete(true);
      } else {
        setIsEnabledDelete(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const streamToggleSwitch = async () => {
    try {
      if (isEnabledStream === false) {
        setIsEnabledStream(true);
      } else {
        setIsEnabledStream(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const historyToggleSwitch = async () => {
    try {
      if (isEnabledHistory === false) {
        setIsEnabledHistory(true);
        const res = await axios
          .put(`${API_HOSTING}user/${userInfo.id}/show-history`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(res => {
            console.log('res: ', res.data);
          });
      } else {
        setIsEnabledHistory(false);
        const res = await axios
          .delete(`${API_HOSTING}user/${userInfo.id}/show-history`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(res => {
            console.log('res: ', res.data);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserInfo = async () => {
    // const temp: any = await AsyncStorage.getItem("userInfo");
    // const userinfo = JSON.parse(temp);
    // setUserInfo(userinfo);
  };

  // const editProfile = async () => {
  //   try {
  //     setValidationValue(true);
  //     if (nameValue === '' || validationValue === false) {
  //       return;
  //     }
  //     navigation.goBack();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <NativeBaseProvider>
      <View style={tw`bg-black flex-1 pt-10`}>
        <View style={tw`mx-4 flex-row justify-between items-center`}>
          <Text style={tw`text-white`}>Auto delete played files</Text>
          <View style={tw``}>
            <Switch
              trackColor={{false: '#9CA3AF', true: '#93C5FD'}}
              thumbColor={isEnabledDelete ? '#2563EB' : '#EFF6FF'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={deleteToggleSwitch}
              value={isEnabledDelete}
            />
          </View>
        </View>
        <View style={tw`mx-4 flex-row justify-between items-center my-6`}>
          <View style={tw`max-w-70`}>
            <Text style={tw`text-white`}>Stream by default</Text>
            <Text style={tw`text-white text-opacity-60 text-xs`}>
              Changes the app to one app streaming, instead downloading
            </Text>
          </View>
          <View style={tw``}>
            <Switch
              trackColor={{false: '#9CA3AF', true: '#93C5FD'}}
              thumbColor={isEnabledStream ? '#2563EB' : '#EFF6FF'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={streamToggleSwitch}
              value={isEnabledStream}
            />
          </View>
        </View>
        <View style={tw`mx-4 flex-row justify-between items-center`}>
          <Text style={tw`text-white`}>Show listen history</Text>
          <View style={tw``}>
            <Switch
              trackColor={{false: '#9CA3AF', true: '#93C5FD'}}
              thumbColor={isEnabledHistory ? '#2563EB' : '#EFF6FF'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={historyToggleSwitch}
              value={isEnabledHistory}
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <View style={tw`flex-row mx-4 mt-8`}>
            <SpeakerphoneIcon style={tw`text-white`} />
            <Text style={tw`text-white`}>Feedback</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={tw`flex-row mx-4 mt-8`}>
            <UserCircleIcon style={tw`text-white`} />
            <Text style={tw`text-white`}>Account</Text>
          </View>
        </TouchableOpacity>
      </View>
    </NativeBaseProvider>
  );
}
