import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {WatcherHeader} from '../../components/WatcherHeader';
import {useResponsiveScale} from '../../hooks/useResponsiveScale';
import type {WatcherStackParamList} from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<WatcherStackParamList, 'ScanCode'>;

const COLORS = {
  white: '#FFFFFF',
  green: '#8FC31F',
  overlay: 'rgba(0, 0, 0, 0.26)',
  panel: 'rgba(0, 0, 0, 0.46)',
  fallback: '#1C1D21',
};

const ScannerCorners: React.FC = () => (
  <Svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
    <Path
      d="M189.387 105H11.6127C8.51343 105 6 102.537 6 99.501C6 96.4619 8.51343 94 11.6127 94H189.387C192.488 94 195 96.463 195 99.501C195.001 102.537 192.488 105 189.387 105Z"
      fill={COLORS.green}
    />
    <Path
      d="M76.75 7H53.5H25C15.0589 7 7 15.0589 7 25V53.5V65.125M123.25 7H146.5H175C184.941 7 193 15.0589 193 25V53.5V65.125M76.75 193H53.5H25C15.0589 193 7 184.941 7 175V146.5V134.875M123.25 193H134.875H146.5H175C184.941 193 193 184.941 193 175V146.5V134.875"
      stroke={COLORS.green}
      strokeWidth="9"
      strokeLinecap="round"
    />
  </Svg>
);

const BarcodeHint: React.FC = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Path
      d="M8.39941 4.40088H2.40088V10.3994C2.40088 10.7175 2.27453 11.0225 2.04963 11.2474C1.82474 11.4723 1.51971 11.5986 1.20166 11.5986C0.883605 11.5986 0.578578 11.4723 0.353681 11.2474C0.128783 11.0225 0.00243755 10.7175 0.00243755 10.3994V3.19922C0.00243755 2.53624 0.538674 2 1.20166 2H8.40185C8.5595 2.00016 8.71556 2.03137 8.86115 2.09184C9.00673 2.15232 9.13898 2.24088 9.25033 2.35246C9.36169 2.46405 9.44998 2.59647 9.51016 2.74218C9.57034 2.88788 9.60123 3.04401 9.60107 3.20166C9.60091 3.3593 9.5697 3.51537 9.50923 3.66095C9.44875 3.80654 9.36019 3.93878 9.24861 4.05014C9.13703 4.1615 9.0046 4.24979 8.8589 4.30997C8.71319 4.37015 8.55706 4.40104 8.39941 4.40088ZM8.39941 32H1.19922C0.881167 32 0.576141 31.8736 0.351244 31.6488C0.126346 31.4239 0 31.1188 0 30.8008V23.6006C0 23.2825 0.126346 22.9775 0.351244 22.7526C0.576141 22.5277 0.881167 22.4014 1.19922 22.4014C1.51727 22.4014 1.8223 22.5277 2.0472 22.7526C2.27209 22.9775 2.39844 23.2825 2.39844 23.6006V29.5991H8.39698C8.71535 29.5988 9.02082 29.725 9.24617 29.9499C9.47153 30.1748 9.59831 30.48 9.59863 30.7983C9.59896 31.1167 9.47279 31.4222 9.2479 31.6475C9.023 31.8729 8.71779 31.9997 8.39941 32ZM28.7983 11.6011C28.4803 11.6011 28.1753 11.4747 27.9504 11.2498C27.7255 11.0249 27.5991 10.7199 27.5991 10.4019V4.40331H21.6006C21.4431 4.40331 21.2872 4.3723 21.1417 4.31203C20.9962 4.25176 20.864 4.16343 20.7526 4.05207C20.6413 3.94071 20.5529 3.80851 20.4927 3.66302C20.4324 3.51752 20.4014 3.36158 20.4014 3.20409C20.4014 3.04661 20.4324 2.89067 20.4927 2.74517C20.5529 2.59968 20.6413 2.46748 20.7526 2.35612C20.864 2.24476 20.9962 2.15643 21.1417 2.09616C21.2872 2.03589 21.4431 2.00488 21.6006 2.00488H28.8008C29.4638 2.00488 30 2.54111 30 3.20409V10.4043C29.9987 10.7221 29.8715 11.0265 29.6463 11.2508C29.4211 11.4751 29.1162 11.6011 28.7983 11.6011ZM28.7983 32H21.5981C21.2801 32 20.9751 31.8736 20.7502 31.6488C20.5253 31.4239 20.3989 31.1188 20.3989 30.8008C20.3989 30.4827 20.5253 30.1777 20.7502 29.9528C20.9751 29.7279 21.2801 29.6016 21.5981 29.6016H27.5967V23.603C27.5967 23.285 27.723 22.9799 27.9479 22.755C28.1728 22.5301 28.4779 22.4038 28.7959 22.4038C29.114 22.4038 29.419 22.5301 29.6439 22.755C29.8688 22.9799 29.9951 23.285 29.9951 23.603V30.8032C29.9954 30.9605 29.9647 31.1162 29.9047 31.2616C29.8446 31.4069 29.7565 31.539 29.6453 31.6502C29.5341 31.7614 29.4021 31.8495 29.2567 31.9096C29.1114 31.9696 28.9556 32.0003 28.7983 32ZM3.88772 10.0094H6.55427V23.993H3.88772V10.0094ZM7.39031 10.0094H8.72359V23.993H7.39031V10.0094ZM24.0721 10.0094H25.9758V23.993H24.0721V10.0094ZM19.8066 10.0094H21.1399V23.993H19.8066V10.0094ZM9.98131 10.0094H13.6375V23.993H9.98131V10.0094ZM16.4552 10.0094H18.6635V23.993H16.4552V10.0094ZM14.398 10.0094H15V23.993H14.398V10.0094ZM22.9363 10.0094H23.5383V23.993H22.9363V10.0094"
      fill="#FFFFFF"
    />
    <Path
      d="M8.39941 4.40088H2.40088V10.3994C2.40088 10.7175 2.27453 11.0225 2.04963 11.2474C1.82474 11.4723 1.51971 11.5986 1.20166 11.5986C0.883605 11.5986 0.578578 11.4723 0.353681 11.2474C0.128783 11.0225 0.00243755 10.7175 0.00243755 10.3994V3.19922C0.00243755 2.53624 0.538674 2 1.20166 2H8.40185C8.5595 2.00016 8.71556 2.03137 8.86115 2.09184C9.00673 2.15232 9.13898 2.24088 9.25033 2.35246C9.36169 2.46405 9.44998 2.59647 9.51016 2.74218C9.57034 2.88788 9.60123 3.04401 9.60107 3.20166C9.60091 3.3593 9.5697 3.51537 9.50923 3.66095C9.44875 3.80654 9.36019 3.93878 9.24861 4.05014C9.13703 4.1615 9.0046 4.24979 8.8589 4.30997C8.71319 4.37015 8.55706 4.40104 8.39941 4.40088ZM8.39941 32H1.19922C0.881167 32 0.576141 31.8736 0.351244 31.6488C0.126346 31.4239 0 31.1188 0 30.8008V23.6006C0 23.2825 0.126346 22.9775 0.351244 22.7526C0.576141 22.5277 0.881167 22.4014 1.19922 22.4014C1.51727 22.4014 1.8223 22.5277 2.0472 22.7526C2.27209 22.9775 2.39844 23.2825 2.39844 23.6006V29.5991H8.39698C8.71535 29.5988 9.02082 29.725 9.24617 29.9499C9.47153 30.1748 9.59831 30.48 9.59863 30.7983C9.59896 31.1167 9.47279 31.4222 9.2479 31.6475C9.023 31.8729 8.71779 31.9997 8.39941 32ZM28.7983 11.6011C28.4803 11.6011 28.1753 11.4747 27.9504 11.2498C27.7255 11.0249 27.5991 10.7199 27.5991 10.4019V4.40331H21.6006C21.4431 4.40331 21.2872 4.3723 21.1417 4.31203C20.9962 4.25176 20.864 4.16343 20.7526 4.05207C20.6413 3.94071 20.5529 3.80851 20.4927 3.66302C20.4324 3.51752 20.4014 3.36158 20.4014 3.20409C20.4014 3.04661 20.4324 2.89067 20.4927 2.74517C20.5529 2.59968 20.6413 2.46748 20.7526 2.35612C20.864 2.24476 20.9962 2.15643 21.1417 2.09616C21.2872 2.03589 21.4431 2.00488 21.6006 2.00488H28.8008C29.4638 2.00488 30 2.54111 30 3.20409V10.4043C29.9987 10.7221 29.8715 11.0265 29.6463 11.2508C29.4211 11.4751 29.1162 11.6011 28.7983 11.6011ZM28.7983 32H21.5981C21.2801 32 20.9751 31.8736 20.7502 31.6488C20.5253 31.4239 20.3989 31.1188 20.3989 30.8008C20.3989 30.4827 20.5253 30.1777 20.7502 29.9528C20.9751 29.7279 21.2801 29.6016 21.5981 29.6016H27.5967V23.603C27.5967 23.285 27.723 22.9799 27.9479 22.755C28.1728 22.5301 28.4779 22.4038 28.7959 22.4038C29.114 22.4038 29.419 22.5301 29.6439 22.755C29.8688 22.9799 29.9951 23.285 29.9951 23.603V30.8032C29.9954 30.9605 29.9647 31.1162 29.9047 31.2616C29.8446 31.4069 29.7565 31.539 29.6453 31.6502C29.5341 31.7614 29.4021 31.8495 29.2567 31.9096C29.1114 31.9696 28.9556 32.0003 28.7983 32Z"
      fill="#8FC31F"
    />
  </Svg>
);

const FlashIcon: React.FC = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Path
      d="M8.53418 5.5249H22.9342C23.4092 5.5249 23.7936 5.14053 23.7936 4.66553C23.7936 4.19053 23.4092 3.80615 22.9342 3.80615H8.53418C8.05918 3.80615 7.6748 4.19053 7.6748 4.66553C7.6748 5.14053 8.05918 5.5249 8.53418 5.5249ZM23.8748 7.47803H7.71543V12.2812L11.1998 16.0155V29.4812H20.3936V16.1312L23.8748 12.2718V7.47803ZM18.6717 27.7655H12.9186V16.4218H18.6748V27.7655H18.6717ZM22.1561 11.6124L19.3811 14.6874H12.3092L9.43105 11.603V9.19678H22.1561V11.6124Z"
      fill="#FFFFFF"
    />
  </Svg>
);

// 扫码页用于调用摄像头扫描设备二维码，并继续进入绑定/配网流程。
export const ScanCodePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();
  const {scaleValue, verticalScaleValue, windowWidth, windowHeight} =
    useResponsiveScale();
  const [permissionRequested, setPermissionRequested] = useState(false);
  const hasNavigatedRef = useRef(false);

  // 页面主要尺寸按统一响应式规则换算
  const sideInset = scaleValue(30, 24, 30);
  const contentWidth = windowWidth - sideInset * 2;
  const titleTop = verticalScaleValue(169, 148, 178);
  const frameTop = verticalScaleValue(34, 28, 38);
  const flashTop = verticalScaleValue(32, 24, 36);
  const frameSize = Math.min(contentWidth * 0.6, scaleValue(200, 188, 208));
  const dividerWidth = Math.min(contentWidth * 0.82, scaleValue(270, 248, 278));
  const actionBottom = Math.max(36, windowHeight * 0.06);
  const actionWidth = Math.min(contentWidth, scaleValue(240, 220, 260));

  useEffect(() => {
    if (!hasPermission && !permissionRequested) {
      setPermissionRequested(true);
      requestPermission().catch(() => {});
    }
  }, [hasPermission, permissionRequested, requestPermission]);

  const handleScanSuccess = () => {
    if (hasNavigatedRef.current) {
      return;
    }

    hasNavigatedRef.current = true;
    navigation.replace('WifiSelect');
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        handleScanSuccess();
      }
    },
  });

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {device && hasPermission ? (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused}
            codeScanner={codeScanner}
          />
        ) : (
          <View style={styles.cameraFallback} />
        )}

        <View style={{height: insets.top}} />
        <View style={styles.overlay} />

        <WatcherHeader
          title="Scan Code"
          onBack={() => navigation.goBack()}
          sideInset={sideInset}
          backgroundColor="transparent"
          titleColor="#FFFFFF"
          iconColor="#FFFFFF"
        />

        <View style={styles.content}>
          <View style={{marginTop: titleTop}}>
            <View style={styles.scanTitleRow}>
              <BarcodeHint />
              <Text style={styles.scanTitle}>Scan Device QR Code</Text>
            </View>

            <View style={[styles.scanDivider, {width: dividerWidth}]} />

            <View
              style={[
                styles.scanFrameWrap,
                {
                  width: frameSize,
                  height: frameSize,
                  marginTop: frameTop,
                },
              ]}>
              <ScannerCorners />
            </View>

            <View style={[styles.flashWrap, {marginTop: flashTop}]}>
              <FlashIcon />
            </View>

            {!hasPermission ? (
              <View style={styles.permissionHintWrap}>
                <Text style={styles.permissionHintTitle}>Camera access required</Text>
                <Text style={styles.permissionHintText}>
                  Enable camera permission to scan your device QR code.
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              bottom: actionBottom,
              width: actionWidth,
            },
          ]}
          activeOpacity={0.85}
          onPress={
            hasPermission
              ? () => navigation.navigate('WifiSelect')
              : async () => {
                  await requestPermission();
                }
          }>
          <Text style={styles.actionButtonText}>
            {hasPermission ? 'Use scanned device' : 'Allow camera'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101113',
  },
  container: {
    flex: 1,
  },
  cameraFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.fallback,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  scanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scanDivider: {
    marginTop: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  scanFrameWrap: {
    alignSelf: 'center',
  },
  flashWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionHintWrap: {
    alignSelf: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.panel,
    alignItems: 'center',
    maxWidth: 260,
  },
  permissionHintTitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  permissionHintText: {
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.86)',
    textAlign: 'center',
  },
  actionButton: {
    position: 'absolute',
    alignSelf: 'center',
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(143,195,31,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
