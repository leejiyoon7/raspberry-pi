const gpio = require('node-wiring-pi');
const BUZZER = 21; //물리핀번호 29
const LED = 2; //물리핀번호 13
const TRIG = 27; //물리핀번호 36
const ECHO = 28; //물리핀번호 38
const BUTTON = 24; //물리핀번호 35

var count =1;
var startTime; // 초음파 송출시간
var travelTime; // 초음파수신까지 경과시간

const CheckButton = function() {
	let ButtonData = gpio.digitalRead(BUTTON);
	if (! ButtonData) {
		if ((count++ % 2) == 1) {
			gpio.digitalWrite(LED, 1);
			console.log("Click! 초음파센서 활성화");
			Triggering();
		}
		else {
			gpio.digitalWrite(LED, 0);
			console.log("Click! 초음파센서 비활성화");
		}
	}
	setTimeout(CheckButton,300);
}

const Triggering = function() {
gpio.digitalWrite (TRIG, gpio.LOW);
gpio.delayMicroseconds(2)
gpio.digitalWrite (TRIG, gpio.HIGH);
gpio.delayMicroseconds(20)
gpio.digitalWrite (TRIG, gpio.LOW);
while(gpio.digitalRead(ECHO) == gpio.LOW) ;
startTime = gpio.micros();
while(gpio.digitalRead(ECHO) == gpio.HIGH) ;
travelTime = gpio.micros() - startTime;
distance = travelTime / 58;

if (distance < 400) {
console.log("근접거리: %i cm\n", distance);
effect_Buzzer(distance);
}
if((count % 2) == 0)
		setTimeout(Triggering, 200);
	else
		return 0;
}

const effect_Buzzer = (dis) => {
if ( dis < 5) {
	BuzzerTurnOn();
	gpio.delay(10);
}
else if (dis >= 5 && dis < 15) {
	BuzzerTurnOn();
	gpio.delay(50);
}
else if (dis >= 15 && dis < 50) {
	BuzzerTurnOn();
	gpio.delay(200);
}
else {
	BuzzerTurnOn();
	gpio.delay(500);
}
}

const BuzzerTurnOn = function() {
gpio.digitalWrite(BUZZER, 1);
setTimeout(BuzzerTurnOff, 5);
}
const BuzzerTurnOff = function() {
gpio. digitalWrite(BUZZER, 0);
}

process.on('SIGINT', function() {
gpio.digitalWrite(LED, 0);
gpio. digitalWrite(BUZZER, 0);
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
gpio.pinMode(LED, gpio.OUTPUT);
setImmediate(CheckButton);