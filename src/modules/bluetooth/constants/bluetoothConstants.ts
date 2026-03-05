/**
 * Bluetooth 常量定义
 * 基于 ESP32 BLE 机器人配置
 */

export const ROBOT_DEVICE_NAME = 'ESP_ROBOT';

export const BLUETOOTH_DEFAULT_CONFIG = {
  SCAN_TIMEOUT: 10000,
  CONNECT_TIMEOUT: 10000,
  RESCAN_DELAY: 3000,
  MAX_RESCAN_ATTEMPTS: 5,
  MTU_ANDROID: 512,
};

/** ESP32 BLE GATT Service UUID - 使用短格式 UUID */
export const BLUETOOTH_UUIDS = {
  // 主服务 UUID - 必须与 ESP32 ble.c 中的 GATTS_SERVICE_UUID_TEST 一致 (0x00FF)
  SERVICE_UUID: '00FF',

  // 特征值 UUID - 短格式
  SERVO_CTRL: 'FF01',  // 舵机控制 (读写 Notify)
  ACTION_CTRL: 'FF02',  // 动作控制 (读写)
  STATUS: 'FF03',       // 状态推送 (Notify)
};

/** 舵机配置 */
export const SERVO_CONFIG = {
  // 舵机数量
  SERVO_COUNT: 2,
  // 舵机ID
  SERVO_X: 0,  // X轴 - GPIO 12
  SERVO_Y: 1,  // Y轴 - GPIO 15
  // 角度范围
  ANGLE_MIN_X: 30,
  ANGLE_MAX_X: 150,
  ANGLE_MIN_Y: 95,
  ANGLE_MAX_Y: 150,
  // 默认角度
  DEFAULT_ANGLE: 90,
};

/** 预设动作 */
export const ACTIONS = [
  { id: 0, name: 'wave', label: '挥手' },
  { id: 1, name: 'greet', label: '问候' },
] as const;

/** BLE 命令格式 */
export const COMMANDS = {
  // 设置舵机
  SET_SERVO: (servoId: number, angle: number) => `SET_SERVO:${servoId}:${angle}`,
  // 播放动作
  PLAY_ACTION: (actionId: number) => `PLAY_ACTION:${actionId}`,
};
