import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Path} from 'react-native-svg';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';

const COLORS = {
  background: '#F5F5F9',
  white: '#FFFFFF',
  black: '#000000',
  title: '#1A1A1A',
  green: '#8FC31F',
  divider: '#EEF0F3',
  arrow: '#D5D7DD',
  danger: '#D20706',
};

const AVATAR_IMAGE =
  'https://www.figma.com/api/mcp/asset/d7b4dc14-fac4-4c28-8429-36133d169a55';

type MenuItem = {
  id: string;
  label: string;
  value?: string;
  icon: React.FC;
};

const BellIcon: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 14 16" fill="none">
    <Path
      d="M6.07725 14.0625L6.075 14.0873C6.07503 14.2473 6.13195 14.4022 6.23561 14.5242C6.33926 14.6462 6.4829 14.7274 6.64087 14.7533L6.75 14.7622C6.84076 14.7623 6.93061 14.7441 7.01416 14.7086C7.09771 14.6731 7.17325 14.6212 7.23627 14.5559C7.29928 14.4906 7.34847 14.4132 7.3809 14.3284C7.41333 14.2436 7.42833 14.1532 7.425 14.0625H8.4375C8.43729 14.4959 8.27035 14.9125 7.97129 15.2262C7.67223 15.5398 7.26396 15.7264 6.8311 15.7472C6.39823 15.768 5.97394 15.6215 5.64615 15.3381C5.31836 15.0546 5.11219 14.6558 5.07037 14.2245L5.0625 14.0625H6.07725ZM7.335 0V1.15538C8.71804 1.3 9.99849 1.95178 10.9292 2.98495C11.86 4.01812 12.375 5.35942 12.375 6.75V12.3739L13.5 12.375V13.5L12.375 13.4989V13.5H1.125V13.4989L0 13.5V12.375L1.125 12.3739V6.75C1.1249 5.35606 1.64238 4.01173 2.57711 2.97763C3.51185 1.94354 4.79725 1.29336 6.18413 1.15313L6.18525 0H7.335ZM6.75 2.25C5.55653 2.25 4.41193 2.72411 3.56802 3.56802C2.72411 4.41193 2.25 5.55653 2.25 6.75V12.3739H11.25V6.75C11.25 5.55653 10.7759 4.41193 9.93198 3.56802C9.08807 2.72411 7.94347 2.25 6.75 2.25Z"
      fill={COLORS.black}
    />
  </Svg>
);

const ChevronRightIcon: React.FC = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path
      d="M4.25 2.25L7.75 6L4.25 9.75"
      stroke={COLORS.arrow}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileArrowIcon: React.FC = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path
      d="M4.25 2.25L7.75 6L4.25 9.75"
      stroke="#FFFFFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const BluetoothConfigIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.75" stroke="#000000" strokeWidth={1.3} />
    <Path
      d="M8.15 4.15V11.85L5.6 9.45L8.3 7.95L5.6 6.5L8.15 4.15Z"
      stroke="#000000"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LinkIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M6.5 8.8L9.5 5.8C10.3818 4.91817 11.811 4.91817 12.6928 5.8C13.5746 6.68183 13.5746 8.111 12.6928 8.99283L10.5928 11.0928C9.711 11.9746 8.28183 11.9746 7.4 11.0928"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 7.2L6.5 10.2C5.61817 11.0818 4.189 11.0818 3.30717 10.2C2.42535 9.31817 2.42535 7.889 3.30717 7.00717L5.40717 4.90717C6.289 4.02535 7.71817 4.02535 8.6 4.90717"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LanguageIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.75" stroke="#000000" strokeWidth={1.3} />
    <Path
      d="M3.75 8H12.25M7.95 1.7C6.65 3.2 5.9 5.25 5.85 8C5.9 10.75 6.65 12.8 7.95 14.3M8.05 1.7C9.35 3.2 10.1 5.25 10.15 8C10.1 10.75 9.35 12.8 8.05 14.3"
      stroke="#000000"
      strokeWidth={1.1}
      strokeLinecap="round"
    />
  </Svg>
);

const UnitSettingsIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path d="M3 4.25H13M3 8H13M3 11.75H13" stroke="#000000" strokeWidth={1.3} strokeLinecap="round" />
    <Circle cx="5" cy="4.25" r="1" fill="#000000" />
    <Circle cx="8" cy="8" r="1" fill="#000000" />
    <Circle cx="11" cy="11.75" r="1" fill="#000000" />
  </Svg>
);

const DashboardIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 3.25C11.1756 3.25 13.75 5.82436 13.75 9C13.75 10.357 13.2801 11.6042 12.4937 12.5871L8 9L8 3.25Z"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    <Path
      d="M8 3.25C4.82436 3.25 2.25 5.82436 2.25 9C2.25 12.1756 4.82436 14.75 8 14.75C9.42245 14.75 10.7243 14.2335 11.728 13.3771"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="9" r="1.2" fill="#000000" />
  </Svg>
);

const ShieldIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 2L12 3.75V7.55C12 10.2 10.35 12.65 8 13.75C5.65 12.65 4 10.2 4 7.55V3.75L8 2Z"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    <Path d="M8 5.1V8.5" stroke="#000000" strokeWidth={1.2} strokeLinecap="round" />
    <Circle cx="8" cy="10.45" r="0.7" fill="#000000" />
  </Svg>
);

const PrivacyIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 2L12 3.75V7.55C12 10.2 10.35 12.65 8 13.75C5.65 12.65 4 10.2 4 7.55V3.75L8 2Z"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    <Path
      d="M6.55 7.2V6.6C6.55 5.8 7.2 5.15 8 5.15C8.8 5.15 9.45 5.8 9.45 6.6V7.2M6.25 7.2H9.75V10.35H6.25V7.2Z"
      stroke="#000000"
      strokeWidth={1.1}
      strokeLinejoin="round"
    />
  </Svg>
);

const PasswordIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M3 13H13M4.25 9.95L9.95 4.25L11.75 6.05L6.05 11.75H4.25V9.95Z"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    <Path d="M8.85 5.35L10.65 7.15" stroke="#000000" strokeWidth={1.2} strokeLinecap="round" />
  </Svg>
);

const TrashIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path d="M3.25 5.25H12.75V12.5H3.25V5.25Z" stroke="#000000" strokeWidth={1.3} />
    <Path d="M2.25 5.25H13.75M6 3.25H10M6.5 7.5V10.75M9.5 7.5V10.75" stroke="#000000" strokeWidth={1.2} strokeLinecap="round" />
  </Svg>
);

const InfoIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.75" stroke="#000000" strokeWidth={1.3} />
    <Path d="M8 7V10.35" stroke="#000000" strokeWidth={1.2} strokeLinecap="round" />
    <Circle cx="8" cy="4.85" r="0.8" fill="#000000" />
  </Svg>
);

const FolderIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M2.5 4.5H6.1L7.35 5.75H13.5V12.5H2.5V4.5Z"
      stroke="#000000"
      strokeWidth={1.3}
      strokeLinejoin="round"
    />
    <Path d="M2.5 6H13.5" stroke="#000000" strokeWidth={1.2} />
  </Svg>
);

const PROFILE_ITEMS: MenuItem[] = [
  {id: 'bluetooth', label: 'Bluetooth Configuration', icon: BluetoothConfigIcon},
  {id: 'api', label: 'Access API key', value: 'zh', icon: LinkIcon},
];

const PREFERENCE_ITEMS: MenuItem[] = [
  {id: 'language', label: 'Language', value: '°C', icon: LanguageIcon},
  {id: 'unit', label: 'Unit Settings', icon: UnitSettingsIcon},
  {id: 'dashboard', label: 'Data Dashboard', icon: DashboardIcon},
];

const SECURITY_ITEMS: MenuItem[] = [
  {id: 'security', label: 'Security Center', icon: ShieldIcon},
  {id: 'privacy', label: 'Privacy Settings', icon: PrivacyIcon},
  {id: 'password', label: 'Change Password', icon: PasswordIcon},
];

const APP_ITEMS: MenuItem[] = [
  {id: 'cache', label: 'Clear Cache', value: '4.33MB', icon: TrashIcon},
  {id: 'version', label: 'Current Version', value: '3.0.3', icon: InfoIcon},
  {id: 'docs', label: 'Document Center', icon: FolderIcon},
];

const MenuSection: React.FC<{items: MenuItem[]}> = ({items}) => (
  <View style={styles.menuCard}>
    {items.map((item, index) => {
      const Icon = item.icon;
      const isLast = index === items.length - 1;

      return (
        <View key={item.id}>
          <TouchableOpacity activeOpacity={0.85} style={styles.menuRow}>
            <View style={styles.menuLeft}>
              <Icon />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>

            <View style={styles.menuRight}>
              {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>

          {!isLast ? <View style={styles.menuDivider} /> : null}
        </View>
      );
    })}
  </View>
);

// User 页面承接个人资料、系统设置、安全项和应用信息入口。
export const UserPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {scaleValue, verticalScaleValue} = useResponsiveScale();

  const horizontalPadding = scaleValue(20, 18, 24);
  const cardGap = verticalScaleValue(14, 12, 16);
  const headerTop = insets.top + verticalScaleValue(10, 8, 14);
  const contentBottom = insets.bottom + verticalScaleValue(94, 84, 104);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerTop,
            paddingHorizontal: horizontalPadding,
            paddingBottom: contentBottom,
            gap: cardGap,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>User</Text>

          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.85}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Image source={{uri: AVATAR_IMAGE}} style={styles.avatar} />

          <View style={styles.profileContent}>
            <Text style={styles.profileName}>Dave</Text>

            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.85}>
              <Text style={styles.profileButtonText}>Profile</Text>
              <ProfileArrowIcon />
            </TouchableOpacity>
          </View>
        </View>

        <MenuSection items={PROFILE_ITEMS} />
        <MenuSection items={PREFERENCE_ITEMS} />
        <MenuSection items={SECURITY_ITEMS} />
        <MenuSection items={APP_ITEMS} />

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.black,
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6E7EB',
  },
  profileContent: {
    marginLeft: 12,
    gap: 10,
  },
  profileName: {
    fontFamily: 'Inter',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.title,
  },
  profileButton: {
    height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    paddingLeft: 8,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  profileButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '400',
    color: COLORS.white,
  },
  menuCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  menuLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
    color: COLORS.black,
  },
  menuDivider: {
    marginVertical: 12,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  logoutButton: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: COLORS.danger,
  },
});
