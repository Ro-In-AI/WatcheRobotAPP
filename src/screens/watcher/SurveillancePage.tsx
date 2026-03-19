import React, {useEffect, useRef, useState} from 'react';
import {
  LayoutAnimation,
  Image,
  ImageBackground,
  LayoutChangeEvent,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Circle, Defs, Ellipse, LinearGradient, Path, Stop} from 'react-native-svg';
import {WatcherHeader} from '../../components/WatcherHeader';

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
const FIGMA_BOTTOM_AREA_HEIGHT = 479;
const BOTTOM_SHEET_HEIGHT = 188;
const FIGMA_OPEN_CONTROLS_BOTTOM = 203;
const CLOSED_CONTROLS_BOTTOM = 28;
const JOYSTICK_KNOB_RADIUS = 30;
const DEFAULT_JOYSTICK_MAX_DISTANCE = 43;
const COMPACT_JOYSTICK_MAX_DISTANCE = 28;
const OTHER_ITEMS = [
  {
    title: 'Love',
    image: 'https://www.figma.com/api/mcp/asset/ef5c9065-a36e-454f-8ebb-47a06a66e947',
  },
  {
    title: 'Error',
    image: 'https://www.figma.com/api/mcp/asset/d2bf57c2-46c9-4742-bf0e-ffbf3bb59ea2',
  },
  {
    title: 'Invoke the tool',
    image: 'https://www.figma.com/api/mcp/asset/604074ab-8141-420b-a550-4f64c4481ea9',
  },
  {
    title: 'Happy',
    image: 'https://www.figma.com/api/mcp/asset/048c0a66-ba75-4825-8b34-61a492376c9f',
  },
  {
    title: 'Sleep',
    image: 'https://www.figma.com/api/mcp/asset/ccee2e44-b8b1-4677-b9c8-2c435869bc32',
  },
  {
    title: 'Thinking',
    image: 'https://www.figma.com/api/mcp/asset/0bfd63a5-8954-48ca-bbcc-600910e232a9',
  },
  {
    title: 'Think',
    image: 'https://www.figma.com/api/mcp/asset/cc20d699-ac91-457e-979a-51319d8da816',
  },
  {
    title: 'Speaking',
    image: 'https://www.figma.com/api/mcp/asset/2432573f-beff-431d-8d04-0135d116203d',
  },
  {
    title: 'listen',
    image: 'https://www.figma.com/api/mcp/asset/27de6292-8b77-4fc1-ae10-25745036835e',
  },
];

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

const FaceIcon: React.FC<{color?: string}> = ({color = '#0D0D0D'}) => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Path
      d="M25.3333 29.3334H6.66667C6.31647 29.3334 5.96971 29.2644 5.64618 29.1304C5.32264 28.9964 5.02867 28.8 4.78105 28.5524C4.53343 28.3047 4.337 28.0108 4.20299 27.6872C4.06898 27.3637 4 27.0169 4 26.6667V20.0001C4.00005 19.6465 4.14055 19.3074 4.3906 19.0574C4.64064 18.8074 4.97975 18.667 5.33333 18.667C5.68692 18.667 6.02603 18.8074 6.27607 19.0574C6.52611 19.3074 6.66661 19.6465 6.66667 20.0001V25.3334C6.66667 25.687 6.80714 26.0262 7.05719 26.2762C7.30724 26.5263 7.64638 26.6667 8 26.6667H24C24.3536 26.6667 24.6928 26.5263 24.9428 26.2762C25.1929 26.0262 25.3333 25.687 25.3333 25.3334V20.0001C25.3334 19.6465 25.4739 19.3074 25.7239 19.0574C25.974 18.8074 26.3131 18.667 26.6667 18.667C27.0203 18.667 27.3594 18.8074 27.6094 19.0574C27.8594 19.3074 27.9999 19.6465 28 20.0001V26.6667C28 27.0169 27.931 27.3637 27.797 27.6872C27.663 28.0108 27.4666 28.3047 27.219 28.5524C26.9713 28.8 26.6774 28.9964 26.3538 29.1304C26.0303 29.2644 25.6835 29.3334 25.3333 29.3334ZM12.6667 10.6667C13.0622 10.6667 13.4489 10.784 13.7778 11.0038C14.1067 11.2236 14.3631 11.5359 14.5144 11.9014C14.6658 12.2668 14.7054 12.669 14.6282 13.0569C14.5511 13.4449 14.3606 13.8013 14.0809 14.081C13.8012 14.3607 13.4448 14.5511 13.0568 14.6283C12.6689 14.7055 12.2668 14.6659 11.9013 14.5145C11.5358 14.3631 11.2235 14.1068 11.0037 13.7779C10.784 13.449 10.6667 13.0623 10.6667 12.6667C10.6667 12.1363 10.8774 11.6276 11.2525 11.2525C11.6275 10.8775 12.1362 10.6667 12.6667 10.6667ZM19.3333 14.6667C18.9378 14.6667 18.5511 14.5494 18.2222 14.3297C17.8933 14.1099 17.6369 13.7976 17.4856 13.4321C17.3342 13.0667 17.2946 12.6645 17.3718 12.2766C17.4489 11.8886 17.6394 11.5322 17.9191 11.2525C18.1988 10.9728 18.5552 10.7823 18.9432 10.7052C19.3311 10.628 19.7332 10.6676 20.0987 10.819C20.4642 10.9704 20.7765 11.2267 20.9963 11.5556C21.216 11.8845 21.3333 12.2712 21.3333 12.6667C21.3333 13.1972 21.1226 13.7059 20.7475 14.081C20.3725 14.456 19.8638 14.6667 19.3333 14.6667ZM18.44 22.0587C18.3937 22.1391 18.3402 22.2149 18.28 22.2854C18.0227 22.5245 17.6845 22.6574 17.3333 22.6574C16.9821 22.6574 16.6439 22.5245 16.3867 22.2854C16.3265 22.2149 16.2729 22.1391 16.2267 22.0587L14.6667 20.4947L12.88 22.2854C12.762 22.414 12.6192 22.5174 12.4601 22.5894C12.3011 22.6613 12.1291 22.7003 11.9546 22.704C11.7801 22.7078 11.6066 22.6761 11.4446 22.611C11.2827 22.5459 11.1356 22.4487 11.0122 22.3252C10.8888 22.2017 10.7917 22.0545 10.7267 21.8925C10.6617 21.7305 10.6302 21.557 10.634 21.3825C10.6379 21.208 10.677 21.0361 10.7491 20.8771C10.8211 20.7181 10.9246 20.5753 11.0533 20.4574L13.56 17.9414C13.6063 17.8611 13.6598 17.7852 13.72 17.7147C13.9773 17.4757 14.3155 17.3428 14.6667 17.3428C15.0179 17.3428 15.3561 17.4757 15.6133 17.7147C15.6735 17.7852 15.7271 17.8611 15.7733 17.9414L17.3333 19.5054L19.12 17.7147C19.238 17.5861 19.3808 17.4827 19.5399 17.4108C19.6989 17.3388 19.8709 17.2998 20.0454 17.2961C20.2199 17.2924 20.3934 17.324 20.5554 17.3892C20.7173 17.4543 20.8644 17.5515 20.9878 17.675C21.1112 17.7984 21.2083 17.9456 21.2733 18.1076C21.3383 18.2696 21.3698 18.4431 21.366 18.6176C21.3621 18.7922 21.323 18.9641 21.2509 19.1231C21.1789 19.2821 21.0754 19.4248 20.9467 19.5427L18.44 22.0587ZM26.6667 16.0001C26.313 16.0001 25.9739 15.8596 25.7239 15.6096C25.4738 15.3595 25.3333 15.0204 25.3333 14.6667C25.3333 12.1914 24.35 9.81742 22.5997 8.06708C20.8493 6.31674 18.4754 5.33341 16 5.33341C13.5246 5.33341 11.1507 6.31674 9.40034 8.06708C7.65 9.81742 6.66667 12.1914 6.66667 14.6667C6.66661 15.0203 6.52611 15.3594 6.27607 15.6094C6.02603 15.8594 5.68692 15.9999 5.33333 15.9999C4.97975 15.9999 4.64064 15.8594 4.3906 15.6094C4.14055 15.3594 4.00005 15.0203 4 14.6667C4 11.4841 5.26428 8.4319 7.51472 6.18147C9.76515 3.93103 12.8174 2.66675 16 2.66675C19.1826 2.66675 22.2348 3.93103 24.4853 6.18147C26.7357 8.4319 28 11.4841 28 14.6667C28 15.0204 27.8595 15.3595 27.6095 15.6096C27.3594 15.8596 27.0203 16.0001 26.6667 16.0001Z"
      fill={color}
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

const ExpandIcon: React.FC = () => (
  <View style={styles.expandIconCircle}>
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path
        d="M5.10407 6.37917L5.22938 6.50556C5.26279 6.53927 5.29621 6.57086 5.32962 6.60035C5.36304 6.62985 5.39645 6.66144 5.42986 6.69515L5.58023 6.84682C5.7473 7.01534 5.81413 7.16279 5.78072 7.28918C5.7473 7.41557 5.64288 7.56303 5.46746 7.73155C5.39227 7.81581 5.26906 7.9443 5.09781 8.11704C4.92656 8.28977 4.74278 8.47725 4.54647 8.67947C4.35016 8.8817 4.16011 9.0755 3.97633 9.26087C3.79255 9.44624 3.65054 9.5937 3.5503 9.70324C3.39993 9.8549 3.29551 9.98761 3.23703 10.1014C3.17856 10.2151 3.20362 10.3268 3.31222 10.4363C3.3874 10.5121 3.48347 10.6132 3.60042 10.7396C3.71737 10.866 3.81761 10.9714 3.90115 11.0556C4.04316 11.1989 4.09537 11.3252 4.05778 11.4348C4.02019 11.5443 3.89697 11.6075 3.68813 11.6244C3.47094 11.6496 3.22868 11.6791 2.96136 11.7128C2.69405 11.7465 2.41838 11.7781 2.13435 11.8076C1.85033 11.8371 1.57257 11.8687 1.30108 11.9024C1.02959 11.9361 0.781065 11.9656 0.555517 11.9909C0.338322 12.0162 0.187957 11.9888 0.10442 11.9087C0.0208841 11.8287 -0.0125305 11.6876 0.00417682 11.4853C0.0208841 11.2747 0.0438566 11.0388 0.0730943 10.7776C0.102332 10.5163 0.133658 10.2488 0.167073 9.97498C0.200487 9.70113 0.231813 9.42939 0.261051 9.15976C0.290289 8.89013 0.317438 8.64156 0.342499 8.41405C0.36756 8.1697 0.436478 8.01382 0.549252 7.94641C0.662026 7.879 0.789419 7.91692 0.931431 8.06016C1.01497 8.14442 1.12356 8.24764 1.25722 8.36982C1.39088 8.492 1.50365 8.59943 1.59554 8.69211C1.68743 8.7848 1.77515 8.81429 1.85868 8.78059C1.94222 8.74688 2.03829 8.67947 2.14688 8.57836C2.25548 8.46882 2.40376 8.31716 2.59172 8.12336C2.77967 7.92956 2.97598 7.72944 3.18065 7.523C3.38531 7.31657 3.58371 7.11434 3.77584 6.91633C3.96798 6.71832 4.12252 6.56033 4.23947 6.44237C4.28959 6.39181 4.34598 6.34336 4.40863 6.29702C4.47128 6.25067 4.5402 6.21908 4.61538 6.20222C4.69057 6.18537 4.76784 6.18959 4.8472 6.21486C4.92656 6.24014 5.01218 6.29491 5.10407 6.37917ZM11.4445 0.00910011C11.6617 -0.016178 11.812 0.0112066 11.8956 0.0912538C11.9791 0.171301 12.0125 0.312437 11.9958 0.514661C11.9791 0.725312 11.9561 0.96124 11.9269 1.22245C11.8977 1.48365 11.8663 1.75118 11.8329 2.02503C11.7995 2.29887 11.7682 2.57272 11.7389 2.84656C11.7097 3.12041 11.6826 3.37108 11.6575 3.59858C11.6324 3.84294 11.5635 3.99671 11.4507 4.05991C11.338 4.1231 11.2106 4.08308 11.0686 3.93984C10.985 3.85558 10.8702 3.74604 10.724 3.61122C10.5778 3.47641 10.4588 3.36266 10.3669 3.26997C10.275 3.17728 10.1956 3.13726 10.1288 3.1499C10.062 3.16254 9.97842 3.21941 9.87818 3.32053C9.76122 3.43849 9.60877 3.59437 9.42081 3.78817C9.23286 3.98197 9.03446 4.1863 8.82562 4.40116C8.61678 4.61603 8.41211 4.82457 8.21163 5.02679L7.748 5.49444C7.69788 5.54499 7.64358 5.59555 7.5851 5.64611C7.52663 5.69666 7.46189 5.73458 7.39088 5.75986C7.31987 5.78514 7.24469 5.78935 7.16533 5.7725C7.08597 5.75565 7.00453 5.70088 6.92099 5.60819L6.44483 5.12791C6.27776 4.95939 6.20466 4.80561 6.22555 4.66658C6.24643 4.52755 6.34041 4.37378 6.50748 4.20526C6.58267 4.12942 6.70797 4.00093 6.8834 3.81977C7.05882 3.63861 7.24678 3.44692 7.44727 3.24469C7.64776 3.04247 7.84198 2.84446 8.02993 2.65066C8.21789 2.45686 8.36617 2.3094 8.47476 2.20829C8.62513 2.05662 8.71911 1.93234 8.7567 1.83544C8.79429 1.73854 8.75879 1.63532 8.65019 1.52578C8.57501 1.44995 8.48521 1.35726 8.38079 1.24773C8.27637 1.13819 8.18239 1.04129 8.09885 0.957027C7.95684 0.813785 7.90463 0.687395 7.94222 0.577856C7.97981 0.468318 8.10303 0.40091 8.31187 0.375632C8.52071 0.350354 8.76088 0.320863 9.03237 0.287159C9.30386 0.253455 9.58162 0.221857 9.86565 0.192366C10.1497 0.162875 10.4274 0.131277 10.6989 0.0975733C10.9704 0.0638692 11.2189 0.0343782 11.4445 0.00910011Z"
        fill="#000000"
      />
    </Svg>
  </View>
);

const Arrow: React.FC<{
  direction: 'up' | 'right' | 'down' | 'left';
  compact?: boolean;
  compactScale?: number;
}> = ({direction, compact = false, compactScale = 1}) => {
  const compactOffset = Math.round(17 * compactScale);
  const iconSize = Math.round((compact ? 20 : 28) * compactScale);
  const rotations = {
    up: '0deg',
    right: '90deg',
    down: '180deg',
    left: '270deg',
  } as const;
  const positions = {
    up: compact ? {top: compactOffset} : styles.arrowUp,
    right: compact ? {right: compactOffset} : styles.arrowRight,
    down: compact ? {bottom: compactOffset} : styles.arrowDown,
    left: compact ? {left: compactOffset} : styles.arrowLeft,
  } as const;

  return (
    <View
      style={[
        styles.arrowWrapper,
        positions[direction],
        {transform: [{rotate: rotations[direction]}]},
      ]}>
      <Svg width={iconSize} height={iconSize} viewBox="0 0 28 28" fill="none">
        <Path
          d="M14.4301 2.44547C14.6624 2.04312 15.2432 2.04312 15.4756 2.44547L21.2187 12.3933C21.451 12.7956 21.1608 13.2985 20.6969 13.2985H9.2088C8.74494 13.2985 8.45467 12.7956 8.687 12.3933L14.4301 2.44547Z"
          fill={COLORS.green}
        />
      </Svg>
    </View>
  );
};

const JoystickPad: React.FC<{
  compact?: boolean;
  compactScale?: number;
  shellSize: number;
}> = ({
  compact = false,
  compactScale = 1,
  shellSize,
}) => {
  const currentShellSize = compact
    ? Math.round(150 * compactScale)
    : shellSize;
  const currentRadius = Math.round(currentShellSize / 2);
  const currentCenterSize = Math.round(currentShellSize * (104 / 250));
  const currentCenterRadius = Math.round(currentCenterSize / 2);

  return (
    <View
      style={[
        styles.joystickShell,
        {
          width: currentShellSize,
          height: currentShellSize,
          borderRadius: currentRadius,
        },
      ]}>
      <Arrow direction="up" compact={compact} compactScale={compactScale} />
      <Arrow direction="right" compact={compact} compactScale={compactScale} />
      <Arrow direction="down" compact={compact} compactScale={compactScale} />
      <Arrow direction="left" compact={compact} compactScale={compactScale} />

      <View
        style={[
          styles.centerOuterCircle,
          {
            width: currentCenterSize,
            height: currentCenterSize,
            borderRadius: currentCenterRadius,
          },
        ]}
      />
    </View>
  );
};

export const SurveillancePage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const navigation = useNavigation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [joystickOffset, setJoystickOffset] = useState({x: 0, y: 0});
  const [bottomAreaHeight, setBottomAreaHeight] = useState(FIGMA_BOTTOM_AREA_HEIGHT);
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
  const headerSideInset = scaleValue(30, 26, 32);
  const horizontalPadding = scaleValue(20, 18, 24);
  const cameraHeight = verticalScaleValue(273, 248, 292);
  const closedJoystickSize = Math.min(scaleValue(250, 224, 268), windowWidth * 0.64);
  const bottomAreaScale = Math.min(
    Math.max((bottomAreaHeight / FIGMA_BOTTOM_AREA_HEIGHT) * heightScale, 0.92),
    1.08,
  );
  const openSheetHeight = Math.round(BOTTOM_SHEET_HEIGHT * bottomAreaScale);
  const openControlsBottom = Math.round(FIGMA_OPEN_CONTROLS_BOTTOM * bottomAreaScale);
  const openJoystickPaddingTop = Math.round(verticalScaleValue(32, 26, 36) * bottomAreaScale);
  const compactJoystickScale = Math.min(Math.max(bottomAreaScale, 0.94), 1.06);
  const joystickShellSize = isPanelOpen
    ? Math.round(150 * compactJoystickScale)
    : closedJoystickSize;
  const joystickCenter = joystickShellSize / 2;
  const joystickMaxDistance = isPanelOpen
    ? Math.round(COMPACT_JOYSTICK_MAX_DISTANCE * compactJoystickScale)
    : Math.round(DEFAULT_JOYSTICK_MAX_DISTANCE * (joystickShellSize / 250));
  const closedControlsBottom = insets.bottom + verticalScaleValue(CLOSED_CONTROLS_BOTTOM, 24, 34);
  const expandRight = scaleValue(36, 28, 38);
  const expandBottom = verticalScaleValue(16, 12, 20);
  const otherImageSize = scaleValue(85, 76, 88);

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

  const handleBottomAreaLayout = (event: LayoutChangeEvent) => {
    const nextHeight = Math.round(event.nativeEvent.layout.height);
    if (nextHeight > 0 && nextHeight !== bottomAreaHeight) {
      setBottomAreaHeight(nextHeight);
    }
  };

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleTogglePanel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPanelOpen(value => !value);
  };

  return (
    <View style={styles.container}>
      <View style={{height: insets.top, backgroundColor: COLORS.white}} />
      <WatcherHeader
        title="Surveillance"
        onBack={() => navigation.goBack()}
        sideInset={headerSideInset}
      />

      <ImageBackground
        source={{uri: CAMERA_IMAGE}}
        style={[styles.cameraContainer, {height: cameraHeight}]}
        imageStyle={styles.cameraImage}
        resizeMode="cover">
        <View style={styles.cameraFallback} />
        <TouchableOpacity
          style={[
            styles.expandButton,
            {marginRight: expandRight, marginBottom: expandBottom},
          ]}
          activeOpacity={0.85}>
          <ExpandIcon />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.bottomArea} onLayout={handleBottomAreaLayout}>
        <View
          style={[
            styles.joystickSection,
            isPanelOpen && styles.joystickSectionOpen,
            isPanelOpen && {paddingTop: openJoystickPaddingTop},
          ]}>
          <View
            style={styles.joystickGestureLayer}
            collapsable={false}
            {...panResponder.panHandlers}>
            <JoystickPad
              compact={isPanelOpen}
              compactScale={compactJoystickScale}
              shellSize={joystickShellSize}
            />
            <View
              pointerEvents="none"
              style={[
                styles.joystickKnobOverlay,
                {
                  left: joystickCenter - JOYSTICK_KNOB_RADIUS + joystickOffset.x,
                  top: joystickCenter - JOYSTICK_KNOB_RADIUS + joystickOffset.y,
                },
              ]}>
              <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
                <Defs>
                  <LinearGradient id="surveillanceKnobGradient" x1="30" y1="8" x2="30" y2="52">
                    <Stop offset="0" stopColor={COLORS.greenDark} />
                    <Stop offset="1" stopColor={COLORS.green} />
                  </LinearGradient>
                </Defs>
                <Ellipse cx={30} cy={30} rx={20} ry={20} fill={COLORS.white} />
                <Ellipse
                  cx={30}
                  cy={30}
                  rx={15.5}
                  ry={15.5}
                  stroke="url(#surveillanceKnobGradient)"
                  strokeWidth={8}
                />
              </Svg>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.controlsRow,
            isPanelOpen
              ? {bottom: openControlsBottom}
              : {bottom: closedControlsBottom},
          ]}>
          <TouchableOpacity style={styles.smallControl} activeOpacity={0.8}>
            <MicrophoneIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            activeOpacity={0.8}
            onPress={handleTogglePanel}>
            <FaceIcon color={isPanelOpen ? COLORS.green : '#0D0D0D'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallControl} activeOpacity={0.8}>
            <SpeakerIcon />
          </TouchableOpacity>
          </View>

        {isPanelOpen && (
          <View
            style={[
              styles.bottomSheet,
              {
                left: horizontalPadding,
                right: horizontalPadding,
                height: openSheetHeight,
              },
            ]}>
            <Text style={styles.bottomSheetTitle}>Other</Text>
            <ScrollView
              style={styles.bottomSheetScroll}
              contentContainerStyle={[styles.otherGrid, {paddingBottom: insets.bottom + 16}]}
              showsVerticalScrollIndicator={false}>
              {OTHER_ITEMS.map(item => (
                <TouchableOpacity
                  key={item.title}
                  style={styles.otherItem}
                  activeOpacity={0.8}>
                  <Image
                    source={{uri: item.image}}
                    style={[styles.otherItemImage, {width: otherImageSize, height: otherImageSize}]}
                    resizeMode="contain"
                  />
                  <Text
                    style={styles.otherItemLabel}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  cameraContainer: {
    width: '100%',
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
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomArea: {
    flex: 1,
    position: 'relative',
  },
  joystickSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  joystickSectionOpen: {
    paddingTop: 32,
  },
  joystickGestureLayer: {
    position: 'relative',
  },
  joystickShell: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  joystickKnobOverlay: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightRing,
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 3,
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
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 2,
    overflow: 'hidden',
  },
  bottomSheetTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 16,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  otherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  otherItem: {
    width: '33.3333%',
    paddingHorizontal: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  otherItemImage: {
    marginBottom: 12,
  },
  otherItemLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    width: '100%',
  },
});
