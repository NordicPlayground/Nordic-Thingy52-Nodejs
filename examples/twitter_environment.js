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
var Twit = require('twit');
var led_color = 1;
var arg_consumer_key;
var arg_consumer_secret;
var arg_access_token;
var arg_access_token_secret;

console.log('Posting environment data to Twitter!');
console.log('Sensor data will be printed to the terminal.');
console.log('The data will be sent to Twitter when the button on the Thingy is pressed!');

var g_temperature = 0;
var g_humidity = 0;
var g_co2 = 0;

var T = new Twit({
  consumer_key:         'INSERT_KEY',
  consumer_secret:      'INSERT_KEY',
  access_token:         'INSERT_KEY',
  access_token_secret:  'INSERT_KEY',
  timeout_ms:           60*1000
})

function onButtonChange(state) {
  console.log('Button: ' + state);

  if (state == 'Pressed')
  {
    led_color = (led_color + 1) % 8;
    if (led_color == 0)
    {
      led_color = 1;
    }

    var led = {
      color : led_color,
      intensity : 20,
      delay : 1000
    };
    this.led_breathe(led, function(error){
      console.log('LED color change: ' + error);
    });

    // Check to see which Tweet to tweet
    if (g_temperature > 30) {
      T.post('statuses/update', { status: 
        `Damn its hot in here! Temperature is ${g_temperature}` }, 
        function(err, data, response) {
        console.log(data)
      })
    }
    else if (g_co2 > 1000) {
      T.post('statuses/update', { status: 
        `eCO2 level is ${g_co2}. Is that your breathe Im smelling?` }, 
        function(err, data, response) {
        console.log(data)
      })
    }
    else if (g_humidity > 70) {
      T.post('statuses/update', { status: 
        `Where is all that humidity coming from? Humidity level is ${g_humidity}` }, 
        function(err, data, response) {
        console.log(data)
      })
    }
    else {
      T.post('statuses/update', { status: 
        `Well that wasnt too interesting.. None of the sensors triggered at all.` }, 
        function(err, data, response) {
        console.log(data)
      })
    }
      
  }
}

function onTemperatureData(temperature) {
  console.log('Temperature sensor: ' + temperature);
  g_temperature = temperature;
}

function onHumidityData(humidity) {
  console.log('Humidity sensor: ' + humidity);
  g_humidity = humidity;
}

function onGasData(gas) {
  console.log('Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc );
  g_co2 = gas.eco2;
}

function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });

  thingy.connectAndSetUp(function(error) {
    console.log('Connected! ' + error);

    thingy.on('temperatureNotif', onTemperatureData);
    thingy.on('humidityNotif', onHumidityData);
    thingy.on('gasNotif', onGasData);
    thingy.on('buttonNotif', onButtonChange);

    thingy.temperature_interval_set(1000, function(error) {
        if (error) {
            console.log('Temperature sensor configure! ' + error);
        }
    });
    thingy.humidity_interval_set(1000, function(error) {
        if (error) {
            console.log('Humidity sensor configure! ' + error);
        }
    });
    thingy.gas_mode_set(1, function(error) {
        if (error) {
            console.log('Gas sensor configure! ' + error);
        }
    });

    thingy.temperature_enable(function(error) {
        console.log('Temperature sensor started! ' + ((error) ? error : ''));
    });
    thingy.humidity_enable(function(error) {
        console.log('Humidity sensor started! ' + ((error) ? error : ''));
    });
    thingy.gas_enable(function(error) {
        console.log('Gas sensor started! ' + ((error) ? error : ''));
    });
    thingy.button_enable(function(error) {
      console.log('Button enabled! ' + error);
    });
  });
}

if (T.config.consumer_key == 'INSERT_KEY' ||
    T.config.consumer_secret == 'INSERT_KEY' ||
    T.config.access_token == 'INSERT_KEY' ||
    T.config.access_token_secret == 'INSERT_KEY') {
    console.log("ERROR: Please specify Twitter Consumer Key, Consumer Secret, Access Token, ");
    console.log("       and Access Token Secret in this file before running the example.");
    process.exit(1);
}

Thingy.discover(onDiscover);
