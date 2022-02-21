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
  playData: any;
  setPlayData: React.Dispatch<React.SetStateAction<any>>;
  sleepVisiblity: boolean;
  setSleepVisiblity: React.Dispatch<React.SetStateAction<any>>;
  timeCounter: number;
  setTimeCounter: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: string;
  setIsPlaying: React.Dispatch<React.SetStateAction<string>>;
  miniPlayerPosition: boolean;
  setMiniPlayerPosition: React.Dispatch<React.SetStateAction<boolean>>;
  move: boolean;
  setMove: React.Dispatch<React.SetStateAction<boolean>>;
  // playbackInstance: RefObject<Video> | null;
};

export const EpisodeContext = createContext<EpisodeContextType>({
  episodeDetail: '',
  setEpisodeDetail: () => {},
  mediaData: '',
  setMediaData: () => {},
  miniPlayer: false,
  setMiniPlayer: () => {},
  playData: null,
  setPlayData: () => {},
  sleepVisiblity: false,
  setSleepVisiblity: () => {},
  timeCounter: 0,
  setTimeCounter: () => {},
  isPlaying: 'buffering',
  setIsPlaying: () => {},
  miniPlayerPosition: false,
  setMiniPlayerPosition: () => {},
  move: true,
  setMove: () => {},
  // playbackInstance: null,
});

const EpisodeProvider: React.FC<Props> = ({ children }) => {
  const [episodeDetail, setEpisodeDetail] = useState('');
  const [mediaData, setMediaData] = useState('');
  const [miniPlayer, setMiniPlayer] = useState(false);
  const [sleepVisiblity, setSleepVisiblity] = useState(false);
  const [timeCounter, setTimeCounter] = useState(0);
  const [isPlaying, setIsPlaying] = useState('buffering');
  const [playData, setPlayData] = useState<any>(null);
  const [miniPlayerPosition, setMiniPlayerPosition] = useState(false);
  const [move, setMove] = useState(true);
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
        playData,
        setPlayData,
        sleepVisiblity,
        setSleepVisiblity,
        timeCounter,
        setTimeCounter,
        isPlaying,
        setIsPlaying,
        miniPlayerPosition,
        setMiniPlayerPosition,
        move,
        setMove,
        // playbackInstance,
      }}>
      {children}
    </EpisodeContext.Provider>
  );
};

export default EpisodeProvider;
