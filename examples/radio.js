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
var icecast = require("icecast");
var lame = require("lame");
var util = require('util');

//var url = 'http://stream.bauermedia.no:80/radiorock.mp3'
//var url = 'http://stream.p4.no/nrj_mp3_hq?TuneIn'
var url = 'http://lyd.nrk.no:80/nrk_radio_p3_mp3_h';

var this_thingy;
var speaker_configured = false;
var ready_to_send = true;

var audio_buffer_size = 1000000;
var audio_buffer = new Buffer(audio_buffer_size);
var audio_buffer_tail = 0;
var audio_buffer_head = 0;

var buffer_status = 0;

function convertAndBuffer(data){
    if (speaker_configured) {
        var index = 0;
        for (index = 0; index < data.length-1; index+=2) {
            var sample_16 = data.readInt16LE(index);

            if (((audio_buffer_tail + 1) % audio_buffer_size) == audio_buffer_head) {
                console.log('Audio buffer full!')
            }
            else {
                // Convert to unsigned 8 bit.
                var sample_8 = parseInt( (((sample_16*125.0)/32768.0) + 125.0), 10);
                audio_buffer.writeUInt8(sample_8, audio_buffer_tail);
                audio_buffer_tail = (audio_buffer_tail + 1) % audio_buffer_size;
            }
        }
    }
}

function sendAudio(){

    if (audio_buffer_head == audio_buffer_tail) {
    }
    else {
        if (((buffer_status == 0) || (buffer_status == 2)) && ready_to_send)
        {
            ready_to_send = false;
            var ble_packet_size = 23*6-3;
            var ble_packet = new Buffer(ble_packet_size);
            var index = 0;

            for (index = 0; index < ble_packet_size; index++){
                var sample = audio_buffer.readUInt8(audio_buffer_head);
                ble_packet.writeUInt8(sample, index);
                audio_buffer_head = (audio_buffer_head + 1) % audio_buffer_size;
                if (audio_buffer_head == audio_buffer_tail) {
                    console.log('Audio buffer empty');
                    break;
                }
            }
            this_thingy.speaker_pcm_write(ble_packet, function(error) {
                ready_to_send = true;
            });
        }
        else {
        }
    }
}

var decoder_8kHz = lame.Decoder();
decoder_8kHz.on('format', function(format) {
    console.log(util.format('Decoder_8k Format: %j', format));
});

decoder_8kHz.on("data", function(data) {
  convertAndBuffer(data);
});

var decoder = lame.Decoder();
decoder.on('format', function(format) {
    console.log(util.format('Decoder Format: %j', format));
    console.log()
    var encoder = lame.Encoder({channels: format.channels, bitDepth: format.bitDepth, sampleRate: format.sampleRate, bitRate: 128, outSampleRate: 8000, mode: lame.MONO});
    decoder.pipe(encoder).pipe(decoder_8kHz);
});

function onSpeakerStatus(status)
{
    buffer_status = status;
}

 function onDiscover(thingy) {
     console.log('Discovered: ' + thingy);
     this_thingy = thingy;

     thingy.on('disconnect', function() {
         console.log('Disconnected!');
     });
     thingy.on('speakerStatusNotif', onSpeakerStatus);
     thingy.connectAndSetUp(function(error) {
         console.log('Connected! ' + ((error) ? error : ''));

         thingy.speaker_mode_set(2, function(error) {
             console.log('Speaker configure! ' + ((error) ? error : ''));
             speaker_configured = true;
         });
         thingy.speaker_status_enable(function(error) {
             console.log('Speaker status start! ' + ((error) ? error : ''));
             icecast.get(url, function(res) {
               res.on('data', function(data) {
                   decoder.write(data);
               });
               res.on('metadata', function(metadata) {
                 var track = icecast.parse(metadata).StreamTitle;
                 console.log(track);
               });
              });

            setInterval(sendAudio, 7);

         });
     });
 }

Thingy.discover(onDiscover);
