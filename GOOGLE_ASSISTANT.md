# Nordic Thingy:52 Node.js library on Raspberry Pi with Google Assistant SDK
Welcome to the Nordic Thingy:52 Node.js library example.
Please see http://www.nordicsemi.com/thingy for the latest Nordic Thingy:52 news and software releases.

See [RASPBERRYPI.md](https://github.com/NordicPlayground/Nordic-Thingy52-Nodejs/blob/master/RASPBERRYPI.md) for how to set up Node.js and Thingy:52 library on the raspberry pi.

## Prerequisites
1. A Raspberry Pi with built in Bluetooth or a Raspberry Pi and a Bluetooth USB dongle.
> Note that the internet radio and microphone example might not work to well with the built in Bluetooth adapter due to bandwidth limitations. It is therefore recommended to use an external Bluetooth USB dongle when using this example.

2. The [Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/) operating system image.
3. Git, Node.js, npm and [noble-device](https://github.com/sandeepmistry/noble-device).

## Installation
1. [Install](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) Raspbian on your Raspberry Pi's SD card using [Etcher](https://etcher.io/).
> To enable the SSH server on your Pi, make a new file called ssh without any extensions in the boot partition on the SD card.

2. Insert the SD card and power up the Raspberry Pi. Then log in using the default username and password. It's higly recommended to change the default password using the `passwd` command.
3. Update the package manger: `sudo apt-get update`.
4. Add the latest version of Node.js to package manager: `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`
5. Install packages: `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev git libasound2-dev nodejs`
6. Install Thingy:52 Node.js library and npm dependencies.
```
mkdir thingy-google-assistant
cd thingy-google-assistant
npm install thingy52
npm install speaker
sudo npm install -g node-gyp
```

7. Patch speaker npm package with device selection patch.
```
cd node_modules/speaker
git apply ../thingy52/examples/rpi/speaker_select_device.patch
node-gyp configure
node-gyp build
node-gyp install
cd ../..
```

8. Add a loopback audio device. `sudo modprobe snd-aloop`
```
// Add snd-bcm2835 and snd-aloop to /etc/modules to avoid having to modprobe after each reboot.
sudo nano /etc/modules
snd-bcm2835
snd-aloop
```
Press `CTRL+X` and press `Y` to quit and save the file.

9. Copy the sound configuration file. `sudo cp node_modules/thingy52/examples/rpi/asound.conf /etc/asound.conf`

10. Follow the [Configure a Developer Project and Account Settings](https://developers.google.com/assistant/sdk/prototype/getting-started-pi-python/config-dev-project-and-account) page to enable Google Assistant API and setup credentials.

11. [Install](https://developers.google.com/assistant/sdk/prototype/getting-started-pi-python/run-sample) google assistant.
```
sudo apt-get install python3-dev python3-venv
python3 -m venv env
env/bin/python -m pip install --upgrade pip setuptools
source env/bin/activate
python -m pip install --upgrade google-assistant-library
python -m pip install --upgrade google-auth-oauthlib[tool]
google-oauthlib-tool --client-secrets /home/pi/thingy-google-assistant/client_secret_client-id.json --scope https://www.googleapis.com/auth/assistant-sdk-prototype --save --headless
```
Replace client_secret_client-id.json with the file downloaded in step 10.

12. Running google assistant and the microphone script:
```
google-assistant-demo
sudo node node_modules/thingy52/examples/microphone.js -d loopin
```
Specify the Bluetooth address of you thingy with adding the `-a` option.

### Autostart on boot
To enable Google assistant and the Thingy:52 microphone script to start at boot follow these steps:
```
sudo cp node_modules/thingy52/examples/rpi/*.service /lib/systemd/system/
sudo systemctl enable google-assistant.service
sudo systemctl enable thingy-mic.service
sudo systemctl start google-assistant.service
sudo systemctl start thingy-mic.service
```
