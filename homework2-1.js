const gpio = require('node-wiring-pi');
const BUZZER = 21; //물리핀번호 29
const RED = 0; //물리핀번호 11
const BLUE = 3; //물리핀번호 15
const GREEN = 2; //물리핀번호 13
const BUTTON = 7; //물리핀번호 7
var count =1;

const CheckButton = () => {
	let data = gpio.digitalRead(BUTTON);
	if (!data) {
		console.log("Pressed! " + count);
		if ((count++ % 3) == 1) {
			gpio.digitalWrite(RED, 0);
			gpio.digitalWrite(GREEN, 0);
			gpio.digitalWrite(BLUE, 1); 
			BuzzerTurnOn();
		}
		else if ((count++ % 3) == 2){
			gpio.digitalWrite(RED, 1);
			gpio.digitalWrite(GREEN, 0);
			gpio.digitalWrite(BLUE, 0); 
			BuzzerTurnOn();
		}
		else {
			gpio.digitalWrite(RED, 0);
			gpio.digitalWrite(GREEN, 1);
			gpio.digitalWrite(BLUE, 0); 
			BuzzerTurnOn();
		}
	}
	setTimeout(CheckButton,300);
}

const BuzzerTurnOn = function() {
gpio.digitalWrite(BUZZER, 1);
console.log("Nodejs: BUZZER on");
setTimeout(BuzzerTurnOff, 200);
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
console.log("버튼(첫번째:파랑, 두번째:빨강, 세번째:초록)");
setImmediate(CheckButton);