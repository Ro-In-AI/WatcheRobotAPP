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
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';

const COLORS = {
  background: '#F0F0F6',
  white: '#FFFFFF',
  text: '#1A1A1A',
  muted: '#79797B',
  cardTitle: '#7A7A7A',
  green: '#8FC31F',
  thumbBorder: '#0F0F10',
};

type ThumbnailItem =
  | {type: 'image'; uri: string}
  | {type: 'composite'; backgroundUri: string; overlayUri: string}
  | {type: 'placeholder'};

const GROUPS: Array<{title: string; items: ThumbnailItem[]}> = [
  {
    title: 'Standby',
    items: [
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/e707ac63-515b-4215-8c41-69eecb0fe07c',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/41d3d237-fff8-4284-913a-acf27762bc08',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/fce20d30-ba49-49cf-95dd-1cdfcafddb8c',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/a9c1f613-d38c-4d61-8edf-653aaf6c99b4',
      },
      {type: 'placeholder'},
    ],
  },
  {
    title: 'Listening',
    items: [
      {
        type: 'composite',
        backgroundUri:
          'https://www.figma.com/api/mcp/asset/25de3c5a-723d-4641-b1ef-e7627a9a1f26',
        overlayUri:
          'https://www.figma.com/api/mcp/asset/7096b6cc-59af-4e37-87a5-82fa8c3a812a',
      },
      {
        type: 'composite',
        backgroundUri:
          'https://www.figma.com/api/mcp/asset/f6870895-f5c4-4961-a81b-0ab4c8afe825',
        overlayUri:
          'https://www.figma.com/api/mcp/asset/7096b6cc-59af-4e37-87a5-82fa8c3a812a',
      },
      {type: 'placeholder'},
      {type: 'placeholder'},
      {type: 'placeholder'},
    ],
  },
  {
    title: 'Speaking',
    items: [
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/40ee32b8-1ba5-4a76-b2c3-c7326fd160d3',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/fdc748f8-0551-4353-8f9b-03ddcf2eabc2',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/b8edf019-7cbd-4d88-bccc-5436c10c1699',
      },
      {type: 'placeholder'},
      {type: 'placeholder'},
    ],
  },
  {
    title: 'Watching Space',
    items: [
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/85941a61-4b07-4b18-b52b-9e18d1ffcbb1',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/1e4855df-5937-43b1-86bb-d7af1c74da1e',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/cb7d2420-e551-4112-91d1-3d6cacba539c',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/60904e85-c4cf-447a-8dff-1c36b94fa2d6',
      },
      {
        type: 'image',
        uri: 'https://www.figma.com/api/mcp/asset/998567e2-ee91-4bfd-bc0e-3b297eb0350b',
      },
    ],
  },
];

const PlayIcon: React.FC = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 4.8C7 3.72 8.212 3.094 9.086 3.72L18.685 10.92C19.405 11.46 19.405 12.54 18.685 13.08L9.086 20.28C8.212 20.906 7 20.28 7 19.2V4.8Z"
      fill={COLORS.green}
    />
  </Svg>
);

const BackIcon: React.FC = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.23544 11.9995L17.3905 19.8827C17.8711 20.3481 17.8711 21.1014 17.3905 21.5653C16.9098 22.03 16.13 22.03 15.6494 21.5653L6.62452 12.8406C6.14458 12.376 6.14458 11.6223 6.62452 11.1591L15.6494 2.43481C15.8905 2.20246 16.2055 2.0863 16.5207 2.0863C16.8358 2.0863 17.1509 2.20248 17.3905 2.43555C17.8711 2.90024 17.8711 3.65242 17.3905 4.1171L9.23544 11.9995Z"
      fill="#000000"
    />
  </Svg>
);

const GroupCard: React.FC<{title: string; items: ThumbnailItem[]}> = ({
  title,
  items,
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
        <PlayIcon />
      </TouchableOpacity>
    </View>

    <View style={styles.thumbnailRow}>
      {items.map((item, index) => {
        if (item.type === 'placeholder') {
          return <View key={`${title}-${index}`} style={styles.placeholder} />;
        }

        if (item.type === 'composite') {
          return (
            <View key={`${title}-${index}`} style={styles.thumbnail}>
              <Image source={{uri: item.backgroundUri}} style={styles.thumbnailImage} />
              <Image
                source={{uri: item.overlayUri}}
                style={styles.thumbnailOverlay}
                resizeMode="contain"
              />
            </View>
          );
        }

        return (
          <View key={`${title}-${index}`} style={styles.thumbnail}>
            <Image source={{uri: item.uri}} style={styles.thumbnailImage} />
          </View>
        );
      })}
    </View>
  </View>
);

/**
 * Animation 页面
 */
export const AnimationPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const navigation = useNavigation();
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
  const topPadding = verticalScaleValue(24, 20, 28);
  const cardGap = verticalScaleValue(16, 14, 18);
  const descriptionWidth = windowWidth - horizontalPadding * 2 - scaleValue(16, 12, 16);
  const contentWidth = windowWidth - horizontalPadding * 2;
  const thumbSize = Math.min(scaleValue(54, 48, 58), (contentWidth - 32 - 52) / 5);
  const overlayTop = Math.round(thumbSize * (17 / 54));
  const overlayLeft = Math.round(thumbSize * (8 / 54));
  const overlayWidth = Math.round(thumbSize * (39 / 54));
  const overlayHeight = Math.round(thumbSize * (19 / 54));

  return (
    <View style={styles.container}>
      <View style={{height: insets.top, backgroundColor: COLORS.white}} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.headerButton, {left: headerSideInset}]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Anomation</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: topPadding,
            paddingBottom: insets.bottom + verticalScaleValue(24, 20, 30),
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.description, {width: descriptionWidth}]}>
          {`Feel free to upload your prefer faces to create your\nunique watcher! Make sure the images are:\n- PNG format\n- 412x412 px size\nThe frame rate is 500 ms per image, please design\nyour animation accordingly,`}
        </Text>

        <View style={[styles.cardList, {gap: cardGap}]}>
          {GROUPS.map(group => (
            <View key={group.title} style={[styles.card, {width: contentWidth}]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{group.title}</Text>
                <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                  <PlayIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.thumbnailRow}>
                {group.items.map((item, index) => {
                  if (item.type === 'placeholder') {
                    return (
                      <View
                        key={`${group.title}-${index}`}
                        style={[
                          styles.placeholder,
                          {
                            width: thumbSize,
                            height: thumbSize,
                            borderRadius: thumbSize * 0.16,
                          },
                        ]}
                      />
                    );
                  }

                  if (item.type === 'composite') {
                    return (
                      <View
                        key={`${group.title}-${index}`}
                        style={[
                          styles.thumbnail,
                          {
                            width: thumbSize,
                            height: thumbSize,
                            borderRadius: thumbSize / 2,
                          },
                        ]}>
                        <Image
                          source={{uri: item.backgroundUri}}
                          style={[styles.thumbnailImage, {borderRadius: thumbSize / 2}]}
                        />
                        <Image
                          source={{uri: item.overlayUri}}
                          style={[
                            styles.thumbnailOverlay,
                            {
                              top: overlayTop,
                              left: overlayLeft,
                              width: overlayWidth,
                              height: overlayHeight,
                            },
                          ]}
                          resizeMode="contain"
                        />
                      </View>
                    );
                  }

                  return (
                    <View
                      key={`${group.title}-${index}`}
                      style={[
                        styles.thumbnail,
                        {
                          width: thumbSize,
                          height: thumbSize,
                          borderRadius: thumbSize / 2,
                        },
                      ]}>
                      <Image
                        source={{uri: item.uri}}
                        style={[styles.thumbnailImage, {borderRadius: thumbSize / 2}]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    height: 44,
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
    color: COLORS.text,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    color: COLORS.muted,
  },
  cardList: {
    gap: 16,
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 19,
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
    color: COLORS.cardTitle,
  },
  playButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnail: {
    borderWidth: 1,
    borderColor: COLORS.thumbBorder,
    overflow: 'hidden',
    backgroundColor: '#111113',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
  },
  placeholder: {
    borderWidth: 1,
    borderColor: COLORS.green,
    borderStyle: 'dashed',
  },
});
