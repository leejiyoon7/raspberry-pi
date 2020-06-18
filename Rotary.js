const gpio = require('node-wiring-pi');
const DT = 29;
const CLK = 28;
var rotate = 0; //오른쪽으로 돌릴 시 +1
//왼쪽으로 돌릴 시 -1
const SenseRotate = function() {
var checked = 0;
//오른쪽 핀(DT)가 먼저 접점이 떨어질 경우
while (gpio.digitalRead(DT) == 0) {
//rotate값을 1 추가 한 후,
if (checked == 0) {
rotate ++;
checked ++;
console.log(rotate);
}
//이후 감지되는 과정을 모두 무시한다.
while(gpio.digitalRead(CLK) == 0) { }
}
//왼쪽으로 돌릴 시 CLK를 기준으로 수행.
while (gpio.digitalRead(CLK) == 0){
if (checked == 0) {
rotate --;
checked ++;
console.log(rotate);
}
while(gpio.digitalRead(DT) == 0) { }
}
setTimeout(SenseRotate, 20);
}
process.on('SIGINT', function() {
console.log("Program Exit...");
process.exit();
});
gpio.wiringPiSetup();
gpio.pinMode(DT, gpio.INPUT);
gpio.pinMode(CLK, gpio.INPUT);
setImmediate(SenseRotate);