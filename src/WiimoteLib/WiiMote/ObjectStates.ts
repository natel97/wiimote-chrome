import { ReportModes, SpeakerEnabled, SpeakerStatus, WMButtons } from "./Types";

export class WiiMoteStatus {
  constructor() {
    this.leds = {
      one: true,
      two: false,
      three: false,
      four: false,
    };
  }
  isRumbling = false;
  leds: WiiMoteLedStatus;
  muted = SpeakerStatus.MUTE;
  soundEnabled = SpeakerEnabled.OFF;
  currentDataMode = ReportModes.CORE_BUTTONS_AND_ACCEL;
}

export type WiiMoteLedStatus = {
  one?: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
};

export type WiiMoteRawStatus = {
  lastLight: number;
  rumble: number;
};

export type WMButtonEventList = {
  button: WMButtons;
  callback: (payload: WMButtonEvent) => void | Promise<void>;
};

export type WMButtonEvent = {
  button: WMButtons;
  isPressed: boolean;
};
