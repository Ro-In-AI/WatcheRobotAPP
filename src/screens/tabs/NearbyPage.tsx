import React, {useEffect, useMemo, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';
import type {
  RootStackParamList,
  RootTabParamList,
} from '../../navigation/AppNavigator';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Nearby'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type RouteProps = RouteProp<RootTabParamList, 'Nearby'>;

type NearbyModalType =
  | 'discovery'
  | 'travelConfirmation'
  | 'invitationSent'
  | 'incomingInvite'
  | 'incomingVisit'
  | null;

const COLORS = {
  background: '#F5F5F9',
  black: '#000000',
  white: '#FFFFFF',
  green: '#8FC31F',
  greenDark: '#7EB11A',
  bubble: '#D9D9D9',
  overlay: 'rgba(0, 0, 0, 0.65)',
  bodyText: '#636A74',
  subText: '#8E959F',
  buttonGray: '#F5F5F9',
};

const DEFAULT_DISCOVERY_NAME = 'Garlic-flavored\ncrayfish';
const DEFAULT_DISTANCE = 'Just 100m away';
const DEFAULT_REQUESTER = 'Crab A';
const DEFAULT_TARGET = 'Spicy Crab';

// Nearby 是“附近设备互访”的入口页，主要负责发起邀请、访问以及接收附近请求。
const BellIcon: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 14 16" fill="none">
    <Path
      d="M6.07725 14.0625L6.075 14.0873C6.07503 14.2473 6.13195 14.4022 6.23561 14.5242C6.33926 14.6462 6.4829 14.7274 6.64087 14.7533L6.75 14.7622C6.84076 14.7623 6.93061 14.7441 7.01416 14.7086C7.09771 14.6731 7.17325 14.6212 7.23627 14.5559C7.29928 14.4906 7.34847 14.4132 7.3809 14.3284C7.41333 14.2436 7.42833 14.1532 7.425 14.0625H8.4375C8.43729 14.4959 8.27035 14.9125 7.97129 15.2262C7.67223 15.5398 7.26396 15.7264 6.8311 15.7472C6.39823 15.768 5.97394 15.6215 5.64615 15.3381C5.31836 15.0546 5.11219 14.6558 5.07037 14.2245L5.0625 14.0625H6.07725ZM7.335 0V1.15538C8.71804 1.3 9.99849 1.95178 10.9292 2.98495C11.86 4.01812 12.375 5.35942 12.375 6.75V12.3739L13.5 12.375V13.5L12.375 13.4989V13.5H1.125V13.4989L0 13.5V12.375L1.125 12.3739V6.75C1.1249 5.35606 1.64238 4.01173 2.57711 2.97763C3.51185 1.94354 4.79725 1.29336 6.18413 1.15313L6.18525 0H7.335ZM6.75 2.25C5.55653 2.25 4.41193 2.72411 3.56802 3.56802C2.72411 4.41193 2.25 5.55653 2.25 6.75V12.3739H11.25V6.75C11.25 5.55653 10.7759 4.41193 9.93198 3.56802C9.08807 2.72411 7.94347 2.25 6.75 2.25Z"
      fill={COLORS.black}
    />
  </Svg>
);

const CloseIcon: React.FC = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Circle cx="9" cy="9" r="9" fill="#D9DDE2" />
    <Path
      d="M6 6L12 12M12 6L6 12"
      stroke="#FFFFFF"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const LocationIcon: React.FC = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path
      d="M6 1.25C4.48122 1.25 3.25 2.48122 3.25 4C3.25 6.12671 6 10.25 6 10.25C6 10.25 8.75 6.12671 8.75 4C8.75 2.48122 7.51878 1.25 6 1.25ZM6 5.125C5.37868 5.125 4.875 4.62132 4.875 4C4.875 3.37868 5.37868 2.875 6 2.875C6.62132 2.875 7.125 3.37868 7.125 4C7.125 4.62132 6.62132 5.125 6 5.125Z"
      fill={COLORS.subText}
    />
  </Svg>
);

const DiscoveryIllustration: React.FC = () => (
  <View style={styles.discoveryIllustration}>
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 180 92" fill="none">
      <Path
        d="M58 67C72 37 107 29 124 49"
        stroke={COLORS.green}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
    <Image
      source={require('../../assets/images/robot_watcher.png')}
      style={[styles.discoveryRobot, styles.discoveryRobotLeft]}
      resizeMode="contain"
    />
    <Image
      source={require('../../assets/images/robot_watcher.png')}
      style={[styles.discoveryRobot, styles.discoveryRobotRight]}
      resizeMode="contain"
    />
  </View>
);

const RequestRobotCard: React.FC = () => (
  <View style={styles.requestRobotWrap}>
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 96 96" fill="none">
      <Defs>
        <LinearGradient id="request-robot-bg" x1="0" y1="0" x2="96" y2="96">
          <Stop offset="0" stopColor="#F7F8FB" />
          <Stop offset="1" stopColor="#EEF1F4" />
        </LinearGradient>
      </Defs>
      <Circle cx="48" cy="48" r="48" fill="url(#request-robot-bg)" />
    </Svg>
    <Image
      source={require('../../assets/images/robot_watcher.png')}
      style={styles.requestRobotImage}
      resizeMode="contain"
    />
  </View>
);

const ModalActionButton: React.FC<{
  label: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
}> = ({label, variant, onPress}) => (
  <TouchableOpacity
    style={[
      styles.modalActionButton,
      variant === 'primary'
        ? styles.modalActionPrimary
        : styles.modalActionSecondary,
    ]}
    activeOpacity={0.85}
    onPress={onPress}>
    <Text
      style={[
        styles.modalActionText,
        variant === 'primary'
          ? styles.modalActionPrimaryText
          : styles.modalActionSecondaryText,
      ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Nearby 页负责展示附近设备发现、发起邀请/访问，以及处理来访请求。
// 这个页面的主体是互访流程编排，页面本身更像一个承接多个弹窗状态的流程入口。
export const NearbyPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {windowWidth, windowHeight, scaleValue, verticalScaleValue} =
    useResponsiveScale();

  const [activeModal, setActiveModal] = useState<NearbyModalType>(null);
  const [requesterName, setRequesterName] = useState(DEFAULT_REQUESTER);
  const [targetName, setTargetName] = useState(DEFAULT_TARGET);

  const headerHorizontalPadding = scaleValue(20, 18, 24);
  const horizontalPadding = scaleValue(30, 24, 30);
  const contentWidth = windowWidth - horizontalPadding * 2;
  const sectionTopPadding = verticalScaleValue(10, 8, 14);
  const headerTop = insets.top + sectionTopPadding;
  const headerBottom = verticalScaleValue(30, 22, 34);
  const headerTitleInset = scaleValue(8, 6, 10);

  const heroWidth = Math.min(contentWidth, scaleValue(333, 308, 352));
  const heroTop = verticalScaleValue(158, 142, 158);
  const heroHeight = verticalScaleValue(332, 306, 338);
  const mainBubbleSize = Math.min(
    heroWidth * (298 / 333),
    scaleValue(298, 268, 298),
  );
  const mainBubbleTop = verticalScaleValue(71, 64, 71);
  const topBubbleSize = scaleValue(116, 104, 116);
  const topBubbleTop = 0;
  const topBubbleLeft = heroWidth * (190 / 333);
  const leftTopBubbleSize = scaleValue(53, 48, 53);
  const leftTopBubbleTop = verticalScaleValue(106, 98, 106);
  const leftTopBubbleLeft = heroWidth * (17 / 333);
  const rightBubbleSize = scaleValue(59, 54, 59);
  const rightBubbleTop = verticalScaleValue(266, 252, 266);
  const rightBubbleLeft = heroWidth * (277 / 333);
  const leftBottomBubbleSize = scaleValue(86, 78, 86);
  const leftBottomBubbleTop = verticalScaleValue(286, 272, 286);
  const leftBottomBubbleLeft = heroWidth * (4 / 333);

  const robotWidth = Math.min(
    heroWidth * (138 / 333),
    scaleValue(138, 128, 138),
  );
  const robotHeight = verticalScaleValue(158, 146, 158);
  const robotTop = verticalScaleValue(141, 130, 141);
  const meTop = verticalScaleValue(318, 302, 318);

  const buttonWidth = Math.min(contentWidth, scaleValue(333, 308, 333));
  const buttonHeight = verticalScaleValue(52, 50, 52);
  const tabBarBottom = insets.bottom + verticalScaleValue(8, 8, 8);
  const tabBarHeight = verticalScaleValue(54, 54, 54);
  const buttonToTabGap = verticalScaleValue(111, 100, 118);
  const buttonTop =
    windowHeight - tabBarBottom - tabBarHeight - buttonToTabGap - buttonHeight;

  const modalWidth = Math.min(
    windowWidth - scaleValue(60, 40, 68),
    scaleValue(323, 310, 323),
  );

  // 当其它页面通过 tab 参数把场景带进来时，这里负责恢复对应弹窗。
  useEffect(() => {
    const scenario = route.params?.scenario;
    if (!scenario) {
      return;
    }

    setRequesterName(route.params?.requesterName ?? DEFAULT_REQUESTER);
    setTargetName(route.params?.targetName ?? DEFAULT_TARGET);
    setActiveModal(
      scenario === 'incomingInvite' ? 'incomingInvite' : 'incomingVisit',
    );
    navigation.setParams({
      scenario: undefined,
      requesterName: undefined,
      targetName: undefined,
    });
  }, [
    navigation,
    route.params?.requesterName,
    route.params?.scenario,
    route.params?.targetName,
  ]);

  // 根据当前请求类型切换提示文案，避免邀请和访问显示成同一段文字。
  const activeRequestCopy = useMemo(() => {
    if (activeModal === 'incomingInvite') {
      return `[${requesterName}] Is it okay to invite your Watcher to visit?`;
    }

    return `[${requesterName}] Wondering if it's okay for your Watcher to visit.`;
  }, [activeModal, requesterName]);

  // Nearby 主动发起“访问”时，下一步切到 Watcher 页输入访问时长。
  const openWatcherDurationFlow = () => {
    setActiveModal(null);
    navigation.navigate('Watcher', {
      scenario: 'visitDuration',
      requesterName,
      targetName,
    });
  };

  // Nearby 主动发起“邀请”时，下一步切到 Watcher 页等待对方确认。
  const openWatcherIncomingRequest = () => {
    setActiveModal(null);
    navigation.navigate('Watcher', {
      scenario: 'incomingRequest',
      requestKind: 'invite',
      requesterName,
      targetName,
    });
  };

  // Nearby 作为被访问方时，允许后直接进入访问中的会话页。
  const handlePermitNearbyRequest = () => {
    setActiveModal(null);
    navigation.navigate('VisitingSession', {
      statusText: `[${requesterName}] is visiting...`,
      buttonLabel: 'End the visit.',
    });
  };

  return (
    <View style={styles.container}>
      <View style={{height: headerTop}} />

      <View style={{paddingHorizontal: headerHorizontalPadding}}>
        <View style={[styles.header, {marginBottom: headerBottom}]}>
          <View style={[styles.headerLeft, {paddingLeft: headerTitleInset}]}>
            <Text style={styles.headerTitle}>Nearby</Text>
          </View>

          <TouchableOpacity
            style={styles.headerBell}
            activeOpacity={0.8}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            onPress={() => navigation.navigate('Notification')}
            onLongPress={() => setActiveModal('incomingInvite')}>
            <BellIcon />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.heroLayer,
          {
            top: heroTop,
            width: heroWidth,
            height: heroHeight,
            left: (windowWidth - heroWidth) / 2,
          },
        ]}>
        <View
          style={[
            styles.bubble,
            styles.mainBubble,
            {
              top: mainBubbleTop,
              width: mainBubbleSize,
              height: mainBubbleSize,
              borderRadius: mainBubbleSize / 2,
              left: (heroWidth - mainBubbleSize) / 2,
            },
          ]}
        />
        <View
          style={[
            styles.bubble,
            {
              top: topBubbleTop,
              left: topBubbleLeft,
              width: topBubbleSize,
              height: topBubbleSize,
              borderRadius: topBubbleSize / 2,
            },
          ]}
        />
        <View
          style={[
            styles.bubble,
            {
              top: leftTopBubbleTop,
              left: leftTopBubbleLeft,
              width: leftTopBubbleSize,
              height: leftTopBubbleSize,
              borderRadius: leftTopBubbleSize / 2,
            },
          ]}
        />
        <View
          style={[
            styles.bubble,
            {
              top: rightBubbleTop,
              left: rightBubbleLeft,
              width: rightBubbleSize,
              height: rightBubbleSize,
              borderRadius: rightBubbleSize / 2,
            },
          ]}
        />
        <View
          style={[
            styles.bubble,
            {
              top: leftBottomBubbleTop,
              left: leftBottomBubbleLeft,
              width: leftBottomBubbleSize,
              height: leftBottomBubbleSize,
              borderRadius: leftBottomBubbleSize / 2,
            },
          ]}
        />

        <Image
          source={require('../../assets/images/robot_watcher.png')}
          style={[
            styles.robotImage,
            {
              top: robotTop,
              width: robotWidth,
              height: robotHeight,
              left: (heroWidth - robotWidth) / 2,
            },
          ]}
          resizeMode="contain"
        />

        <Text style={[styles.meText, {top: meTop}]}>Me</Text>
      </View>

      {/* 主操作按钮：正常点击走“发现附近设备”，长按用于本地调试来访弹窗。 */}
      <TouchableOpacity
        style={[
          styles.matchButton,
          {
            top: buttonTop,
            width: buttonWidth,
            height: buttonHeight,
            left: (windowWidth - buttonWidth) / 2,
          },
        ]}
        activeOpacity={0.88}
        onPress={() => setActiveModal('discovery')}
        onLongPress={() => setActiveModal('incomingVisit')}>
        <Text style={styles.matchButtonText}>Match nearby devices</Text>
      </TouchableOpacity>

      <Modal
        visible={activeModal !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setActiveModal(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setActiveModal(null)}
          />

          {/* 发现附近设备后的首个弹窗，用户可以选择邀请或直接访问。 */}
          {activeModal === 'discovery' ? (
            <View style={[styles.modalCard, {width: modalWidth, paddingTop: 18}]}>
              <TouchableOpacity
                style={styles.discoveryClose}
                activeOpacity={0.8}
                onPress={() => setActiveModal(null)}>
                <CloseIcon />
              </TouchableOpacity>

              <Text style={styles.discoveryTitle}>Nearby Discovery</Text>
              <DiscoveryIllustration />
              <Text style={styles.discoveryName}>{DEFAULT_DISCOVERY_NAME}</Text>
              <View style={styles.discoveryDistanceRow}>
                <LocationIcon />
                <Text style={styles.discoveryDistance}>{DEFAULT_DISTANCE}</Text>
              </View>

              <View style={styles.discoveryActions}>
                <ModalActionButton
                  label="Invitation"
                  variant="secondary"
                  onPress={() => setActiveModal('invitationSent')}
                />
                <ModalActionButton
                  label="Visitation"
                  variant="primary"
                  onPress={() => setActiveModal('travelConfirmation')}
                />
              </View>
            </View>
          ) : null}

          {/* 访问链路：确认后跳到 Watcher 页继续输入访问时长。 */}
          {activeModal === 'travelConfirmation' ? (
            <View
              style={[
                styles.modalCard,
                styles.confirmationCard,
                {width: modalWidth},
              ]}>
              <Text style={styles.modalTitle}>Travel Confirmation</Text>
              <Text style={styles.modalDescription}>
                Your crayfish went to visit [{DEFAULT_REQUESTER}]
              </Text>

              <View style={styles.modalActionsRow}>
                <ModalActionButton
                  label="Cancel"
                  variant="secondary"
                  onPress={() => setActiveModal(null)}
                />
                <ModalActionButton
                  label="Confirm"
                  variant="primary"
                  onPress={openWatcherDurationFlow}
                />
              </View>
            </View>
          ) : null}

          {/* 邀请链路：确认后跳到 Watcher 页展示收到邀请的提示。 */}
          {activeModal === 'invitationSent' ? (
            <View
              style={[
                styles.modalCard,
                styles.confirmationCard,
                {width: modalWidth},
              ]}>
              <Text style={styles.modalTitle}>Invitation Sent</Text>
              <Text style={styles.modalDescription}>
                Invitation has been sent and is awaiting the recipient's approval.
              </Text>

              <View style={styles.modalActionsRow}>
                <ModalActionButton
                  label="Cancel"
                  variant="secondary"
                  onPress={() => setActiveModal(null)}
                />
                <ModalActionButton
                  label="Confirm"
                  variant="primary"
                  onPress={openWatcherIncomingRequest}
                />
              </View>
            </View>
          ) : null}

          {/* 被动收到邀请/访问请求时，在 Nearby 页直接做允许或拒绝。 */}
          {activeModal === 'incomingInvite' || activeModal === 'incomingVisit' ? (
            <View
              style={[styles.modalCard, styles.requestCard, {width: modalWidth}]}>
              <Text style={styles.modalTitle}>Visiting Request</Text>
              <RequestRobotCard />
              <Text style={styles.requestDescription}>{activeRequestCopy}</Text>

              <View style={styles.modalActionsRow}>
                <ModalActionButton
                  label="Refuse"
                  variant="secondary"
                  onPress={() => setActiveModal(null)}
                />
                <ModalActionButton
                  label="Permit"
                  variant="primary"
                  onPress={handlePermitNearbyRequest}
                />
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.3,
  },
  headerBell: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLayer: {
    position: 'absolute',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: COLORS.bubble,
  },
  mainBubble: {
    opacity: 0.75,
  },
  robotImage: {
    position: 'absolute',
  },
  meText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
    color: COLORS.black,
  },
  matchButton: {
    position: 'absolute',
    borderRadius: 30,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '500',
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  discoveryClose: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  discoveryTitle: {
    marginTop: 18,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.black,
  },
  discoveryIllustration: {
    marginTop: 12,
    width: 180,
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoveryRobot: {
    position: 'absolute',
    width: 66,
    height: 66,
  },
  discoveryRobotLeft: {
    left: 34,
    bottom: 0,
  },
  discoveryRobotRight: {
    right: 28,
    top: 0,
    width: 56,
    height: 56,
  },
  discoveryName: {
    marginTop: 10,
    fontFamily: 'Inter',
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },
  discoveryDistanceRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discoveryDistance: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '400',
    color: COLORS.subText,
  },
  discoveryActions: {
    marginTop: 18,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  confirmationCard: {
    paddingTop: 18,
  },
  requestCard: {
    paddingTop: 18,
  },
  modalTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
  modalDescription: {
    marginTop: 22,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: COLORS.bodyText,
    textAlign: 'center',
  },
  requestRobotWrap: {
    marginTop: 14,
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestRobotImage: {
    width: 72,
    height: 72,
  },
  requestDescription: {
    marginTop: 12,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '400',
    color: COLORS.bodyText,
    textAlign: 'center',
  },
  modalActionsRow: {
    marginTop: 24,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionPrimary: {
    backgroundColor: COLORS.green,
  },
  modalActionSecondary: {
    backgroundColor: COLORS.buttonGray,
  },
  modalActionText: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '500',
  },
  modalActionPrimaryText: {
    color: COLORS.white,
  },
  modalActionSecondaryText: {
    color: COLORS.greenDark,
  },
});
