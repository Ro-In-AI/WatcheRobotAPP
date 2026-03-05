import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// 舵机通道配置
const SERVO_CHANNELS = [
  { id: 0, name: '舵机1', defaultAngle: 90 },
  { id: 1, name: '舵机2', defaultAngle: 90 },
  { id: 2, name: '舵机3', defaultAngle: 90 },
  { id: 3, name: '舵机4', defaultAngle: 90 },
  { id: 4, name: '舵机5', defaultAngle: 90 },
  { id: 5, name: '舵机6', defaultAngle: 90 },
];

// 预设姿势
const PRESETS = [
  { name: '初始化', angles: [90, 90, 90, 90, 90, 90] },
  { name: '站立', angles: [90, 60, 120, 90, 60, 120] },
  { name: '蹲下', angles: [90, 120, 60, 90, 120, 60] },
  { name: '挥手', angles: [90, 90, 90, 45, 90, 90] },
];

export const ControlPage: React.FC = () => {
  const [angles, setAngles] = useState<number[]>([90, 90, 90, 90, 90, 90]);

  const updateAngle = (channel: number, angle: number) => {
    const newAngles = [...angles];
    newAngles[channel] = angle;
    setAngles(newAngles);
    // TODO: 发送蓝牙命令
    console.log(`舵机${channel + 1}: ${angle}°`);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setAngles([...preset.angles]);
    // TODO: 发送蓝牙命令
    console.log('应用预设:', preset.name, preset.angles);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>舵机控制</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 预设姿势 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>预设姿势</Text>
          <View style={styles.presetGrid}>
            {PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.name}
                style={styles.presetButton}
                onPress={() => applyPreset(preset)}
              >
                <Text style={styles.presetText}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 舵机滑块 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>舵机控制</Text>
          {SERVO_CHANNELS.map((servo) => (
            <View key={servo.id} style={styles.servoControl}>
              <View style={styles.servoHeader}>
                <Text style={styles.servoName}>{servo.name}</Text>
                <Text style={styles.servoAngle}>{angles[servo.id]}°</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>0°</Text>
                <View style={styles.sliderTrack}>
                  <TouchableOpacity
                    style={[
                      styles.sliderThumb,
                      { left: `${(angles[servo.id] / 180) * 100}%` },
                    ]}
                    onPress={() => {}}
                  />
                </View>
                <Text style={styles.sliderLabel}>180°</Text>
              </View>
              <View style={styles.buttonRow}>
                {[0, 45, 90, 135, 180].map((angle) => (
                  <TouchableOpacity
                    key={angle}
                    style={[
                      styles.angleButton,
                      angles[servo.id] === angle && styles.angleButtonActive,
                    ]}
                    onPress={() => updateAngle(servo.id, angle)}
                  >
                    <Text
                      style={[
                        styles.angleButtonText,
                        angles[servo.id] === angle && styles.angleButtonTextActive,
                      ]}
                    >
                      {angle}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 发送按钮 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>发送指令</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#6E6E73',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  presetText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  servoControl: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  servoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  servoName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  servoAngle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#8E8E93',
    width: 30,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    position: 'relative',
    marginHorizontal: 8,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginLeft: -8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  angleButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  angleButtonActive: {
    backgroundColor: '#007AFF',
  },
  angleButtonText: {
    fontSize: 12,
    color: '#007AFF',
  },
  angleButtonTextActive: {
    color: '#FFF',
  },
  sendButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
