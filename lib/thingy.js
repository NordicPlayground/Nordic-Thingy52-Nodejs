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

var NobleDevice = require('noble-device');

var TCS_UUID              = 'ef6801009b3549339b1052ffa9740042';

var TES_UUID              = 'ef6802009b3549339b1052ffa9740042';
var TES_TEMP_UUID         = 'ef6802019b3549339b1052ffa9740042';
var TES_PRESS_UUID        = 'ef6802029b3549339b1052ffa9740042';
var TES_HUMID_UUID        = 'ef6802039b3549339b1052ffa9740042';
var TES_GAS_UUID          = 'ef6802049b3549339b1052ffa9740042';
var TES_COLOR_UUID        = 'ef6802059b3549339b1052ffa9740042';
var TES_CONF_UUID         = 'ef6802069b3549339b1052ffa9740042';

var UIS_UUID              = 'ef6803009b3549339b1052ffa9740042';
var UIS_LED_UUID          = 'ef6803019b3549339b1052ffa9740042';
var UIS_BTN_UUID          = 'ef6803029b3549339b1052ffa9740042';
var UIS_PIN_UUID          = 'ef6803039b3549339b1052ffa9740042';

var TMS_UUID              = 'ef6804009b3549339b1052ffa9740042';
var TMS_CONF_UUID         = 'ef6804019b3549339b1052ffa9740042';
var TMS_TAP_UUID          = 'ef6804029b3549339b1052ffa9740042';
var TMS_ORIENTATION_UUID  = 'ef6804039b3549339b1052ffa9740042';
var TMS_QUATERNION_UUID   = 'ef6804049b3549339b1052ffa9740042';
var TMS_STEP_COUNTER_UUID = 'ef6804059b3549339b1052ffa9740042';
var TMS_RAW_DATA_UUID     = 'ef6804069b3549339b1052ffa9740042';
var TMS_EULER_UUID        = 'ef6804079b3549339b1052ffa9740042';
var TMS_ROTATION_UUID     = 'ef6804089b3549339b1052ffa9740042';
var TMS_HEADING_UUID      = 'ef6804099b3549339b1052ffa9740042';
var TMS_GRAVITY_UUID      = 'ef68040a9b3549339b1052ffa9740042';

var TSS_UUID              = 'ef6805009b3549339b1052ffa9740042';
var TSS_CONF_UUID         = 'ef6805019b3549339b1052ffa9740042';
var TSS_SPEAKER_DATA_UUID = 'ef6805029b3549339b1052ffa9740042';
var TSS_SPEAKER_STAT_UUID = 'ef6805039b3549339b1052ffa9740042';
var TSS_MIC_UUID          = 'ef6805049b3549339b1052ffa9740042';

// then create your thing with the object pattern
var Thingy = function(peripheral) {
    // call nobles super constructor
    NobleDevice.call(this, peripheral);

    this.onTempNotifBinded  = this.onTempNotif.bind(this);
    this.onPressNotifBinded = this.onPressNotif.bind(this);
    this.onHumidNotifBinded = this.onHumidNotif.bind(this);
    this.onGasNotifBinded   = this.onGasNotif.bind(this);
    this.onColorNotifBinded = this.onColorNotif.bind(this);
    this.onBtnNotifBinded   = this.onBtnNotif.bind(this);
    this.onTapNotifBinded           = this.onTapNotif.bind(this);
    this.onOrientationNotifBinded   = this.onOrientationNotif.bind(this);
    this.onQuaternionNotifBinded    = this.onQuaternionNotif.bind(this);
    this.onStepCounterNotifBinded   = this.onStepCounterNotif.bind(this);
    this.onRawNotifBinded           = this.onRawNotif.bind(this);
    this.onEulerNotifBinded         = this.onEulerNotif.bind(this);
    this.onRotationNotifBinded      = this.onRotationNotif.bind(this);
    this.onHeadingNotifBinded       = this.onHeadingNotif.bind(this);
    this.onGravityNotifBinded       = this.onGravityNotif.bind(this);
    this.onSpkrStatNotifBinded = this.onSpkrStatNotif.bind(this);
    this.onMicNotifBinded      = this.onMicNotif.bind(this);
};

// tell Noble about the service uuid(s) your peripheral advertises (optional)
Thingy.SCAN_UUIDS = [TCS_UUID];

// inherit noble device
NobleDevice.Util.inherits(Thingy, NobleDevice);

// Environment
Thingy.prototype.onTempNotif = function(data) {
    var integer = data.readInt8(0);
    var decimal = data.readUInt8(1);
    var temperature = integer + (decimal/100);

    this.emit('temperatureNotif', temperature);
};

Thingy.prototype.onPressNotif = function(data) {
    var integer = data.readInt32LE(0);
    var decimal = data.readUInt8(4);
    var pressure = integer + (decimal/100);

    this.emit('pressureNotif', pressure);
};

Thingy.prototype.onHumidNotif = function(data) {
    var humid = data.readUInt8(0);

    this.emit('humidityNotif', humid);
};

Thingy.prototype.onGasNotif = function(data) {
    var gas = {
        eco2 : data.readUInt16LE(0),
        tvoc : data.readUInt16LE(2)
    }

    this.emit('gasNotif', gas);
};

Thingy.prototype.onColorNotif = function(data) {
    var color = {
        red :   data.readUInt16LE(0),
        green : data.readUInt16LE(2),
        blue :  data.readUInt16LE(4),
        clear : data.readUInt16LE(6)
    }

    this.emit('colorNotif', color);
};

// User Interface
Thingy.prototype.onBtnNotif = function(data) {
    if (data.readUInt8(0)) {
        this.emit('buttonNotif', 'Pressed');
    }
    else {
        this.emit('buttonNotif', 'Released');
    }
};

// Motion Service
Thingy.prototype.onTapNotif = function(data) {
    var tapData = {
        direction   : data.readUInt8(0),
        count       : data.readUInt8(1)
    }

    this.emit('tapNotif', tapData);
};

Thingy.prototype.onOrientationNotif = function(data) {
    var orientation = data.readUInt8(0);

    this.emit('orientationNotif', orientation);
};

Thingy.prototype.onQuaternionNotif = function(data) {
    var quaternion = {
        w : data.readInt32LE(0)/(1<<30),
        x : data.readInt32LE(4)/(1<<30),
        y : data.readInt32LE(8)/(1<<30),
        z : data.readInt32LE(12)/(1<<30)
    }

    this.emit('quaternionNotif', quaternion);
};

Thingy.prototype.onStepCounterNotif = function(data) {
    var stepCounter = {
        steps : data.readUInt32LE(0),
        time : data.readUInt32LE(4)
    }

    this.emit('stepCounterNotif', stepCounter);
};

Thingy.prototype.onRawNotif = function(data) {
    var raw_data = {
        accelerometer : {
            x : data.readInt16LE(0)/(1<<10),
            y : data.readInt16LE(2)/(1<<10),
            z : data.readInt16LE(4)/(1<<10)
        },
        gyroscope : {
            x : data.readInt16LE(6)/(1<<5),
            y : data.readInt16LE(8)/(1<<5),
            z : data.readInt16LE(10)/(1<<5)
        },
        compass : {
            x : data.readInt16LE(12)/(1<<4),
            y : data.readInt16LE(14)/(1<<4),
            z : data.readInt16LE(16)/(1<<4)
        },
    }

    this.emit('rawNotif', raw_data);
};

Thingy.prototype.onEulerNotif = function(data) {
    var euler = {
        roll  : data.readInt32LE(0)/(1<<16),
        pitch : data.readInt32LE(4)/(1<<16),
        yaw   : data.readInt32LE(8)/(1<<16)
    }

    this.emit('eulerNotif', euler);
};

Thingy.prototype.onRotationNotif = function(data) {
    var rotation_matrix = {
        m_11 : data.readInt16LE(0)/(1<<14),
        m_12 : data.readInt16LE(2)/(1<<14),
        m_13 : data.readInt16LE(4)/(1<<14),

        m_21 : data.readInt16LE(6)/(1<<14),
        m_22 : data.readInt16LE(8)/(1<<14),
        m_23 : data.readInt16LE(10)/(1<<14),

        m_31 : data.readInt16LE(12)/(1<<14),
        m_32 : data.readInt16LE(14)/(1<<14),
        m_33 : data.readInt16LE(16)/(1<<14)
    }

    this.emit('rotationNotif', rotation_matrix);
};

Thingy.prototype.onHeadingNotif = function(data) {
    var heading = data.readInt32LE(0)/(1<<16)

    this.emit('headingNotif', heading);
};

Thingy.prototype.onGravityNotif = function(data) {
    var gravity = {
        x : data.readFloatLE(0),
        y : data.readFloatLE(4),
        z : data.readFloatLE(8)
    }

    this.emit('gravityNotif', gravity);
};


// Sound Service
Thingy.prototype.onSpkrStatNotif = function(data) {
    var status = data.readUInt8(0);

    this.emit('speakerStatusNotif', status);
};

Thingy.prototype.onMicNotif = function(data) {
    var adpcm = {
        header : data.slice(0, 3),
        data   : data.slice(3)
    };

    this.emit('MicrophoneNotif', adpcm);
};

//
// Environment Service
//
Thingy.prototype.gas_enable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_GAS_UUID, true, this.onGasNotifBinded, error);
};

Thingy.prototype.gas_disable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_GAS_UUID, false, this.onGasNotifBinded, error);
};

Thingy.prototype.gas_mode_set = function(gas_mode, done) {
    this.readDataCharacteristic(TES_UUID, TES_CONF_UUID, function(error, data){
        data.writeUInt8(gas_mode, 8);
        this.writeDataCharacteristic(TES_UUID, TES_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.temperature_enable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_TEMP_UUID, true, this.onTempNotifBinded, error);
};

Thingy.prototype.temperature_disable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_TEMP_UUID, false, this.onTempNotifBinded, error);
};

Thingy.prototype.temperature_interval_set = function(interval, done) {
    this.readDataCharacteristic(TES_UUID, TES_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 0);
        this.writeDataCharacteristic(TES_UUID, TES_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.pressure_enable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_PRESS_UUID, true, this.onPressNotifBinded, error);
};

Thingy.prototype.pressure_disable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_PRESS_UUID, false, this.onPressNotifBinded, error);
};

Thingy.prototype.pressure_interval_set = function(interval, done) {
    this.readDataCharacteristic(TES_UUID, TES_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 2);
        this.writeDataCharacteristic(TES_UUID, TES_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.humidity_enable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_HUMID_UUID, true, this.onHumidNotifBinded, error);
};

Thingy.prototype.humidity_disable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_HUMID_UUID, false, this.onHumidNotifBinded, error);
};

Thingy.prototype.humidity_interval_set = function(interval, done) {
    this.readDataCharacteristic(TES_UUID, TES_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 4);
        this.writeDataCharacteristic(TES_UUID, TES_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.color_enable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_COLOR_UUID, true, this.onColorNotifBinded, error);
};

Thingy.prototype.color_disable = function(error) {
  this.notifyCharacteristic(TES_UUID, TES_COLOR_UUID, false, this.onColorNotifBinded, error);
};

Thingy.prototype.color_interval_set = function(interval, done) {
    this.readDataCharacteristic(TES_UUID, TES_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 6);
        this.writeDataCharacteristic(TES_UUID, TES_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.color_ref_led_set = function(led, done) {
    this.readDataCharacteristic(TES_UUID, TES_CONF_UUID, function(error, data){
        data.writeUInt8(led.red, 9);
        data.writeUInt8(led.green, 10);
        data.writeUInt8(led.blue, 11);
        this.writeDataCharacteristic(TES_UUID, TES_CONF_UUID, data, done);
    }.bind(this));
};

//
// User Interface Service
//

Thingy.prototype.led_off = function(callback) {
    this.writeUInt8Characteristic(UIS_UUID, UIS_LED_UUID, 0, callback);
};

Thingy.prototype.led_breathe = function(data, callback) {
    if (!data || !data.hasOwnProperty('color') || 
                 !data.hasOwnProperty('intensity') ||
                 !data.hasOwnProperty('delay'))
    {
        return callback(new Error('data must contain: color, intensity and delay. ' + data));
    }

    var buffer = new Buffer(5);
    buffer.writeUInt8(2, 0);
    buffer.writeUInt8(data.color, 1);
    buffer.writeUInt8(data.intensity, 2);
    buffer.writeUInt16LE(data.delay, 3);

    this.writeDataCharacteristic(UIS_UUID, UIS_LED_UUID, buffer, callback);
};

Thingy.prototype.led_set = function(data, callback) {
    if (!data || !data.hasOwnProperty('r') || 
                 !data.hasOwnProperty('g') || 
                 !data.hasOwnProperty('b')) 
    {
        return callback(new Error('data must contain colors: r, g and b ' + data));
    }

    var buffer = new Buffer(4);
    buffer.writeUInt8(1, 0);
    buffer.writeUInt8(data.r, 1);
    buffer.writeUInt8(data.g, 2);
    buffer.writeUInt8(data.b, 3);

    this.writeDataCharacteristic(UIS_UUID, UIS_LED_UUID, buffer, callback);
};

Thingy.prototype.led_one_shot = function(data, callback) {
    if (!data || !data.hasOwnProperty('color') || 
                 !data.hasOwnProperty('intensity')) 
    {
        return callback(new Error('data must contain: color and intensity ' + data));
    }

    var buffer = new Buffer(3);
    buffer.writeUInt8(3, 0);
    buffer.writeUInt8(data.color, 1);
    buffer.writeUInt8(data.intensity, 2);

    this.writeDataCharacteristic(UIS_UUID, UIS_LED_UUID, buffer, callback);
};

Thingy.prototype.button_enable = function(error) {
  this.notifyCharacteristic(UIS_UUID, UIS_BTN_UUID, true, this.onBtnNotifBinded, error);
};

Thingy.prototype.button_disable = function(error) {
  this.notifyCharacteristic(UIS_UUID, UIS_BTN_UUID, false, this.onBtnNotifBinded, error);
};


//
// Motion Service
//

Thingy.prototype.stepCounter_interval_set = function(interval, done) {
    this.readDataCharacteristic(TMS_UUID, TMS_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 0);
        this.writeDataCharacteristic(TMS_UUID, TMS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.temp_compensation_interval_set = function(interval, done) {
    this.readDataCharacteristic(TMS_UUID, TMS_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 2);
        this.writeDataCharacteristic(TMS_UUID, TMS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.magnetometer_compensation_interval_set = function(interval, done) {
    this.readDataCharacteristic(TMS_UUID, TMS_CONF_UUID, function(error, data){
        data.writeUInt16LE(interval, 4);
        this.writeDataCharacteristic(TMS_UUID, TMS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.motion_processing_freq_set = function(frequency, done) {
    this.readDataCharacteristic(TMS_UUID, TMS_CONF_UUID, function(error, data){
        data.writeUInt16LE(frequency, 6);
        this.writeDataCharacteristic(TMS_UUID, TMS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.wake_on_motion_set = function(state, done) {
    this.readDataCharacteristic(TMS_UUID, TMS_CONF_UUID, function(error, data){
        data.writeUInt16LE(state, 8);
        this.writeDataCharacteristic(TMS_UUID, TMS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.tap_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_TAP_UUID, true, this.onTapNotifBinded, error);
}

Thingy.prototype.tap_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_TAP_UUID, false, this.onTapNotifBinded, error);
}

Thingy.prototype.orientation_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_ORIENTATION_UUID, true, this.onOrientationNotifBinded, error);
}

Thingy.prototype.orientation_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_ORIENTATION_UUID, false, this.onOrientationNotifBinded, error);
}

Thingy.prototype.quaternion_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_QUATERNION_UUID, true, this.onQuaternionNotifBinded, error);
}

Thingy.prototype.quaternion_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_QUATERNION_UUID, false, this.onQuaternionNotifBinded, error);
}

Thingy.prototype.stepCounter_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_STEP_COUNTER_UUID, true, this.onStepCounterNotifBinded, error);
}

Thingy.prototype.stepCounter_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_STEP_COUNTER_UUID, false, this.onStepCounterNotifBinded, error);
}

Thingy.prototype.raw_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_RAW_DATA_UUID, true, this.onRawNotifBinded, error);
}

Thingy.prototype.raw_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_RAW_DATA_UUID, false, this.onRawNotifBinded, error);
}

Thingy.prototype.euler_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_EULER_UUID, true, this.onEulerNotifBinded, error);
}

Thingy.prototype.euler_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_EULER_UUID, false, this.onEulerNotifBinded, error);
}

Thingy.prototype.rotation_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_ROTATION_UUID, true, this.onRotationNotifBinded, error);
}

Thingy.prototype.rotation_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_ROTATION_UUID, false, this.onRotationNotifBinded, error);
}

Thingy.prototype.heading_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_HEADING_UUID, true, this.onHeadingNotifBinded, error);
}

Thingy.prototype.heading_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_HEADING_UUID, false, this.onHeadingNotifBinded, error);
}

Thingy.prototype.gravity_enable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_GRAVITY_UUID, true, this.onGravityNotifBinded, error);
}

Thingy.prototype.gravity_disable = function(error) {
  this.notifyCharacteristic(TMS_UUID, TMS_GRAVITY_UUID, false, this.onGravityNotifBinded, error);
}


//
// Sound Service
//

Thingy.prototype.speaker_mode_set = function(speaker_mode, done) {
    this.readDataCharacteristic(TSS_UUID, TSS_CONF_UUID, function(error, data){
        data.writeUInt8(speaker_mode, 0)
        this.writeDataCharacteristic(TSS_UUID, TSS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.speaker_status_enable = function(error) {
  this.notifyCharacteristic(TSS_UUID, TSS_SPEAKER_STAT_UUID, true, this.onSpkrStatNotifBinded, error);
};

Thingy.prototype.speaker_status_disable = function(error) {
  this.notifyCharacteristic(TSS_UUID, TSS_SPEAKER_STAT_UUID, false, this.onSpkrStatNotifBinded, error);
};

Thingy.prototype.speaker_pcm_write = function(pcm, done) {
    this.writeDataCharacteristic(TSS_UUID, TSS_SPEAKER_DATA_UUID, pcm, done);
};

Thingy.prototype.mic_mode_set = function(mic_mode, done) {
    this.readDataCharacteristic(TSS_UUID, TSS_CONF_UUID, function(error, data){
        data.writeUInt8(mic_mode, 0)
        this.writeDataCharacteristic(TSS_UUID, TSS_CONF_UUID, data, done);
    }.bind(this));
};

Thingy.prototype.mic_enable = function(error) {
  this.notifyCharacteristic(TSS_UUID, TSS_MIC_UUID, true, this.onMicNotifBinded, error);
};

Thingy.prototype.mic_disable = function(error) {
  this.notifyCharacteristic(TSS_UUID, TSS_MIC_UUID, false, this.onMicNotifBinded, error);
};
// you can mixin other existing service classes here too,
// noble device provides battery and device information,
// add the ones your device provides
NobleDevice.Util.mixin(Thingy, NobleDevice.BatteryService);
//NobleDevice.Util.mixin(Thingy, NobleDevice.DeviceInformationService);

// export your device
module.exports = Thingy;
