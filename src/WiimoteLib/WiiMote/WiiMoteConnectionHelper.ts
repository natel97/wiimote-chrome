import WiiMote from "../WiiMote";
import { HIDDevice } from "./Types";

export class WiiMoteConnectionHelper {
  bluetoothDevice?: BluetoothDevice;
  bluetoothServer?: BluetoothRemoteGATTServer;
  hidDevice?: HIDDevice;

  async connectViaBluetooth() {
    checkWindowForAPI("bluetooth");

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Nintendo" }],
    });

    if (!device) return;
    this.bluetoothDevice = device;

    const server = await device.gatt?.connect();
    if (server) this.bluetoothServer = server;
  }

  async connectViaHID() {
    const nav: any = navigator; // bypass typescript missing experimental APi
    checkWindowForAPI("hid");
    
    const device: HIDDevice[] = await nav.hid.requestDevice({
      filters: [{ vendorId: 0x057e }],
    });

    if (device && device[0]) {
      this.hidDevice = device[0];
      this.hidDevice.open();
    }
    const wdow: any = window;
    wdow.device = this.hidDevice;

    if (this.hidDevice) return new WiiMote(this.hidDevice);
    return null;
  }
}

const checkWindowForAPI = (name: string) => {
  if (!(name in navigator)) {
    throw new Error(`API is not available: navigator.${name}`);
  }
};
