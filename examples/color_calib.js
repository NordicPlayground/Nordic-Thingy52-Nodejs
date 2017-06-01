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
var enabled;
var this_thingy;
var led = {
    red   : 120,
    green : 60,
    blue  : 20
};

var min_intensity = 2600
var max_intensity = 2650

console.log('Nordic Thingy:52 color sensor calibration!');
console.log('Place the Thingy:52 on something white, and press the button');

function onColorData(color)
{
    console.log('Color sensor: r ' + color.red +
                             ' g ' + color.green +
                             ' b ' + color.blue +
                             ' c ' + color.clear );

     let r_ratio = color.red   / (color.red + color.green + color.blue);
     let g_ratio = color.green / (color.red + color.green + color.blue);
     let b_ratio = color.blue  / (color.red + color.green + color.blue);

     var clear_at_black = 300;
     var clear_at_white = 400;
     var clear_diff = clear_at_white - clear_at_black;

     let clear_normalized = (color.clear - clear_at_black) / clear_diff;
     if (clear_normalized < 0)
     {
         clear_normalized = 0;
     }

     let r_8 = r_ratio * 255.0 * 3 * clear_normalized;
     if (r_8 > 255)
     {
         r_8 = 255;
     }
     let g_8 = g_ratio * 255.0 * 3 * clear_normalized;
     if (g_8 > 255)
     {
         g_8 = 255;
     }
     let b_8 = b_ratio * 255.0 * 3 * clear_normalized;
     if (b_8 > 255)
     {
         b_8 = 255;
     }
     let rgb_str = "rgb("+r_8.toFixed(0)+","+g_8.toFixed(0)+","+b_8.toFixed(0)+")";
     console.log(rgb_str);

    if (color.red < min_intensity)
    {
        led.red = led.red + 1;
        if (led.red > 255)
        {
            led.red = 255;
        }
    }
    else if (color.red > max_intensity)
    {
        led.red = led.red - 1;
        if (led.red < 0)
        {
            led.red = 0;
        }
    }

    if (color.green < min_intensity)
    {
        led.green = led.green + 1;
        if (led.green > 255)
        {
            led.green = 255;
        }
    }
    else if (color.green > max_intensity)
    {
        led.green = led.green - 1;
        if (led.green < 0)
        {
            led.green = 0;
        }
    }

    if (color.blue < min_intensity)
    {
        led.blue = led.blue + 1;
        if (led.blue > 255)
        {
            led.blue = 255;
        }
    }
    else if (color.blue > max_intensity)
    {
        led.blue = led.blue - 1;
        if (led.blue < 0)
        {
            led.blue = 0;
        }
    }
    console.log('Led config: r ' + led.red +
                           ' g ' + led.green +
                           ' b ' + led.blue );

    setTimeout(function(){
        this_thingy.color_ref_led_set(led, function(error) {
            if (error) {
                console.log('Color sensor configure! ' + error);
            }
        });
    }, 20);
}

function onButtonChange(state) {
    if (state == 'Pressed') {
        if (enabled) {
            enabled = false;
            this.color_disable(function(error) {
                console.log('Color sensor stopped! ' + ((error) ? error : ''));
            });
        }
        else {
            enabled = true;
            this.color_enable(function(error) {
                console.log('Color sensor started! ' + ((error) ? error : ''));
            });
        }
    }
}

function onDiscover(thingy) {
    this_thingy = thingy;
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });

  thingy.connectAndSetUp(function(error) {
    console.log('Connected! ' + error ? error : '');

    thingy.on('colorNotif', onColorData);
    thingy.on('buttonNotif', onButtonChange);

    thingy.led_off(function(error) {
        if (error) {
            console.log('Lightwell led off ' + error);
        }
    });

    thingy.color_interval_set(1500, function(error) {
        if (error) {
            console.log('Color sensor configure interval! ' + error);
        }
    });

    thingy.color_ref_led_set(led, function(error) {
        if (error) {
            console.log('Color sensor configure led! ' + error);
        }
    });

    thingy.button_enable(function(error) {
        console.log('Button started! ' + ((error) ? error : ''));
    });

    enabled = false;

  });
}

Thingy.discover(onDiscover);
