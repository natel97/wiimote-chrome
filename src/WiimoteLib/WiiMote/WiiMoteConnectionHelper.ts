import WiiMote from "../WiiMote";
import { HIDDevice } from "./Types";

declare global {
  interface Window {
    device?: HIDDevice;
  }
}

export class WiiMoteConnectionHelper {
  bluetoothDevice?: BluetoothDevice;
  bluetoothServer?: BluetoothRemoteGATTServer;
  hidDevice?: HIDDevice;

  async connectViaBluetooth() {
    if (!navigator.bluetooth) {
      throw new Error(`API is not available: navigator.bluetooth`);
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Nintendo" }],
    });

    if (!device) return;
    this.bluetoothDevice = device;

    const server = await device.gatt?.connect();
    if (server) this.bluetoothServer = server;
  }

  async connectViaHID() {
    if (!navigator.hid) {
      throw new Error(`API is not available: navigator.hid`);
    }

    const device: HIDDevice[] = await navigator.hid.requestDevice({
      filters: [{ vendorId: 0x057e }],
    });

    if (device && device[0]) {
      this.hidDevice = device[0];
      this.hidDevice.open();
    }
    window.device = this.hidDevice;

    if (this.hidDevice) return new WiiMote(this.hidDevice);
    return null;
  }
}

// Define missing types for the HID API

interface HIDDeviceFilter {
  vendorId?: number;
  productId?: number;
  usagePage?: number;
  usage?: number;
}

interface HIDDeviceRequestOptions {
  filters: HIDDeviceFilter[];
}

interface HIDConnectionEvent extends Event {
  readonly device: HIDDevice;
}

interface HIDEventMap {
  connect: HIDConnectionEvent;
  disconnect: HIDConnectionEvent;
}

interface HID extends EventTarget {
  requestDevice: (options: HIDDeviceRequestOptions) => Promise<HIDDevice[]>;
  getDevices: () => Promise<HIDDevice[]>;
  onconnect: ((this: HID, ev: HIDConnectionEvent) => void) | null;
  ondisconnect: ((this: HID, ev: HIDConnectionEvent) => void) | null;
  addEventListener<K extends keyof HIDEventMap>(
    type: K,
    listener: (this: HID, ev: HIDEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof HIDEventMap>(
    type: K,
    listener: (this: HID, ev: HIDEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface Navigator {
    hid?: HID;
  }
}
