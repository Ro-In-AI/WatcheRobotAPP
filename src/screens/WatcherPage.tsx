import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { DanceIcon, MotionIcon, SurveillanceIcon, AnimationIcon } from '../components/icons';

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
  const [activeModes, setActiveModes] = useState<string[]>([]);

  const cards = [
    { id: 'DANCE', title: 'DANCE', icon: DanceIcon },
    { id: 'MOTION', title: 'MOTION', icon: MotionIcon },
    { id: 'SURVEILLANCE', title: 'SURVEILLANCE', icon: SurveillanceIcon },
    { id: 'ANIMATION', title: 'ANIMATION', icon: AnimationIcon },
  ];

  const toggleCard = (cardId: string) => {
    setActiveModes(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

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
            <Text style={styles.headerTitle}>
              Wat<Text style={{ color: '#8FC31F' }}>c</Text>her
            </Text>
            <View style={styles.triangleIcon} />
          </View>

          {/* 右侧：通知铃铛图标 */}
          <TouchableOpacity style={styles.bellButton}>
            <Svg width={18} height={18} viewBox="0 0 14 16" fill="none">
              <Path
                d="M6.07725 14.0625L6.075 14.0873C6.07503 14.2473 6.13195 14.4022 6.23561 14.5242C6.33926 14.6462 6.4829 14.7274 6.64087 14.7533L6.75 14.7622C6.84076 14.7623 6.93061 14.7441 7.01416 14.7086C7.09771 14.6731 7.17325 14.6212 7.23627 14.5559C7.29928 14.4906 7.34847 14.4132 7.3809 14.3284C7.41333 14.2436 7.42833 14.1532 7.425 14.0625H8.4375C8.43729 14.4959 8.27035 14.9125 7.97129 15.2262C7.67223 15.5398 7.26396 15.7264 6.8311 15.7472C6.39823 15.768 5.97394 15.6215 5.64615 15.3381C5.31836 15.0546 5.11219 14.6558 5.07037 14.2245L5.0625 14.0625H6.07725ZM7.335 0V1.15538C8.71804 1.3 9.99849 1.95178 10.9292 2.98495C11.86 4.01812 12.375 5.35942 12.375 6.75V12.3739L13.5 12.375V13.5L12.375 13.4989V13.5H1.125V13.4989L0 13.5V12.375L1.125 12.3739V6.75C1.1249 5.35606 1.64238 4.01173 2.57711 2.97763C3.51185 1.94354 4.79725 1.29336 6.18413 1.15313L6.18525 0H7.335ZM6.75 2.25C5.55653 2.25 4.41193 2.72411 3.56802 3.56802C2.72411 4.41193 2.25 5.55653 2.25 6.75V12.3739H11.25V6.75C11.25 5.55653 10.7759 4.41193 9.93198 3.56802C9.08807 2.72411 7.94347 2.25 6.75 2.25Z"
                fill={COLORS.black}
              />
            </Svg>
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
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Device Offline</Text>
          </View>
        </View>

        {/* ===== 核心按钮：Connect the device ===== */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect the device</Text>
          </TouchableOpacity>
        </View>

        {/* ===== 功能卡片网格 (Grid Cards) ===== */}
        <View style={styles.gridContainer}>
          {cards.map((card) => {
            const isActive = activeModes.includes(card.id);
            const IconComponent = card.icon;
            return (
              <Pressable
                key={card.id}
                style={({ pressed }) => [
                  styles.gridCard,
                  pressed && styles.gridCardPressed,
                ]}
                onPress={() => toggleCard(card.id)}
              >
                <Text style={styles.cardTitle}>{card.title}</Text>
                <View style={styles.cardIconBg}>
                  <IconComponent
                    size={26}
                    color={isActive ? COLORS.green : COLORS.cardTitle}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
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
    paddingBottom: 120,
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

  // 机器人图片 - 按照 Node ID: uLuHB 设计稿
  // height: 196, width: fill_container
  deviceImage: {
    width: '100%',
    height: 196,
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
    backgroundColor: COLORS.statusRed,
  },

  // 状态文字
  // 设计稿：fontFamily: Inter, fontSize: 14, color: #8e959f
  statusText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.statusGray,
  },

  // ===== Connect 按钮容器 =====
  buttonContainer: {
    marginHorizontal: -10,  // 向外扩展 10px
    paddingHorizontal: 20,  // 实际边距 = 20(父) - 10(扩展) + 20(自己) = 30px
    marginBottom: 30,
  },

  // ===== Connect 按钮 =====
  connectButton: {
    display: 'flex',
    width: '100%',  // 自适应屏幕宽度
    paddingVertical: 18,
    paddingHorizontal: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#8FC31F',
  },

  // 按钮文字 - 按照设计稿 Node ID: kBpN3
  connectButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 16,
    textAlign: 'center',
  },

  // ===== 功能卡片网格 =====
  // 按照设计稿：rowGap: 12
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  // 网格卡片
  gridCard: {
    width: '47%',
    height: 116,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },

  // 按下状态卡片（交互反馈）
  gridCardPressed: {
    opacity: 0.9,
  },

  // 卡片图标底座 - 按照设计稿规格
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

  // 卡片标题 - 按照设计稿规格
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#636A74',
    lineHeight: 16,
  },
});
