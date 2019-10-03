# Nordic Thingy:52 Node.js library

[![Greenkeeper badge](https://badges.greenkeeper.io/NordicPlayground/Nordic-Thingy52-Nodejs.svg)](https://greenkeeper.io/)

Welcome to the Nordic Thingy:52 Node.js library example.
Please see http://www.nordicsemi.com/thingy for the latest Nordic Thingy:52 news and software releases.

This library is using [noble-device](https://github.com/sandeepmistry/noble-device) and [noble](https://github.com/sandeepmistry/noble) to handle the Bluetooth connection.


> See [RASPBERRYPI.md](https://github.com/NordicPlayground/Nordic-Thingy52-Nodejs/blob/master/RASPBERRYPI.md) for how to set it up on a Raspberry Pi running Raspbian.

> See [GOOGLE_ASSISTANT.md](https://github.com/NordicPlayground/Nordic-Thingy52-Nodejs/blob/master/GOOGLE_ASSISTANT.md) for how to set it up on a Raspberry Pi running Raspbian and Google Assistant using the Thingy:52 as microphone input.

## Prerequisites
1. [Node.js](https://nodejs.org/en/) JavaScript runtime.
2. [noble-device](https://github.com/sandeepmistry/noble-device) (A [Node.js](https://nodejs.org/en/) lib to abstract BLE (Bluetooth Low Energy) peripherals, using [noble](https://github.com/sandeepmistry/noble)).
3. Bluetooth 4.0 USB dongle supported by [noble](https://github.com/sandeepmistry/noble) and [node-bluetooth-hci-socket](https://github.com/sandeepmistry/node-bluetooth-hci-socket#prerequisites).

## Installation
1. Install package: `npm install thingy52`
2. Find examples `cd node_modules/thingy52/examples`.

## Examples
A few examples like reading environment sensor data, reading button presses, color sensor calibration, connecting Thingy:52 to Firebase and more can be found under the examples folder.
