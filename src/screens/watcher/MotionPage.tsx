import React, {useRef, useState} from 'react';
import {
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Defs, Ellipse, LinearGradient, Path, Stop} from 'react-native-svg';
import type {WatcherStackParamList} from '../../navigation/AppNavigator';
import {WatcherHeader} from '../../components/WatcherHeader';

const COLORS = {
  background: '#F5F5F9',
  white: '#FFFFFF',
  black: '#000000',
  title: '#1A1A1A',
  secondary: '#8E959F',
  green: '#8FC31F',
  greenDark: '#77C320',
  lightRing: '#EEF0F5',
  divider: '#EEF0F3',
};

const ROBOT_IMAGE =
  'https://www.figma.com/api/mcp/asset/5fdd0947-93dc-47a3-855c-8261f368c503';

const DANCE_ITEMS = [
  {
    id: 'love',
    title: 'Love',
    image: 'https://www.figma.com/api/mcp/asset/deac19a8-76c2-4a6f-a830-3e18868805de',
  },
  {
    id: 'error',
    title: 'Error',
    image: 'https://www.figma.com/api/mcp/asset/dcc2cccf-5e8f-420f-b1b9-e450551edfd2',
  },
  {
    id: 'invoke',
    title: 'Invoke the tool',
    image: 'https://www.figma.com/api/mcp/asset/d270b506-d190-46c3-aa35-900581775b54',
  },
  {
    id: 'happy',
    title: 'Happy',
    image: 'https://www.figma.com/api/mcp/asset/2ad79225-70da-4eed-b1d8-e6eaafdffaaa',
  },
  {
    id: 'sleep',
    title: 'Sleep',
    image: 'https://www.figma.com/api/mcp/asset/a3ce1c81-0cc2-402d-8a91-9ea11d7f7918',
  },
  {
    id: 'thinking',
    title: 'Thinking',
    image: 'https://www.figma.com/api/mcp/asset/48db04a0-dce5-4009-8d98-4fa3c60a9638',
  },
  {
    id: 'think',
    title: 'Think',
    image: 'https://www.figma.com/api/mcp/asset/33ded805-a253-4288-bf73-89b119bd4fc1',
  },
  {
    id: 'speaking',
    title: 'Speaking',
    image: 'https://www.figma.com/api/mcp/asset/f41f40d0-0d1e-4216-b7a4-870f760f2915',
  },
  {
    id: 'listen',
    title: 'listen',
    image: 'https://www.figma.com/api/mcp/asset/ef40f096-146b-4ac2-9931-3f711d4521f5',
  },
];

const JOYSTICK_RADIUS = 30;
type MotionNavigationProp = NativeStackNavigationProp<WatcherStackParamList>;

const Arrow: React.FC<{direction: 'up' | 'right' | 'down' | 'left'}> = ({direction}) => {
  const rotation = {
    up: '0deg',
    right: '90deg',
    down: '180deg',
    left: '270deg',
  } as const;
  const position = {
    up: styles.arrowUp,
    right: styles.arrowRight,
    down: styles.arrowDown,
    left: styles.arrowLeft,
  } as const;

  return (
    <View style={[styles.arrowWrapper, position[direction], {transform: [{rotate: rotation[direction]}]}]}>
      <Svg width={24} height={24} viewBox="0 0 28 28" fill="none">
        <Path
          d="M14.4301 2.44547C14.6624 2.04312 15.2432 2.04312 15.4756 2.44547L21.2187 12.3933C21.451 12.7956 21.1608 13.2985 20.6969 13.2985H9.2088C8.74494 13.2985 8.45467 12.7956 8.687 12.3933L14.4301 2.44547Z"
          fill={COLORS.green}
        />
      </Svg>
    </View>
  );
};

export const MotionPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const navigation = useNavigation<MotionNavigationProp>();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [joystickOffset, setJoystickOffset] = useState({x: 0, y: 0});
  const panStartRef = useRef({x: 0, y: 0});

  const widthScale = Math.min(Math.max(windowWidth / 393, 0.92), 1.12);
  const heightScale = Math.min(Math.max(windowHeight / 852, 0.88), 1.1);
  const scaleValue = (value: number, min?: number, max?: number) => {
    const scaled = value * widthScale;
    if (typeof min === 'number' && scaled < min) {
      return min;
    }
    if (typeof max === 'number' && scaled > max) {
      return max;
    }
    return scaled;
  };
  const verticalScaleValue = (value: number, min?: number, max?: number) => {
    const scaled = value * heightScale;
    if (typeof min === 'number' && scaled < min) {
      return min;
    }
    if (typeof max === 'number' && scaled > max) {
      return max;
    }
    return scaled;
  };

  const horizontalPadding = scaleValue(20, 18, 24);
  const headerSideInset = scaleValue(30, 26, 32);
  const contentWidth = windowWidth - horizontalPadding * 2;
  const robotTop = verticalScaleValue(24, 20, 28);
  const robotBottom = verticalScaleValue(17, 14, 22);
  const robotWidth = Math.min(scaleValue(171, 158, 182), contentWidth * 0.52);
  const robotHeight = Math.min(scaleValue(196, 182, 210), contentWidth * 0.6);
  const cardTopPadding = verticalScaleValue(20, 18, 24);
  const joystickTop = verticalScaleValue(24, 20, 28);
  const joystickBottom = verticalScaleValue(18, 14, 22);
  const joystickShellSize = Math.min(scaleValue(185, 170, 194), contentWidth * 0.56);
  const joystickCenter = joystickShellSize / 2;
  const joystickMaxDistance = joystickShellSize * (28 / 185);
  const danceTop = verticalScaleValue(16, 14, 18);
  const gridBottomPadding = insets.bottom + verticalScaleValue(16, 12, 22);
  const gridItemWidth = Math.floor((contentWidth - 32) / 3);
  const gridImageSize = Math.min(scaleValue(85, 76, 88), gridItemWidth - scaleValue(22, 18, 24));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panStartRef.current = joystickOffset;
      },
      onPanResponderMove: (_, gestureState) => {
        const nextX = panStartRef.current.x + gestureState.dx;
        const nextY = panStartRef.current.y + gestureState.dy;
        const distance = Math.sqrt(nextX * nextX + nextY * nextY);

        if (distance <= joystickMaxDistance) {
          setJoystickOffset({x: nextX, y: nextY});
          return;
        }

        const angle = Math.atan2(nextY, nextX);
        setJoystickOffset({
          x: Math.cos(angle) * joystickMaxDistance,
          y: Math.sin(angle) * joystickMaxDistance,
        });
      },
      onPanResponderRelease: () => {
        setJoystickOffset({x: 0, y: 0});
      },
      onPanResponderTerminate: () => {
        setJoystickOffset({x: 0, y: 0});
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={{height: insets.top, backgroundColor: COLORS.background}} />

      <WatcherHeader
        title="Motion"
        onBack={() => navigation.goBack()}
        sideInset={headerSideInset}
        backgroundColor={COLORS.background}
      />

      <View style={styles.content}>
        <View
          style={[
            styles.robotSection,
            {
              width: contentWidth,
              marginTop: robotTop,
              marginBottom: robotBottom,
            },
          ]}>
          <Image
            source={{uri: ROBOT_IMAGE}}
            style={[styles.robotImage, {width: robotWidth, height: robotHeight}]}
            resizeMode="contain"
          />
        </View>

        <View
          style={[
            styles.card,
            {
              width: contentWidth,
              paddingTop: cardTopPadding,
            },
          ]}>
          <Text style={styles.sectionTitle}>Joystick</Text>

          <View
            style={[
              styles.joystickSection,
              {paddingTop: joystickTop, paddingBottom: joystickBottom},
            ]}>
            <View
              style={[styles.joystickShell, {width: joystickShellSize, height: joystickShellSize, borderRadius: joystickCenter}]}
              collapsable={false}
              {...panResponder.panHandlers}>
              <Arrow direction="up" />
              <Arrow direction="right" />
              <Arrow direction="down" />
              <Arrow direction="left" />

              <View
                style={[
                  styles.joystickKnobOuter,
                  {
                    left: joystickCenter - JOYSTICK_RADIUS + joystickOffset.x,
                    top: joystickCenter - JOYSTICK_RADIUS + joystickOffset.y,
                  },
                ]}>
                <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
                  <Defs>
                    <LinearGradient id="motionKnobGradient" x1="30" y1="8" x2="30" y2="52">
                      <Stop offset="0" stopColor={COLORS.greenDark} />
                      <Stop offset="1" stopColor={COLORS.green} />
                    </LinearGradient>
                  </Defs>
                  <Ellipse cx={30} cy={30} rx={20} ry={20} fill={COLORS.white} />
                  <Ellipse cx={30} cy={30} rx={15.5} ry={15.5} stroke="url(#motionKnobGradient)" strokeWidth={8} />
                </Svg>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.danceSection}>
            <Text style={[styles.danceTitle, {marginBottom: danceTop}]}>Dance</Text>

            <ScrollView
              style={styles.danceScroll}
              contentContainerStyle={[styles.grid, {paddingBottom: gridBottomPadding}]}
              showsVerticalScrollIndicator={false}>
              {DANCE_ITEMS.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.gridItem,
                    {width: gridItemWidth},
                    selectedItem === item.id && styles.gridItemActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedItem(current => (current === item.id ? null : item.id))}>
                  <Image
                    source={{uri: item.image}}
                    style={[styles.gridImage, {width: gridImageSize, height: gridImageSize}]}
                    resizeMode="contain"
                  />
                  <Text style={styles.gridLabel} numberOfLines={1}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
  },
  robotSection: {
    alignItems: 'center',
  },
  robotImage: {
    alignSelf: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  joystickSection: {
    alignItems: 'center',
  },
  joystickShell: {
    backgroundColor: COLORS.white,
    position: 'relative',
    shadowColor: '#CFCFD7',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 6,
  },
  arrowWrapper: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowUp: {
    top: '10.27027%',
    left: '43.51351%',
  },
  arrowRight: {
    right: '10.27027%',
    top: '43.51351%',
  },
  arrowDown: {
    bottom: '10.27027%',
    left: '43.51351%',
  },
  arrowLeft: {
    left: '10.27027%',
    top: '43.51351%',
  },
  joystickKnobOuter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightRing,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  danceSection: {
    flex: 1,
    paddingTop: 16,
  },
  danceTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },
  danceScroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  gridItem: {
    paddingHorizontal: 11,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  gridItemActive: {
    backgroundColor: '#F3F5F8',
  },
  gridImage: {
    marginBottom: 12,
  },
  gridLabel: {
    width: '100%',
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
    color: COLORS.black,
    textAlign: 'center',
  },
});
