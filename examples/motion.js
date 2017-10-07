/*
  Copyright (c) 2010 - 2017, Nordic Semiconductor ASA
  All rights reserved.
  Redistribution and use in source and binary forms, with or without modification,
  are permitted provided that the following conditions are met:
  1. Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.
  2. Redistributions in binary form, except as embedded into a Nordic
     Semiconductor ASA integrated circuit in a product or a software update for
     such product, must reproduce the above copyright notice, this list of
     conditions and the following disclaimer in the documentation and/or other
     materials provided with the distribution.
  3. Neither the name of Nordic Semiconductor ASA nor the names of its
     contributors may be used to endorse or promote products derived from this
     software without specific prior written permission.
  4. This software, with or without modification, must only be used with a
     Nordic Semiconductor ASA integrated circuit.
  5. Any software provided in binary form under this license must not be reverse
     engineered, decompiled, modified and/or disassembled.
  THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS
  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
  OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 
var Thingy = require('../index');
require('console.table');
var enabled;

console.log('Reading Thingy Motion sensors!');

var Direction = Object.freeze([
    'UNDEFINED',
    'TAP_X_UP', 'TAP_X_DOWN',
    'TAP_Y_UP', 'TAP_Y_DOWN',
    'TAP_Z_UP', 'TAP_Z_DOWN'
]);

var Orientation = Object.freeze([
    'Portrait', 'Landscape', 'Reverse portrait', 'Reverse landscape'
]);

function onTapData(tap) {
    console.log('Tap data: Dir: %s (%d), Count: %d', 
                        Direction[tap.direction], tap.direction, tap.count);
}

function onOrientationData(orientation) {
    console.log('Orientation data: %s (%d)', Orientation[orientation], orientation);
}

function onQuaternionData(quaternion) {
    console.log('Quaternion data: w: %d, x: %d, y: %d, z: %d', 
        quaternion.w, quaternion.x, quaternion.y, quaternion.z);
}

function onStepCounterData(stepCounter) {
    console.log('Step Counter data: Steps: %d, Time[ms]: %d', 
        stepCounter.steps, stepCounter.time);
}

function onRawData(raw_data) {
    console.log('Raw data: Accelerometer: x %d, y %d, z %d', 
        raw_data.accelerometer.x, raw_data.accelerometer.y, raw_data.accelerometer.z);
    console.log('Raw data: Gyroscope: x %d, y %d, z %d', 
        raw_data.gyroscope.x, raw_data.gyroscope.y, raw_data.gyroscope.z);
    console.log('Raw data: Compass: x %d, y %d, z %d', 
        raw_data.compass.x, raw_data.compass.y, raw_data.compass.z);
}

function onEulerData(euler) {
    console.log('Euler angles: roll %d, pitch %d, yaw %d', 
        euler.roll, euler.pitch, euler.yaw);
}

function onRotationData(rotation) {
    console.log('Rotation: matrix length in bytes ' + rotation.length);

    // 3x3 matrix
    var rotation_matrix = [[], [], []];

    var data_index = 0;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            rotation_matrix[i][j] = rotation.readInt16LE(data_index);
            data_index += 2
        }
    }

    console.table(rotation_matrix);
}

function onHeadingData(heading) {
    console.log('Heading: %d', heading);
}

function onGravityData(gravity) {
    console.log('Gravity: x: %d, y %d, z %d', gravity.x, gravity.y, gravity.z);
}

function onButtonChange(state) {
    if (state == 'Pressed') {
        if (enabled) {
            enabled = false;
            this.tap_disable(function(error) {
                console.log('Tap sensor stopped! ' + ((error) ? error : ''));
            });
            this.orientation_disable(function(error) {
                console.log('Orientation sensor stopped! ' + ((error) ? error : ''));
            });
            this.quaternion_disable(function(error) {
                console.log('Quaternion sensor stopped! ' + ((error) ? error : ''));
            });
            this.stepCounter_disable(function(error) {
                console.log('Step Counter sensor stopped! ' + ((error) ? error : ''));
            });
            this.raw_disable(function(error) {
                console.log('Raw sensor stopped! ' + ((error) ? error : ''));
            });
            this.euler_disable(function(error) {
                console.log('Euler sensor stopped! ' + ((error) ? error : ''));
            });
            this.rotation_disable(function(error) {
                console.log('Rotation sensor stopped! ' + ((error) ? error : ''));
            });
            this.heading_disable(function(error) {
                console.log('Heading sensor stopped! ' + ((error) ? error : ''));
            });
            this.gravity_disable(function(error) {
                console.log('Gravity sensor stopped! ' + ((error) ? error : ''));
            });
        }
        else {
            enabled = true;
            this.tap_enable(function(error) {
                console.log('Tap sensor started! ' + ((error) ? error : ''));
            });
            this.orientation_enable(function(error) {
                console.log('Orientation sensor started! ' + ((error) ? error : ''));
            });
            this.quaternion_enable(function(error) {
                console.log('Quaternion sensor started! ' + ((error) ? error : ''));
            });
            this.stepCounter_enable(function(error) {
                console.log('Step Counter sensor started! ' + ((error) ? error : ''));
            });
            this.raw_enable(function(error) {
                console.log('Raw sensor started! ' + ((error) ? error : ''));
            });
            this.euler_enable(function(error) {
                console.log('Euler sensor started! ' + ((error) ? error : ''));
            });
            this.rotation_enable(function(error) {
                console.log('Rotation sensor started! ' + ((error) ? error : ''));
            });
            this.heading_enable(function(error) {
                console.log('Heading sensor started! ' + ((error) ? error : ''));
            });
            this.gravity_enable(function(error) {
                console.log('Gravity sensor started! ' + ((error) ? error : ''));
            });
        }
    }
}

function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });

  thingy.connectAndSetUp(function(error) {
    console.log('Connected! ' + error ? error : '');

    thingy.on('tapNotif', onTapData);
    thingy.on('orientationNotif', onOrientationData);
    thingy.on('quaternionNotif', onQuaternionData);
    thingy.on('stepCounterNotif', onStepCounterData);
    thingy.on('rawNotif', onRawData);
    thingy.on('eulerNotif', onEulerData);
    thingy.on('rotationNotif', onRotationData);
    thingy.on('headingNotif', onHeadingData);
    thingy.on('gravityNotif', onGravityData);
    thingy.on('buttonNotif', onButtonChange);

    thingy.motion_processing_freq_set(5, function(error) {
        if (error) {
            console.log('Motion freq set configure failed! ' + error);
        }
    });    

    enabled = true;
    thingy.orientation_enable(function(error) {
        console.log('Orientation sensor started! ' + ((error) ? error : ''));
    });
    thingy.rotation_enable(function(error) {
        console.log('Rotation sensor started! ' + ((error) ? error : ''));
    });
    thingy.button_enable(function(error) {
        console.log('Button started! ' + ((error) ? error : ''));
    });
  });
}

Thingy.discover(onDiscover);
