export enum WiiMoteActions {
  SET_RUMBLE = 0x10,
  SET_DATA_MODE = 0x33,
  ENABLE_SPEAKER = 0x14,
  MUTE_SPEAKER = 0x19,
  SEND_SPEAKER_DATA = 0x18,
  LED = 0x11,
}

export enum Rumble {
  ON = 0x01,
  OFF = 0x00,
}

export enum LEDS {
  ONE = 0x10,
  TWO = 0x20,
  THREE = 0x40,
  FOUR = 0x80,
}
export enum SpeakerStatus {
  MUTE = 0x04,
  UNMUTE = 0x00,
}

export enum SpeakerEnabled {
  ON = 0x04,
  OFF = 0x00,
}

export enum ReportModes {
  CORE_BUTTONS = 0x30,
  CORE_BUTTONS_AND_ACCEL = 0x31,
  CORE_BUTTONS_ACCEL_IR = 0x33,
}

export const SpeakerSettings = {
  LOW_QUALITY: [0x00, 0x00, 0xd0, 0x07, 0x40, 0x00, 0x00],
  MID_QUALITY: [0x00, 0x40, 0x40, 0x1f, 0x40, 0x00, 0x00],
  HIGH_QUALITY: [0x00, 0x40, 0x70, 0x17, 0x60, 0x00, 0x00],
};

export const SOUND_REGISTERS = [
  0xa20001,
  0xa20002,
  0xa20003,
  0xa20004,
  0xa20005,
  0xa20006,
  0xa20007,
  0xa20008,
];

export interface HIDInputReportEvent extends Event {
  readonly data: DataView;
  readonly device: HIDDevice;
  readonly reportId: number;
}

export type HIDDevice = {
  oninputreport: ((this: HIDDevice, ev: HIDInputReportEvent) => void) | null;
  opened: boolean;
  productId: number;
  productName: string;
  vendorId: number;
  collections: HIDCollectionInfo[];
  open: () => Promise<void>;
  close: () => Promise<void>;
  sendReport: (reportId: number, data: ArrayBuffer) => Promise<void>;
  sendFeatureReport: (reportId: number, data: ArrayBuffer) => Promise<void>;
  receiveFeatureReport: (reportId: number) => Promise<DataView>;
  forget: () => Promise<void>;
  addEventListener(
    type: "inputreport",
    listener: (this: HIDDevice, ev: HIDInputReportEvent) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: "inputreport",
    listener: (this: HIDDevice, ev: HIDInputReportEvent) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
};

export interface HIDCollectionInfo {
  usagePage: number;
  usage: number;
  type: number;
  children?: HIDCollectionInfo[];
  inputReports?: HIDReportInfo[];
  outputReports?: HIDReportInfo[];
  featureReports?: HIDReportInfo[];
}

export interface HIDReportInfo {
  reportId: number;
  items: HIDReportItem[];
}

export interface HIDReportItem {
  isAbsolute?: boolean;
  isArray?: boolean;
  isBufferedBytes?: boolean;
  isConstant?: boolean;
  isLinear?: boolean;
  isRange?: boolean;
  isVolatile?: boolean;
  hasNull?: boolean;
  hasPreferredState?: boolean;
  wrap?: boolean;
  usages?: number[];
  usageMinimum?: number;
  usageMaximum?: number;
  reportSize?: number;
  reportCount?: number;
  unitExponent?: number;
  unitSystem?: number;
  unitFactorLengthExponent?: number;
  unitFactorMassExponent?: number;
  unitFactorTimeExponent?: number;
  unitFactorTemperatureExponent?: number;
  unitFactorCurrentExponent?: number;
  unitFactorLuminousIntensityExponent?: number;
  logicalMinimum?: number;
  logicalMaximum?: number;
  physicalMinimum?: number;
  physicalMaximum?: number;
  strings?: string[];
}

export enum Bit1Buttons {
  DPAD_LEFT,
  DPAD_RIGHT,
  DPAD_DOWN,
  DPAD_UP,
  PLUS,
}

export enum Bit2Buttons {
  TWO,
  ONE,
  B,
  A,
  MINUS,
  HOME = 7,
}

export enum WMButtons {
  DPAD_LEFT = "DPAD_LEFT",
  DPAD_RIGHT = "DPAD_RIGHT",
  DPAD_DOWN = "DPAD_DOWN",
  DPAD_UP = "DPAD_UP",
  PLUS = "PLUS",
  TWO = "TWO",
  ONE = "ONE",
  B = "B",
  A = "A",
  MINUS = "MINUS",
  HOME = "HOME",
}
