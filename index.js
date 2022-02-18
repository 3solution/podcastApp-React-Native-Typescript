/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App/App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import service from './src/screens/Player/service.ts';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => service);
// TrackPlayer.registerPlaybackService(() =>
//   require('./src/screens/Player/service.ts'),
// );
