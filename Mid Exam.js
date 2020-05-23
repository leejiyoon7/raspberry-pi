const gpio = require('node-wiring-pi');
const BUTTON = 0;
const RED = 1;
const GREEN = 2;
const LIGHT = 3;
const TOUCH = 4;
const BUZZER = 5;

var count = 1;
var first = 70;
var second = 40;

const checkbutton = function() {
	var buttondata = gpio.digitalRead(BUTTON);
	if(!buttondata) {
		if(count++ % 2 == 1) {
			gpio.digitalWrite(RED,1);
			gpio.digitalWrite(GREEN,1);
			buzzeron(first);
			checklight();
		}
		else {
			gpio.digitalWrite(RED,0);
			gpio.digitalWrite(GREEN,0);
			buzzeron(second);
			checktouch();
		}
	}
}

const checklight = function() {
	var lightdata = gpio.digitalRead(LIGHT);
	if(!lightdata)
		gpio.digitalWrite(RED,0);
	else
		gpio.digitalWrite(RED,1);

	if(count % 2 == 0)
		setTimeout(checklight,300);
	else
		return 0;
}

const checktouch = function() {
	var touchdata = gpio.digitalRead(TOUCH);
	if(!lightdata)
		gpio.wiringPiISR(TOUCH,INT_EDGE_FALLING,checktouch);

	if(count % 2 == 1)
		setTimeout(checktouch,300);
	else
		return 0;
}

const buzzeron = function(time) {
	gpio.digitalWrite(BUZZER,1);
	setTimeout(buzzeroff,time);
}

const buzzeroff = function() {
	gpio.digitalWrite(BUZZER,0);
}

process.on('SIGINT', function() {
gpio.digitalWrite(RED, 0);
gpio. digitalWrite(GREEN, 0);
console.log("프로그램이 종료됩니다….");
process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(TOUCH, gpio.INPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(BUTTON, gpio.INPUT);
setImmediate(checkbutton);