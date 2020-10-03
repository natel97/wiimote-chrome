import React, { useEffect, useState } from "react";
import WiiMote from "../WiimoteLib/WiiMote";
import { WMButtons } from "../WiimoteLib/WiiMote/Types";

export default ({ device }: { device: WiiMote }) => {
  return (
    <div>
      {Object.keys(WMButtons).map((b) => (
        <SingleButton button={b as WMButtons} wiimote={device} />
      ))}
    </div>
  );
};

const SingleButton = ({
  button,
  wiimote,
}: {
  button: WMButtons;
  wiimote: WiiMote;
}) => {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    wiimote.addButtonListener(button, (e) => setPressed(e.isPressed));
  }, [button, wiimote]);
  return (
    <div>
      {button}: {pressed ? "Pressed" : "Not Pressed"}
    </div>
  );
};
