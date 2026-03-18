export const ROBOT_DEVICE_NAME = 'ESP_ROBOT';

export const BLUETOOTH_DEFAULT_CONFIG = {
  SCAN_TIMEOUT: 10000,
  CONNECT_TIMEOUT: 10000,
  RESCAN_DELAY: 3000,
  MAX_RESCAN_ATTEMPTS: 5,
  MTU_ANDROID: 512,
};

export const BLUETOOTH_UUIDS = {
  SERVICE_UUID: '00FF',
  SERVO_CTRL: 'FF01',
  PROVISIONING_CTRL: 'FF01',
  ACTION_CTRL: 'FF02',
  STATUS: 'FF03',
  DEVICE_INFO_SERVICE: '180A',
  MANUFACTURER_NAME: '2A29',
  FIRMWARE_REVISION: '2A26',
  HARDWARE_REVISION: '2A27',
  SERIAL_NUMBER: '2A25',
};

export const WIFI_COMMANDS = {
  STATUS: 'WIFI_STATUS',
  CLEAR: 'WIFI_CLEAR',
  CONFIG: (ssid: string, password: string) =>
    `WIFI_CONFIG:${JSON.stringify({ ssid, password })}`,
};

export const SERVO_CONFIG = {
  SERVO_COUNT: 2,
  SERVO_X: 0,
  SERVO_Y: 1,
  ANGLE_MIN_X: 30,
  ANGLE_MAX_X: 150,
  ANGLE_MIN_Y: 95,
  ANGLE_MAX_Y: 150,
  DEFAULT_ANGLE: 90,
};

export const ACTIONS = [
  { id: 0, name: 'wave', label: '挥手' },
  { id: 1, name: 'greet', label: '问候' },
] as const;

export const COMMANDS = {
  SET_SERVO: (servoId: number, angle: number) => `SET_SERVO:${servoId}:${angle}`,
  SERVO_MOVE: (servoId: number, direction: number) => `SERVO_MOVE:${servoId}:${direction}`,
  PLAY_ACTION: (actionId: number) => `PLAY_ACTION:${actionId}`,
  QUEUE_ADD: (servoId: number, angle: number, duration: number) =>
    `QUEUE_ADD:${servoId}:${angle}:${duration}`,
  QUEUE_CLEAR: () => 'QUEUE_CLEAR',
};
