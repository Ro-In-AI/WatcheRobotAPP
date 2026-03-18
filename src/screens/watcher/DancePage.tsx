import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Path, Rect } from 'react-native-svg';
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

type TabType = 'default' | 'customization';

const DEFAULT_ROBOTS = ['Watcher-01', 'Watcher-02', 'Watcher-03'] as const;

export const DancePage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = React.useState<TabType>('default');
  const [selectedRobot, setSelectedRobot] = React.useState<string>('Watcher-01');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ===== Header (Node ID: PPJeF) ===== */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9.23544 11.9995L17.3905 19.8827C17.8711 20.3481 17.8711 21.1014 17.3905 21.5653C16.9098 22.03 16.13 22.03 15.6494 21.5653L6.62452 12.8406C6.14458 12.376 6.14458 11.6223 6.62452 11.1591L15.6494 2.43481C15.8905 2.20246 16.2055 2.0863 16.5207 2.0863C16.8358 2.0863 17.1509 2.20248 17.3905 2.43555C17.8711 2.90024 17.8711 3.65242 17.3905 4.1171L9.23544 11.9995Z"
              fill="black"
            />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Dance</Text>

        <TouchableOpacity style={styles.headerButton}>
          <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Path
              d="M9 16.8403C6.8968 16.8403 4.91961 16.0253 3.43236 14.5453C1.94454 13.0643 1.125 11.0955 1.125 9.00021C1.125 6.90545 1.94457 4.93615 3.43182 3.45564C4.91907 1.97571 6.89626 1.16064 8.99946 1.16064C11.1027 1.16064 13.0798 1.97571 14.5665 3.45564C16.0549 4.93615 16.8739 6.90545 16.8739 8.99963C16.8745 11.0949 16.0549 13.0643 14.5665 14.5447C13.0804 16.0247 11.1032 16.8403 9 16.8403ZM9 2.28504C7.19607 2.28504 5.50069 2.98366 4.22608 4.25268C2.952 5.52055 2.25 7.20692 2.25 9.00018C2.25 10.7934 2.95143 12.4798 4.2255 13.7471C5.50012 15.0161 7.19549 15.7147 8.99943 15.7147C10.8028 15.7147 12.4987 15.0161 13.7734 13.7471C15.0474 12.4786 15.7494 10.7929 15.7489 8.9996C15.7489 7.20634 15.0474 5.52055 13.7734 4.25322C12.4993 2.98423 10.8034 2.28504 9 2.28504Z"
              fill="black"
            />
            <Path
              d="M12.9375 8.43752H9.56252V5.06252C9.56252 4.752 9.31051 4.5 9 4.5C8.68949 4.5 8.43748 4.752 8.43748 5.06252V8.43752H5.06252C4.752 8.43752 4.5 8.68952 4.5 9.00003C4.5 9.31054 4.752 9.56254 5.06252 9.56254H8.43752V12.9375C8.43752 13.2486 8.68952 13.5001 9.00003 13.5001C9.31054 13.5001 9.56254 13.2486 9.56254 12.9375V9.56252H12.9375C13.2486 9.56252 13.5001 9.31051 13.5001 9C13.5001 8.68949 13.2486 8.43752 12.9375 8.43752Z"
              fill="black"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* ===== 时间按钮栏 (Node ID: VRAF8) ===== */}
      <View style={styles.timeBar}>
        <TouchableOpacity
          style={[styles.discoverButton, selectedTab === 'default' && styles.buttonActive]}
          onPress={() => setSelectedTab('default')}
        >
          <Text style={[styles.discoverButtonText, selectedTab === 'default' && styles.textActive]}>
            Default
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.customButton, selectedTab === 'customization' && styles.buttonActive]}
          onPress={() => setSelectedTab('customization')}
        >
          <Text style={[styles.customButtonText, selectedTab === 'customization' && styles.textActive]}>
            Customization
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== 机器人展示区 ===== */}
      <View style={styles.robotSection}>
        <Image
          source={require('../../assets/images/robot_watcher.png')}
          style={styles.robotImage}
          resizeMode="contain"
        />
        <Text style={styles.robotLabel}>Watcher-01</Text>
      </View>

      {/* ===== 底部白色卡片 ===== */}
      {selectedTab === 'default' ? (
        // Default tab: Node ID: oQww2
        <View style={styles.bottomCardDefault}>
          <Text style={styles.otherTitle}>Other</Text>

          <View style={styles.iconGrid}>
            {DEFAULT_ROBOTS.map((robotName) => (
              <TouchableOpacity
                key={robotName}
                style={[styles.iconItem, selectedRobot === robotName && styles.iconItemActive]}
                onPress={() => setSelectedRobot(robotName)}
              >
                <Image
                  source={require('../../assets/images/robot_watcher.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
                <Text style={styles.iconLabel}>{robotName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        // Customization tab: Node ID: eH657
        <View style={styles.bottomCardCustom}>
          <Text style={styles.otherTitle}>Other</Text>

          <View style={styles.iconGrid}>
            {/* 机器人卡片 */}
            <View style={styles.customIconItem}>
              <Image
                source={require('../../assets/images/robot_watcher.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
              <Text style={styles.iconLabel}>Watcher-04</Text>
            </View>

            {/* 绿色添加按钮 */}
            <TouchableOpacity style={styles.addButton}>
              <Svg width={75} height={75} viewBox="0 0 75 75" fill="none">
                <Rect
                  x="1"
                  y="1"
                  width="73"
                  height="73"
                  rx="12"
                  stroke="#8FC31F"
                  strokeWidth="2"
                  fill="none"
                />
                <Path
                  d="M37.5 25V50"
                  stroke="#8FC31F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <Path
                  d="M25 37.5H50"
                  stroke="#8FC31F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>

            {/* 空占位 */}
            <View style={styles.emptySlot} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
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

  headerTitle: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },

  // 机器人展示区
  robotSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  robotImage: {
    width: 173,
    height: 182,
  },

  robotLabel: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 16,
  },

  // 时间按钮栏 (Node ID: VRAF8)
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

  // Default 按钮 (Node ID: MI2jE) - 默认非激活状态
  discoverButton: {
    flex: 0.49,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // "Default" 文字 (Node ID: VVQCJ) - 默认非激活状态
  discoverButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#636A74',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // Customization 按钮 (Node ID: Spb4H)
  customButton: {
    flex: 0.49,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // "Customization" 文字 (Node ID: LJ2Fb)
  customButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#636A74',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // 底部白色卡片 - Default tab (Node ID: oQww2)
  bottomCardDefault: {
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

  // 底部白色卡片 - Customization tab (Node ID: eH657)
  bottomCardCustom: {
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

  otherTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },

  iconGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },

  iconItem: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    alignItems: 'center',
    gap: 12,
    maxWidth: 107,
  },

  iconItemActive: {
    backgroundColor: '#F3F5F8',
  },

  // Customization tab 机器人卡片 (无选中功能)
  customIconItem: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    alignItems: 'center',
    gap: 12,
    maxWidth: 107,
  },

  // 空占位
  emptySlot: {
    flex: 1,
  },

  iconImage: {
    width: '100%',
    height: 85,
  },

  iconLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.black,
    textAlign: 'center',
  },

  // 激活状态的按钮样式
  buttonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#0000001a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 7.35,
    elevation: 2,
  },

  // 激活状态的文字样式
  textActive: {
    fontWeight: '700',
    color: '#0D0D0D',
  },

  // 绿色添加按钮 (Node ID: 8zHRP)
  addButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 107,
  },

});


