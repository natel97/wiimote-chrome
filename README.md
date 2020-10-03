# Experimental WiiMote connection through HID

This is a fun website to test the idea of connecting an old Nintendo Wii Remote to a computer and utilizing the HID device APIs.

This website has been tested and works with Ubuntu. Your milage will vary.

## Requirements:

- Bluetooth
- A browser that supports HID devices (navigator.hid API)
- A computer that has the necessary drivers to connect to a Wii Remote (most mobile devices won't)
- Access to /dev/hidraw

## Granting Access to hardware APIs in Ubuntu

- Enable the Chrome flag for the experimental API
- Grant Access to your group

I created a the following file
/etc/udev/rules.d/60-wiimote-connect.rules

```
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="sudo"
```

Since Google Chrome was unable to access `/dev/hidraw` and I was in the sudo group.

## References

WiiBrew for the low level HID [help](https://wiibrew.org/wiki/Wiimote)
