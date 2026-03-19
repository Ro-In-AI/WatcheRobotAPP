import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MomentsIcon, NearbyIcon, UserIcon, WatcherIcon} from './TabBarIcons';

import {
  AnimationPage,
  DancePage,
  MomentsPage,
  MotionPage,
  NearbyPage,
  SurveillancePage,
  UserPage,
  WatcherPage,
} from '../screens';

export type WatcherStackParamList = {
  WatcherHome: undefined;
  Dance: undefined;
  Motion: undefined;
  Surveillance: undefined;
  Animation: undefined;
};

export type RootTabParamList = {
  Watcher: undefined;
  Nearby: undefined;
  Moments: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<WatcherStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const COLORS = {
  active: '#8FC31F',
  inactive: '#9FA2A6',
  background: '#FFFFFF',
  activeBg: '#F3F5F8',
};

const TAB_CONFIG = [
  {label: 'Watcher', icon: WatcherIcon},
  {label: 'Nearby', icon: NearbyIcon},
  {label: 'Moments', icon: MomentsIcon},
  {label: 'User', icon: UserIcon},
];

const CustomTabBar: React.FC<any> = props => {
  const {state, navigation} = props;
  const insets = useSafeAreaInsets();

  const shouldHideTabBar = () => {
    try {
      const currentTab = state.routes[state.index];

      if (currentTab.name === 'Watcher' && currentTab.state) {
        return currentTab.state.index > 0;
      }
    } catch (error) {
      console.log('TabBar check error:', error);
    }

    return false;
  };

  if (shouldHideTabBar()) {
    return null;
  }

  const tabBarContent = (
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
              activeOpacity={0.7}>
              {isFocused && <View style={styles.activeBackground} />}

              <View style={styles.tabContent}>
                <IconComponent
                  color={isFocused ? COLORS.active : COLORS.inactive}
                  size={20}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {color: isFocused ? COLORS.active : COLORS.inactive},
                  ]}>
                  {tabConfig.label}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.floatingContainer, {bottom: insets.bottom + 8}]}>
      {tabBarContent}
    </View>
  );
};

const WatcherStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="WatcherHome" component={WatcherPage} />
      <Stack.Screen name="Dance" component={DancePage} />
      <Stack.Screen name="Motion" component={MotionPage} />
      <Stack.Screen name="Surveillance" component={SurveillancePage} />
      <Stack.Screen name="Animation" component={AnimationPage} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="Watcher" component={WatcherStack} />
        <Tab.Screen name="Nearby" component={NearbyPage} />
        <Tab.Screen name="Moments" component={MomentsPage} />
        <Tab.Screen name="User" component={UserPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    backgroundColor: COLORS.background,
    borderRadius: 30,
    padding: 4,
    borderWidth: 0,
    borderTopWidth: 0,
    gap: 4,
    shadowColor: '#000000',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {width: 0, height: 0},
    elevation: 0,
  },
  tabItemWrapper: {
    flex: 1,
  },
  tabButton: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    width: '100%',
    height: 46,
    backgroundColor: COLORS.activeBg,
    borderRadius: 23,
  },
  tabContent: {
    alignItems: 'center',
    gap: 2,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
