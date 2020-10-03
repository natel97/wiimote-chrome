import {
  WiiMoteLedStatus,
  WiiMoteRawStatus,
  WiiMoteStatus,
} from "./ObjectStates";
import { LEDS, Rumble } from "./Types";

export function calculateLights({ one, two, three, four }: WiiMoteLedStatus) {
  return (
    +Boolean(one) * LEDS.ONE +
    +Boolean(two) * LEDS.TWO +
    +Boolean(three) * LEDS.THREE +
    +Boolean(four) * LEDS.FOUR
  );
}
export function rawStatusFromStatus(status: WiiMoteStatus): WiiMoteRawStatus {
  return {
    lastLight: calculateLights(status.leds),
    rumble: status.isRumbling ? Rumble.ON : Rumble.OFF,
  };
}

export function numbersToBuffer(data: number[]): ArrayBuffer {
  return new Int8Array(data);
}

export function getBitInByte(byte: number, index: number) {
  return byte & (1 << (index - 1));
}
