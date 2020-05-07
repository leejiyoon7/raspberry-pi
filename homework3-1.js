const gpio = require('node-wiring-pi');
const BUZZER = 21; //물리핀번호 29
const RED = 0; //물리핀번호 11
const GREEN = 2; //물리핀번호 13
const BLUE = 3; //물리핀번호 15
const TOUCH = 7; //물리핀번호 7
const LIGHT = 22; //물리핀번호 31
const RELAY = 23; //물리핀번호 33
const BUTTON = 24; //물리핀번호 35

var count =1;

const CheakTouch = function() {
	let TouchData = gpio.digitalRead(TOUCH);
	if(TouchData) {
		TwoLedTurnOn();
	}
setTimeout(CheakTouch,300)
}

const CheckButton = function() {
	let ButtonData = gpio.digitalRead(BUTTON);
	if (! ButtonData) {
		if ((count++ % 2) == 1) {
			LedTurnOn();
			BuzzerTurnOn();
			console.log("Click! 조도센서 활성화");
			CheckLight();
		}
		else {
			LedTurnOff();
			BuzzerTurnOn();
			console.log("Click! 조도센서 비활성화");
		}
	}
	setTimeout(CheckButton,300);
}

const CheckLight = function() {
var LightData = gpio. digitalRead(LIGHT);
if (! LightData) {
console.log("Bright! 전류를 차단합니다");
gpio.digitalWrite(RELAY, gpio.LOW);
}
else {
console.log("Dark! 전류가 흐릅니다");
gpio.digitalWrite(RELAY, gpio.HIGH);
}
if((count % 2) == 0)
		setTimeout(CheckLight,1000);
	else
		return 0;
}

const TwoLedTurnOn = function() {
gpio.digitalWrite(GREEN, 1);
setTimeout (TwoLedTurnOff,1000);
}

const TwoLedTurnOff = function() {
gpio.digitalWrite(GREEN, 0);
}

const LedTurnOn = function() {
gpio.digitalWrite(RED, 1);
gpio.digitalWrite(BLUE, 1);
}

const LedTurnOff = function() {
gpio.digitalWrite(RED, 0);
gpio.digitalWrite(BLUE, 0);
}

const BuzzerTurnOn = function() {
gpio.digitalWrite(BUZZER, 1);
setTimeout(BuzzerTurnOff, 300);
}
const BuzzerTurnOff = function() {
gpio. digitalWrite(BUZZER, 0);
}

process.on('SIGINT', function() {
gpio.digitalWrite(RED, 0);
gpio. digitalWrite(GREEN, 0);
gpio.digitalWrite(BLUE, 0);
gpio. digitalWrite(BUZZER, 0);
gpio.digitalWrite(RELAY, gpio.LOW);
console.log("프로그램이 종료됩니다….");
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(TOUCH, gpio.INPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(RELAY, gpio.OUTPUT);
gpio.pinMode(BUTTON, gpio.INPUT);
console.log("터치(2색led 점멸) 클릭(첫번째:조도센서 활성화, 두번째:조도센서 비활성화)");
setImmediate(CheckButton);