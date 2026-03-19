import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Svg, Path, Rect} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

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
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = React.useState<TabType>('default');
  const [selectedRobot, setSelectedRobot] = React.useState<string>('Watcher-01');

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
  const tabTop = verticalScaleValue(22, 18, 28);
  const tabHeight = verticalScaleValue(50, 48, 52);
  const tabInnerHeight = verticalScaleValue(42, 40, 44);
  const robotTop = verticalScaleValue(28, 20, 34);
  const robotBottom = verticalScaleValue(26, 22, 34);
  const robotSize = Math.min(scaleValue(196, 176, 210), contentWidth * 0.56);
  const robotLabelTop = verticalScaleValue(16, 14, 18);
  const bottomCardTopPadding = verticalScaleValue(16, 14, 18);
  const bottomContentBottom = insets.bottom + verticalScaleValue(16, 12, 22);
  const itemWidth = Math.floor((contentWidth - 32) / 3);
  const iconSize = Math.min(scaleValue(85, 76, 88), itemWidth - scaleValue(22, 18, 24));
  const addButtonSize = Math.min(scaleValue(75, 68, 80), itemWidth);

  return (
    <View style={styles.container}>
      <View style={{height: insets.top, backgroundColor: COLORS.white}} />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.headerButton, {left: headerSideInset}]}
            onPress={() => navigation.goBack()}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9.23544 11.9995L17.3905 19.8827C17.8711 20.3481 17.8711 21.1014 17.3905 21.5653C16.9098 22.03 16.13 22.03 15.6494 21.5653L6.62452 12.8406C6.14458 12.376 6.14458 11.6223 6.62452 11.1591L15.6494 2.43481C15.8905 2.20246 16.2055 2.0863 16.5207 2.0863C16.8358 2.0863 17.1509 2.20248 17.3905 2.43555C17.8711 2.90024 17.8711 3.65242 17.3905 4.1171L9.23544 11.9995Z"
                fill="black"
              />
            </Svg>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Dance</Text>

          <TouchableOpacity
            style={[styles.headerRightButton, {right: headerSideInset}]}>
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
      </View>

      <View
        style={[
          styles.timeBar,
          {
            marginHorizontal: horizontalPadding,
            marginTop: tabTop,
            height: tabHeight,
          },
        ]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            {height: tabInnerHeight},
            selectedTab === 'default' && styles.buttonActive,
          ]}
          onPress={() => setSelectedTab('default')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'default' && styles.textActive,
            ]}>
            Default
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            {height: tabInnerHeight},
            selectedTab === 'customization' && styles.buttonActive,
          ]}
          onPress={() => setSelectedTab('customization')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'customization' && styles.textActive,
            ]}>
            Customization
          </Text>
        </TouchableOpacity>
      </View>

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
          source={require('../../assets/images/robot_watcher.png')}
          style={[styles.robotImage, {width: robotSize, height: robotSize}]}
          resizeMode="contain"
        />
        <Text style={[styles.robotLabel, {marginTop: robotLabelTop}]}>
          Watcher-01
        </Text>
      </View>

      <View
        style={[
          styles.bottomCard,
          {
            marginHorizontal: horizontalPadding,
            paddingTop: bottomCardTopPadding,
          },
        ]}>
        <Text style={styles.otherTitle}>Other</Text>

        {selectedTab === 'default' ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.iconGrid,
              {paddingBottom: bottomContentBottom},
            ]}>
            {DEFAULT_ROBOTS.map(robotName => (
              <TouchableOpacity
                key={robotName}
                style={[
                  styles.iconItem,
                  {width: itemWidth},
                  selectedRobot === robotName && styles.iconItemActive,
                ]}
                onPress={() => setSelectedRobot(robotName)}>
                <Image
                  source={require('../../assets/images/robot_watcher.png')}
                  style={[styles.iconImage, {width: iconSize, height: iconSize}]}
                  resizeMode="contain"
                />
                <Text style={styles.iconLabel}>{robotName}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.iconGrid,
              {paddingBottom: bottomContentBottom},
            ]}>
            <View style={[styles.customIconItem, {width: itemWidth}]}>
              <Image
                source={require('../../assets/images/robot_watcher.png')}
                style={[styles.iconImage, {width: iconSize, height: iconSize}]}
                resizeMode="contain"
              />
              <Text style={styles.iconLabel}>Watcher-04</Text>
            </View>

            <TouchableOpacity
              style={[styles.addButton, {width: itemWidth, height: itemWidth}]}>
              <Svg
                width={addButtonSize}
                height={addButtonSize}
                viewBox="0 0 75 75"
                fill="none">
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

            <View style={[styles.emptySlot, {width: itemWidth}]} />
          </ScrollView>
        )}
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
  headerRightButton: {
    position: 'absolute',
    right: 0,
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
  timeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
    borderRadius: 30,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.gray,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  robotSection: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  robotImage: {
    alignSelf: 'center',
  },
  robotLabel: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
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
    alignItems: 'flex-start',
  },
  iconItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 11,
    alignItems: 'center',
    gap: 12,
  },
  iconItemActive: {
    backgroundColor: '#F3F5F8',
  },
  customIconItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 11,
    alignItems: 'center',
    gap: 12,
  },
  emptySlot: {
    height: 1,
  },
  iconImage: {
    alignSelf: 'center',
  },
  iconLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.black,
    textAlign: 'center',
  },
  buttonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#0000001a',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 7.35,
    elevation: 2,
  },
  textActive: {
    fontWeight: '600',
    color: '#0D0D0D',
  },
  addButton: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
