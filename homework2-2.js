const gpio = require('node-wiring-pi');
const BUZZER = 21; //물리핀번호 29
const RED = 0; //물리핀번호 11
const BLUE = 3; //물리핀번호 15
const GREEN = 2; //물리핀번호 13
const BUTTON = 7; //물리핀번호 7
const LIGHT = 22; //물리핀번호 31

const CheckLight = function() {
var Lightdata = gpio.digitalRead(LIGHT);
	if (! Lightdata) {
		console.log("Nodejs: Bright!!");
		gpio.digitalWrite(RED, 0);
		gpio.digitalWrite(GREEN, 0);
		gpio.digitalWrite(BLUE, 0);
		}

	else {
		console.log("Nodejs: Dark..");
		gpio.digitalWrite(RED, 1);
		gpio.digitalWrite(GREEN, 1);
		gpio.digitalWrite(BLUE, 1);
		let Buttondata = gpio.digitalRead(BUTTON);
		if (! Buttondata) {
			console.log("Pressed!");
			BuzzerTurnOn();
		}
	}
	setTimeout(CheckLight, 1000);
}

const BuzzerTurnOn = function() {
gpio.digitalWrite(BUZZER, 1);
console.log("Nodejs: BUZZER on");
setTimeout(BuzzerTurnOff, 100);
}
const BuzzerTurnOff = function() {
gpio. digitalWrite(BUZZER, 0);
console.log("Nodejs: BUZZER off");
}

process.on('SIGINT', function() {
gpio.digitalWrite(RED, 0);
gpio.digitalWrite(GREEN, 0);
gpio.digitalWrite(BLUE, 0);
gpio. digitalWrite(BUZZER, 0);
console.log("프로그램이 종료됩니다….");
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
setImmediate(CheckLight);