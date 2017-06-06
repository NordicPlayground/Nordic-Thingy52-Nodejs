# Nordic Thingy:52 Node.js library on Raspberry Pi

Welcome to the Nordic Thingy:52 Node.js library example.
Please see http://www.nordicsemi.com/thingy for the latest Nordic Thingy:52 news and software releases.

This library is using [noble-device](https://github.com/sandeepmistry/noble-device) and [noble](https://github.com/sandeepmistry/noble) to handle the Bluetooth connection.

## Prerequisites
1. A Raspberry Pi with built in Bluetooth or a Raspberry Pi and a Bluetooth USB dongle.
> Note that the internet radio example might not work to well with the built in Bluetooth adapter due to bandwidth limitations. It is therefore recommended to use an external Bluetooth USB dongle when using this example.

2. The [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/) operating system image.
3. Git, Node.js, npm and noble-device.

## Setup
1. [Install](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) Raspbian on your Raspberry Pi's SD card using [Etcher](https://etcher.io/).
> To enable the SSH server on your Pi, make a new file called ssh without any extensions in the boot partition on the SD card.

2. Insert the SD card and power up the Raspberry Pi. Then log in using the default username and password. It's higly recommended to change the default password using the `passwd` command.
3. Update the package manger: `sudo apt-get update`.
4. Install git: `sudo apt-get install git`
5. Install Bluetooth dependencies: `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev`
6. Clone the repository: `git clone https://github.com/NordicSemiconductor/Nordic-Thingy52-Nodejs.git`
7. Add the latest version of Node.js to package manager: `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`
8. Install Node.js: `sudo apt-get install nodejs`

## Run the examples
1. Go into the Nordic-Thingy52-Nodejs folder. `cd /Nordic-Thingy52-Nodejs`
2. Install [noble-device](https://github.com/sandeepmistry/noble-device): `npm install noble-device`
3. Check if the example you want to run has other required npm packages by opening the example. As we can see below the radio.js script requires icecast, lame and util.
```javascript
var Thingy = require('../index');
var icecast = require("icecast");
var lame = require("lame");
var util = require('util');
```
4. Install required npm packages: `npm install <package name>`
5. Run example: `sudo node <example_name>.js`
