const gpio = require('node-wiring-pi');
const LEDPIN = 29;
var flag = 0;
const TimeOutHandler = function ( ) {
if (flag > 0) {
gpio.digitalWrite(LEDPIN, 1);
console.log("Node: LED on");
flag = 0;
}
else {
gpio.digitalWrite(LEDPIN, 0);
console.log("Node: LED off");
flag = 1;
}
setTimeout (TimeOutHandler, 1000);
}
gpio.setup('wpi');
gpio.pinMode(LEDPIN, gpio.OUTPUT);
setTimeout(TimeOutHandler, 1000); 