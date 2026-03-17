import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

/**
 * Dance 页面
 * 完全还原 Pencil 设计稿 (Node ID: IMnLH)
 */

const COLORS = {
  background: '#F5F5F9',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#636A74',
  lightGray: '#E1E1E7',
};

export const DancePage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ===== Header (Node ID: PPJeF) ===== */}
      <View style={styles.header}>
        {/* 左侧：返回按钮 */}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
              fill={COLORS.black}
            />
          </Svg>
        </TouchableOpacity>

        {/* 中间：标题 */}
        <Text style={styles.headerTitle}>Dance</Text>

        {/* 右侧：菜单图标 */}
        <TouchableOpacity style={styles.headerButton}>
          <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Path
              d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z"
              fill={COLORS.black}
            />
            <Path
              d="M9 4.5C9.82843 4.5 10.5 3.82843 10.5 3C10.5 2.17157 9.82843 1.5 9 1.5C8.17157 1.5 7.5 2.17157 7.5 3C7.5 3.82843 8.17157 4.5 9 4.5Z"
              fill={COLORS.black}
            />
            <Path
              d="M9 16.5C9.82843 16.5 10.5 15.8284 10.5 14.5C10.5 13.1716 9.82843 12.5 9 12.5C8.17157 12.5 7.5 13.1716 7.5 14.5C7.5 15.8284 8.17157 16.5 9 16.5Z"
              fill={COLORS.black}
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ===== 主内容区 (Node ID: p1ker) ===== */}
      <View style={styles.contentArea}>
        {/* "Other" 标题 */}
        <Text style={styles.sectionTitle}>Other</Text>

        {/* 两个按钮容器 */}
        <View style={styles.buttonRow}>
          {/* Discover 按钮 */}
          <TouchableOpacity style={styles.discoverButton}>
            <Text style={styles.discoverButtonText}>Discover</Text>
          </TouchableOpacity>

          {/* Customization 按钮 */}
          <TouchableOpacity style={styles.customButton}>
            <Text style={styles.customButtonText}>Customization</Text>
          </TouchableOpacity>
        </View>

        {/* 内容卡片 */}
        <View style={styles.contentCard}>
          {/* 机器人图片 */}
          <Image
            source={require('../assets/images/robot_watcher.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>Watcher-01</Text>
        </View>
      </View>

      {/* ===== 底部时间栏 (Node ID: VRAF8) ===== */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
        <Text style={styles.timeLabel}>时间</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ===== 最外层容器 =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ===== Header (Node ID: PPJeF) =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 30,
    backgroundColor: COLORS.background,
  },

  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 标题：SF Pro, 18px, fontWeight: 500
  headerTitle: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },

  // ===== 主内容区 =====
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // "Other" 标题：Inter, 14px, fontWeight: 500
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 10,
  },

  // 按钮行
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  // Discover 按钮 - 绿色高亮状态
  discoverButton: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 7.35,
    elevation: 2,
  },

  discoverButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },

  // Customization 按钮 - 灰色状态
  customButton: {
    flex: 1,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  customButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.gray,
  },

  // 内容卡片
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },

  cardImage: {
    width: '100%',
    height: 182,
    marginBottom: 16,
  },

  cardText: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },

  // ===== 底部时间栏 (Node ID: VRAF8) =====
  bottomBar: {
    height: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
  },

  // "时间" 标签：14px, fontWeight: normal, #636a74
  timeLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.gray,
  },
});
