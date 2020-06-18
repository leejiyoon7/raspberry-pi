const express = require('express');
const gpio = require('node-wiring-pi');
const bodyParser = require('body-parser');
const app = express();
const GREEN = 21;
const RED = 22;
const BLUE = 23;
var mydata = {
actid: 'LED3',
redcolor: 'OFF',
greencolor: 'OFF',
bluecolor: 'OFF'
};

const led3control = (req, res) => {
console.log("PUT method로 데이터 수신...");
if (req.body.actid == 'LED3') {
if (req.body.redcolor == 'ON') {
gpio.digitalWrite(RED, 1);
gpio.digitalWrite(BLUE, 0);
gpio.digitalWrite(GREEN, 0);
console.log("빨강LED켰음");
}
if (req.body.greencolor == 'ON') {
gpio.digitalWrite(RED, 0);
gpio.digitalWrite(BLUE, 0);
gpio.digitalWrite(GREEN, 1);
console.log("초록LED켰음");
}
if (req.body.bluecolor == 'ON') {
gpio.digitalWrite(RED, 0);
gpio.digitalWrite(BLUE, 1);
gpio.digitalWrite(GREEN, 0);
console.log("파랑LED켰음");
}
res.send("OK");
}
else
res.send("FAIL");
}

app.use(bodyParser.urlencoded({ extended: false }));
app.put('/led', led3control);
app.get('/led', (req, res) => {
console.log("Get method");
res.send("OK"); });
app.listen(60001, ( ) => {
console.log('SVR_LED.js: 서버(60001)가동중 ...');
gpio.wiringPiSetup();
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
});