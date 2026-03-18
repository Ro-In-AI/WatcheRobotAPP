import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useBluetooth, BluetoothStatus } from '../../modules/bluetooth';
import {
  COMMANDS,
  BLUETOOTH_UUIDS,
} from '../../modules/bluetooth/constants/bluetoothConstants';
import { parseBlenderAnimation, generateESP32Commands } from '../../utils/animationParser';
import { BlenderAnimation } from '../../types/animation';
import thinkAnimationJson from '../../assets/思考 - 关键_watcher_animation.json';
import sleepAnimationJson from '../../assets/睡觉 - 关键_watcher_animation.json';
import testAnimationJson from '../../assets/测试 - X_watcher_animation.json';

// 颜色常量
const COLORS = {
  background: '#F5F5F9',
  white: '#FFFFFF',
  gray: '#8E959F',
  lightGray: '#F3F5F8',
  green: '#8FC31F',
  greenDark: '#77C320',
  black: '#000000',
  separator: 'rgba(0, 0, 0, 0.05)',
};

interface JoystickPosition {
  x: number;
  y: number;
}

const MOTIONS = [
  { id: 0, name: 'wave', label: '挥手', icon: '👋' },
  { id: 1, name: 'greet', label: '问候', icon: '🙂' },
  { id: 2, name: 'nod', label: '点头', icon: '😊' },
  { id: 3, name: 'shake', label: '摇头', icon: '😐' },
  { id: 4, name: 'turnLeft', label: '左转', icon: '⬅️' },
  { id: 5, name: 'turnRight', label: '右转', icon: '➡️' },
];

const ANIMATIONS = [
  { id: 'think', name: '思考', json: thinkAnimationJson as BlenderAnimation },
  { id: 'sleep', name: '睡觉', json: sleepAnimationJson as BlenderAnimation },
  { id: 'test', name: '测试', json: testAnimationJson as BlenderAnimation },
];

export const MotionPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { status, sendCommand } = useBluetooth();
  const [selectedMotion, setSelectedMotion] = useState<number | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isConnected = status === BluetoothStatus.Connected;

  // Joystick 位置
  const joystickPosition = useRef<JoystickPosition>({ x: 129.094, y: 126.66 });

  // 发送命令
  const sendBLECommand = useCallback(async (command: string) => {
    try {
      await sendCommand({
        data: command,
        serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
        characteristicUUID: BLUETOOTH_UUIDS.SERVO_CTRL,
        type: 'response',
      });
    } catch (err) {
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
    } catch (err: any) {
      Alert.alert('错误', err.message || '发送命令失败');
    }
  }, [isConnected, sendCommand]);

  // Joystick PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const newX = 129.094 + dx;
        const newY = 126.66 + dy;

        const distance = Math.sqrt(Math.pow(newX - 129.094, 2) + Math.pow(newY - 126.66, 2));
        const maxDistance = 43;

        if (distance <= maxDistance) {
          joystickPosition.current = { x: newX, y: newY };
        } else {
          const angle = Math.atan2(newY - 126.66, newX - 129.094);
          joystickPosition.current = {
            x: 129.094 + Math.cos(angle) * maxDistance,
            y: 126.66 + Math.sin(angle) * maxDistance,
          };
        }

        const normalizedX = (joystickPosition.current.x - 129.094) / maxDistance;
        const normalizedY = (joystickPosition.current.y - 126.66) / maxDistance;

        if (Math.abs(normalizedX) > 0.1) {
          const pitchAngle = 90 + Math.round(normalizedX * 30);
          sendBLECommand(COMMANDS.SET_SERVO(0, Math.max(10, Math.min(170, pitchAngle))));
        }
        if (Math.abs(normalizedY) > 0.1) {
          const yawAngle = 120 - Math.round(normalizedY * 30);
          sendBLECommand(COMMANDS.SET_SERVO(1, Math.max(45, Math.min(150, yawAngle))));
        }
      },
      onPanResponderRelease: () => {
        joystickPosition.current = { x: 129.094, y: 126.66 };
      },
    })
  ).current;

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

  const playAnimation = useCallback(async (animation: typeof ANIMATIONS[0]) => {
    if (!isConnected) {
      Alert.alert('提示', '请先连接蓝牙设备');
      return;
    }
    try {
      const parsed = parseBlenderAnimation(animation.json, animation.name);
      const commands = generateESP32Commands(parsed);
      for (const cmd of commands) {
        await sendBLECommand(cmd);
        await new Promise<void>(resolve => setTimeout(() => resolve(), 10));
      }
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        setSelectedAnimation(null);
      }, parsed.duration);
    } catch (err) {
      Alert.alert('错误', '播放动画失败');
    }
  }, [isConnected, sendBLECommand]);

  const handleStop = () => {
    setIsPlaying(false);
    setSelectedMotion(null);
    setSelectedAnimation(null);
    sendBLECommand(COMMANDS.QUEUE_CLEAR());
    sendBLECommand(COMMANDS.SET_SERVO(0, 90));
    sendBLECommand(COMMANDS.SET_SERVO(1, 120));
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top, backgroundColor: COLORS.white }} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9.23544 11.9995L17.3905 19.8827C17.8711 20.3481 17.8711 21.1014 17.3905 21.5653C16.9098 22.03 16.13 22.03 15.6494 21.5653L6.62452 12.8406C6.14458 12.376 6.14458 11.6223 6.62452 11.1591L15.6494 2.43481C15.8905 2.20246 16.2055 2.0863 16.5207 2.0863C16.8358 2.0863 17.1509 2.20248 17.3905 2.43555C17.8711 2.90024 17.8711 3.65242 17.3905 4.1171L9.23544 11.9995Z"
                fill="black"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MOTION</Text>
        </View>
      </View>

      {/* Robot Image Section */}
      <View style={styles.robotSection}>
        <Image
          source={require('../../assets/images/robot_watcher.png')}
          style={styles.robotImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Card - 参考 DancePage 布局 */}
      <View style={styles.bottomCard}>
        {/* Joystick Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Joystick</Text>

          <View style={styles.joystickContainer}>
            <View style={styles.joystickPanArea} {...panResponder.panHandlers}>
              <View style={styles.joystickSvgWrapper}>
                {/* White ring image */}
                <Image
                  source={require('../../assets/icons/Subtract.svg')}
                  style={{ width: 259, height: 259, position: 'absolute' }}
                  resizeMode="contain"
                />

                <Svg width={259} height={259} viewBox="0 0 259 259">
                  <Defs>
                    <LinearGradient id="greenGradient" x1="129.991" y1="103.343" x2="129.094" y2="166.568">
                      <Stop offset="0" stopColor={COLORS.green} />
                      <Stop offset="1" stopColor={COLORS.greenDark} />
                    </LinearGradient>
                  </Defs>

                    {/* Direction arrows */}
                    <Path
                      d="M129.608 55.2565C129.921 54.7156 130.701 54.7156 131.014 55.2565L138.743 68.6447C139.056 69.1856 138.665 69.8618 138.041 69.8618H122.581C121.957 69.8618 121.566 69.1856 121.879 68.6447L129.608 55.2565Z"
                      fill={COLORS.green}
                    />
                    <Path
                      d="M128.797 201.309C129.109 201.85 129.89 201.85 130.202 201.309L137.932 187.921C138.244 187.38 137.854 186.704 137.229 186.704H121.77C121.145 186.704 120.755 187.38 121.067 187.921L128.797 201.309Z"
                      fill={COLORS.green}
                    />
                    <Path
                      d="M57.6907 127.986C57.1498 128.298 57.1498 129.079 57.6907 129.391L71.0789 137.121C71.6198 137.433 72.296 137.043 72.296 136.418L72.296 120.959C72.296 120.334 71.6198 119.944 71.0789 120.256L57.6907 127.986Z"
                      fill={COLORS.green}
                    />
                    <Path
                      d="M204.554 127.986C205.095 128.298 205.095 129.079 204.554 129.391L191.166 137.121C190.625 137.433 189.949 137.043 189.949 136.418L189.949 120.959C189.949 120.334 190.625 119.944 191.166 120.256L204.554 127.986Z"
                      fill={COLORS.green}
                    />

                    {/* Knob - outer gray circle */}
                    <Ellipse
                      cx={129.094 + (joystickPosition.current.x - 129.094)}
                      cy={126.66 + (joystickPosition.current.y - 126.66)}
                      rx={26}
                      ry={26}
                      fill={COLORS.lightGray}
                    />
                    {/* Knob - circle with green gradient stroke */}
                    <Ellipse
                      cx={129.094 + (joystickPosition.current.x - 129.094)}
                      cy={126.66 + (joystickPosition.current.y - 126.66)}
                      rx={21.5022}
                      ry={21.5022}
                      stroke="url(#greenGradient)"
                      strokeWidth={8.11404}
                    />
                    {/* Knob - inner gray circle (fills the hollow center) */}
                    <Ellipse
                      cx={129.094 + (joystickPosition.current.x - 129.094)}
                      cy={126.66 + (joystickPosition.current.y - 126.66)}
                      rx={17.5}
                      ry={17.5}
                      fill={COLORS.lightGray}
                    />
                  </Svg>
                </View>
            </View>
          </View>

          <View style={styles.separator} />
        </View>

        {/* Dance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dance</Text>

          {/* Row 1 */}
          <View style={styles.iconGrid}>
            {MOTIONS.slice(0, 3).map((motion) => (
              <TouchableOpacity
                key={motion.id}
                style={[
                  styles.iconItem,
                  selectedMotion === motion.id && styles.iconItemActive,
                ]}
                onPress={() => handleMotionPress(motion.id)}
              >
                <View style={styles.iconImagePlaceholder}>
                  <Text style={styles.robotIcon}>{motion.icon}</Text>
                </View>
                <Text style={[
                  styles.iconLabel,
                  selectedMotion === motion.id && styles.iconLabelSelected,
                ]}>
                  Watcher-03
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 2 */}
          <View style={styles.iconGrid}>
            {MOTIONS.slice(3, 6).map((motion) => (
              <TouchableOpacity
                key={motion.id}
                style={[
                  styles.iconItem,
                  selectedMotion === motion.id && styles.iconItemActive,
                ]}
                onPress={() => handleMotionPress(motion.id)}
              >
                <View style={styles.iconImagePlaceholder}>
                  <Text style={styles.robotIcon}>{motion.icon}</Text>
                </View>
                <Text style={[
                  styles.iconLabel,
                  selectedMotion === motion.id && styles.iconLabelSelected,
                ]}>
                  Watcher-03
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 3 - Animations */}
          <View style={styles.iconGrid}>
            {ANIMATIONS.map((animation) => (
              <TouchableOpacity
                key={animation.id}
                style={[
                  styles.iconItem,
                  selectedAnimation === animation.id && styles.iconItemActive,
                ]}
                onPress={() => handleAnimationPress(animation.id)}
              >
                <View style={styles.iconImagePlaceholder}>
                  <Text style={styles.robotIcon}>🎬</Text>
                </View>
                <Text style={[
                  styles.iconLabel,
                  selectedAnimation === animation.id && styles.iconLabelSelected,
                ]}>
                  {animation.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stop Button */}
          {isPlaying && (
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.stopButtonText}>停止播放</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    height: 44,
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  headerContent: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  robotSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  robotImage: {
    width: 173,
    height: 182,
  },
  // 底部卡片 - 参考 DancePage
  bottomCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20 + 34,
    marginLeft: 20,
    marginRight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: 16,
  },
  joystickContainer: {
    alignItems: 'center',
  },
  joystickPanArea: {
    width: 259,
    height: 259,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joystickSvgWrapper: {
    width: 259,
    height: 259,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginTop: 20,
  },
  // 图标网格 - 参考 DancePage iconGrid
  iconGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  // 图标项 - 参考 DancePage iconItem
  iconItem: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    alignItems: 'center',
    maxWidth: 107,
  },
  iconItemActive: {
    backgroundColor: COLORS.lightGray,
  },
  iconLabelSelected: {
    fontWeight: '500',
  },
  iconImagePlaceholder: {
    width: '100%',
    height: 85,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  robotIcon: {
    fontSize: 32,
  },
  iconLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.black,
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  stopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
