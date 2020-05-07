const gpio = require('node-wiring-pi');
const RELAY = 22;
const TurnOn = function() {
gpio.digitalWrite(RELAY, gpio.HIGH); // 3초 동안 전원공급
console.log("Nodejs: RELAY on");
setTimeout(TurnOff, 3000);
}
const TurnOff = function() {
gpio.digitalWrite(RELAY, gpio.LOW); // 3초동안 전원차단
console.log("Nodejs: RELAY off");
setTimeout(TurnOn, 3000);
}
gpio.wiringPiSetup();
gpio.pinMode(RELAY, gpio.OUTPUT);
setTimeout(TurnOn, 200);