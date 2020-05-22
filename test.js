const gpio = require('node-wiring-pi');
const LED = 2;

const ON = function () {
    gpio.digitalWrite(LED,1);
    console.log("LED ON");
    setTimeout(OFF,1000);
}

const OFF = function () {
    gpio.digitalWrite(LED,0);
    console.log("LED OFF");
    setTimeout(ON,1000);
}

process.on('SIGINT', function() {
    gpio.digitalWrite(LED,0);
    console.log("Process Exit");
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(LED, gpio.OUTPUT);
setTimeout(ON,100);