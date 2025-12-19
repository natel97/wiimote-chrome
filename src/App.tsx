import React, { useState } from "react";
import WiiMoteAccel from "./Components/WiiMoteAccel";
import WiiMoteButtons from "./Components/WiiMoteButtons";
import WiiMoteFeedback from "./Components/WiiMoteFeedback";
import WiiMote from "./WiimoteLib/WiiMote";
import { WiiMoteConnectionHelper } from "./WiimoteLib/WiiMote/WiiMoteConnectionHelper";

export default () => {
  const helper = new WiiMoteConnectionHelper();
  const [wiiMote, setWiiMote] = useState<WiiMote | null>(null);
  const [error, setError] = useState("");
  return (
    <div className="App">
      <div>
        <div>
          <div>Step 1</div>
          <div>Connect to the Wii Remote</div>
          <div>
            Either go to your settings and manually connect or use the web API
            via the button
          </div>
          <div>
            In MacOS, you need to install
            <a
              href="https://github.com/dolphin-emu/WiimotePair"
              target="_blank"
              rel="noopener noreferrer"
            >
              WiimotePair
            </a>
          </div>
          {helper.bluetoothDevice && <div>Bluetooth Device Detected</div>}
          {helper.bluetoothServer && <div>Bluetooth Server Connected</div>}
        </div>
        <div>
          <div>Step 2</div>
          <div>Establish a HID connection</div>
          <div>Enable the browser to access the raw HID APIs</div>
          {helper.hidDevice && <div>HID Connection Established</div>}
        </div>
      </div>
      <header className="App-header">
        <button
          onClick={() =>
            helper
              .connectViaBluetooth()
              .catch((err) => setError(JSON.stringify(err)))
          }
        >
          Connect to bluetooth
        </button>
        <button
          onClick={() =>
            helper
              .connectViaHID()
              .then((device) => setWiiMote(device))
              .catch((err) => setError(err))
          }
        >
          Connect to HID
        </button>
        {error && <div>{error}</div>}
      </header>
      {wiiMote && <WiiMoteFeedback device={wiiMote} />}
      {wiiMote && <WiiMoteButtons device={wiiMote} />}
      {wiiMote && <WiiMoteAccel device={wiiMote} />}
    </div>
  );
};
