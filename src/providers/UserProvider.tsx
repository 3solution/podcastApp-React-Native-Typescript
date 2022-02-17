import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {API_HOSTING} from '@env';
import axios from 'axios';
import {UserInfo} from '../types';
type Props = {
  children: React.ReactNode;
};

type UserContextType = {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
};

export const UserContext = createContext<UserContextType>({
  accessToken: '',
  setAccessToken: () => {},
  userInfo: {},
  setUserInfo: () => {},
});

const UserProvider: React.FC<Props> = ({children}) => {
  const [accessToken, setAccessToken] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const getToken = async () => {
    const tokenValue = await AsyncStorage.getItem('accessToken');
    setAccessToken(tokenValue ?? '');
  };

  const getUserInfo = async () => {
    try {
      setUserInfo({});
      const res = await axios.get(`${API_HOSTING}user/info`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserInfo(res.data);
    } catch (error: any) {
      if (error.toJSON().status == 401) {
        setAccessToken('');
        await AsyncStorage.setItem('accessToken', '');
        await AsyncStorage.setItem('refreshToken', '');
      }
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (accessToken !== '') {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{accessToken, setAccessToken, userInfo, setUserInfo}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
