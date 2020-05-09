const gpio = require('node-wiring-pi');
const BUTTON = 24;
const LED = 2;

var chatteringTimer = 100;
var chatteringCount  = 0;
var keyState = 1;

const DetectButton = function(){
        var data = gpio.digitalRead(BUTTON);
        if(!data){
                data = true;
                gpio.digitalWrite(LED,1);
                gpio.delay(500);
                gpio.digitalWrite(LED,0);
                }
        else {
                data = false;
                gpio.digitalWrite(LED,0);
                gpio.delay(500);
                }
}

process.on('SIGINT', function() {
gpio.digitalWrite(LED, 0);
console.log("Program Exit...");
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED, gpio.OUTPUT);
console.log("이벤트방식: 버튼을 누르면 LED가 켜집니다.....");
gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_RISING, DetectButton);