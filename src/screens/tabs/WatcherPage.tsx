import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Svg, Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AnimationIcon,
  DanceIcon,
  MotionIcon,
  SurveillanceIcon,
} from '../../components/icons';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';
import type {WatcherStackParamList} from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<WatcherStackParamList>;

const COLORS = {
  background: '#F5F5F9',
  white: '#FFFFFF',
  black: '#000000',
  green: '#8FC31F',
  grayIcon: '#363C44',
  statusRed: '#D20706',
  statusGray: '#8E959F',
  cardTitle: '#BABFC4',
  activeCardTitle: '#000000',
};

export const WatcherPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {windowWidth, scaleValue, verticalScaleValue} = useResponsiveScale();
  const navigation = useNavigation<NavigationProp>();
  const [isConnected, setIsConnected] = useState(false);

  // 页面主要尺寸按统一响应式规则换算
  const horizontalPadding = scaleValue(20, 18, 24);
  const contentWidth = windowWidth - horizontalPadding * 2;
  const heroWidth = Math.min(contentWidth, scaleValue(333, 308, 352));
  const gridGap = scaleValue(16, 14, 18);
  const cardWidth = (contentWidth - gridGap) / 2;
  const robotSize = Math.min(heroWidth * (196 / 333), scaleValue(196, 176, 210));
  const headerBottom = verticalScaleValue(30, 22, 34);
  const deviceGap = verticalScaleValue(16, 14, 18);
  const deviceBottom = verticalScaleValue(20, 16, 24);
  const buttonBottom = verticalScaleValue(32, 24, 38);
  const cardHeight = verticalScaleValue(116, 108, 122);
  const sectionTopPadding = verticalScaleValue(10, 8, 14);

  const cards = [
    {id: 'DANCE', title: 'DANCE', icon: DanceIcon},
    {id: 'MOTION', title: 'MOTION', icon: MotionIcon},
    {id: 'SURVEILLANCE', title: 'SURVEILLANCE', icon: SurveillanceIcon},
    {id: 'ANIMATION', title: 'ANOMATION', icon: AnimationIcon},
  ];

  return (
    <View style={[styles.container, {paddingTop: insets.top + sectionTopPadding}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: insets.bottom + verticalScaleValue(94, 84, 104),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* 顶部标题和通知入口 */}
        <View style={[styles.header, {marginBottom: headerBottom}]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              Wat<Text style={{color: COLORS.green}}>c</Text>her
            </Text>
            <View style={styles.triangleIcon} />
          </View>

          <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
            <Svg width={18} height={18} viewBox="0 0 14 16" fill="none">
              <Path
                d="M6.07725 14.0625L6.075 14.0873C6.07503 14.2473 6.13195 14.4022 6.23561 14.5242C6.33926 14.6462 6.4829 14.7274 6.64087 14.7533L6.75 14.7622C6.84076 14.7623 6.93061 14.7441 7.01416 14.7086C7.09771 14.6731 7.17325 14.6212 7.23627 14.5559C7.29928 14.4906 7.34847 14.4132 7.3809 14.3284C7.41333 14.2436 7.42833 14.1532 7.425 14.0625H8.4375C8.43729 14.4959 8.27035 14.9125 7.97129 15.2262C7.67223 15.5398 7.26396 15.7264 6.8311 15.7472C6.39823 15.768 5.97394 15.6215 5.64615 15.3381C5.31836 15.0546 5.11219 14.6558 5.07037 14.2245L5.0625 14.0625H6.07725ZM7.335 0V1.15538C8.71804 1.3 9.99849 1.95178 10.9292 2.98495C11.86 4.01812 12.375 5.35942 12.375 6.75V12.3739L13.5 12.375V13.5L12.375 13.4989V13.5H1.125V13.4989L0 13.5V12.375L1.125 12.3739V6.75C1.1249 5.35606 1.64238 4.01173 2.57711 2.97763C3.51185 1.94354 4.79725 1.29336 6.18413 1.15313L6.18525 0H7.335ZM6.75 2.25C5.55653 2.25 4.41193 2.72411 3.56802 3.56802C2.72411 4.41193 2.25 5.55653 2.25 6.75V12.3739H11.25V6.75C11.25 5.55653 10.7759 4.41193 9.93198 3.56802C9.08807 2.72411 7.94347 2.25 6.75 2.25Z"
                fill={COLORS.black}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* 中间设备主视觉和在线状态 */}
        <View
          style={[
            styles.heroSection,
            styles.deviceSection,
            {width: heroWidth, gap: deviceGap, marginBottom: deviceBottom},
          ]}>
          <Image
            source={require('../../assets/images/robot_watcher.png')}
            style={[styles.deviceImage, {width: robotSize, height: robotSize}]}
            resizeMode="contain"
          />

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: isConnected ? COLORS.green : COLORS.statusRed},
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? 'Online' : 'Device Offline'}
            </Text>
          </View>
        </View>

        {/* 设备连接按钮 */}
        <View
          style={[
            styles.heroSection,
            styles.buttonContainer,
            {width: heroWidth, marginBottom: buttonBottom},
          ]}>
          <TouchableOpacity
            style={[
              styles.connectButton,
              isConnected && styles.connectButtonDisabled,
            ]}
            onPress={() => setIsConnected(!isConnected)}
            activeOpacity={0.85}>
            <Text style={styles.connectButtonText}>
              {isConnected ? 'Disconnect' : 'Connect the device'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 底部功能入口卡片 */}
        <View style={[styles.gridContainer, {columnGap: gridGap}]}>
          {cards.map(card => {
            const IconComponent = card.icon;
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.gridCard, {width: cardWidth, height: cardHeight}]}
                activeOpacity={0.85}
                onPress={() => {
                  const routeName: keyof WatcherStackParamList =
                    card.id === 'DANCE'
                      ? 'Dance'
                      : card.id === 'MOTION'
                        ? 'Motion'
                        : card.id === 'SURVEILLANCE'
                          ? 'Surveillance'
                          : 'Animation';
                  navigation.navigate(routeName);
                }}>
                <Text
                  style={[
                    styles.cardTitle,
                    {color: isConnected ? COLORS.activeCardTitle : COLORS.cardTitle},
                  ]}>
                  {card.title}
                </Text>
                <View style={styles.cardIconBg}>
                  <IconComponent
                    size={26}
                    color={isConnected ? COLORS.green : COLORS.cardTitle}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.3,
  },
  triangleIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.grayIcon,
    transform: [{rotate: '-90deg'}],
  },
  bellButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignSelf: 'center',
  },
  deviceSection: {
    alignItems: 'center',
  },
  deviceImage: {
    alignSelf: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.statusGray,
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  connectButton: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: COLORS.green,
  },
  connectButtonDisabled: {
    backgroundColor: '#E1E1E7',
  },
  connectButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 16,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
    width: '100%',
  },
  gridCard: {
    height: 116,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  cardIconBg: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3F5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cardTitle,
    lineHeight: 16,
  },
});
