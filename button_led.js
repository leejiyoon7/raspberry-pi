const gpio = require('node-wiring-pi');
const BUTTON = 29; // 물리핀번호는 40
const RED = 28; // 물리핀번호는 37
const BLUE = 25; // 물리핀번호는 38
var count = 0; // 첫번째, 두번째 횟수를 세기 위함

const CheckButton = () => {
	let data = gpio.digitalRead(BUTTON);
	if (!data) {
		console.log("Pressed! " + count);
		if ((count++ % 2) == 0) {
			gpio.digitalWrite(RED, 1); gpio.digitalWrite(BLUE, 0);
		}
		else {
			gpio.digitalWrite(RED, 0); gpio.digitalWrite(BLUE, 1);
		}
	}
	setTimeout(CheckButton,300);
}

process.on('SIGINT', function() {
gpio.digitalWrite(RED, 0);
gpio.digitalWrite(BLUE, 0);
console.log("프로그램이 종료됩니다….");
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
console.log("버튼(첫번째:빨강, 두번째:파랑)");
setImmediate(CheckButton);