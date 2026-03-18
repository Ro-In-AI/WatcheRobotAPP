import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { DanceIcon, MotionIcon, SurveillanceIcon } from '../components/icons';
import { BLEPop, BluetoothStatus, useBluetooth } from '../modules/bluetooth';

// 设计稿颜色提取
const COLORS = {
  background: '#F5F5F9',     // 页面背景色
  white: '#FFFFFF',          // 卡片背景
  black: '#000000',          // 标题文字
  green: '#8FC31F',          // 主绿色（按钮、选中状态）
  grayIcon: '#363C44',       // 三角形图标
  statusRed: '#D20706',      // 状态红点
  statusGray: '#8E959F',     // 离线状态文字
  cardTitle: '#636A74',      // 卡片标题
  iconBg: '#F0F0F0',         // 图标底座背景
};

/**
 * Watcher 首页
 * 完全还原 Pencil 设计稿 (Node ID: jbWD1)
 */
export const WatcherPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [isBlePopVisible, setIsBlePopVisible] = useState(false);
  const {
    status,
    deviceInfo,
    error,
    connectToConfiguredDevice,
    stopScan,
    disconnect,
    clearError,
  } = useBluetooth();

  const isConnected = status === BluetoothStatus.Connected;
  const isBusy =
    status === BluetoothStatus.Scanning || status === BluetoothStatus.Connecting;

  const connectionLabel = useMemo(() => {
    switch (status) {
      case BluetoothStatus.Connected:
        return deviceInfo?.name || 'Device Connected';
      case BluetoothStatus.Scanning:
        return 'Scanning device...';
      case BluetoothStatus.Connecting:
        return 'Connecting device...';
      case BluetoothStatus.Error:
        return error?.message || 'Connection failed';
      case BluetoothStatus.Disconnected:
        return 'Device Disconnected';
      case BluetoothStatus.Idle:
      default:
        return 'Device Offline';
    }
  }, [deviceInfo?.name, error?.message, status]);

  const connectButtonText = useMemo(() => {
    if (isConnected) {
      return 'Disconnect device';
    }

    if (isBusy) {
      return 'Connecting...';
    }

    return 'Connect the device';
  }, [isBusy, isConnected]);

  const statusDotStyle = useMemo(() => {
    switch (status) {
      case BluetoothStatus.Connected:
        return styles.statusDotConnected;
      case BluetoothStatus.Scanning:
      case BluetoothStatus.Connecting:
        return styles.statusDotPending;
      default:
        return styles.statusDotOffline;
    }
  }, [status]);

  const handleConnect = useCallback(async () => {
    if (isConnected) {
      await disconnect();
      return;
    }

    clearError();
    setIsBlePopVisible(true);

    try {
      await connectToConfiguredDevice({
        scanTimeout: 10000,
        connectTimeout: 15000,
        autoConnect: true,
        enableAutoRescan: false,
      });
    } catch (err: any) {
      Alert.alert('蓝牙连接失败', err?.message || '请稍后重试');
    }
  }, [clearError, connectToConfiguredDevice, disconnect, isConnected]);

  const handleCancelBle = useCallback(async () => {
    setIsBlePopVisible(false);
    clearError();
    await stopScan();
  }, [clearError, stopScan]);

  const handleCloseBle = useCallback(() => {
    setIsBlePopVisible(false);
  }, []);

  const handleRetryBle = useCallback(() => {
    handleConnect().catch((err) => {
      Alert.alert('蓝牙连接失败', err?.message || '请稍后重试');
    });
  }, [handleConnect]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== 自定义 Header 区 ===== */}
        <View style={styles.header}>
          {/* 左侧：Watcher 标题 + 三角形图标 */}
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Watcher</Text>
            <View style={styles.triangleIcon} />
          </View>

          {/* 右侧：通知铃铛图标 */}
          <TouchableOpacity style={styles.bellButton}>
            <Icon name="bell" size={18} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        {/* ===== 设备展示与状态区 ===== */}
        <View style={styles.deviceSection}>
          {/* 机器人图片 - 使用真实产品图 */}
          <Image
            source={require('../assets/images/robot_watcher.png')}
            style={styles.deviceImage}
            resizeMode="contain"
          />

          {/* 状态行：红点 + Device Offline */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, statusDotStyle]} />
            <Text style={styles.statusText}>{connectionLabel}</Text>
          </View>
        </View>

        {/* ===== 核心按钮：Connect the device ===== */}
        <TouchableOpacity
          style={[
            styles.connectButton,
            isConnected && styles.disconnectButton,
            isBusy && styles.connectButtonDisabled,
          ]}
          onPress={handleConnect}
          disabled={isBusy}
        >
          <Text style={styles.connectButtonText}>{connectButtonText}</Text>
        </TouchableOpacity>

        {/* ===== 功能卡片网格 (Grid Cards) ===== */}
        <View style={styles.gridContainer}>
          {/* DANCE 卡片 - 48% 宽度 */}
          <TouchableOpacity style={styles.gridCard}>
            <Text style={styles.cardTitle}>DANCE</Text>
            <View style={styles.cardIconBg}>
              <DanceIcon size={20} />
            </View>
          </TouchableOpacity>

          {/* MOTION 卡片 - 48% 宽度 */}
          <TouchableOpacity style={styles.gridCard}>
            <Text style={styles.cardTitle}>MOTION</Text>
            <View style={styles.cardIconBg}>
              <MotionIcon size={20} />
            </View>
          </TouchableOpacity>

          {/* SURVEILLANCE 卡片 - 100% 宽度，marginTop 撑开间距 */}
          <TouchableOpacity style={styles.fullWidthCard}>
            <Text style={styles.cardTitle}>SURVEILLANCE</Text>
            <View style={styles.cardIconBg}>
              <SurveillanceIcon size={20} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BLEPop
        isVisible={isBlePopVisible}
        status={status}
        onCancel={() => {
          handleCancelBle().catch(() => undefined);
        }}
        onRetry={handleRetryBle}
        onReconnect={handleRetryBle}
        onClose={handleCloseBle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ===== 最外层容器 =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ===== ScrollView 样式 =====
  scrollView: {
    flex: 1,
  },

  // 【关键】防止底部内容被悬浮导航栏遮挡
  scrollContent: {
    paddingBottom: 120, // 底部导航栏高度 + 安全距离
    paddingHorizontal: 20,
  },

  // ===== Header 区 =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginBottom: 32,
  },

  // Header 左侧容器
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // "Watcher" 标题
  // 设计稿：fontFamily: Inter, fontSize: 24, fontWeight: 700
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.3,
  },

  // 三角形图标
  // 设计稿：#363c44, 12x12, polygon rotation -90
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

  // 铃铛按钮
  bellButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== 设备展示区 =====
  deviceSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },

  // 机器人图片 - 真实产品图，contain 模式保持比例
  // 设计稿：width: 250, height: 250
  deviceImage: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },

  // 状态行
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // 状态红点
  // 设计稿：#d20706, 6x6 ellipse
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotOffline: {
    backgroundColor: COLORS.statusRed,
  },
  statusDotConnected: {
    backgroundColor: '#34C759',
  },
  statusDotPending: {
    backgroundColor: '#F5B43A',
  },

  // 状态文字
  // 设计稿：fontFamily: Inter, fontSize: 14, color: #8e959f
  statusText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.statusGray,
  },

  // ===== Connect 按钮 =====
  // 设计稿：backgroundColor: #8fc31f, cornerRadius: 30, padding: [18, 38]
  connectButton: {
    width: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  disconnectButton: {
    backgroundColor: '#363C44',
  },
  connectButtonDisabled: {
    opacity: 0.7,
  },

  // 按钮文字
  // 设计稿：fontFamily: Inter, fontSize: 16, fontWeight: 500, color: #ffffff
  connectButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 0.2,
  },

  // ===== 功能卡片网格 =====
  // 关键：flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // 网格卡片 - DANCE 和 MOTION
  // 设计稿：width: 48%, height: ~120
  gridCard: {
    width: '48%',
    height: 120,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between', // 关键：文字在上，图标在下
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // 全宽卡片 - SURVEILLANCE
  // 设计稿：width: 100%, marginTop: 15 撑开间距
  fullWidthCard: {
    width: '100%',
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginTop: 15, // 撑开与上方卡片的间距
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // 卡片图标底座
  // 设计稿：width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0'
  cardIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end', // 图标在卡片底部
  },

  // 卡片标题
  // 设计稿：fontFamily: Inter, fontSize: 16, fontWeight: 700, color: #636a74
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cardTitle,
    letterSpacing: 0.2,
  },
});
