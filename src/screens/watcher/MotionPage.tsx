import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBluetooth, BluetoothStatus } from '../../modules/bluetooth';
import {
  ACTIONS,
  COMMANDS,
  BLUETOOTH_UUIDS,
} from '../../modules/bluetooth/constants/bluetoothConstants';
import { parseBlenderAnimation, generateESP32Commands } from '../../utils/animationParser';
import { BlenderAnimation } from '../../types/animation';
import thinkAnimationJson from '../../assets/思考 - 关键_watcher_animation.json';
import sleepAnimationJson from '../../assets/睡觉 - 关键_watcher_animation.json';
import testAnimationJson from '../../assets/测试 - X_watcher_animation.json';
import executeAnimationJson from '../../assets/Execute30fps8s.json';
import failAnimationJson from '../../assets/fail30fps4s.json';
import speakAnimationJson from '../../assets/speak30fps7s-2.json';
import successAnimationJson from '../../assets/Success30fps3s.json';
import thinkingAnimationJson from '../../assets/thinking30fps6s.json';

// 颜色常量
const COLORS = {
  lightGray: '#E1E1E7',
  white: '#FFFFFF',
  black: '#000000',
  green: '#8FC31F',
  greenStroke: '#8FC31F',
  textDark: '#0D0D0D',
  textGray: '#636A74',
  bgGray: '#F3F5F8',
};

// 预设动作
interface Motion {
  id: number;
  name: string;
  label: string;
  icon: string;
}

const MOTIONS: Motion[] = [
  { id: 0, name: 'wave', label: '挥手', icon: '👋' },
  { id: 1, name: 'greet', label: '问候', icon: '🙂' },
];

// Blender 动画
const ANIMATIONS = [
  { id: 'think', name: '思考', json: thinkAnimationJson as BlenderAnimation },
  { id: 'sleep', name: '睡觉', json: sleepAnimationJson as BlenderAnimation },
  { id: 'test', name: '测试', json: testAnimationJson as BlenderAnimation },
  { id: 'execute', name: '执行', json: executeAnimationJson as BlenderAnimation },
  { id: 'fail', name: '失败', json: failAnimationJson as BlenderAnimation },
  { id: 'speak', name: '说话', json: speakAnimationJson as BlenderAnimation },
  { id: 'success', name: '成功', json: successAnimationJson as BlenderAnimation },
  { id: 'thinking', name: '思考2', json: thinkingAnimationJson as BlenderAnimation },
];

export const MotionPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { status, deviceInfo, sendCommand } = useBluetooth();
  const [selectedTab, setSelectedTab] = useState<'preset' | 'animation'>('preset');
  const [selectedMotion, setSelectedMotion] = useState<number | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isConnected = status === BluetoothStatus.Connected;

  // 发送命令
  const sendBLECommand = useCallback(async (command: string) => {
    try {
      await sendCommand({
        data: command,
        serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
        characteristicUUID: BLUETOOTH_UUIDS.SERVO_CTRL,
        type: 'response',
      });
      console.log('发送命令:', command);
    } catch (err: any) {
      console.error('发送命令失败:', err);
    }
  }, [sendCommand]);

  // 发送动作命令
  const sendActionCommand = useCallback(async (actionId: number) => {
    if (!isConnected) {
      Alert.alert('提示', '请先连接蓝牙设备');
      return;
    }

    try {
      const command = COMMANDS.PLAY_ACTION(actionId);
      await sendCommand({
        data: command,
        serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
        characteristicUUID: BLUETOOTH_UUIDS.ACTION_CTRL,
        type: 'response',
      });
      console.log('发送动作命令:', command);
    } catch (err: any) {
      console.error('发送动作命令失败:', err);
      Alert.alert('错误', err.message || '发送命令失败，请确保已连接到 ESP_ROBOT 设备');
    }
  }, [isConnected, sendCommand]);

  // 播放动画
  const playAnimation = useCallback(async (animation: typeof ANIMATIONS[0]) => {
    if (!isConnected) {
      Alert.alert('提示', '请先连接蓝牙设备');
      return;
    }

    try {
      const parsed = parseBlenderAnimation(animation.json, animation.name);
      console.log('解析动画:', parsed.name, '时长:', parsed.duration, 'ms');
      console.log('命令数量:', parsed.servoCommands.length);

      const commands = generateESP32Commands(parsed);

      for (const cmd of commands) {
        await sendBLECommand(cmd);
        await new Promise<void>(resolve => {
          setTimeout(() => resolve(), 10);
        });
      }

      console.log('动画命令发送完成');
      setIsPlaying(true);

      setTimeout(() => {
        setIsPlaying(false);
        setSelectedAnimation(null);
      }, parsed.duration);
    } catch (err: any) {
      console.error('播放动画失败:', err);
      Alert.alert('错误', '播放动画失败');
    }
  }, [isConnected, sendBLECommand]);

  const handleMotionPress = (motionId: number) => {
    if (!isConnected) {
      Alert.alert('提示', '请先连接蓝牙设备');
      return;
    }

    if (selectedMotion === motionId) {
      setSelectedMotion(null);
      setIsPlaying(false);
    } else {
      setSelectedMotion(motionId);
      setSelectedAnimation(null);
      sendActionCommand(motionId);
      setIsPlaying(true);
    }
  };

  const handleAnimationPress = (animationId: string) => {
    if (!isConnected) {
      Alert.alert('提示', '请先连接蓝牙设备');
      return;
    }

    if (selectedAnimation === animationId) {
      setSelectedAnimation(null);
      setIsPlaying(false);
      sendBLECommand(COMMANDS.QUEUE_CLEAR());
    } else {
      setSelectedAnimation(animationId);
      setSelectedMotion(null);
      const animation = ANIMATIONS.find(a => a.id === animationId);
      if (animation) {
        playAnimation(animation);
      }
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setSelectedMotion(null);
    setSelectedAnimation(null);
    sendBLECommand(COMMANDS.QUEUE_CLEAR());
    sendBLECommand(COMMANDS.SET_SERVO(0, 90));
    sendBLECommand(COMMANDS.SET_SERVO(1, 120));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 页眉 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.backButton}>
            <View style={[styles.backLine, { transform: [{ rotate: '45deg' }], left: 5, top: 6 }]} />
            <View style={[styles.backLine, { transform: [{ rotate: '-45deg' }], left: 5, top: 14 }]} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Motion</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.addIcon}>
            <View style={[styles.addLine, { transform: [{ rotate: '0deg' }] }]} />
            <View style={[styles.addLine, { transform: [{ rotate: '90deg' }] }]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 时间按钮栏 */}
      <View style={styles.timeBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'preset' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('preset')}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'preset' ? styles.tabButtonTextActive : styles.tabButtonTextNormal,
            ]}
          >
            Preset
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'animation' && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab('animation')}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'animation' ? styles.tabButtonTextActive : styles.tabButtonTextNormal,
            ]}
          >
            Animation
          </Text>
        </TouchableOpacity>
      </View>

      {/* 机器人显示区域 */}
      <View style={styles.robotSection}>
        <View style={styles.robotCard}>
          <Image
            source={require('../../assets/images/robot_watcher.png')}
            style={styles.robotImage}
            resizeMode="contain"
          />
          <Text style={styles.robotLabel}>
            {isConnected ? (deviceInfo?.name || 'Watcher-01') : '未连接'}
          </Text>
        </View>
      </View>

      {/* 底部白色卡片 */}
      <View style={styles.bottomCard}>
        <View style={styles.contentArea}>
          <Text style={styles.otherTitle}>Other</Text>

          {/* 预设动作网格 */}
          {selectedTab === 'preset' && (
            <View style={styles.iconGrid}>
              {MOTIONS.map((motion) => (
                <TouchableOpacity
                  key={motion.id}
                  style={[
                    styles.iconItem,
                    selectedMotion === motion.id && styles.iconItemSelected,
                  ]}
                  onPress={() => handleMotionPress(motion.id)}
                >
                  <View style={styles.iconImage}>
                    <Text style={styles.iconEmoji}>{motion.icon}</Text>
                  </View>
                  <Text style={[
                    styles.iconLabel,
                    selectedMotion === motion.id && styles.iconLabelActive,
                  ]}>
                    {motion.label}
                  </Text>
                </TouchableOpacity>
              ))}
              {/* 添加更多预设动作的占位符 */}
              <View style={styles.iconItem}>
                <View style={styles.iconImage} />
                <Text style={styles.iconLabel}>待添加</Text>
              </View>
              <View style={styles.iconItem}>
                <View style={styles.iconImage} />
                <Text style={styles.iconLabel}>待添加</Text>
              </View>
            </View>
          )}

          {/* Blender 动画网格 */}
          {selectedTab === 'animation' && (
            <ScrollView style={styles.animationScroll}>
              <View style={styles.iconGrid}>
                {ANIMATIONS.map((animation) => (
                  <TouchableOpacity
                    key={animation.id}
                    style={[
                      styles.iconItem,
                      selectedAnimation === animation.id && styles.iconItemSelected,
                    ]}
                    onPress={() => handleAnimationPress(animation.id)}
                  >
                    <View style={styles.iconImage}>
                      <Text style={styles.iconEmoji}>🎬</Text>
                    </View>
                    <Text
                      style={[
                        styles.iconLabel,
                        selectedAnimation === animation.id && styles.iconLabelActive,
                      ]}
                    >
                      {animation.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {/* 停止按钮 */}
          {isPlaying && (
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.stopButtonText}>停止</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  header: {
    height: 44,
    backgroundColor: '#F5F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  headerButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  backLine: {
    position: 'absolute',
    width: 11.5,
    height: 1.5,
    backgroundColor: '#000',
  },
  addIcon: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  addLine: {
    position: 'absolute',
    width: 18,
    height: 1.5,
    backgroundColor: '#8FC31F',
    top: 8,
    left: 0,
  },
  headerTitle: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  timeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: COLORS.lightGray,
    borderRadius: 30,
    padding: 4,
  },
  tabButton: {
    flex: 0.49,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#0000001A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 7.35,
    elevation: 2,
  },
  tabButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    textAlign: 'center',
  },
  tabButtonTextActive: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  tabButtonTextNormal: {
    fontWeight: '400',
    color: COLORS.textGray,
  },
  robotSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  robotCard: {
    alignItems: 'center',
    gap: 16,
  },
  robotImage: {
    width: 173,
    height: 182,
  },
  robotLabel: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  bottomCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20 + 34,
  },
  contentArea: {
    flex: 1,
  },
  otherTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconItem: {
    width: 107,
    borderRadius: 12,
    backgroundColor: COLORS.bgGray,
    padding: 13,
    gap: 12,
  },
  iconItemSelected: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1.5,
    borderColor: COLORS.greenStroke,
  },
  iconImage: {
    width: 81,
    height: 85,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 40,
  },
  iconLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textGray,
    textAlign: 'center',
  },
  iconLabelActive: {
    fontWeight: '500',
    color: COLORS.textDark,
  },
  animationScroll: {
    flex: 1,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  stopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
