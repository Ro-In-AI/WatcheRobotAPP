import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Svg, Path} from 'react-native-svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AnimationIcon,
  DanceIcon,
  MotionIcon,
  SurveillanceIcon,
} from '../../components/icons';
import {bluetoothService} from '../../modules/bluetooth';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';
import type {WatcherStackParamList} from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<WatcherStackParamList>;
type RouteProps = RouteProp<WatcherStackParamList, 'WatcherHome'>;

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
  overlay: 'rgba(0, 0, 0, 0.65)',
};

type FailureType = 'bluetooth' | 'wifi' | null;

const LoadingSpinner: React.FC = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      rotateValue.setValue(0);
    };
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate}]}}>
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Path
          d="M7 0.875C7.36244 0.875 7.65625 1.16881 7.65625 1.53125V2.84375C7.65625 3.20619 7.36244 3.5 7 3.5C6.63756 3.5 6.34375 3.20619 6.34375 2.84375V1.53125C6.34375 1.16881 6.63756 0.875 7 0.875Z"
          fill="white"
        />
        <Path
          d="M7 10.5C7.36244 10.5 7.65625 10.7938 7.65625 11.1562V12.4688C7.65625 12.8312 7.36244 13.125 7 13.125C6.63756 13.125 6.34375 12.8312 6.34375 12.4688V11.1562C6.34375 10.7938 6.63756 10.5 7 10.5Z"
          fill="white"
          fillOpacity="0.35"
        />
        <Path
          d="M0.875 7C0.875 6.63756 1.16881 6.34375 1.53125 6.34375H2.84375C3.20619 6.34375 3.5 6.63756 3.5 7C3.5 7.36244 3.20619 7.65625 2.84375 7.65625H1.53125C1.16881 7.65625 0.875 7.36244 0.875 7Z"
          fill="white"
          fillOpacity="0.7"
        />
        <Path
          d="M10.5 7C10.5 6.63756 10.7938 6.34375 11.1562 6.34375H12.4688C12.8312 6.34375 13.125 6.63756 13.125 7C13.125 7.36244 12.8312 7.65625 12.4688 7.65625H11.1562C10.7938 7.65625 10.5 7.36244 10.5 7Z"
          fill="white"
          fillOpacity="0.15"
        />
        <Path
          d="M2.88775 2.88775C3.144 2.6315 3.5595 2.6315 3.81575 2.88775L4.74387 3.81587C5.00012 4.07212 5.00012 4.48763 4.74387 4.74387C4.48763 5.00012 4.07212 5.00012 3.81587 4.74387L2.88775 3.81575C2.6315 3.5595 2.6315 3.144 2.88775 2.88775Z"
          fill="white"
          fillOpacity="0.85"
        />
        <Path
          d="M9.25613 9.25613C9.51237 8.99988 9.92788 8.99988 10.1841 9.25613L11.1122 10.1842C11.3685 10.4405 11.3685 10.856 11.1122 11.1122C10.856 11.3685 10.4405 11.3685 10.1842 11.1122L9.25613 10.1841C8.99988 9.92788 8.99988 9.51237 9.25613 9.25613Z"
          fill="white"
          fillOpacity="0.25"
        />
        <Path
          d="M9.25613 4.74387C8.99988 4.48763 8.99988 4.07212 9.25613 3.81587L10.1842 2.88775C10.4405 2.6315 10.856 2.6315 11.1122 2.88775C11.3685 3.144 11.3685 3.5595 11.1122 3.81575L10.1841 4.74387C9.92788 5.00012 9.51237 5.00012 9.25613 4.74387Z"
          fill="white"
          fillOpacity="0.5"
        />
        <Path
          d="M2.88775 11.1122C2.6315 10.856 2.6315 10.4405 2.88775 10.1842L3.81587 9.25613C4.07212 8.99988 4.48763 8.99988 4.74387 9.25613C5.00012 9.51237 5.00012 9.92788 4.74387 10.1841L3.81575 11.1122C3.5595 11.3685 3.144 11.3685 2.88775 11.1122Z"
          fill="white"
          fillOpacity="0.6"
        />
      </Svg>
    </Animated.View>
  );
};

export const WatcherPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {windowWidth, scaleValue, verticalScaleValue} = useResponsiveScale();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [failureType, setFailureType] = useState<FailureType>(null);

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

  useEffect(() => {
    if (route.params?.connected) {
      setFailureType(null);
      setIsConnecting(false);
      setIsConnected(true);
      navigation.setParams({connected: undefined});
    }
  }, [navigation, route.params?.connected]);

  const wait = (ms: number): Promise<void> =>
    new Promise(resolve => {
      const timer = setTimeout(resolve, ms);
      return () => clearTimeout(timer);
    });

  const checkWifiReady = async () => {
    try {
      await Promise.race([
        fetch('https://www.baidu.com/favicon.ico', {
          method: 'GET',
        }),
        wait(2500).then(() => {
          throw new Error('wifi-timeout');
        }),
      ]);
      return true;
    } catch {
      return false;
    }
  };

  const handleConnectPress = async () => {
    if (isConnecting) {
      return;
    }

    if (isConnected) {
      setIsConnected(false);
      return;
    }

    setFailureType(null);
    setIsConnecting(true);

    try {
      await wait(700);
      const bluetoothState = await bluetoothService.getAdapterState();

      if (bluetoothState !== 'PoweredOn') {
        setFailureType('bluetooth');
        return;
      }

      const wifiReady = await checkWifiReady();
      if (!wifiReady) {
        setFailureType('wifi');
        return;
      }

      await wait(900);
      setIsConnected(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const failureCopy =
    failureType === 'bluetooth'
      ? {
          description:
            'Connection failed. Please turn on the Bluetooth on your mobile phone.',
          action: 'Go now',
        }
      : {
          description: 'Connection failed. Please turn on WIFI.',
          action: 'Go now',
        };

  const cards = [
    {id: 'DANCE', title: 'DANCE', icon: DanceIcon},
    {id: 'MOTION', title: 'MOTION', icon: MotionIcon},
    {id: 'SURVEILLANCE', title: 'SURVEILLANCE', icon: SurveillanceIcon},
    {id: 'ANIMATION', title: 'ANIMATION', icon: AnimationIcon},
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
            onPress={handleConnectPress}
            onLongPress={() => navigation.navigate('BindingGuide')}
            activeOpacity={0.85}>
            {isConnecting ? (
              <View style={styles.loadingContent}>
                <LoadingSpinner />
                <Text style={styles.connectButtonText}>Connect the device</Text>
              </View>
            ) : (
              <Text style={styles.connectButtonText}>
                {isConnected ? 'Disconnect' : 'Connect the device'}
              </Text>
            )}
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
                activeOpacity={isConnected && !isConnecting ? 0.85 : 1}
                disabled={!isConnected || isConnecting}
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

      <Modal
        visible={failureType !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setFailureType(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Text style={styles.modalIconText}>!</Text>
            </View>
            <Text style={styles.modalTitle}>Connection Failed</Text>
            <Text style={styles.modalDescription}>{failureCopy.description}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                activeOpacity={0.85}
                onPress={() => setFailureType(null)}>
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                activeOpacity={0.85}
                onPress={() => {
                  setFailureType(null);
                  navigation.navigate('BindingGuide');
                }}>
                <Text style={styles.modalPrimaryText}>{failureCopy.action}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  modalCard: {
    width: '100%',
    maxWidth: 324,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#DCE1E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIconText: {
    fontFamily: 'Inter',
    fontSize: 44,
    lineHeight: 44,
    fontWeight: '700',
    color: COLORS.white,
  },
  modalTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 12,
  },
  modalDescription: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: '#636A74',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 264,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
  },
  modalSecondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#F5F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrimaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '600',
    color: COLORS.green,
  },
  modalPrimaryText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});
