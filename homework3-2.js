const gpio = require('node-wiring-pi');
const BUTTON = 24;
const LED = 2;

const DetectButton = function(){
        var data1 = gpio.digitalRead(BUTTON);
        gpio.delay(200);
        var data2 = gpio.digitalRead(BUTTON);
        if(data1 == data2) {
        	gpio.digitalWrite(LED, 1);
        	gpio.delay(50);
        	gpio.digitalWrite(LED, 0);
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