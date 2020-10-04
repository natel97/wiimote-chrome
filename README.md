# Experimental WiiMote connection through HID

This is a fun website to test the idea of connecting an old Nintendo Wii Remote to a computer and utilizing the HID device APIs.

This website has been tested and works with Version 85.0.4183.121 of Google Chrome on Ubuntu and Windows. Your milage will vary.

## Requirements:

- Bluetooth
- A browser that supports HID devices (navigator.hid API)
- A computer that has the necessary drivers to connect to a Wii Remote (most mobile devices won't)
- Access to /dev/hidraw (Linux)

## Connecting a Wii Remote on Windows
The Bluetooth Web API was unable to find the Wii Remote on my machine, but I could connect it by:

- Control Pannel => Devices and Printers => Add a Device (Ribon Bar) => Nintendo RVL-CNT-01
- Leave the pin blank and click next
- It should connect

## Granting Access to hardware APIs

- Enable the Chrome flag for the experimental API (enable-experimental-web-platform-features)
- Grant Access to your group (Linux)

I created a the following file
/etc/udev/rules.d/60-wiimote-connect.rules

```
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="sudo"
```

Since Google Chrome was unable to access `/dev/hidraw` and I was in the sudo group.

## References

WiiBrew for the low level HID [help](https://wiibrew.org/wiki/Wiimote)
