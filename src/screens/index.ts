// 底部 Tab 的四个主入口页面。
export { WatcherPage } from './tabs/WatcherPage';
export { NearbyPage } from './tabs/NearbyPage';
export { MomentsPage } from './tabs/MomentsPage';
export { UserPage } from './tabs/UserPage';

// Watcher 业务下的子流程页面，例如配网、通知、扫码和访问会话等。
export {
  MotionPage,
  DancePage,
  SurveillancePage,
  AnimationPage,
  BindingGuidePage,
  ScanCodePage,
  WifiSelectPage,
  NotificationPage,
  VisitSessionPage,
} from './watcher';

// 历史旧页面，仅保留作参考，不参与当前主流程。
export { OldBluetoothPage } from './legacy/OldBluetoothPage';
export { OldMotionPage } from './legacy/OldMotionPage';
export { OldControlPage } from './legacy/OldControlPage';
export { WatcherPage as OldWatcherPage } from './legacy/OldWatcherPage';
