const gpio = require('node-wiring-pi');
const BUZZER = 21; //물리핀번호 29
const RED = 0; //물리핀번호 11
const BLUE = 3; //물리핀번호 15
const TOUCH = 7; //물리핀번호 7
const LIGHT = 22; //물리핀번호 31
var count = 1;

const CheckTouch = () => {
	let TouchData = gpio.digitalRead(TOUCH);
	if (!TouchData) {
		console.log("Touch! " + count);
		if ((count % 2) == 1) {
			gpio.digitalWrite(RED, 1); gpio.digitalWrite(BLUE, 0);
			count++;
		}
		else {
			gpio.digitalWrite(RED, 0); gpio.digitalWrite(BLUE, 1);
			count++;
		}
	}
	setTimeout(CheckButton,300);
}

process.on('SIGINT', function() {
gpio.digitalWrite(RED, 0);
gpio.digitalWrite(BLUE, 0);
gpio. digitalWrite(BUZZER, 0);
console.log("프로그램이 종료됩니다….");
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TOUCH, gpio.INPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
console.log("터치 (첫번째:조도센서 활성화, 두번째:조도센서 비활성화)");
setImmediate(CheckTouch);