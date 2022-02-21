import TrackPlayer, { Event } from 'react-native-track-player';

export default async function service() {
  console.log('service');
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('play');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('pause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    console.log('Forward');
    let newPosition = await TrackPlayer.getPosition();
    let duration = await TrackPlayer.getDuration();
    newPosition += 10;
    if (newPosition > duration) {
      newPosition = duration;
    }
    TrackPlayer.seekTo(newPosition);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
    console.log('backword');
    let newPosition = await TrackPlayer.getPosition();
    newPosition -= 10;
    if (newPosition < 0) {
      newPosition = 0;
    }
    TrackPlayer.seekTo(newPosition);
  });
}
