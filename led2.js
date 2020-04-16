const gpio = require('node-wiring-pi');
const BLUE = 29; // 물리핀번호: 40
const RED = 28; // 물리핀번호: 38
const GREEN = 27; // 물리핀번호: 36
var count = 0; // 순서를 카운팅하는 변수
const TimeOutHandler = function ( ) {
switch (count % 4){
case 0: gpio.digitalWrite (RED, 1); // 빨강 on
console.log("Node: RED on");
break;
case 1: gpio.digitalWrite (RED, 0); // 빨강off
gpio.digitalWrite (GREEN, 1); // 초록on
console.log("Node: GREEN on");
break;
case 2: gpio.digitalWrite (GREEN, 0);
gpio.digitalWrite (BLUE, 1);
console.log("Node: BLUE on"); // 콘솔출력
break;
case 3: gpio.digitalWrite(RED, 0);
gpio.digitalWrite(GREEN, 0);
gpio.digitalWrite(BLUE, 0);
console.log("Node: All off");
break;
default: break;
}
count++; // 순서증가
setTimeout(TimeOutHandler, 1000); // 1초후 이벤트
}
gpio.setup('wpi');
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(TimeOutHandler); 