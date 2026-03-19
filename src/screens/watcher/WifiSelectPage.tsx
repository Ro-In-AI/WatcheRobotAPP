import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Path} from 'react-native-svg';
import {WatcherHeader} from '../../components/WatcherHeader';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';
import type {WatcherStackParamList} from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<
  WatcherStackParamList,
  'WifiSelect'
>;

const COLORS = {
  background: '#F5F5F9',
  white: '#FFFFFF',
  black: '#000000',
  green: '#8FC31F',
  overlay: 'rgba(0, 0, 0, 0.65)',
  line: '#EFF0F1',
  subText: '#8E959F',
  bodySubText: '#636A74',
  inputBg: '#F5F5F9',
};

const wifiOptions = [
  'Innoxsz-2.4G',
  'Innoxsz-Public',
  'Meeting MG',
  'Innoxsz-Guest',
  'Innoxsz-Office',
  'Erroright_5G',
  'PETPA2.4G',
  'PETPA5G',
];

const WifiIcon: React.FC<{active?: boolean}> = ({active = false}) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M1.99805 5.99967C5.45793 2.85407 10.5408 2.85407 14.0007 5.99967"
      stroke={active ? COLORS.green : '#000000'}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path
      d="M4.33398 8.33333C6.4936 6.42619 9.50706 6.42619 11.6667 8.33333"
      stroke={active ? COLORS.green : '#000000'}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path
      d="M6.66602 10.6663C7.46233 10.0184 8.5377 10.0184 9.33402 10.6663"
      stroke={active ? COLORS.green : '#000000'}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Circle cx="8.00065" cy="13.0007" r="1.33333" fill={active ? COLORS.green : '#000000'} />
  </Svg>
);

const RefreshIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M13.3333 8.00004C13.3333 10.9456 10.9455 13.3334 7.99996 13.3334C5.89046 13.3334 4.06706 12.1088 3.20044 10.3334"
      stroke="#63728A"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <Path
      d="M2.66667 8.00004C2.66667 5.05452 5.05448 2.66671 8 2.66671C10.1095 2.66671 11.9329 3.89129 12.7995 5.66671"
      stroke="#63728A"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <Path
      d="M11.7334 5.73334H12.8001V4.66667"
      stroke="#63728A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.2666 10.2667H3.19993V11.3334"
      stroke="#63728A"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SuccessDecoration: React.FC = () => (
  <Svg width={132} height={84} viewBox="0 0 132 84" fill="none">
    <Circle cx="66" cy="40" r="33" fill="#8FC31F" />
    <Path
      d="M51 39.5L61.5 50L82 28.5"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M13 45L0 51L13 57" fill="#8FC31F" />
    <Path d="M20 53L33 37" stroke="#3A94D8" strokeWidth="4" strokeLinecap="round" />
    <Path d="M119 29L132 17" stroke="#F0B14B" strokeWidth="4" strokeLinecap="round" />
    <Path d="M104 44L116 51" fill="#2E8ED5" />
    <Path
      d="M15 12L18 18L25 19L20 24L21 31L15 28L9 31L10 24L5 19L12 18L15 12Z"
      fill="#F0B14B"
    />
    <Path
      d="M113 53L115 58L120 60L115 62L113 67L111 62L106 60L111 58L113 53Z"
      fill="#2E8ED5"
    />
    <Circle cx="101" cy="8" r="4" fill="#8FC31F" />
  </Svg>
);

export const WifiSelectPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const {scaleValue, verticalScaleValue, windowWidth} = useResponsiveScale();
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const passwordOverlayOpacity = useRef(new Animated.Value(0)).current;
  const passwordSheetTranslateY = useRef(new Animated.Value(28)).current;
  const successOverlayOpacity = useRef(new Animated.Value(0)).current;
  const successCardScale = useRef(new Animated.Value(0.96)).current;

  // 页面主要尺寸按统一响应式规则换算
  const horizontalPadding = scaleValue(20, 18, 24);
  const contentWidth = windowWidth - horizontalPadding * 2;
  const cardWidth = Math.min(contentWidth, scaleValue(353, 326, 360));
  const sideInset = scaleValue(30, 24, 30);
  const cardTop = verticalScaleValue(13, 10, 16);
  const rowHeight = verticalScaleValue(48, 44, 48);
  const sheetHeight = verticalScaleValue(304, 286, 304);
  const sheetCardTop = verticalScaleValue(24, 20, 24);
  const sheetActionTop = verticalScaleValue(32, 28, 32);
  const successCardWidth = Math.min(contentWidth, scaleValue(324, 304, 330));

  const handleWifiPress = (wifiName: string) => {
    setSelectedWifi(wifiName);
    setPassword('');
    setShowPasswordModal(true);
  };

  const handleConfirmPassword = () => {
    setShowPasswordModal(false);
    setShowSuccessModal(true);
  };

  const handleStartUsing = () => {
    setShowSuccessModal(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'WatcherHome', params: {connected: true}}],
    });
  };

  useEffect(() => {
    if (!showPasswordModal) {
      passwordOverlayOpacity.setValue(0);
      passwordSheetTranslateY.setValue(28);
      return;
    }

    Animated.parallel([
      Animated.timing(passwordOverlayOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(passwordSheetTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [passwordOverlayOpacity, passwordSheetTranslateY, showPasswordModal]);

  useEffect(() => {
    if (!showSuccessModal) {
      successOverlayOpacity.setValue(0);
      successCardScale.setValue(0.96);
      return;
    }

    Animated.parallel([
      Animated.timing(successOverlayOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(successCardScale, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [showSuccessModal, successCardScale, successOverlayOpacity]);

  return (
    <View style={styles.safeArea}>
      <View style={[styles.statusBarSpacer, {height: insets.top}]} />
      <View style={styles.container}>
        <WatcherHeader
          title="Bluetooth pairing"
          onBack={() => navigation.goBack()}
          sideInset={sideInset}
          backgroundColor={COLORS.white}
        />

        <View
          style={[
            styles.listCard,
            {
              width: cardWidth,
              marginTop: cardTop,
              minHeight: verticalScaleValue(458, 420, 458),
            },
          ]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Select Wi-Fi</Text>
            <View style={styles.refreshIconWrap}>
              <RefreshIcon />
            </View>
          </View>
          <Text style={styles.cardSubtitle}>Only supports 2.4GHz Wi-Fi</Text>

          <View style={styles.listWrap}>
            {wifiOptions.map((wifiName, index) => {
              const active = wifiName === 'PETPA5G';
              return (
                <TouchableOpacity
                  key={wifiName}
                  style={[
                    styles.wifiRow,
                    {minHeight: rowHeight},
                    index === wifiOptions.length - 1 && styles.lastWifiRow,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleWifiPress(wifiName)}>
                  <View style={styles.wifiLeft}>
                    <WifiIcon active={active} />
                    <Text style={styles.wifiName}>{wifiName}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Modal
          visible={showPasswordModal}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={() => setShowPasswordModal(false)}>
          <Animated.View
            style={[
              styles.overlay,
              {opacity: passwordOverlayOpacity},
            ]}>
            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  height: sheetHeight,
                  transform: [{translateY: passwordSheetTranslateY}],
                },
              ]}>
              <Text style={styles.sheetTitle}>Enter the password</Text>

              <View style={[styles.sheetCard, {marginTop: sheetCardTop}]}>
                <Text style={styles.sheetWifiName}>
                  WiFi name : {selectedWifi ?? ''}
                </Text>

                <View style={styles.inputWrap}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="........"
                    placeholderTextColor="#000000"
                    secureTextEntry
                    style={styles.passwordInput}
                  />
                  <Text style={styles.eyeHint}>••</Text>
                </View>

                <View style={[styles.sheetActions, {marginTop: sheetActionTop}]}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    activeOpacity={0.85}
                    onPress={() => setShowPasswordModal(false)}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={0.85}
                    onPress={handleConfirmPassword}>
                    <Text style={styles.primaryButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>

        <Modal
          visible={showSuccessModal}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={() => setShowSuccessModal(false)}>
          <Animated.View
            style={[
              styles.overlay,
              styles.centerOverlay,
              {opacity: successOverlayOpacity},
            ]}>
            <Animated.View
              style={[
                styles.successCard,
                {
                  width: successCardWidth,
                  transform: [{scale: successCardScale}],
                },
              ]}>
              <SuccessDecoration />
              <Text style={styles.successTitle}>Connection successful</Text>
              <Text style={styles.successDescription}>
                Connected device: Watcher 0123
              </Text>

              <TouchableOpacity
                style={styles.successButton}
                activeOpacity={0.85}
                onPress={handleStartUsing}>
                <Text style={styles.successButtonText}>Start using</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statusBarSpacer: {
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  listCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 18,
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
  refreshIconWrap: {
    position: 'absolute',
    right: 0,
    top: 1,
  },
  cardSubtitle: {
    marginTop: 12,
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '400',
    color: COLORS.subText,
    textAlign: 'center',
  },
  listWrap: {
    marginTop: 32,
  },
  wifiRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    justifyContent: 'center',
  },
  lastWifiRow: {
    borderBottomWidth: 0,
  },
  wifiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 14,
  },
  wifiName: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  centerOverlay: {
    justifyContent: 'center',
  },
  bottomSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 34,
    alignItems: 'center',
  },
  sheetTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
  sheetCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sheetWifiName: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  inputWrap: {
    marginTop: 16,
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    color: COLORS.black,
    paddingVertical: 0,
  },
  eyeHint: {
    fontSize: 12,
    color: '#B3B7BD',
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    width: '47.5%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.green,
  },
  primaryButton: {
    width: '47.5%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  successCard: {
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 28,
  },
  successTitle: {
    marginTop: 24,
    fontFamily: 'Inter',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
  successDescription: {
    marginTop: 12,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: COLORS.bodySubText,
    textAlign: 'center',
  },
  successButton: {
    marginTop: 24,
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
