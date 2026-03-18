import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import { useDispatch, useSelector } from 'react-redux';
import bleConfig from '../config/ble_config.json';
import { BLUETOOTH_UUIDS, WIFI_COMMANDS } from '../constants/bluetoothConstants';
import { bluetoothService } from '../services/bluetoothService';
import {
    BluetoothReceivedData,
    BluetoothStatus,
    ConnectOptions,
    DeviceDiscoveredCallback,
    NotificationListener,
    NotificationOptions,
    ScanOptions,
    SendCommandOptions,
    UseBluetoothReturn,
    WifiProvisioningPayload,
    WifiProvisioningStatus,
} from '../types';
import {
    selectBluetoothState,
    setDeviceInfo,
    setError,
    setReceivedData,
    setStatus,
} from '../store';

const LAST_CONNECTED_DEVICE_ID_KEY = 'lastConnectedDeviceId';

const parseWifiProvisioningStatus = (raw: string): WifiProvisioningStatus | null => {
    const message = raw.trim();

    if (message === 'WIFI_UNCONFIGURED') {
        return { state: 'unconfigured', message, raw };
    }

    if (message === 'WIFI_CLEARED') {
        return { state: 'cleared', message, raw };
    }

    if (message.startsWith('WIFI_CONNECTING')) {
        const [, ssid = ''] = message.split(':');
        return { state: 'connecting', message, raw, ssid };
    }

    if (message.startsWith('WIFI_CONNECTED')) {
        const [, ssid = '', ip = ''] = message.split(':');
        return { state: 'connected', message, raw, ssid, ip };
    }

    if (message.startsWith('WIFI_DISCONNECTED')) {
        const [, ssid = ''] = message.split(':');
        return { state: 'disconnected', message, raw, ssid };
    }

    return null;
};

export const useBluetooth = (): UseBluetoothReturn => {
    const dispatch = useDispatch();
    const { status, deviceInfo, receivedData, error } = useSelector(selectBluetoothState);
    const autoRescanConfigRef = useRef<{
        scanTimeout: number;
        connectTimeout: number;
        autoConnect: boolean;
        enableAutoRescan: boolean;
        maxRescanAttempts: number;
        rescanDelayMs: number;
        currentAttempts: number;
    } | null>(null);

    const initialize = useCallback(async () => {
        try {
            await bluetoothService.initialize();
        } catch (err: any) {
            dispatch(
                setError({
                    message: err.message || 'Bluetooth initialization failed',
                }),
            );
        }
    }, [dispatch]);

    const startScan = useCallback(
        async (onDeviceFound: DeviceDiscoveredCallback, options?: ScanOptions) => {
            try {
                dispatch(setStatus(BluetoothStatus.Scanning));
                dispatch(setError(null));
                await bluetoothService.startScan(onDeviceFound, options);
            } catch (err: any) {
                dispatch(setStatus(BluetoothStatus.Error));
                dispatch(
                    setError({
                        message: err.message || 'Scan failed',
                    }),
                );
            }
        },
        [dispatch],
    );

    const stopScan = useCallback(async () => {
        bluetoothService.stopScan();
        if (status === BluetoothStatus.Scanning) {
            dispatch(setStatus(BluetoothStatus.Idle));
        }
    }, [dispatch, status]);

    const connectToDevice = useCallback(
        async (deviceId: string, options?: ConnectOptions) => {
            try {
                dispatch(setStatus(BluetoothStatus.Connecting));
                dispatch(setError(null));

                const device = await bluetoothService.connectToDevice(deviceId, options);
                await AsyncStorage.setItem(LAST_CONNECTED_DEVICE_ID_KEY, device.id);

                dispatch(setStatus(BluetoothStatus.Connected));
                dispatch(
                    setDeviceInfo({
                        id: device.id,
                        name: device.name,
                        mtu: device.mtu,
                    }),
                );

                bluetoothService.setOnDisconnectedListener(() => {
                    dispatch(setStatus(BluetoothStatus.Disconnected));
                    dispatch(setDeviceInfo(null));
                    dispatch(setReceivedData(null));
                });
            } catch (err: any) {
                dispatch(setStatus(BluetoothStatus.Error));
                dispatch(
                    setError({
                        message: err.message || 'Connection failed',
                    }),
                );
                throw err;
            }
        },
        [dispatch],
    );

    const disconnect = useCallback(async () => {
        try {
            await bluetoothService.disconnectDevice();
            dispatch(setStatus(BluetoothStatus.Disconnected));
            dispatch(setDeviceInfo(null));
            dispatch(setReceivedData(null));
        } catch (err: any) {
            console.warn('Disconnect error:', err);
        }
    }, [dispatch]);

    const writeData = useCallback(
        async (
            serviceUUID: string,
            characteristicUUID: string,
            data: string | Uint8Array,
            withResponse: boolean = false,
        ) => {
            try {
                const options: NotificationOptions = {
                    serviceUUID,
                    characteristicUUID,
                };

                if (withResponse) {
                    await bluetoothService.sendDataWithResponse(options, data);
                } else {
                    await bluetoothService.sendDataWithoutResponse(options, data);
                }
            } catch (err: any) {
                dispatch(
                    setError({
                        message: err.message || 'Write data failed',
                    }),
                );
                throw err;
            }
        },
        [dispatch],
    );

    const readData = useCallback(
        async (serviceUUID: string, characteristicUUID: string) => {
            try {
                const options: NotificationOptions = {
                    serviceUUID,
                    characteristicUUID,
                };
                return await bluetoothService.readCharacteristic(options);
            } catch (err: any) {
                dispatch(
                    setError({
                        message: err.message || 'Read data failed',
                    }),
                );
                throw err;
            }
        },
        [dispatch],
    );

    const subscribeToNotifications = useCallback(
        (options: NotificationOptions, callback: NotificationListener) => {
            try {
                return bluetoothService.startNotifications(options, data => {
                    let characteristicName = 'Unknown';
                    let valueFormat = 'string';

                    const service = bleConfig.services.find(
                        s => s.uuid.toLowerCase() === options.serviceUUID.toLowerCase(),
                    );
                    if (service) {
                        const characteristic = service.characteristics.find(
                            c => c.uuid.toLowerCase() === options.characteristicUUID.toLowerCase(),
                        );
                        if (characteristic) {
                            characteristicName = characteristic.name;
                            if (characteristic.value_format) {
                                valueFormat = characteristic.value_format;
                            }
                        }
                    }

                    let processedData: any = data;
                    if (typeof data === 'string') {
                        try {
                            const decoded = base64.decode(data);
                            if (valueFormat === 'bytes') {
                                const bytes = new Uint8Array(decoded.length);
                                for (let i = 0; i < decoded.length; i++) {
                                    bytes[i] = decoded.charCodeAt(i);
                                }
                                processedData = Array.from(bytes);
                            } else {
                                processedData = decoded;
                            }
                        } catch (parseError) {
                            console.warn('Data parse error:', parseError);
                        }
                    }

                    const receivedDataObj: BluetoothReceivedData = {
                        characteristicName,
                        characteristicUUID: options.characteristicUUID,
                        data: processedData,
                        timestamp: new Date().toISOString(),
                    };

                    dispatch(setReceivedData(receivedDataObj));
                    callback(receivedDataObj);
                });
            } catch (err: any) {
                dispatch(
                    setError({
                        message: err.message || 'Subscribe notifications failed',
                    }),
                );
                return () => {};
            }
        },
        [dispatch],
    );

    const subscribeToProvisioningStatus = useCallback(
        (callback: (wifiStatus: WifiProvisioningStatus) => void) => {
            return subscribeToNotifications(
                {
                    serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
                    characteristicUUID: BLUETOOTH_UUIDS.PROVISIONING_CTRL,
                },
                value => {
                    const raw =
                        typeof value === 'string'
                            ? value
                            : typeof value.data === 'string'
                              ? value.data
                              : '';
                    const parsed = raw ? parseWifiProvisioningStatus(raw) : null;

                    if (parsed) {
                        callback(parsed);
                    }
                },
            );
        },
        [subscribeToNotifications],
    );

    const connectToConfiguredDevice = useCallback(
        async (options?: {
            deviceName?: string;
            scanTimeout?: number;
            connectTimeout?: number;
            autoConnect?: boolean;
            enableAutoRescan?: boolean;
            maxRescanAttempts?: number;
            rescanDelayMs?: number;
        }) => {
            const state = await bluetoothService.getAdapterState();

            if (Platform.OS === 'ios') {
                if (state !== 'PoweredOn') {
                    await new Promise<void>((resolve, reject) => {
                        const subscription = (bluetoothService as any).manager.onStateChange(
                            (newState: string) => {
                                if (newState === 'PoweredOn') {
                                    subscription.remove();
                                    resolve();
                                } else if (newState === 'PoweredOff' || newState === 'Unauthorized') {
                                    subscription.remove();
                                    reject(new Error('Bluetooth is unavailable on this iPhone.'));
                                }
                            },
                            true,
                        );
                    });
                }
            } else if (state !== 'PoweredOn') {
                throw new Error('Bluetooth is turned off.');
            }

            const {
                deviceName = bleConfig.ble_device_name,
                scanTimeout = 10000,
                connectTimeout = 15000,
                autoConnect = true,
                enableAutoRescan = false,
                maxRescanAttempts = 5,
                rescanDelayMs = 3000,
            } = options || {};

            autoRescanConfigRef.current = {
                scanTimeout,
                connectTimeout,
                autoConnect,
                enableAutoRescan,
                maxRescanAttempts,
                rescanDelayMs,
                currentAttempts: 0,
            };

            const performScanAndConnect = async () => {
                try {
                    await bluetoothService.initialize();
                    dispatch(setError(null));

                    if (status === BluetoothStatus.Scanning) {
                        return;
                    }

                    dispatch(setStatus(BluetoothStatus.Scanning));
                    let deviceFound = false;

                    const scanPromise = bluetoothService.startScan(
                        async device => {
                            const deviceLocalName = (device as any).localName;
                            if (device.name === deviceName || deviceLocalName === deviceName) {
                                deviceFound = true;
                                await stopScan();

                                try {
                                    await connectToDevice(device.id, {
                                        timeout: connectTimeout,
                                        autoConnect,
                                    });

                                    if (autoRescanConfigRef.current) {
                                        autoRescanConfigRef.current.currentAttempts = 0;
                                    }

                                    if (enableAutoRescan) {
                                        setupAutoRescan();
                                    }
                                } catch (connectError) {
                                    console.error('Target device discovered but connection failed:', connectError);
                                    deviceFound = false;
                                }
                            }
                        },
                        { timeout: scanTimeout },
                    );

                    await scanPromise;

                    if (!deviceFound) {
                        await stopScan();
                        dispatch(setStatus(BluetoothStatus.Error));
                        dispatch(
                            setError({
                                message: `Unable to find ${deviceName}. Make sure the device is powered on and advertising BLE.`,
                            }),
                        );
                    }
                } catch (scanError) {
                    console.error('Bluetooth scan/connect failed:', scanError);
                    const message =
                        scanError instanceof Error ? scanError.message : 'Scan or connection failed';
                    dispatch(setError({ message }));
                    dispatch(setStatus(BluetoothStatus.Error));
                    throw scanError;
                } finally {
                    try {
                        await stopScan();
                    } catch {
                        // ignore cleanup failures
                    }
                }
            };

            const setupAutoRescan = () => {
                bluetoothService.setOnDisconnectedListener(() => {
                    dispatch(setStatus(BluetoothStatus.Disconnected));
                    dispatch(setDeviceInfo(null));
                    dispatch(setReceivedData(null));

                    if (
                        autoRescanConfigRef.current &&
                        autoRescanConfigRef.current.currentAttempts <
                            autoRescanConfigRef.current.maxRescanAttempts
                    ) {
                        autoRescanConfigRef.current.currentAttempts += 1;
                        setTimeout(() => {
                            performScanAndConnect().catch(reconnectError => {
                                console.error('Auto rescan failed:', reconnectError);
                                if (
                                    autoRescanConfigRef.current &&
                                    autoRescanConfigRef.current.currentAttempts >=
                                        autoRescanConfigRef.current.maxRescanAttempts
                                ) {
                                    dispatch(
                                        setError({
                                            message: 'Auto reconnect failed. Please reconnect manually.',
                                        }),
                                    );
                                }
                            });
                        }, autoRescanConfigRef.current.rescanDelayMs);
                    } else {
                        dispatch(
                            setError({
                                message: 'Auto reconnect failed. Please reconnect manually.',
                            }),
                        );
                    }
                });
            };

            try {
                const lastId = await AsyncStorage.getItem(LAST_CONNECTED_DEVICE_ID_KEY);
                if (lastId) {
                    try {
                        await connectToDevice(lastId, { timeout: connectTimeout, autoConnect });
                        if (enableAutoRescan) {
                            setupAutoRescan();
                        }
                        return;
                    } catch (cachedConnectError) {
                        console.warn('Cached BLE device connection failed, falling back to scan:', cachedConnectError);
                        await AsyncStorage.removeItem(LAST_CONNECTED_DEVICE_ID_KEY);
                    }
                }

                await performScanAndConnect();
            } catch (err) {
                console.error('connectToConfiguredDevice failed:', err);
                dispatch(
                    setError({
                        message: err instanceof Error ? err.message : 'Connection failed',
                    }),
                );
                dispatch(setStatus(BluetoothStatus.Error));
                throw err;
            }
        },
        [connectToDevice, dispatch, status, stopScan],
    );

    const sendCommand = useCallback(
        async (options: SendCommandOptions) => {
            const {
                data,
                serviceUUID = BLUETOOTH_UUIDS.SERVICE_UUID,
                characteristicUUID = BLUETOOTH_UUIDS.SERVO_CTRL,
                type = 'no_response',
            } = options;

            try {
                if (status !== BluetoothStatus.Connected || !deviceInfo) {
                    throw new Error('Bluetooth device is not connected.');
                }

                const stillConnected = await bluetoothService.isDeviceConnected(deviceInfo.id);
                if (!stillConnected) {
                    dispatch(setStatus(BluetoothStatus.Disconnected));
                    dispatch(setDeviceInfo(null));
                    throw new Error('The BLE device disconnected.');
                }

                if (type === 'response') {
                    await bluetoothService.sendDataWithResponse(
                        { serviceUUID, characteristicUUID },
                        data,
                    );
                } else {
                    await bluetoothService.sendDataWithoutResponse(
                        { serviceUUID, characteristicUUID },
                        data,
                    );
                }
            } catch (sendError) {
                console.error('BLE command send failed:', sendError);
                const message =
                    sendError instanceof Error ? sendError.message : 'Failed to send BLE command';
                dispatch(setError({ message }));
                dispatch(setStatus(BluetoothStatus.Error));
                throw sendError;
            }
        },
        [deviceInfo, dispatch, status],
    );

    const requestWifiStatus = useCallback(async () => {
        await sendCommand({
            data: WIFI_COMMANDS.STATUS,
            serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
            characteristicUUID: BLUETOOTH_UUIDS.PROVISIONING_CTRL,
            type: 'response',
        });
    }, [sendCommand]);

    const configureWifi = useCallback(
        async ({ ssid, password }: WifiProvisioningPayload) => {
            await sendCommand({
                data: WIFI_COMMANDS.CONFIG(ssid, password),
                serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
                characteristicUUID: BLUETOOTH_UUIDS.PROVISIONING_CTRL,
                type: 'response',
            });
        },
        [sendCommand],
    );

    const clearWifiCredentials = useCallback(async () => {
        await sendCommand({
            data: WIFI_COMMANDS.CLEAR,
            serviceUUID: BLUETOOTH_UUIDS.SERVICE_UUID,
            characteristicUUID: BLUETOOTH_UUIDS.PROVISIONING_CTRL,
            type: 'response',
        });
    }, [sendCommand]);

    const clearError = useCallback(() => {
        dispatch(setError(null));
        if (status === BluetoothStatus.Error) {
            dispatch(setStatus(BluetoothStatus.Idle));
        }
    }, [dispatch, status]);

    const clearAll = useCallback(() => {
        dispatch(setStatus(BluetoothStatus.Idle));
        dispatch(setDeviceInfo(null));
        dispatch(setReceivedData(null));
        dispatch(setError(null));
    }, [dispatch]);

    return {
        status,
        deviceInfo,
        receivedData,
        error,
        initialize,
        startScan,
        stopScan,
        connectToDevice,
        connectToConfiguredDevice,
        disconnect,
        writeData,
        readData,
        subscribeToNotifications,
        sendCommand,
        subscribeToProvisioningStatus,
        requestWifiStatus,
        configureWifi,
        clearWifiCredentials,
        clearError,
        clearAll,
    };
};
