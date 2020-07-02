const gpio = require('node-wiring-pi'), ejs = require('ejs');
const express = require('express'), fs = require('fs');
const app = express();
const BLUELED = 29, BUZZER = 24, LIGHT = 28;
var timerid, index, value=[ ]; // value 배열에 데이터저장
var led1state = '#b0b0b0' ; // OFF상태색(회색)
var buzzerstate = '#b0b0b0';
var lightstate = '#b0b0b0';
app.get('/', (req, res) => {
fs.readFile('views/contpage.ejs','utf8',(error, data) => {
if (error)
res.send(500);
else
res.send(ejs.render(data, {
led1color:led1state,
buzzercolor:buzzerstate,
lightcolor:lightstate }));
});
});
app.listen(60002, () => {
gpio.wiringPiSetup();
gpio.pinMode(BLUELED, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
console.log("웹서버실행중( http://192.168.0.199:60002 ) ");
app.get('/led1/1', (req, res) => {
console.log("LED를 ON시킵니다");
gpio.digitalWrite(BLUELED, 1);
led1state = '#0000ff'; // 웹 컬러셋팅(파랑)
res.redirect('/');
});
app.get('/led1/0', (req, res) => {
console.log("LED를 OFF합니다.");
gpio.digitalWrite(BLUELED, 0);
led1state = '#b0b0b0'; // 웹 컬러셋팅(회색)
res.redirect('/');
});
app.get('/buzzer/1', (req, res) => {
console.log("부져를 켭니다");
gpio.digitalWrite(BUZZER, 1);
buzzerstate = '#0000ff';
res.redirect('/');
});
app.get('/buzzer/0', (req, res) => {
console.log("부져를 끕니다");
gpio.digitalWrite(BUZZER, 0);
buzzerstate = '#b0b0b0';
res.redirect('/');
});
const lightctl = ( ) => {
if (index < 500) {
value[index++] = gpio.digitalRead(LIGHT);
console.log('value:' + value[index-1]);
}
else
index = 0;
timerid = setTimeout(lightctl, 1000);
}
app.get('/light/1', (req, res) => { // 조도센서 측정시작(활성화)
console.log(" 광센서로 측정을 시작합니다...");
timerid = setTimeout(lightctl, 100);
lightstate = '#0000ff';
res.redirect('/');
});
app.get('/light/2', (req, res) => { // 조도센서 측정값 조회
console.log(" 그동안 측정된 값들을 보여줍니다.");
fs.readFile('views/lightdata.ejs','utf8',(error, data) => {
if (error) res.send(500);
else res.send(ejs.render(data, { lightdata: value }));
});
});
app.get('/light/0', (req, res) => { // 조도센서 측정종료(비활성화)
console.log(" 광센서의 측정을 중지하였습니다...");
clearTimeout(timerid);
lightstate = '#a0a0a0';
res.redirect('/');
});
