import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// 动作类型
interface Motion {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// 可用动作
const MOTIONS: Motion[] = [
  { id: 'forward', name: '前进', description: '向前行走', icon: '⬆️' },
  { id: 'backward', name: '后退', description: '向后行走', icon: '⬇️' },
  { id: 'left', name: '左转', description: '向左转体', icon: '⬅️' },
  { id: 'right', name: '右转', description: '向右转体', icon: '➡️' },
  { id: 'wave', name: '挥手', description: '抬起手臂挥动', icon: '👋' },
  { id: 'pushup', name: '俯卧撑', description: '做俯卧撑动作', icon: '💪' },
  { id: 'sit', name: '坐下', description: '坐下姿势', icon: '🪑' },
  { id: 'stand', name: '站立', description: '站立姿势', icon: '🧍' },
  { id: 'dance1', name: '舞蹈1', description: '预设舞蹈动作', icon: '💃' },
  { id: 'dance2', name: '舞蹈2', description: '预设舞蹈动作', icon: '🕺' },
  { id: 'bow', name: '鞠躬', description: '礼貌鞠躬', icon: '🙇' },
  { id: 'shake', name: '握手', description: '握手动作', icon: '🤝' },
];

export const MotionPage: React.FC = () => {
  const [selectedMotion, setSelectedMotion] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // 0-100

  const handleMotionPress = (motionId: string) => {
    if (selectedMotion === motionId) {
      setSelectedMotion(null);
      // TODO: 停止动作
    } else {
      setSelectedMotion(motionId);
      // TODO: 播放动作
      console.log('播放动作:', motionId, '速度:', speed);
    }
  };

  const handlePlayStop = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setSelectedMotion(null);
      // TODO: 停止所有动作
    } else if (selectedMotion) {
      setIsPlaying(true);
      // TODO: 开始循环播放
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>动作控制</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {isPlaying ? '运行中' : '空闲'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 速度控制 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>速度控制</Text>
          <View style={styles.speedControl}>
            <Text style={styles.speedLabel}>慢</Text>
            <View style={styles.speedSlider}>
              {[25, 50, 75, 100].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.speedButton,
                    speed === s && styles.speedButtonActive,
                  ]}
                  onPress={() => setSpeed(s)}
                >
                  <Text
                    style={[
                      styles.speedButtonText,
                      speed === s && styles.speedButtonTextActive,
                    ]}
                  >
                    {s}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.speedLabel}>快</Text>
          </View>
        </View>

        {/* 动作网格 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>动作选择</Text>
          <View style={styles.motionGrid}>
            {MOTIONS.map((motion) => (
              <TouchableOpacity
                key={motion.id}
                style={[
                  styles.motionCard,
                  selectedMotion === motion.id && styles.motionCardActive,
                ]}
                onPress={() => handleMotionPress(motion.id)}
              >
                <Text style={styles.motionIcon}>{motion.icon}</Text>
                <Text
                  style={[
                    styles.motionName,
                    selectedMotion === motion.id && styles.motionNameActive,
                  ]}
                >
                  {motion.name}
                </Text>
                <Text style={styles.motionDesc}>{motion.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 播放/停止按钮 */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.playButton,
              !selectedMotion && styles.playButtonDisabled,
            ]}
            onPress={handlePlayStop}
            disabled={!selectedMotion}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '停止' : '播放动作'}
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
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
  speedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  speedLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  speedSlider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12,
  },
  speedButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  speedButtonActive: {
    backgroundColor: '#007AFF',
  },
  speedButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  speedButtonTextActive: {
    color: '#FFF',
  },
  motionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  motionCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  motionCardActive: {
    backgroundColor: '#007AFF',
  },
  motionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  motionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  motionNameActive: {
    color: '#FFF',
  },
  motionDesc: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
