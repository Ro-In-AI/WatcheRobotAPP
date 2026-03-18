import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DanceIcon, MotionIcon, SurveillanceIcon, AnimationIcon } from '../../components/icons';
import { useBluetooth } from '../../modules/bluetooth/hooks/useBluetooth';
import { BluetoothStatus, WifiProvisioningStatus } from '../../modules/bluetooth/types';
import type { WatcherStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<WatcherStackParamList>;

const COLORS = {
  background: '#F5F5F9',
  white: '#FFFFFF',
  black: '#000000',
  green: '#8FC31F',
  grayIcon: '#363C44',
  statusRed: '#D20706',
  statusGray: '#8E959F',
  cardTitle: '#636A74',
};

const INITIAL_WIFI_STATUS: WifiProvisioningStatus = {
  state: 'idle',
  message: 'Connect the device to configure WiFi',
  raw: '',
};

export const WatcherPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const {
    status,
    deviceInfo,
    receivedData,
    error,
    initialize,
    connectToConfiguredDevice,
    disconnect,
    subscribeToProvisioningStatus,
    requestWifiStatus,
    configureWifi,
    clearWifiCredentials,
    clearError,
  } = useBluetooth();
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiStatus, setWifiStatus] = useState<WifiProvisioningStatus>(INITIAL_WIFI_STATUS);
  const [isSubmittingWifi, setIsSubmittingWifi] = useState(false);
  const [lastBleMessage, setLastBleMessage] = useState('No BLE status yet');
  const lastAlertStateRef = useRef<WifiProvisioningStatus['state']>('idle');

  const cards = [
    { id: 'DANCE', title: 'DANCE', icon: DanceIcon },
    { id: 'MOTION', title: 'MOTION', icon: MotionIcon },
    { id: 'SURVEILLANCE', title: 'SURVEILLANCE', icon: SurveillanceIcon },
    { id: 'ANIMATION', title: 'ANIMATION', icon: AnimationIcon },
  ];

  const isConnected = status === BluetoothStatus.Connected;
  const isConnecting =
    status === BluetoothStatus.Connecting || status === BluetoothStatus.Scanning;
  const connectButtonLabel = isConnected
    ? 'Disconnect'
    : isConnecting
      ? 'Connecting...'
      : 'Connect the device';
  const wifiStatusLabel = useMemo(() => {
    switch (wifiStatus.state) {
      case 'connected':
        return wifiStatus.ip
          ? `Connected to ${wifiStatus.ssid || 'WiFi'} (${wifiStatus.ip})`
          : `Connected to ${wifiStatus.ssid || 'WiFi'}`;
      case 'connecting':
        return `Connecting to ${wifiStatus.ssid || 'WiFi'}...`;
      case 'unconfigured':
        return 'WiFi is not configured yet';
      case 'disconnected':
        return wifiStatus.ssid
          ? `Disconnected from ${wifiStatus.ssid}`
          : 'WiFi disconnected';
      case 'cleared':
        return 'Saved WiFi credentials cleared';
      default:
        return wifiStatus.message;
    }
  }, [wifiStatus]);

  useEffect(() => {
    initialize().catch(() => {});
  }, [initialize]);

  useEffect(() => {
    if (!error) {
      return;
    }

    setWifiStatus({
      state: 'error',
      message: error.message,
      raw: error.message,
    });
  }, [error]);

  useEffect(() => {
    if (!receivedData || typeof receivedData === 'string') {
      return;
    }

    if (typeof receivedData.data === 'string' && receivedData.data.trim()) {
      setLastBleMessage(receivedData.data.trim());
    }
  }, [receivedData]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    const unsubscribe = subscribeToProvisioningStatus(nextStatus => {
      setWifiStatus(nextStatus);
    });

    requestWifiStatus().catch(() => {});
    return unsubscribe;
  }, [isConnected, requestWifiStatus, subscribeToProvisioningStatus]);

  useEffect(() => {
    if (!isConnected || wifiStatus.state !== 'connecting') {
      return;
    }

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      requestWifiStatus().catch(() => {});
      if (attempts >= 5) {
        clearInterval(timer);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isConnected, requestWifiStatus, wifiStatus.state]);

  useEffect(() => {
    if (wifiStatus.state === lastAlertStateRef.current) {
      return;
    }

    lastAlertStateRef.current = wifiStatus.state;

    if (wifiStatus.state === 'connected') {
      Alert.alert(
        'WiFi Connected',
        wifiStatus.ip
          ? `${wifiStatus.ssid || 'WiFi'} connected\nIP: ${wifiStatus.ip}`
          : `${wifiStatus.ssid || 'WiFi'} connected`,
      );
    } else if (wifiStatus.state === 'disconnected') {
      Alert.alert(
        'WiFi Failed',
        wifiStatus.ssid
          ? `Failed to connect to ${wifiStatus.ssid}. Check the password and try again.`
          : 'WiFi connection failed. Please try again.',
      );
    } else if (wifiStatus.state === 'error') {
      Alert.alert('WiFi Error', wifiStatus.message);
    }
  }, [wifiStatus]);

  const handleConnectPress = async () => {
    if (isConnected) {
      await disconnect();
      setWifiStatus({
        state: 'idle',
        message: 'Device disconnected',
        raw: 'Device disconnected',
      });
      return;
    }

    clearError();
    setWifiStatus(INITIAL_WIFI_STATUS);
    try {
      await connectToConfiguredDevice();
    } catch {
      // hook already updates error state
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await requestWifiStatus();
    } catch {
      // hook already updates error state
    }
  };

  const handleConfigureWifi = async () => {
    const ssid = wifiSsid.trim();
    if (!ssid) {
      Alert.alert('Missing WiFi name', 'Please enter the WiFi SSID.');
      return;
    }

    setIsSubmittingWifi(true);
    try {
      await configureWifi({
        ssid,
        password: wifiPassword,
      });
      setWifiStatus({
        state: 'connecting',
        message: `Connecting to ${ssid}...`,
        raw: `WIFI_CONNECTING:${ssid}`,
        ssid,
      });
    } catch {
      // hook already updates error state
    } finally {
      setIsSubmittingWifi(false);
    }
  };

  const handleClearWifi = async () => {
    setIsSubmittingWifi(true);
    try {
      await clearWifiCredentials();
      setWifiPassword('');
      setWifiStatus({
        state: 'cleared',
        message: 'Saved WiFi credentials cleared',
        raw: 'WIFI_CLEARED',
      });
    } catch {
      // hook already updates error state
    } finally {
      setIsSubmittingWifi(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              Wat<Text style={{ color: COLORS.green }}>c</Text>her
            </Text>
            <View style={styles.triangleIcon} />
          </View>

          <TouchableOpacity style={styles.bellButton}>
            <Svg width={18} height={18} viewBox="0 0 14 16" fill="none">
              <Path
                d="M6.07725 14.0625L6.075 14.0873C6.07503 14.2473 6.13195 14.4022 6.23561 14.5242C6.33926 14.6462 6.4829 14.7274 6.64087 14.7533L6.75 14.7622C6.84076 14.7623 6.93061 14.7441 7.01416 14.7086C7.09771 14.6731 7.17325 14.6212 7.23627 14.5559C7.29928 14.4906 7.34847 14.4132 7.3809 14.3284C7.41333 14.2436 7.42833 14.1532 7.425 14.0625H8.4375C8.43729 14.4959 8.27035 14.9125 7.97129 15.2262C7.67223 15.5398 7.26396 15.7264 6.8311 15.7472C6.39823 15.768 5.97394 15.6215 5.64615 15.3381C5.31836 15.0546 5.11219 14.6558 5.07037 14.2245L5.0625 14.0625H6.07725ZM7.335 0V1.15538C8.71804 1.3 9.99849 1.95178 10.9292 2.98495C11.86 4.01812 12.375 5.35942 12.375 6.75V12.3739L13.5 12.375V13.5L12.375 13.4989V13.5H1.125V13.4989L0 13.5V12.375L1.125 12.3739V6.75C1.1249 5.35606 1.64238 4.01173 2.57711 2.97763C3.51185 1.94354 4.79725 1.29336 6.18413 1.15313L6.18525 0H7.335ZM6.75 2.25C5.55653 2.25 4.41193 2.72411 3.56802 3.56802C2.72411 4.41193 2.25 5.55653 2.25 6.75V12.3739H11.25V6.75C11.25 5.55653 10.7759 4.41193 9.93198 3.56802C9.08807 2.72411 7.94347 2.25 6.75 2.25Z"
                fill={COLORS.black}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.deviceSection}>
          <Image
            source={require('../../assets/images/robot_watcher.png')}
            style={styles.deviceImage}
            resizeMode="contain"
          />

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? COLORS.green : COLORS.statusRed },
              ]}
            />
            <Text style={styles.statusText}>
              {isConnected ? deviceInfo?.name || 'ESP_ROBOT' : 'Device Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.connectButton, isConnected && styles.connectButtonDisabled]}
            onPress={() => {
              handleConnectPress().catch(() => {});
            }}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.connectButtonText}>{connectButtonLabel}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.provisionCard}>
          <View style={styles.provisionHeader}>
            <Text style={styles.provisionTitle}>Bluetooth WiFi Provisioning</Text>
            <Text style={styles.provisionSubtitle}>{wifiStatusLabel}</Text>
          </View>

          <View style={styles.debugBox}>
            <Text style={styles.debugLabel}>Last BLE Message</Text>
            <Text style={styles.debugValue}>{lastBleMessage}</Text>
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>WiFi Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your home WiFi SSID"
              placeholderTextColor="#9AA0A6"
              value={wifiSsid}
              onChangeText={setWifiSsid}
              editable={isConnected && !isSubmittingWifi}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WiFi password"
              placeholderTextColor="#9AA0A6"
              value={wifiPassword}
              onChangeText={setWifiPassword}
              secureTextEntry
              editable={isConnected && !isSubmittingWifi}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.provisionActions}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                (!isConnected || isSubmittingWifi) && styles.secondaryButtonDisabled,
              ]}
              onPress={() => {
                handleRefreshStatus().catch(() => {});
              }}
              disabled={!isConnected || isSubmittingWifi}
            >
              <Text style={styles.secondaryButtonText}>Refresh Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                (!isConnected || isSubmittingWifi) && styles.secondaryButtonDisabled,
              ]}
              onPress={() => {
                handleClearWifi().catch(() => {});
              }}
              disabled={!isConnected || isSubmittingWifi}
            >
              <Text style={styles.secondaryButtonText}>Clear WiFi</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isConnected || isSubmittingWifi) && styles.primaryButtonDisabled,
            ]}
            onPress={() => {
              handleConfigureWifi().catch(() => {});
            }}
            disabled={!isConnected || isSubmittingWifi}
          >
            {isSubmittingWifi ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Send WiFi to Device</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {cards.map(card => {
            const IconComponent = card.icon;
            return (
              <TouchableOpacity
                key={card.id}
                style={styles.gridCard}
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
                }}
              >
                <Text style={styles.cardTitle}>{card.title}</Text>
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
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginBottom: 32,
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
    transform: [{ rotate: '-90deg' }],
  },
  bellButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  deviceImage: {
    width: '100%',
    height: 196,
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
    marginHorizontal: -10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  connectButton: {
    width: '100%',
    minHeight: 56,
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
  provisionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    gap: 14,
  },
  provisionHeader: {
    gap: 6,
  },
  debugBox: {
    backgroundColor: '#F3F5F8',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  debugLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cardTitle,
  },
  debugValue: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.black,
  },
  provisionTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  provisionSubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.statusGray,
  },
  inputBlock: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.cardTitle,
  },
  input: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F5F8',
    paddingHorizontal: 14,
    fontFamily: 'Inter',
    fontSize: 15,
    color: COLORS.black,
  },
  provisionActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cardTitle,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridCard: {
    width: '47%',
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
    color: '#636A74',
    lineHeight: 16,
  },
});
