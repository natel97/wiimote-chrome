import {
  calculateLights,
  rawStatusFromStatus,
  numbersToBuffer,
  getBitInByte,
} from "./WiiMote/Logic";
import {
  WiiMoteLedStatus,
  WiiMoteRawStatus,
  WiiMoteStatus,
  WMButtonEvent,
  WMButtonEventList,
} from "./WiiMote/ObjectStates";
import {
  Bit1Buttons,
  Bit2Buttons,
  HIDDevice,
  ReportModes,
  Rumble,
  SOUND_REGISTERS,
  SpeakerEnabled,
  SpeakerSettings,
  SpeakerStatus,
  WiiMoteActions,
  WMButtons,
} from "./WiiMote/Types";

export default class WiiMote {
  device: HIDDevice;
  private status: WiiMoteStatus;
  private rawStatus: WiiMoteRawStatus;
  private soundInitialized = false;
  private lastBit1Buttons = [0, 0, 0, 0, 0];
  private lastBit2Buttons = [0, 0, 0, 0, 0, 0, 0, 0];
  private listeners: WMButtonEventList[] = [];

  constructor(device: HIDDevice) {
    this.device = device;
    this.status = new WiiMoteStatus();
    this.rawStatus = rawStatusFromStatus(this.status);
    this.setDataTracking(ReportModes.CORE_BUTTONS);
    const w: any = window;
    w.wiimote = this;
    this.device.oninputreport = (e: any) => this.listenForUpdates(e);
  }

  setRumble(isRumbling: boolean) {
    let state = isRumbling ? Rumble.ON : Rumble.OFF;
    this.device.sendReport(
      WiiMoteActions.LED,
      numbersToBuffer([state + this.rawStatus.lastLight])
    );
    this.status.isRumbling = isRumbling;
    this.rawStatus.rumble = state;
  }

  updateLed(status: WiiMoteLedStatus, merge = true) {
    const newState = { ...this.status.leds, ...status };
    const ledStatus = calculateLights(merge ? newState : status);
    this.device.sendReport(WiiMoteActions.LED, numbersToBuffer([ledStatus]));
    this.status.leds = newState;
    this.rawStatus.lastLight = ledStatus;
  }

  initSound(status = SpeakerSettings.MID_QUALITY) {
    // The following sequence will initialize the speaker:
    // Enable speaker (Send 0x04 to Output Report 0x14)
    // Mute speaker (Send 0x04 to Output Report 0x19)
    // Write 0x01 to register 0xa20009
    // Write 0x08 to register 0xa20001
    // Write 7-byte configuration to registers 0xa20001-0xa20008
    // Write 0x01 to register 0xa20008
    // Unmute speaker (Send 0x00 to Output Report 0x19)

    if (this.soundInitialized) return;

    this.device.sendReport(
      WiiMoteActions.ENABLE_SPEAKER,
      numbersToBuffer([SpeakerEnabled.ON])
    );
    this.device.sendReport(
      WiiMoteActions.MUTE_SPEAKER,
      numbersToBuffer([SpeakerStatus.MUTE])
    );
    this.device.sendReport(0xa20009, numbersToBuffer([0x01]));
    this.device.sendReport(0xa20001, numbersToBuffer([0x08]));

    for (let register of SOUND_REGISTERS) {
      this.device.sendReport(register, numbersToBuffer(status));
    }

    this.device.sendReport(0xa20008, numbersToBuffer([0x01]));
    this.device.sendReport(
      WiiMoteActions.MUTE_SPEAKER,
      numbersToBuffer([SpeakerStatus.UNMUTE])
    );
    this.soundInitialized = true;
  }

  playSoundData(data: Buffer) {
    const newData = Array.from(data);
    this.device.sendReport(
      WiiMoteActions.SEND_SPEAKER_DATA,
      new Int8Array(newData)
    );
  }

  setDataTracking(trackingMode: ReportModes) {
    this.device.sendReport(0x12, numbersToBuffer([0x00, trackingMode]));
  }

  private listenForUpdates(event: any) {
    const [byte1, byte2] = Array.from(new Uint8Array(event.data.buffer));
    this.matchBits(byte1, this.lastBit1Buttons, Bit1Buttons);
    this.matchBits(byte2, this.lastBit2Buttons, Bit2Buttons);
  }

  public addButtonListener(
    key: WMButtons,
    listener: (event: WMButtonEvent) => any
  ) {
    this.listeners.push({ button: key, callback: listener });
  }

  matchBits(bit: number, prevState: any[], nameDefs: any) {
    for (let i = 0; i < 8; i++) {
      const buttonIsPressed = getBitInByte(bit, i + 1);
      if (nameDefs[i] && prevState[i] !== +buttonIsPressed) {
        prevState[i] = +buttonIsPressed;
        this.listeners
          .filter((x) => x.button === nameDefs[i])
          .forEach((e) =>
            e.callback({
              button: e.button,
              isPressed: Boolean(buttonIsPressed),
            })
          );
      }
    }
  }
}
