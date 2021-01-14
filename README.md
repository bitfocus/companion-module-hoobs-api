# companion-module-hoobs-api

This module provides control over smart home accessories registered with a local [HOOBS](https://hoobs.org/) instance. HOOBS is based on Homebridge. Homebridge is a lightweight NodeJS server that emulates the iOS HomeKit API. Homebridge allows you to integrate with smart home devices that do not support the HomeKit protocol.

## Configuration
See [HELP.md](HELP.md)

## Supported Version
The module supports and has been tested with the latest HOOBS version.

HOOBS Version | Node Version
--- | ---
3.1.1 | 12.14.1

## HOOBS API
To develop this module we used the  [API Reference](https://support.hoobs.org/docs/5e764e96e87d1e02b6c19d4d) provided in the [HOOBS Developers Guide](https://support.hoobs.org/docs/5e763bf6e87d1e02b6c19d2d).
## Change Log

#### v1.0.0
- Added action to power on/off accessories
- Added action to set the brightness of supported accessories
- Added action to set the color temperature (in Kelvin) of supported accessories

## TODO
- [ ] Add API polling to support feedbacks
- [ ] Add power on/off feedback
- [ ] Add brightness feeedback
- [ ] Add color temperature feedback
- [ ] Add action to set RGB color
