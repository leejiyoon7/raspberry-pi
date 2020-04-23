const gpio = require('node-wiring-pi');
const TOUCH = 7;

const CheckTouch = function( ) {
var data = gpio.digitalRead(TOUCH);
if (data)
console.log("Nodejs: Touched !");
setTimeout(CheckTouch, 300);
}

process.on('SIGINT', function() {
console.log("Program Exit...");
process.exit();
});

gpio.setup('wpi');
gpio.pinMode(TOUCH, gpio.INPUT);
setTimeout(CheckTouch, 200);