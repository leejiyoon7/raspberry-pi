const gpio = require('node-wiring-pi');
const BLUE = 29; // 물리핀번호: 40
const GREEN = 28; // 물리핀번호: 38
const RED = 27; // 물리핀번호: 36
var count = 0; // 순서를 카운팅하는 변수

const TimeOutHandler = function () {
switch (count % 7){
case 0: gpio.digitalWrite (GREEN, 1); // 초록 on
console.log("Node: GREEN on");
break;

case 1: gpio.digitalWrite (GREEN, 0); // 파랑on
gpio.digitalWrite (BLUE, 1); 
console.log("Node: BLUE on");
break;

case 2: gpio.digitalWrite (GREEN, 1); // 청록색 on
console.log("Node: BLUE GREEN on"); 
break;

case 3: gpio.digitalWrite(GREEN, 0); //빨강 on
gpio.digitalWrite(BLUE, 0);
gpio.digitalWrite(RED, 1);
console.log("Node: RED on");
break;

case 4: gpio.digitalWrite(GREEN, 1); // 흰색 on
gpio.digitalWrite(BLUE, 1);
console.log("Node: ALL on");
break;

case 5: gpio.digitalWrite(GREEN, 0); //모두 off
gpio.digitalWrite(BLUE, 0);
gpio.digitalWrite(RED, 0);
console.log("Node: ALL off");
break;

default: break;
}
count++; // 순서증가
if (count==7) {
   count =0;
   function3();
   return 0;
}
setTimeout(TimeOutHandler, 1000); // 1초후 이벤트
}

const function3 = function () {
   for(i=0; i<3; i++){
  (function(x){
    setTimeout(function(){
      AllOn();
    }, 2000*x);
  })(i);
}
setTimeout(TimeOutHandler,6000);
}

const AllOn = function () { //모두켜기
   gpio.digitalWrite(GREEN, 1);
   gpio.digitalWrite(BLUE, 1);
   gpio.digitalWrite(RED, 1);
   console.log("Node: ALL on");
   setTimeout(AllOff,1000);
}

const AllOff = function () { //모두끄기
   gpio.digitalWrite(GREEN, 0);
   gpio.digitalWrite(BLUE, 0);
   gpio.digitalWrite(RED, 0);
   console.log("Node: ALL off");
}

process.on('SIGINT', function() {
gpio.digitalWrite(GREEN, 0);
gpio.digitalWrite(BLUE, 0);
gpio.digitalWrite(RED, 0);
console.log("Program Exit...");
process.exit();
});

gpio.setup('wpi');
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
setImmediate(TimeOutHandler);