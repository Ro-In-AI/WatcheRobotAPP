import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Defs, Ellipse, LinearGradient, Path, Stop} from 'react-native-svg';

const COLORS = {
  background: '#F2F2F7',
  white: '#FFFFFF',
  black: '#000000',
  green: '#8FC31F',
  greenDark: '#77C320',
  lightRing: '#E9E9F2',
  cameraFallback: '#D7D8DE',
};

const CAMERA_IMAGE =
  'https://www.figma.com/api/mcp/asset/9d5536a5-8474-482b-bb63-2da71cd53257';
const EXPAND_ICON =
  'https://www.figma.com/api/mcp/asset/0a5e079d-369a-4a25-9dd7-e1a49cb3e0ff';

const BackIcon: React.FC = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.23544 11.9995L17.3905 19.8827C17.8711 20.3481 17.8711 21.1014 17.3905 21.5653C16.9098 22.03 16.13 22.03 15.6494 21.5653L6.62452 12.8406C6.14458 12.376 6.14458 11.6223 6.62452 11.1591L15.6494 2.43481C15.8905 2.20246 16.2055 2.0863 16.5207 2.0863C16.8358 2.0863 17.1509 2.20248 17.3905 2.43555C17.8711 2.90024 17.8711 3.65242 17.3905 4.1171L9.23544 11.9995Z"
      fill={COLORS.black}
    />
  </Svg>
);

const MicrophoneIcon: React.FC = () => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
    <Path
      d="M11.0003 14.6667C8.47949 14.6667 6.41699 12.4667 6.41699 9.71667V4.95C6.41699 2.2 8.47949 0 11.0003 0C13.5212 0 15.5837 2.2 15.5837 4.95V9.7625C15.5837 12.4667 13.5212 14.6667 11.0003 14.6667ZM11.0003 1.83333C9.48783 1.83333 8.25033 3.20833 8.25033 4.95V9.7625C8.25033 11.4583 9.48783 12.8792 11.0003 12.8792C12.5128 12.8792 13.7503 11.5042 13.7503 9.7625V4.95C13.7503 3.20833 12.5128 1.83333 11.0003 1.83333Z"
      fill="#020202"
    />
    <Path
      d="M17.8747 9.25833C17.3705 9.25833 16.958 9.67083 16.958 10.175V11.0917C16.958 14.1167 14.483 16.5917 11.458 16.5917H10.5413C7.51634 16.5917 5.04134 14.1167 5.04134 11.0917V10.175C5.04134 9.67083 4.62884 9.25833 4.12467 9.25833C3.62051 9.25833 3.20801 9.67083 3.20801 10.175V11.0917C3.20801 14.9875 6.23301 18.15 10.083 18.3792V20.1667H7.74551C7.28717 20.1667 6.87467 20.5792 6.87467 21.0375V21.1292C6.87467 21.5875 7.28717 22 7.74551 22H14.2538C14.7122 22 15.1247 21.5875 15.1247 21.1292V21.0375C15.1247 20.5792 14.7122 20.1667 14.2538 20.1667H11.9163V18.3792C15.7663 18.15 18.7913 14.9417 18.7913 11.0917V10.175C18.7913 9.67083 18.3788 9.25833 17.8747 9.25833Z"
      fill="#020202"
    />
  </Svg>
);

const FaceIcon: React.FC = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={16} r={15.5} fill="white" />
    <Path
      d="M10.2 18.8C10.2 14.2738 13.8188 10.6 18.2833 10.6H20.8667"
      stroke="#0D0D0D"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M11.1 20.45C12.8064 22.8887 15.7312 24.3 18.8 24.3C21.0962 24.3 23.3112 23.5094 25.0833 22.0667"
      stroke="#0D0D0D"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Circle cx={14.2} cy={15.4} r={1.2} fill="#0D0D0D" />
    <Circle cx={21.3} cy={15.4} r={1.2} fill="#0D0D0D" />
    <Path
      d="M9.7 10.7L11.95 8.45"
      stroke="#0D0D0D"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M22.8 8.45L25.05 10.7"
      stroke="#0D0D0D"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const SpeakerIcon: React.FC = () => (
  <Svg width={21} height={17} viewBox="0 0 21 17" fill="none">
    <Path
      d="M8.98363 0.423617C9.29831 0.192799 9.66902 0.0503708 10.0573 0.0111026C10.4456 -0.0281656 10.8373 0.0371563 11.1918 0.200294C11.5464 0.363431 11.8508 0.618444 12.0735 0.938885C12.2963 1.25933 12.4293 1.63353 12.4587 2.02268C12.7635 6.04688 12.7635 10.0884 12.4587 14.1126C12.4293 14.5017 12.2963 14.8759 12.0735 15.1963C11.8508 15.5168 11.5464 15.7718 11.1918 15.9349C10.8373 16.0981 10.4456 16.1634 10.0573 16.1241C9.66902 16.0849 9.29831 15.9424 8.98363 15.7116L4.52638 12.4426H2.37606C1.8773 12.4426 1.39351 12.2722 1.00489 11.9595C0.616264 11.6469 0.346148 11.2109 0.239313 10.7237L0.220063 10.6261C0.0739827 9.78111 0.000360845 8.92516 0 8.06762C0 7.21449 0.0735 6.36137 0.220063 5.50912C0.307553 5.00073 0.5719 4.53961 0.966407 4.20723C1.36091 3.87484 1.8602 3.69257 2.37606 3.69262H4.52594L8.98363 0.423617ZM10.5949 1.88662C10.5216 1.80936 10.4227 1.76148 10.3166 1.75198C10.2105 1.74248 10.1046 1.77199 10.0188 1.83499L5.33006 5.2733C5.17994 5.38336 4.99864 5.44267 4.8125 5.44262H2.37563C2.27252 5.44266 2.17275 5.47912 2.09391 5.54556C2.01506 5.61199 1.96222 5.70414 1.94469 5.80574C1.81548 6.55278 1.75034 7.30949 1.75 8.06762C1.75 8.82099 1.81475 9.5748 1.94469 10.3295C1.96223 10.4312 2.01514 10.5234 2.09407 10.5898C2.17301 10.6563 2.27289 10.6927 2.37606 10.6926H4.8125C4.99864 10.6926 5.17994 10.7519 5.33006 10.8619L10.0188 14.3007C10.0817 14.3468 10.1559 14.3752 10.2335 14.383C10.3112 14.3908 10.3895 14.3777 10.4604 14.345C10.5312 14.3123 10.5921 14.2613 10.6366 14.1972C10.6811 14.1331 10.7077 14.0583 10.7135 13.9804C11.0116 10.0442 11.0116 6.09104 10.7135 2.1548C10.7074 2.07326 10.6786 1.99506 10.6304 1.92905L10.5949 1.88662ZM18.9634 3.0543C19.7304 4.61406 20.1279 6.3295 20.125 8.06762C20.127 9.80564 19.7296 11.5209 18.9634 13.0809C18.861 13.2892 18.6801 13.4483 18.4604 13.5231C18.2407 13.598 18.0003 13.5825 17.792 13.4801C17.5838 13.3777 17.4247 13.1968 17.3498 12.9771C17.275 12.7574 17.2904 12.517 17.3928 12.3087C18.0417 10.9893 18.3778 9.53801 18.375 8.06762C18.3769 6.59732 18.0409 5.14625 17.3928 3.82649C17.2904 3.61821 17.275 3.37779 17.3498 3.15811C17.4247 2.93843 17.5838 2.75748 17.792 2.65509C18.0003 2.55269 18.2407 2.53722 18.4604 2.61209C18.6801 2.68696 18.861 2.84603 18.9634 3.0543ZM16.0269 5.0528C16.4229 6.00854 16.6262 7.0331 16.625 8.06762C16.625 9.11499 16.4203 10.1348 16.0269 11.0824C15.9348 11.2919 15.7642 11.4569 15.5519 11.5421C15.3395 11.6273 15.1022 11.6259 14.8909 11.5382C14.6795 11.4506 14.5109 11.2836 14.4211 11.0731C14.3314 10.8626 14.3277 10.6254 14.4108 10.4122C14.7185 9.66889 14.8763 8.87209 14.875 8.06762C14.875 7.25168 14.7158 6.45937 14.4108 5.72305C14.3277 5.50986 14.3314 5.2726 14.4211 5.06211C14.5109 4.85162 14.6795 4.68465 14.8909 4.59699C15.1022 4.50934 15.3395 4.50796 15.5519 4.59316C15.7642 4.67837 15.9348 4.84337 16.0269 5.0528Z"
      fill="#000000"
    />
  </Svg>
);

const Arrow: React.FC<{direction: 'up' | 'right' | 'down' | 'left'}> = ({direction}) => {
  const rotations = {
    up: '0deg',
    right: '90deg',
    down: '180deg',
    left: '270deg',
  } as const;
  const positions = {
    up: styles.arrowUp,
    right: styles.arrowRight,
    down: styles.arrowDown,
    left: styles.arrowLeft,
  } as const;

  return (
    <View
      style={[
        styles.arrowWrapper,
        positions[direction],
        {transform: [{rotate: rotations[direction]}]},
      ]}>
      <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <Path
          d="M14.4301 2.44547C14.6624 2.04312 15.2432 2.04312 15.4756 2.44547L21.2187 12.3933C21.451 12.7956 21.1608 13.2985 20.6969 13.2985H9.2088C8.74494 13.2985 8.45467 12.7956 8.687 12.3933L14.4301 2.44547Z"
          fill={COLORS.green}
        />
      </Svg>
    </View>
  );
};

const JoystickPad: React.FC = () => (
  <View style={styles.joystickShell}>
    <Arrow direction="up" />
    <Arrow direction="right" />
    <Arrow direction="down" />
    <Arrow direction="left" />

    <View style={styles.centerOuterCircle}>
      <Svg width={92} height={92} viewBox="0 0 92 92" fill="none">
        <Defs>
          <LinearGradient id="joystickGradient" x1="46" y1="15" x2="46" y2="77">
            <Stop offset="0" stopColor={COLORS.greenDark} />
            <Stop offset="1" stopColor={COLORS.green} />
          </LinearGradient>
        </Defs>
        <Ellipse cx={46} cy={46} rx={26} ry={26} fill={COLORS.white} />
        <Ellipse
          cx={46}
          cy={46}
          rx={20.8}
          ry={20.8}
          stroke="url(#joystickGradient)"
          strokeWidth={10}
        />
      </Svg>
    </View>
  </View>
);

export const SurveillancePage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{height: insets.top, backgroundColor: COLORS.white}} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <BackIcon />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>SURVEILLANCE</Text>
        </View>
      </View>

      <ImageBackground
        source={{uri: CAMERA_IMAGE}}
        style={styles.cameraContainer}
        imageStyle={styles.cameraImage}
        resizeMode="cover">
        <View style={styles.cameraFallback} />
        <TouchableOpacity style={styles.expandButton} activeOpacity={0.85}>
          <Image source={{uri: EXPAND_ICON}} style={styles.expandIcon} />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.bottomArea}>
        <View style={styles.joystickSection}>
          <JoystickPad />
        </View>

        <View style={[styles.controlsRow, {paddingBottom: insets.bottom + 14}]}>
          <TouchableOpacity style={styles.smallControl} activeOpacity={0.8}>
            <MicrophoneIcon />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} activeOpacity={0.8}>
            <FaceIcon />
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallControl} activeOpacity={0.8}>
            <SpeakerIcon />
          </TouchableOpacity>
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
    paddingHorizontal: 30,
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
  headerTitle: {
    fontFamily: 'SF Pro',
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  cameraContainer: {
    width: '100%',
    height: 273,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: COLORS.cameraFallback,
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  cameraFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  expandButton: {
    width: 24,
    height: 24,
    marginRight: 36,
    marginBottom: 16,
    zIndex: 2,
  },
  expandIcon: {
    width: '100%',
    height: '100%',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  joystickSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  joystickShell: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  arrowWrapper: {
    position: 'absolute',
  },
  arrowUp: {
    top: 28,
  },
  arrowRight: {
    right: 28,
  },
  arrowDown: {
    bottom: 28,
  },
  arrowLeft: {
    left: 28,
  },
  centerOuterCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.lightRing,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  smallControl: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
