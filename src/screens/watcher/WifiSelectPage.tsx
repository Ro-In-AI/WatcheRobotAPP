import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Path} from 'react-native-svg';
import {WatcherHeader} from '../../components/WatcherHeader';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';
import {STORAGE_KEYS} from '../../utils/storageKeys';
import type {RootStackParamList} from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
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
      d="M0 5.513L1.455 7.056C5.069 3.221 10.931 3.221 14.545 7.056L16 5.513C11.585 0.829 4.422 0.829 0 5.513ZM5.818 11.685L8 14L10.182 11.685C8.982 10.405 7.025 10.405 5.818 11.685ZM2.91 8.6L4.365 10.143C6.372 8.013 9.63 8.013 11.637 10.143L13.091 8.6C10.284 5.622 5.724 5.622 2.909 8.6H2.91Z"
      fill={active ? COLORS.green : '#000000'}
    />
  </Svg>
);

const RefreshIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4.16967 2.53792C4.20434 2.51659 4.23634 2.49592 4.26501 2.47659C5.36718 1.7298 6.66833 1.33146 7.99967 1.33326C11.6817 1.33326 14.6663 4.31792 14.6663 7.99992C14.6682 9.24711 14.3186 10.4696 13.6577 11.5273C13.6379 11.5589 13.6102 11.5847 13.5773 11.6024C13.5445 11.62 13.5076 11.6288 13.4703 11.6279C13.4331 11.6269 13.3967 11.6163 13.3648 11.597C13.3329 11.5777 13.3065 11.5505 13.2883 11.5179L11.6083 8.49526C11.5801 8.44452 11.5657 8.38729 11.5664 8.32923C11.5671 8.27118 11.5829 8.21431 11.6123 8.16427C11.6418 8.11422 11.6838 8.07274 11.7342 8.04391C11.7846 8.01508 11.8416 7.99992 11.8997 7.99992H13.333C13.3332 7.01395 13.0601 6.0472 12.544 5.20709C12.0279 4.36697 11.289 3.68636 10.4094 3.24086C9.52984 2.79537 8.54397 2.60242 7.56133 2.68346C6.57868 2.7645 5.63774 3.11635 4.84301 3.69992C4.77484 3.74994 4.69682 3.78488 4.61411 3.80242C4.5314 3.81996 4.44591 3.81971 4.36331 3.80168C4.28071 3.78364 4.20289 3.74824 4.13503 3.69783C4.06716 3.64741 4.01079 3.58313 3.96967 3.50926L3.93234 3.44259C3.84783 3.29024 3.82534 3.11117 3.86955 2.94265C3.91376 2.77414 4.02126 2.62917 4.16967 2.53792ZM11.7397 13.5199C10.6364 14.269 9.33319 14.6686 7.99967 14.6666C4.31767 14.6666 1.33301 11.6819 1.33301 7.99992C1.33301 6.75059 1.67701 5.58126 2.27434 4.58192C2.30013 4.53867 2.33685 4.50298 2.38082 4.47844C2.42479 4.45389 2.47444 4.44136 2.52479 4.4421C2.57514 4.44284 2.62441 4.45684 2.66763 4.48267C2.71085 4.5085 2.74651 4.54527 2.77101 4.58926L4.39101 7.50459C4.41922 7.55533 4.4337 7.61256 4.433 7.67062C4.4323 7.72867 4.41644 7.78554 4.38701 7.83558C4.35758 7.88563 4.31558 7.92711 4.26518 7.95594C4.21479 7.98477 4.15773 7.99993 4.09967 7.99992H2.66634C2.66632 8.98624 2.9398 9.95323 3.4564 10.7934C3.97299 11.6336 4.71245 12.3141 5.5926 12.7593C6.47274 13.2044 7.45908 13.3968 8.442 13.315C9.42491 13.2332 10.3659 12.8804 11.1603 12.2959C11.2303 12.2437 11.3104 12.2068 11.3955 12.1875C11.4806 12.1683 11.5688 12.1671 11.6544 12.184C11.74 12.201 11.821 12.2358 11.8923 12.286C11.9636 12.3363 12.0236 12.401 12.0683 12.4759C12.1652 12.6378 12.195 12.8311 12.1512 13.0146C12.1075 13.198 11.9938 13.3572 11.8343 13.4579C11.8029 13.4779 11.7718 13.4983 11.741 13.5193L11.7397 13.5199Z"
      fill="#5D6E7F"
    />
  </Svg>
);

const HiddenPasswordIcon: React.FC = () => (
  <Svg width={15} height={7} viewBox="0 0 15 7" fill="none">
    <Path
      d="M13.7964 1.004C13.8642 0.901827 13.892 0.778192 13.8743 0.656824C13.8565 0.535457 13.7946 0.424909 13.7004 0.3464C13.597 0.270148 13.468 0.237187 13.3408 0.254514C13.2135 0.271841 13.098 0.338092 13.0188 0.4392C12.9948 0.4624 10.2924 3.5416 7.06758 3.5416C3.94758 3.5416 1.11638 0.4392 1.09238 0.416C1.00451 0.325596 0.886373 0.27079 0.760603 0.262081C0.634833 0.253372 0.510271 0.291371 0.410779 0.3688C0.317572 0.450037 0.260232 0.564805 0.251242 0.688118C0.242252 0.811431 0.28234 0.933303 0.362779 1.0272C0.410779 1.0976 0.996378 1.7312 1.92678 2.4352L0.683579 3.6824C0.639748 3.72597 0.605408 3.77815 0.582718 3.83563C0.560027 3.89312 0.549477 3.95469 0.551731 4.01645C0.553985 4.07821 0.568995 4.13884 0.595816 4.19452C0.622636 4.25021 0.660688 4.29974 0.707579 4.34C0.755579 4.4328 0.875579 4.4792 0.995579 4.4792C1.12408 4.47738 1.24729 4.42776 1.34118 4.34L2.68118 3.0008C3.3706 3.46409 4.11706 3.83625 4.90198 4.108L4.38918 5.7784C4.31638 6.0344 4.46118 6.2976 4.73318 6.368H4.87878C4.98505 6.37017 5.0889 6.33611 5.17323 6.2714C5.25757 6.2067 5.31736 6.11521 5.34278 6.012L5.85638 4.34C6.25862 4.41416 6.66657 4.45298 7.07558 4.456C7.48459 4.45299 7.89254 4.41417 8.29478 4.34L8.80838 5.988C8.85638 6.1976 9.07238 6.344 9.27318 6.344C9.32118 6.344 9.36918 6.344 9.39318 6.3216C9.51906 6.289 9.62692 6.20789 9.69318 6.096C9.72512 6.04161 9.74558 5.98125 9.75328 5.91864C9.76099 5.85603 9.75578 5.79251 9.73798 5.732L9.22518 4.084C10.014 3.8128 10.7612 3.4408 11.4468 2.9784L12.762 4.2936C12.8189 4.34793 12.888 4.38799 12.9634 4.41051C13.0388 4.43303 13.1185 4.43736 13.1959 4.42316C13.2733 4.40895 13.3463 4.37661 13.4088 4.32879C13.4713 4.28096 13.5216 4.21901 13.5556 4.148C13.5943 4.06429 13.6073 3.971 13.5931 3.87989C13.5788 3.78878 13.538 3.70392 13.4756 3.636L12.2332 2.3888C12.8023 1.98451 13.3267 1.52055 13.7972 1.0048L13.7964 1.004Z"
      fill="#BABFC4"
      stroke="#BABFC4"
      strokeWidth="0.5"
    />
  </Svg>
);

const VisiblePasswordIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M7.9993 13C5.5553 13 3.3743 11.457 1.4623 8.444C1.37786 8.31131 1.33301 8.15728 1.33301 8C1.33301 7.84272 1.37786 7.68869 1.4623 7.556C3.3743 4.543 5.5553 3 7.9993 3C10.4443 3 12.6253 4.543 14.5373 7.556C14.6217 7.68869 14.6666 7.84272 14.6666 8C14.6666 8.15728 14.6217 8.31131 14.5373 8.444C12.6253 11.457 10.4443 13 7.9993 13ZM7.9993 4C5.9763 4 4.1013 5.31 2.3723 8C4.1023 10.69 5.9763 12 7.9993 12C10.0233 12 11.8973 10.69 13.6263 8C11.8973 5.31 10.0233 4 7.9993 4ZM7.9993 10.333C7.37781 10.3357 6.78069 10.0914 6.33926 9.65389C5.89783 9.21639 5.64821 8.6215 5.6453 8C5.64821 7.3785 5.89783 6.78361 6.33926 6.34611C6.78069 5.90862 7.37781 5.66434 7.9993 5.667C9.2993 5.667 10.3533 6.711 10.3533 8C10.3504 8.6215 10.1008 9.21639 9.65934 9.65389C9.21791 10.0914 8.6208 10.3357 7.9993 10.333ZM7.9993 9.333C8.35452 9.3346 8.69584 9.19508 8.94824 8.94512C9.20063 8.69517 9.34345 8.35522 9.3453 8C9.34345 7.64478 9.20063 7.30484 8.94824 7.05488C8.69584 6.80492 8.35452 6.6654 7.9993 6.667C7.64426 6.66567 7.3032 6.8053 7.05102 7.05523C6.79884 7.30516 6.65615 7.64496 6.6543 8C6.65615 8.35504 6.79884 8.69484 7.05102 8.94477C7.3032 9.1947 7.64426 9.33433 7.9993 9.333Z"
      fill="#BABFC4"
    />
  </Svg>
);

const PasswordDot: React.FC = () => (
  <Svg width={4} height={4} viewBox="0 0 4 4" fill="none">
    <Path d="M4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2Z" fill="#000000" />
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
  const visiblePasswordInputRef = useRef<TextInput>(null);
  const hiddenPasswordInputRef = useRef<TextInput>(null);
  const [selectedWifi, setSelectedWifi] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordKeyboardOffset, setPasswordKeyboardOffset] = useState(0);
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
  const sheetHeight = verticalScaleValue(320, 300, 320);
  const sheetCardTop = verticalScaleValue(20, 16, 20);
  const sheetActionTop = verticalScaleValue(28, 24, 28);
  const successCardWidth = Math.min(contentWidth, scaleValue(324, 304, 330));
  const getActivePasswordInput = () =>
    showPassword ? visiblePasswordInputRef.current : hiddenPasswordInputRef.current;

  const handleWifiPress = (wifiName: string) => {
    setSelectedWifi(wifiName);
    setPassword('');
    setShowPassword(false);
    setShowPasswordModal(true);
  };

  const handleConfirmPassword = () => {
    setShowPasswordModal(false);
    setShowSuccessModal(true);
  };

  const handleTogglePasswordVisibility = () => {
    const nextShowPassword = !showPassword;
    setShowPassword(nextShowPassword);

    requestAnimationFrame(() => {
      const target = nextShowPassword
        ? visiblePasswordInputRef.current
        : hiddenPasswordInputRef.current;
      target?.focus();
      target?.setNativeProps({
        selection: {start: password.length, end: password.length},
      });
    });
  };

  const handleStartUsing = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.hasCompletedInitialBinding,
        'true',
      );
    } catch {
      // 首次绑定标记写入失败时，不阻塞用户继续回到首页。
    }

    setShowSuccessModal(false);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          params: {connected: true},
          state: {
            index: 0,
            routes: [{name: 'Watcher', params: {connected: true}}],
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (!showPasswordModal) {
      passwordOverlayOpacity.setValue(0);
      passwordSheetTranslateY.setValue(28);
      setPasswordKeyboardOffset(0);
      return;
    }

    requestAnimationFrame(() => {
      const target = getActivePasswordInput();
      target?.focus();
      target?.setNativeProps({
        selection: {start: password.length, end: password.length},
      });
    });

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
  }, [
    passwordOverlayOpacity,
    passwordSheetTranslateY,
    showPasswordModal,
  ]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, event => {
      setPasswordKeyboardOffset(
        Math.max(0, event.endCoordinates.height - insets.bottom),
      );
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setPasswordKeyboardOffset(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

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
          <TouchableOpacity
            style={styles.overlayTapArea}
            activeOpacity={1}
            onPress={() => setShowPasswordModal(false)}
          />
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                height: sheetHeight,
                marginBottom: passwordKeyboardOffset,
                transform: [{translateY: passwordSheetTranslateY}],
              },
            ]}>
            <Text style={styles.sheetTitle}>Enter the password</Text>

            <View style={[styles.sheetCard, {marginTop: sheetCardTop}]}>
              <Text style={styles.sheetWifiName}>
                WiFi name : {selectedWifi ?? ''}
              </Text>

              {showPassword ? (
                <View style={styles.inputWrap}>
                  <TextInput
                    ref={visiblePasswordInputRef}
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      requestAnimationFrame(() => {
                        visiblePasswordInputRef.current?.setNativeProps({
                          selection: {start: text.length, end: text.length},
                        });
                      });
                    }}
                    onFocus={() => {
                      requestAnimationFrame(() => {
                        visiblePasswordInputRef.current?.setNativeProps({
                          selection: {start: password.length, end: password.length},
                        });
                      });
                    }}
                    placeholder=""
                    placeholderTextColor="#000000"
                    secureTextEntry={false}
                    autoFocus
                    autoCorrect={false}
                    spellCheck={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    selectionColor={COLORS.black}
                    style={styles.passwordInput}
                  />
                  <TouchableOpacity
                    style={styles.eyeHint}
                    activeOpacity={0.8}
                    onPress={handleTogglePasswordVisibility}>
                    <VisiblePasswordIcon />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.inputWrap}
                  activeOpacity={1}
                  onPress={() => hiddenPasswordInputRef.current?.focus()}>
                  <TextInput
                    ref={hiddenPasswordInputRef}
                    value={password}
                    onChangeText={setPassword}
                    placeholder=""
                    placeholderTextColor="#000000"
                    secureTextEntry
                    autoFocus
                    autoCorrect={false}
                    spellCheck={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    importantForAutofill="no"
                    selectionColor="transparent"
                    caretHidden
                    contextMenuHidden
                    style={styles.maskedPasswordInput}
                  />
                  <View style={styles.hiddenPasswordMask} pointerEvents="none" />
                  {password.length > 0 ? (
                    <View style={styles.passwordDots} pointerEvents="none">
                      {Array.from({length: password.length}).map((_, index) => (
                        <PasswordDot key={index} />
                      ))}
                    </View>
                  ) : null}
                  <View style={styles.hiddenPasswordPlaceholder} />
                  <TouchableOpacity
                    style={styles.eyeHint}
                    activeOpacity={0.8}
                    onPress={handleTogglePasswordVisibility}>
                    <HiddenPasswordIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}

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
  overlayTapArea: {
    flex: 1,
  },
  centerOverlay: {
    justifyContent: 'center',
  },
  bottomSheet: {
    position: 'relative',
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 34,
    alignItems: 'center',
    zIndex: 30,
    elevation: 30,
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
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.black,
    paddingVertical: 0,
    paddingRight: 44,
  },
  maskedPasswordInput: {
    position: 'absolute',
    left: 12,
    right: 52,
    top: 0,
    bottom: 0,
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 20,
    color: 'transparent',
    textShadowColor: 'transparent',
    backgroundColor: 'transparent',
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    zIndex: 0,
  },
  hiddenPasswordInput: {
    position: 'absolute',
    left: -9999,
    width: 1,
    height: 1,
    opacity: 0,
    color: 'transparent',
    textShadowColor: 'transparent',
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  hiddenPasswordPlaceholder: {
    flex: 1,
  },
  hiddenPasswordMask: {
    position: 'absolute',
    left: 12,
    right: 52,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.inputBg,
    zIndex: 1,
  },
  passwordDots: {
    position: 'absolute',
    left: 12,
    right: 52,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
    zIndex: 2,
  },
  eyeHint: {
    position: 'absolute',
    right: 8,
    top: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
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
