import React, { useState } from "react";
import WiiMote from "../WiimoteLib/WiiMote";
import { WiiMoteLedStatus } from "../WiimoteLib/WiiMote/ObjectStates";

export default ({ device }: { device: WiiMote }) => {
  return (
    <div>
      <div>
        <RumbleToggle device={device} />
      </div>
      <div>
        <LedToggle index="one" device={device} />
        <LedToggle index="two" device={device} />
        <LedToggle index="three" device={device} />
        <LedToggle index="four" device={device} />
      </div>
    </div>
  );
};

const RumbleToggle = ({ device }: { device: WiiMote }) => {
  const [isRumbling, setRumbling] = useState(false);

  return (
    <div>
      Set Rumble{" "}
      <button
        onClick={() => {
          setRumbling(!isRumbling);
          device.setRumble(!isRumbling);
        }}
      >
        Toggle {isRumbling ? "OFF" : "ON"}
      </button>
    </div>
  );
};

const LedToggle = ({
  index,
  device,
}: {
  index: keyof WiiMoteLedStatus;
  device: WiiMote;
}) => {
  const [led, setLed] = useState(false);
  let updated: any = {};
  updated[index] = !led;

  return (
    <div>
      Led {index}{" "}
      <button
        onClick={() => {
          device.updateLed(updated, true);
          setLed(!led);
        }}
      >
        Toggle {led ? "OFF" : "ON"}
      </button>
    </div>
  );
};
