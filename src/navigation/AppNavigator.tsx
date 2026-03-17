import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { WatcherIcon, NearbyIcon, MomentsIcon, UserIcon } from './TabBarIcons';

import {
  WatcherPage,
  NearbyPage,
  MomentsPage,
  UserPage,
} from '../screens';
import { DancePage } from '../screens/DancePage';

// Stack Navigator 参数类型
export type WatcherStackParamList = {
  WatcherHome: undefined;
  Dance: undefined;
};

// 导航参数类型
export type RootTabParamList = {
  Watcher: undefined;
  Nearby: undefined;
  Moments: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<WatcherStackParamList>();

const Tab = createBottomTabNavigator<RootTabParamList>();

// 从设计稿提取的精确颜色值
const COLORS = {
  active: '#8FC31F',      // 选中状态：绿色
  inactive: '#9FA2A6',    // 未选中状态：灰色
  background: '#FFFFFF',  // Tab Bar 背景色：白色
  activeBg: '#F3F5F8',    // 选中 Tab 背景色：浅灰
};

// Tab 配置 - 使用 SVG 图标组件
const TAB_CONFIG = [
  { label: 'Watcher', icon: WatcherIcon },
  { label: 'Nearby', icon: NearbyIcon },
  { label: 'Moments', icon: MomentsIcon },
  { label: 'User', icon: UserIcon },
];

/**
 * 自定义 Tab Bar 组件
 * 完全还原设计稿样式：悬浮式胶囊导航栏
 * 使用 react-native-shadow-2 实现跨平台柔和阴影
 * 使用 SVG 图标组件，支持动态颜色
 * 当在深层页面时自动隐藏
 */
const CustomTabBar: React.FC<any> = (props) => {
  const { state, navigation } = props;

  // 检查是否应该隐藏 Tab Bar
  const shouldHideTabBar = () => {
    try {
      // 获取当前选中的 Tab
      const currentTab = state.routes[state.index];

      // 只处理 Watcher Tab
      if (currentTab.name === 'Watcher' && currentTab.state) {
        // Watcher Tab 有一个嵌套的 Stack Navigator
        // 检查 Stack 的当前索引，大于 0 表示在深层页面
        const stackIndex = currentTab.state.index;
        return stackIndex > 0;
      }
    } catch (e) {
      console.log('TabBar check error:', e);
    }
    return false;
  };

  if (shouldHideTabBar()) {
    return null;
  }

  return (
    <View style={styles.floatingContainer}>
      {/* 设计稿阴影：0 0 27px 0 rgba(0, 0, 0, 0.05) */}
      <Shadow
        distance={27}
        startColor="rgba(0, 0, 0, 0.05)"
        endColor="rgba(0, 0, 0, 0)"
        offset={[0, 0]}
        style={{ width: '100%' }} // 强制撑满宽度
      >
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const tabConfig = TAB_CONFIG[index];
            const IconComponent = tabConfig.icon;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <View key={route.key} style={styles.tabItemWrapper}>
                <TouchableOpacity
                  style={styles.tabButton}
                  onPress={onPress}
                  activeOpacity={0.7}
                >
                  {/* 选中状态的浅绿色背景块 */}
                  {isFocused && <View style={styles.activeBackground} />}

                  {/* SVG 图标和文字 */}
                  <View style={styles.tabContent}>
                    <IconComponent
                      color={isFocused ? COLORS.active : COLORS.inactive}
                      size={20}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: isFocused ? COLORS.active : COLORS.inactive },
                      ]}
                    >
                      {tabConfig.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </Shadow>
    </View>
  );
};

// Watcher Stack Navigator - 支持页面跳转
const WatcherStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WatcherHome" component={WatcherPage} />
      <Stack.Screen name="Dance" component={DancePage} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Watcher" component={WatcherStack} />
        <Tab.Screen name="Nearby" component={NearbyPage} />
        <Tab.Screen name="Moments" component={MomentsPage} />
        <Tab.Screen name="User" component={UserPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // ===== 悬浮式胶囊导航栏容器 =====
  // 设计稿参数：position: absolute, bottom: 34, left: 20, right: 20
  floatingContainer: {
    position: 'absolute',
    bottom: 34, // 设计稿底部安全距离
    left: 0,
    right: 0,
    marginHorizontal: 20, // 设计稿左右边距
    backgroundColor: 'transparent',
  },

  // ===== Tab Bar 主体 =====
  // 设计稿参数：height: 54, padding: 4, borderRadius: 30
  tabBar: {
    flexDirection: 'row',
    width: '100%', // 强制撑满宽度
    height: 54, // 设计稿高度
    backgroundColor: COLORS.background, // '#FFF'
    borderRadius: 30, // 设计稿圆角
    padding: 4, // 设计稿内边距
    borderWidth: 0,
    borderTopWidth: 0, // 消除系统自带顶部灰线
    gap: 4, // Tab 之间的间隙
  },

  // ===== Tab 项包装器 =====
  tabItemWrapper: {
    flex: 1, // 均匀分布
  },

  // ===== Tab 按钮 =====
  tabButton: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // 用于绝对定位背景块
  },

  // ===== 选中状态的浅绿色背景块 =====
  activeBackground: {
    position: 'absolute',
    width: '100%',
    height: 46,
    backgroundColor: COLORS.activeBg,
    borderRadius: 23,
  },

  // ===== Tab 内容（图标+文字） =====
  tabContent: {
    alignItems: 'center',
    gap: 2, // 图标与文字的间距
    zIndex: 1, // 确保在背景块之上
  },

  // ===== Tab 文字 =====
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
