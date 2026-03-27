import type {ImageSourcePropType} from 'react-native';

export type WatcherActionItem = {
  id: string;
  title: string;
  imageSource: ImageSourcePropType;
};

// Watcher 当前的动作资源在 Dance、Motion 和 Surveillance 三处共用。
export const WATCHER_ACTION_ITEMS: WatcherActionItem[] = [
  {
    id: 'love',
    title: 'Love',
    imageSource: require('../../assets/images/dance/love.webp'),
  },
  {
    id: 'error',
    title: 'Error',
    imageSource: require('../../assets/images/dance/error.webp'),
  },
  {
    id: 'invoke-tool',
    title: 'Invoke the tool',
    imageSource: require('../../assets/images/dance/invoke-tool.webp'),
  },
  {
    id: 'happy',
    title: 'Happy',
    imageSource: require('../../assets/images/dance/happy.webp'),
  },
  {
    id: 'sleep',
    title: 'Sleep',
    imageSource: require('../../assets/images/dance/sleep.webp'),
  },
  {
    id: 'thinking',
    title: 'Thinking',
    imageSource: require('../../assets/images/dance/thinking.webp'),
  },
  {
    id: 'think',
    title: 'Think',
    imageSource: require('../../assets/images/dance/think.webp'),
  },
  {
    id: 'speaking',
    title: 'Speaking',
    imageSource: require('../../assets/images/dance/speaking.webp'),
  },
  {
    id: 'listen',
    title: 'Listen',
    imageSource: require('../../assets/images/dance/listen.webp'),
  },
];
