import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainBottomTabParamList} from './screens/main/MainBottomTabParams';
import {RootStackParamList} from './screens/RootStackPrams';

export type UserInfo = {
  id?: string;
  username?: string;
  avatar?: any;
  showHistory?: boolean;
};

export type RootTabScreenProps<Screen extends keyof MainBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainBottomTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
