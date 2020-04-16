const gpio = require('node-wiring-pi');
const BUZZER = 29;
const TurnOn = function() {
gpio.digitalWrite(BUZZER, 1);
console.log("Nodejs: BUZZER on");
setTimeout(TurnOff, 1000);
}
const TurnOff = function() {
gpio. digitalWrite(BUZZER, 0);
console.log("Nodejs: BUZZER off");
setTimeout(TurnOn, 1000);
}
process.on('SIGINT', function() {
gpio. digitalWrite(BUZZER, 0); // 소리끄고 종료
console.log("Program Exit...");
process.exit();
});
gpio.setup('wpi');
gpio.pinMode(BUZZER, gpio.OUTPUT);
setImmediate(TurnOn);