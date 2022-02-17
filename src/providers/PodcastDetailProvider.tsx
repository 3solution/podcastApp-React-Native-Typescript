import React, {createContext, useState} from 'react';

type downloadTemp = {
  title: string;
  description: string;
  imgUrl: string;
  audioUrl: string;
  date: string;
  uuid: string;
  duration: number;
};

type Props = {
  children: React.ReactNode;
};

type PodcastContextType = {
  podcastDetail: string;
  setPodcastDetail: React.Dispatch<React.SetStateAction<string>>;
  following: string;
  setFollowing: React.Dispatch<React.SetStateAction<string>>;
  download: Array<downloadTemp>;
  setDownload: React.Dispatch<React.SetStateAction<Array<downloadTemp>>>;
};

export const PodcastContext = createContext<PodcastContextType>({
  podcastDetail: '',
  setPodcastDetail: () => {},
  following: '',
  setFollowing: () => {},
  download: [],
  setDownload: () => {},
});

const PodcastProvider: React.FC<Props> = ({children}) => {
  const [podcastDetail, setPodcastDetail] = useState('');
  const [following, setFollowing] = useState('');
  const [download, setDownload] = useState<Array<downloadTemp>>([]);
  return (
    <PodcastContext.Provider
      value={{
        podcastDetail,
        setPodcastDetail,
        following,
        setFollowing,
        download,
        setDownload,
      }}>
      {children}
    </PodcastContext.Provider>
  );
};

export default PodcastProvider;
