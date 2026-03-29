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
import Svg, {Circle, ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
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

type MenuSectionProps = {
  items: MenuItem[];
  cardStyle: object;
  rowStyle: object;
  menuLeftStyle: object;
  menuRightStyle: object;
  menuValueStyle: object;
  dividerStyle: object;
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
    <Path
      d="M9.14003 4.71601C8.94229 4.56319 8.73449 4.42388 8.51802 4.299C8.32902 4.2 8.01802 4.082 7.69302 4.252C7.37302 4.421 7.29003 4.74 7.26003 4.95C7.23003 5.156 7.23003 5.422 7.23003 5.707V6.91301L6.32502 6.139C6.27512 6.09633 6.2173 6.06389 6.15487 6.04356C6.09243 6.02322 6.0266 6.01539 5.96113 6.02049C5.89567 6.0256 5.83185 6.04355 5.77332 6.07332C5.7148 6.1031 5.6627 6.1441 5.62002 6.194C5.57735 6.24391 5.54491 6.30173 5.52458 6.36416C5.50424 6.4266 5.49641 6.49243 5.50151 6.5579C5.50662 6.62336 5.52457 6.68718 5.55434 6.74571C5.58412 6.80423 5.62512 6.85633 5.67503 6.89901L6.96102 7.99901L5.67503 9.10101C5.62512 9.14368 5.58412 9.19578 5.55434 9.2543C5.52457 9.31283 5.50662 9.37665 5.50151 9.44211C5.49641 9.50758 5.50424 9.57341 5.52458 9.63585C5.54491 9.69828 5.57735 9.7561 5.62002 9.80601C5.6627 9.85591 5.7148 9.89691 5.77332 9.92669C5.83185 9.95646 5.89567 9.97441 5.96113 9.97952C6.0266 9.98462 6.09243 9.97679 6.15487 9.95645C6.2173 9.93612 6.27512 9.90369 6.32502 9.86101L7.23003 9.08601V10.292C7.23003 10.577 7.23003 10.844 7.26003 11.05C7.29003 11.26 7.37302 11.579 7.69302 11.747C8.01802 11.917 8.32902 11.8 8.51802 11.701C8.70102 11.605 8.91403 11.449 9.14003 11.284L9.75503 10.834C9.92203 10.713 10.089 10.591 10.21 10.473C10.345 10.339 10.5 10.136 10.5 9.84701C10.5 9.55701 10.345 9.354 10.21 9.221C10.0668 9.09013 9.91475 8.96918 9.75503 8.85901L8.57803 8.00001L9.75503 7.141C9.92203 7.02 10.089 6.898 10.21 6.779C10.345 6.646 10.5 6.443 10.5 6.154C10.5 5.864 10.345 5.661 10.21 5.528C10.0668 5.39713 9.91475 5.27619 9.75503 5.166L9.14003 4.71601ZM8.23002 10.258V8.98401L9.14203 9.65C9.23703 9.72001 9.31402 9.77501 9.37702 9.82401L9.40702 9.84701L9.37702 9.87001C9.31402 9.919 9.23703 9.97501 9.14203 10.044L8.57803 10.456C8.43403 10.561 8.32303 10.642 8.23403 10.702C8.23045 10.554 8.22912 10.406 8.23002 10.258ZM8.26203 10.968L8.26102 10.965V10.968H8.26203ZM8.23002 5.74101C8.23002 5.55301 8.23003 5.409 8.23403 5.297C8.32303 5.357 8.43403 5.43801 8.57803 5.54401L9.14203 5.955C9.23703 6.025 9.31402 6.08101 9.37702 6.13001L9.40702 6.153L9.37702 6.17501C9.31402 6.22501 9.23703 6.28 9.14203 6.35L8.23002 7.016V5.74V5.74101ZM8.26003 5.035L8.26203 5.03201L8.26102 5.035H8.26003Z"
      fill="#000000"
    />
    <Path
      d="M14.1129 11.4132C14.6779 10.4035 15 9.23935 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C9.73245 15 11.3179 14.3706 12.5402 13.3281"
      stroke="#000000"
      strokeWidth={1.2}
      strokeLinecap="round"
    />
  </Svg>
);

const LinkIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M5.30079 14.7523C4.14737 14.7523 3.0738 14.3087 2.25754 13.4924C1.4522 12.6844 1 11.59 1 10.4492C1 9.30833 1.4522 8.21399 2.25754 7.40592L3.85458 5.80888C4.11188 5.55158 4.53776 5.55158 4.79506 5.80888C5.05237 6.06618 5.05237 6.49206 4.79506 6.74936L3.19802 8.34641C2.9217 8.62245 2.7025 8.95024 2.55294 9.31105C2.40338 9.67186 2.3264 10.0586 2.3264 10.4492C2.3264 10.8398 2.40338 11.2265 2.55294 11.5873C2.7025 11.9481 2.9217 12.2759 3.19802 12.552C4.31595 13.6699 6.27677 13.6788 7.40357 12.552L9.00062 10.9549C9.25792 10.6976 9.68379 10.6976 9.9411 10.9549C10.1984 11.2122 10.1984 11.6381 9.9411 11.8954L8.34405 13.4924C7.52778 14.3087 6.45422 14.7523 5.30079 14.7523ZM11.4228 10.1386C11.2542 10.1386 11.0856 10.0765 10.9526 9.94345C10.8288 9.81823 10.7594 9.64927 10.7594 9.47321C10.7594 9.29715 10.8288 9.12819 10.9526 9.00297L12.5496 7.40592C12.8259 7.12988 13.0451 6.80209 13.1947 6.44128C13.3442 6.08047 13.4212 5.69373 13.4212 5.30315C13.4212 4.91257 13.3442 4.52582 13.1947 4.16502C13.0451 3.80421 12.8259 3.47641 12.5496 3.20037C11.4228 2.07357 9.47086 2.07357 8.34405 3.20037L6.74701 4.79742C6.48971 5.05472 6.06383 5.05472 5.80653 4.79742C5.54922 4.54012 5.54922 4.11424 5.80653 3.85694L7.40357 2.25989C8.21984 1.44362 9.29341 1 10.4468 1C11.6002 1 12.6738 1.44362 13.4901 2.25989C14.2954 3.06796 14.7476 4.1623 14.7476 5.30315C14.7476 6.444 14.2954 7.53834 13.4901 8.34641L11.893 9.94345C11.76 10.0765 11.5914 10.1386 11.4228 10.1386Z"
      fill="#000000"
    />
    <Path
      d="M6.6634 9.87764C6.49482 9.87764 6.32624 9.81553 6.19315 9.68245C6.0694 9.55722 6 9.38826 6 9.21221C6 9.03615 6.0694 8.86719 6.19315 8.74197L9.74214 5.19298C9.99945 4.93567 10.4253 4.93567 10.6826 5.19298C10.9399 5.45028 10.9399 5.87616 10.6826 6.13346L7.13364 9.68245C7.00055 9.81553 6.83197 9.87764 6.6634 9.87764Z"
      fill="#000000"
    />
  </Svg>
);

const LanguageIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#language-clip)">
      <Path
        d="M14.1129 11.4132C14.6779 10.4035 15 9.23935 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C9.73245 15 11.3179 14.3706 12.5402 13.3281"
        stroke="#000000"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M8.00033 0.666656C10.2223 2.85532 11.3337 5.29999 11.3337 7.99999C11.3337 10.7 10.2223 13.1447 8.00033 15.3333C5.77833 13.1447 4.66699 10.7 4.66699 7.99999C4.66699 5.29999 5.77833 2.85532 8.00033 0.666656ZM8.00033 2.64266L7.83899 2.84666C6.60299 4.44599 6.00033 6.15332 6.00033 7.99999C6.00033 9.84666 6.60299 11.554 7.83899 13.1533L8.00033 13.3567L8.16166 13.1533C9.34366 11.6233 9.94699 9.99399 9.99699 8.23999L10.0003 7.99999C10.0003 6.15399 9.39766 4.44599 8.16166 2.84666L8.00033 2.64266Z"
        fill="#000000"
      />
      <Path d="M1.33301 7.33334H14.6663V8.66668H1.33301V7.33334Z" fill="#000000" />
    </G>
    <Defs>
      <ClipPath id="language-clip">
        <Rect width={16} height={16} fill="#FFFFFF" />
      </ClipPath>
    </Defs>
  </Svg>
);

const UnitSettingsIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4.7998 12.6596C4.9218 12.6596 5.03971 12.7081 5.12598 12.7944C5.21212 12.8805 5.26063 12.9977 5.26074 13.1196C5.26074 13.2416 5.21224 13.3595 5.12598 13.4457C5.03971 13.532 4.9218 13.5795 4.7998 13.5795C4.67799 13.5794 4.56076 13.5319 4.47461 13.4457C4.38834 13.3595 4.33984 13.2416 4.33984 13.1196C4.33996 12.9977 4.38846 12.8805 4.47461 12.7944C4.56077 12.7082 4.67797 12.6597 4.7998 12.6596ZM1.83984 13.06H2.7041C2.70342 13.0799 2.7002 13.0997 2.7002 13.1196C2.7002 13.1397 2.70341 13.1601 2.7041 13.1801H1.83984C1.82411 13.18 1.809 13.1737 1.79785 13.1625C1.7866 13.1513 1.78027 13.1355 1.78027 13.1196C1.78039 13.1038 1.7867 13.0887 1.79785 13.0776C1.809 13.0664 1.82409 13.0601 1.83984 13.06ZM14.1602 13.06C14.1761 13.06 14.1919 13.0663 14.2031 13.0776C14.2141 13.0887 14.2206 13.1039 14.2207 13.1196C14.2207 13.1354 14.2143 13.1513 14.2031 13.1625C14.1919 13.1738 14.1761 13.1801 14.1602 13.1801H6.89648C6.89718 13.1601 6.90039 13.1397 6.90039 13.1196C6.90039 13.0997 6.89717 13.0799 6.89648 13.06H14.1602ZM11.2002 7.8598C11.3221 7.8598 11.4391 7.9084 11.5254 7.99457C11.6116 8.08078 11.6601 8.19785 11.6602 8.31976C11.6602 8.44173 11.6116 8.5587 11.5254 8.64496C11.4391 8.73122 11.3222 8.77972 11.2002 8.77972C11.0782 8.7797 10.9612 8.73121 10.875 8.64496C10.7888 8.55871 10.7402 8.44169 10.7402 8.31976C10.7403 8.19785 10.7888 8.08078 10.875 7.99457C10.9612 7.90837 11.0783 7.85982 11.2002 7.8598ZM1.83984 8.26019H9.10449C9.10381 8.28006 9.10059 8.29985 9.10059 8.31976C9.10059 8.33992 9.1038 8.3602 9.10449 8.38031H1.83984C1.82416 8.3802 1.80899 8.37379 1.79785 8.36273C1.7866 8.35148 1.78027 8.33568 1.78027 8.31976C1.78033 8.30398 1.78672 8.28896 1.79785 8.27777C1.809 8.26662 1.82409 8.26031 1.83984 8.26019ZM14.1602 8.26019C14.1761 8.26019 14.1919 8.26652 14.2031 8.27777C14.2141 8.28894 14.2206 8.30408 14.2207 8.31976C14.2207 8.33565 14.2143 8.35148 14.2031 8.36273C14.1919 8.37398 14.1761 8.38031 14.1602 8.38031H13.2959C13.2966 8.3602 13.2998 8.33993 13.2998 8.31976C13.2998 8.29985 13.2966 8.28006 13.2959 8.26019H14.1602ZM4.7998 3.06C4.86021 3.06 4.92075 3.07204 4.97656 3.09515C5.03227 3.11827 5.08333 3.15212 5.12598 3.19476C5.16858 3.23743 5.20251 3.28847 5.22559 3.34418C5.24862 3.39989 5.26074 3.45967 5.26074 3.51996C5.26074 3.58023 5.2486 3.64003 5.22559 3.69574C5.20252 3.75143 5.16856 3.8025 5.12598 3.84515C5.08334 3.88779 5.03226 3.92165 4.97656 3.94476C4.92075 3.96788 4.86021 3.97992 4.7998 3.97992C4.67797 3.9798 4.56077 3.93131 4.47461 3.84515C4.3885 3.75891 4.33984 3.64184 4.33984 3.51996C4.33985 3.39807 4.38849 3.281 4.47461 3.19476C4.53928 3.13009 4.62159 3.08648 4.70996 3.06879L4.7998 3.06ZM1.83984 3.46039H2.7041C2.70342 3.48025 2.7002 3.50005 2.7002 3.51996C2.7002 3.53985 2.70342 3.55968 2.7041 3.57953H1.83984C1.82409 3.57942 1.809 3.5731 1.79785 3.56195C1.78675 3.55072 1.78027 3.53576 1.78027 3.51996C1.78028 3.50415 1.78673 3.48919 1.79785 3.47797C1.809 3.46682 1.82409 3.4605 1.83984 3.46039ZM14.1602 3.46039C14.1761 3.46039 14.1919 3.46671 14.2031 3.47797C14.2141 3.48917 14.2207 3.50425 14.2207 3.51996C14.2207 3.53566 14.2141 3.55074 14.2031 3.56195C14.1919 3.5732 14.1761 3.57953 14.1602 3.57953H6.89648C6.89716 3.55968 6.90039 3.53985 6.90039 3.51996C6.90039 3.50005 6.89716 3.48025 6.89648 3.46039H14.1602Z"
      fill="#000000"
      stroke="#000000"
    />
  </Svg>
);

const DashboardIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#dashboard-clip)">
      <Path
        d="M14.1129 11.4132C14.6779 10.4035 15 9.23935 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C9.73245 15 11.3179 14.3706 12.5402 13.3281"
        stroke="#000000"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M8 6.75C7.66848 6.75 7.35054 6.8817 7.11612 7.11612C6.8817 7.35054 6.75 7.66848 6.75 8C6.75 8.33152 6.8817 8.64946 7.11612 8.88388C7.35054 9.1183 7.66848 9.25 8 9.25C8.33152 9.25 8.64946 9.1183 8.88388 8.88388C9.1183 8.64946 9.25 8.33152 9.25 8C9.25 7.66848 9.1183 7.35054 8.88388 7.11612C8.64946 6.8817 8.33152 6.75 8 6.75ZM8 7.75C8.0663 7.75 8.12989 7.77634 8.17678 7.82322C8.22366 7.87011 8.25 7.9337 8.25 8C8.25 8.0663 8.22366 8.12989 8.17678 8.17678C8.12989 8.22366 8.0663 8.25 8 8.25C7.9337 8.25 7.87011 8.22366 7.82322 8.17678C7.77634 8.12989 7.75 8.0663 7.75 8C7.75 7.9337 7.77634 7.87011 7.82322 7.82322C7.87011 7.77634 7.9337 7.75 8 7.75Z"
        fill="#000000"
      />
      <Path
        d="M10.8535 4.793L11.207 5.1465C11.3007 5.24026 11.3533 5.36742 11.3533 5.5C11.3533 5.63258 11.3007 5.75974 11.207 5.8535L8.7802 8.28025C8.48735 8.5731 8.01255 8.5731 7.7197 8.28025C7.42685 7.9874 7.42685 7.5126 7.7197 7.21975L10.1465 4.793C10.2402 4.69926 10.3674 4.64661 10.5 4.64661C10.6325 4.64661 10.7597 4.69926 10.8535 4.793Z"
        fill="#000000"
      />
      <Path d="M8 1.5V2.5" stroke="#000000" strokeLinecap="round" />
      <Path d="M1 8.00568L1.99998 8.00002" stroke="#000000" strokeLinecap="round" />
      <Path d="M15 8L14 8" stroke="#000000" strokeLinecap="round" />
    </G>
    <Defs>
      <ClipPath id="dashboard-clip">
        <Rect width={16} height={16} fill="#FFFFFF" />
      </ClipPath>
    </Defs>
  </Svg>
);

const ShieldIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#shield-clip)">
      <Path
        d="M7.63672 11.582L5.30393 9.60076C5.01741 9.35741 4.98238 8.92788 5.22568 8.64131C5.46815 8.35574 5.89579 8.31975 6.18258 8.56077L7.5 9.66797L10.5362 6.18824C10.7797 5.9092 11.203 5.87952 11.483 6.12186C11.7641 6.36512 11.7945 6.79032 11.5509 7.0711L7.63672 11.582Z"
        fill="#000000"
      />
      <Path
        d="M11.2576 14C10.4283 14.5709 9.36274 15.0912 8 15.5C3 14 2 11 2 9.49999V3C3.33333 2.83333 6.4 2.6 8 1C8.5 1.5 10.5 3 14 3C14 4.5 14 7.5 14 9.49999C14 10.2322 13.7617 11.3219 12.9361 12.4201"
        stroke="#000000"
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="shield-clip">
        <Rect width={16} height={16} fill="#FFFFFF" />
      </ClipPath>
    </Defs>
  </Svg>
);

const PrivacyIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#privacy-clip)">
      <Path
        d="M7.93616 5.54598C8.17907 5.54582 8.41582 5.62244 8.61257 5.76491C8.80932 5.90737 8.956 6.10838 9.03165 6.33921C9.1073 6.57005 9.10805 6.81888 9.03379 7.05017C8.95952 7.28145 8.81405 7.48334 8.61816 7.62698V9.79198C8.61816 9.96729 8.54852 10.1354 8.42456 10.2594C8.3006 10.3833 8.13247 10.453 7.95716 10.453C7.78185 10.453 7.61373 10.3833 7.48976 10.2594C7.3658 10.1354 7.29616 9.96729 7.29616 9.79198V7.65698C7.08922 7.5205 6.93192 7.32081 6.8477 7.08766C6.76348 6.85451 6.75685 6.60038 6.82881 6.36316C6.90076 6.12594 7.04744 5.91832 7.24699 5.77124C7.44654 5.62416 7.68827 5.5445 7.93616 5.54598Z"
        fill="#000000"
      />
      <Path
        d="M11.2576 14C10.4283 14.5709 9.36274 15.0912 8 15.5C3 14 2 11 2 9.49999V3C3.33333 2.83333 6.4 2.6 8 1C8.5 1.5 10.5 3 14 3C14 4.5 14 7.5 14 9.49999C14 10.2322 13.7617 11.3219 12.9361 12.4201"
        stroke="#000000"
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="privacy-clip">
        <Rect width={16} height={16} fill="#FFFFFF" />
      </ClipPath>
    </Defs>
  </Svg>
);

const PasswordIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M3.70313 6.80471C3.39375 6.80315 3.14219 6.55159 3.14062 6.24221V4.94846C3.14219 2.82659 4.86094 1.10627 6.98438 1.10315C8.7875 1.10315 10.3641 2.37034 10.7438 4.11565C10.7766 4.26252 10.7484 4.41721 10.6672 4.54534C10.5844 4.6719 10.4563 4.76096 10.3078 4.79221C10.1609 4.82502 10.0063 4.7969 9.87969 4.71565C9.75313 4.6344 9.66406 4.50471 9.63281 4.35627C9.35156 3.11252 8.24688 2.22971 6.97188 2.22815C5.47031 2.22971 4.25469 3.4469 4.25469 4.94846V6.24221C4.25937 6.39065 4.20469 6.53596 4.1 6.64221C3.99687 6.74846 3.85313 6.80784 3.70469 6.80627V6.80471H3.70313Z"
      fill="#000000"
    />
    <Path
      d="M10.9547 14.9H2.90156C2.01406 14.9 1.29688 14.1969 1.29688 13.3375V7.28436C1.29688 6.42499 2.01562 5.72186 2.90156 5.72186H8.67344C8.98437 5.72186 9.23594 5.97499 9.2375 6.28592C9.2375 6.59686 8.98437 6.84843 8.67344 6.84999H2.90156C2.64844 6.84999 2.42344 7.06092 2.42344 7.28592V13.3406C2.42344 13.5797 2.64844 13.7766 2.90156 13.7766H10.9547C11.2078 13.7766 11.4328 13.5656 11.4328 13.3406V8.79061C11.4344 8.47967 11.6859 8.22811 11.9969 8.22811C12.3062 8.22967 12.5578 8.47967 12.5594 8.79061V13.3391C12.5594 14.1969 11.8406 14.9 10.9547 14.9Z"
      fill="#000000"
    />
    <Path
      d="M7.02637 12C6.87793 11.9985 6.73574 11.9375 6.63262 11.8313C6.5248 11.725 6.46387 11.5813 6.46387 11.4297C6.46387 11.2781 6.5248 11.1344 6.63262 11.0281L13.742 3.88909C13.8482 3.78127 13.992 3.72034 14.1436 3.72034C14.2951 3.72034 14.4389 3.78127 14.5451 3.88909C14.7701 4.11565 14.7701 4.46721 14.5451 4.69221L7.43418 11.8328C7.3237 11.9372 7.17834 11.9968 7.02637 12Z"
      fill="#000000"
    />
  </Svg>
);

const TrashIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M6.274 5.12642V1.61523H9.64741V5.12642M6.274 5.12642H1.78125V8.16676H2.84048M6.274 5.12642H9.64741M9.64741 5.12642H14.2178V8.16676H13.0605M13.0605 8.16676V12.0506L13.3057 13.2177M13.0605 8.16676H2.84048M2.84048 8.16676V12.2467L2.40936 14.3848H5.44988M5.44988 14.3848V11.8544M5.44988 14.3848H8.01949M8.01949 14.3848V11.8544M8.01949 14.3848H10.5302M10.5302 14.3848V11.8544M10.5302 14.3848H12.0405"
      stroke="#000000"
      strokeLinecap="round"
    />
  </Svg>
);

const InfoIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#info-clip)">
      <Path
        d="M14.1129 11.4132C14.6779 10.4035 15 9.23935 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C9.73245 15 11.3179 14.3706 12.5402 13.3281"
        stroke="#000000"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M7.78674 6.09447C8.02247 6.09447 8.23464 6.00804 8.39965 5.84302C8.57253 5.678 8.65896 5.4737 8.65896 5.24582C8.65896 5.01009 8.57253 4.81364 8.39965 4.64862C8.23464 4.49147 8.02247 4.40503 7.78674 4.40503C7.54314 4.40503 7.33884 4.49147 7.17382 4.64862C7.00881 4.81364 6.92237 5.01794 6.92237 5.24582C6.92237 5.4737 7.00881 5.678 7.17382 5.84302C7.33884 6.00804 7.551 6.09447 7.78674 6.09447ZM9.10686 11.0606C8.95756 11.0371 8.85541 10.9978 8.8004 10.9428C8.7454 10.8956 8.72182 10.7778 8.72182 10.5892L8.73754 9.49693C8.73754 8.28682 8.72968 7.43031 8.71397 6.95884V6.84097L6.96166 6.95098L6.85951 6.9667C6.56091 6.99027 6.49805 7.12385 6.49805 7.22601C6.49805 7.29673 6.53734 7.46174 6.85951 7.49317C7.12668 7.52461 7.18168 7.57961 7.18954 7.58747C7.20526 7.6189 7.2524 7.74462 7.27598 8.37325C7.29169 8.82115 7.29955 9.33977 7.29955 10.0077C7.29955 10.4713 7.28383 10.762 7.2524 10.8956C7.22883 10.9978 7.11882 11.0528 6.91451 11.0685C6.56877 11.0921 6.49805 11.2257 6.49805 11.3435C6.49805 11.4221 6.52948 11.595 6.84379 11.595C6.89094 11.595 6.96952 11.5871 7.09525 11.5714C7.26026 11.5557 7.44099 11.5478 7.6453 11.5478C8.10105 11.5478 8.4468 11.5557 8.77683 11.5793L8.94185 11.5871C9.03614 11.595 9.10686 11.595 9.16187 11.595C9.2483 11.595 9.37403 11.5871 9.44475 11.5085C9.47618 11.4771 9.50761 11.4221 9.49976 11.3435C9.4919 11.1864 9.35831 11.0921 9.10686 11.0606Z"
        fill="#000000"
      />
    </G>
    <Defs>
      <ClipPath id="info-clip">
        <Rect width={16} height={16} fill="#FFFFFF" />
      </ClipPath>
    </Defs>
  </Svg>
);

const FolderIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M14.2987 2.52418H8.34632C8.08341 2.52418 7.87012 2.3109 7.87012 2.04809C7.87012 1.78518 8.08341 1.57184 8.3463 1.57184H14.2986C14.5614 1.57184 14.7749 1.78518 14.7749 2.04809C14.7748 2.3109 14.5617 2.52418 14.2987 2.52418Z"
      fill="#000000"
    />
    <Path
      d="M13 14H2.5C1.94772 14 1.5 13.5523 1.5 13V3C1.5 2.44772 1.94772 2 2.5 2H5.65779C6.0865 2 6.46751 2.27327 6.60498 2.67934L6.95752 3.72066C7.09499 4.12673 7.476 4.4 7.90471 4.4H13.5C14.0523 4.4 14.5 4.84772 14.5 5.4V12.5"
      stroke="#000000"
      strokeLinecap="round"
    />
  </Svg>
);

const PROFILE_ITEMS: MenuItem[] = [
  {id: 'bluetooth', label: 'Bluetooth Configuration', icon: BluetoothConfigIcon},
  {id: 'api', label: 'Access API key', value: 'zh', icon: LinkIcon},
];

const PREFERENCE_ITEMS: MenuItem[] = [
  {id: 'language', label: 'Language', value: '\u2103', icon: LanguageIcon},
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

const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  cardStyle,
  rowStyle,
  menuLeftStyle,
  menuRightStyle,
  menuValueStyle,
  dividerStyle,
}) => (
  <View style={[styles.menuCard, cardStyle]}>
    {items.map((item, index) => {
      const Icon = item.icon;
      const isLast = index === items.length - 1;

      return (
        <View key={item.id}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.menuRow, rowStyle]}>
            <View style={[styles.menuLeft, menuLeftStyle]}>
              <Icon />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>

            <View style={[styles.menuRight, menuRightStyle]}>
              {item.value ? (
                <Text style={[styles.menuValue, menuValueStyle]}>{item.value}</Text>
              ) : null}
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>

          {!isLast ? <View style={[styles.menuDivider, dividerStyle]} /> : null}
        </View>
      );
    })}
  </View>
);

// User 页面承接个人资料、系统设置、安全项和应用信息入口。
export const UserPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {windowWidth, windowHeight, scaleValue, verticalScaleValue} =
    useResponsiveScale();

  const horizontalPadding = scaleValue(20, 18, 24);
  const contentWidth = windowWidth - horizontalPadding * 2;
  const headerTop = insets.top + verticalScaleValue(10, 8, 12);
  const headerTitleInset = scaleValue(10, 8, 10);
  const headerBottom = verticalScaleValue(6, 4, 8);
  const sectionGap = verticalScaleValue(12, 10, 14);
  const profileBottom = verticalScaleValue(24, 20, 28);
  const contentBottom = insets.bottom + verticalScaleValue(20, 16, 24);
  const avatarSize = scaleValue(80, 72, 84);
  const profileContentLeft = scaleValue(10, 8, 12);
  const profileContentTop = verticalScaleValue(12, 10, 14);
  const profileButtonMarginTop = verticalScaleValue(8, 6, 10);
  const profileButtonPaddingLeft = scaleValue(8, 8, 10);
  const profileButtonPaddingRight = scaleValue(4, 4, 6);
  const cardPaddingHorizontal = scaleValue(16, 14, 18);
  const cardPaddingVertical = verticalScaleValue(12, 10, 14);
  const menuRowMinHeight = verticalScaleValue(24, 22, 26);
  const menuSideGap = scaleValue(8, 8, 10);
  const menuValueGap = scaleValue(8, 8, 10);
  const dividerMargin = verticalScaleValue(9, 7, 11);
  const logoutHeight = verticalScaleValue(48, 46, 50);
  const tabOverlayHeight = insets.bottom + 8 + 54;
  const logoutVisibleHeight = verticalScaleValue(28, 24, 30);
  const logoutScrollTailHeight = Math.max(
    tabOverlayHeight - logoutVisibleHeight + verticalScaleValue(12, 10, 16),
    verticalScaleValue(24, 20, 28),
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: headerTop,
            paddingHorizontal: horizontalPadding,
            paddingBottom: headerBottom,
          },
        ]}>
        <View style={styles.header}>
          <View style={[styles.headerLeft, {paddingLeft: headerTitleInset}]}>
            <Text style={styles.pageTitle}>User</Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.85}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <BellIcon />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: contentBottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.profileSection,
            {
              width: contentWidth,
              marginBottom: profileBottom,
            },
          ]}>
          <Image
            source={{uri: AVATAR_IMAGE}}
            style={[
              styles.avatar,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
              },
            ]}
          />

          <View
            style={[
              styles.profileContent,
              {
                marginLeft: profileContentLeft,
                paddingTop: profileContentTop,
              },
            ]}>
            <Text style={styles.profileName}>Dave</Text>

            <TouchableOpacity
              style={[
                styles.profileButton,
                {
                  marginTop: profileButtonMarginTop,
                  paddingLeft: profileButtonPaddingLeft,
                  paddingRight: profileButtonPaddingRight,
                },
              ]}
              activeOpacity={0.85}>
              <Text style={styles.profileButtonText}>Profile</Text>
              <ProfileArrowIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{gap: sectionGap}}>
          <MenuSection
            items={PROFILE_ITEMS}
            cardStyle={{
              width: contentWidth,
              paddingHorizontal: cardPaddingHorizontal,
              paddingVertical: cardPaddingVertical,
            }}
            rowStyle={{minHeight: menuRowMinHeight}}
            menuLeftStyle={{gap: menuSideGap}}
            menuRightStyle={{gap: menuValueGap}}
            menuValueStyle={{}}
            dividerStyle={{marginVertical: dividerMargin}}
          />
          <MenuSection
            items={PREFERENCE_ITEMS}
            cardStyle={{
              width: contentWidth,
              paddingHorizontal: cardPaddingHorizontal,
              paddingVertical: cardPaddingVertical,
            }}
            rowStyle={{minHeight: menuRowMinHeight}}
            menuLeftStyle={{gap: menuSideGap}}
            menuRightStyle={{gap: menuValueGap}}
            menuValueStyle={{}}
            dividerStyle={{marginVertical: dividerMargin}}
          />
          <MenuSection
            items={SECURITY_ITEMS}
            cardStyle={{
              width: contentWidth,
              paddingHorizontal: cardPaddingHorizontal,
              paddingVertical: cardPaddingVertical,
            }}
            rowStyle={{minHeight: menuRowMinHeight}}
            menuLeftStyle={{gap: menuSideGap}}
            menuRightStyle={{gap: menuValueGap}}
            menuValueStyle={{}}
            dividerStyle={{marginVertical: dividerMargin}}
          />
          <MenuSection
            items={APP_ITEMS}
            cardStyle={{
              width: contentWidth,
              paddingHorizontal: cardPaddingHorizontal,
              paddingVertical: cardPaddingVertical,
            }}
            rowStyle={{minHeight: menuRowMinHeight}}
            menuLeftStyle={{gap: menuSideGap}}
            menuRightStyle={{gap: menuValueGap}}
            menuValueStyle={{}}
            dividerStyle={{marginVertical: dividerMargin}}
          />
        </View>

        <View style={{marginTop: sectionGap}}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                width: contentWidth,
                height: logoutHeight,
              },
            ]}
            activeOpacity={0.85}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: logoutScrollTailHeight}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.background,
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.black,
  },
  bellButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    backgroundColor: '#E6E7EB',
  },
  profileContent: {},
  profileName: {
    fontFamily: 'Inter',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.title,
  },
  profileButton: {
    height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.green,
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
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  menuLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.black,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.black,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  logoutButton: {
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
