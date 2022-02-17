import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Video} from 'expo-av';
import React, {
  createContext,
  // RefObject,
  useEffect,
  // useRef,
  useState,
} from 'react';

type Props = {
  children: React.ReactNode;
};
type playbackInstanceInfo = {
  rate: number;
  position: number;
  duration: number;
  state: string;
};

type EpisodeContextType = {
  episodeDetail: string;
  setEpisodeDetail: React.Dispatch<React.SetStateAction<string>>;
  mediaData: string;
  setMediaData: React.Dispatch<React.SetStateAction<string>>;
  miniPlayer: boolean;
  setMiniPlayer: React.Dispatch<React.SetStateAction<boolean>>;
  playbackInstanceInfo: playbackInstanceInfo;
  setPlaybackInstanceInfo: React.Dispatch<
    React.SetStateAction<playbackInstanceInfo>
  >;
  playData: any;
  setPlayData: React.Dispatch<React.SetStateAction<any>>;
  // playbackInstance: RefObject<Video> | null;
};

export const EpisodeContext = createContext<EpisodeContextType>({
  episodeDetail: '',
  setEpisodeDetail: () => {},
  mediaData: '',
  setMediaData: () => {},
  miniPlayer: false,
  setMiniPlayer: () => {},
  playbackInstanceInfo: {
    rate: 1,
    position: 0,
    duration: 0,
    state: 'Buffering',
  },
  setPlaybackInstanceInfo: () => {},
  playData: null,
  setPlayData: () => {},
  // playbackInstance: null,
});

const EpisodeProvider: React.FC<Props> = ({children}) => {
  const [episodeDetail, setEpisodeDetail] = useState('');
  const [mediaData, setMediaData] = useState('');
  const [miniPlayer, setMiniPlayer] = useState(false);
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    rate: 1,
    position: 0,
    duration: 0,
    state: 'Buffering',
  });
  const [playData, setPlayData] = useState<any>(null);
  // const playbackInstance = useRef<Video>(null);

  const getToken = async () => {
    const Value = await AsyncStorage.getItem('episodeUuid');
    setEpisodeDetail(Value ?? '');
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <EpisodeContext.Provider
      value={{
        episodeDetail,
        setEpisodeDetail,
        mediaData,
        setMediaData,
        miniPlayer,
        setMiniPlayer,
        playbackInstanceInfo,
        setPlaybackInstanceInfo,
        playData,
        setPlayData,
        // playbackInstance,
      }}>
      {children}
    </EpisodeContext.Provider>
  );
};

export default EpisodeProvider;
