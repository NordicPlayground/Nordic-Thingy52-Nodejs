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
var request = require('request');
var util = require('util');
var thingy_id;
var maker_key;
var maker_evt;
var BASE_URL = 'https://maker.ifttt.com/trigger/%s/with/key/%s';

function makeRequest (params, cb){
  request(params, function (error, response, body) {
    if (response) {
        if (response.statusCode == 200) {
          return cb('');
        }
        return cb(JSON.parse(body)['errors']);
    }
    else {
        return cb('Failed');
    }
  });
}

function ifttt_gas_push(eco2, tvoc)
{
    var requestParams = {
      url: util.format(BASE_URL, maker_evt, maker_key),
      qs: { "value1" : eco2, "value2" : tvoc},
      method: 'POST'
    };

    makeRequest(requestParams, function (err) {
        console.log('Gas data pushed to IFTTT ' + err)
    });
}

function onGasSensorData(gas) {
    console.log('Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc )
    ifttt_gas_push(gas.eco2, gas.tvoc);
}

function connectAndEnableGas(thingy) {
    thingy.connectAndSetUp(function(error) {
        console.log('Connected! ' + ((error) ? error : ''));
        thingy.gas_mode_set(3, function(error) {
            console.log('Gas sensor configured! ' + ((error) ? error : ''));
        });
        thingy.gas_enable(function(error) {
            console.log('Gas sensor started! ' + ((error) ? error : ''));
        });
    });
}

function onDiscover(thingy) {
    console.log('Discovered: ' + thingy);

    thingy.on('disconnect', function() {
        console.log('Disconnected! Trying to reconnect');
        connectAndEnableGas(this);
    });
    thingy.on('gasNotif', onGasSensorData);
    connectAndEnableGas(thingy);
}

console.log('IFTTT Thingy gas sensor!');

process.argv.forEach(function(val, index, array){
    if (val == '-a') {
        if (process.argv[index + 1]) {
            thingy_id = process.argv[index + 1];
        }
    }
    else if (val == '-e') {
        if (process.argv[index + 1]) {
            maker_evt = process.argv[index + 1];
        }
    }
    else if (val == '-k') {
        if (process.argv[index + 1]) {
            maker_key = process.argv[index + 1];
        }
    }
});

if (!maker_key || !maker_evt) {
    console.log("Please specify IFTTT Maker Service event and key:");
    console.log("node ifttt_gas.js -e <event> -k <key> (-a <address>)");
    process.exit(1);
}

if (!thingy_id) {
    Thingy.discover(onDiscover);
}
else {
    Thingy.discoverById(thingy_id, onDiscover);
}
