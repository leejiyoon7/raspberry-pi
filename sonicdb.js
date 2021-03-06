const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const TRIG = 29;
const ECHO = 28;
var startTime; // 초음파 송출시간
var travelTime; // 초음파수신까지 경과시간
const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'root', // DB접속 아이디
password: 'asqwzx11', // 암호
database: 'sensordb' //사용할 DB명
});

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
	console.log("근접거리: %i cm",distance);
	if (distance <= 20) { // 20cm이내 근접거리
		let stamptime = new Date();
		client.query('INSERT INTO sonic VALUES (?, ?)', [stamptime, distance], (err, result) => {
			if (err) {
				console.log("DB저장실패!");
				console.log(err);
			}
			else console.log("DB에 저장을 했습니다!");
		}); /* client.query */
	}
}
setTimeout(Triggering, 700);
}

const Retrieve = function() {
let stamp_distance;
client.query('SELECT * FROM `sonic`', function (error, results, fields) {
console.log("----------------- 현재까지 DB에 저장된 내용을 출력합니다 ---------------");
results.forEach(function(element, i) {
let d = element.stamp, str = '';
str += d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate() + ' '; // YYYY.MM.DD
str += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.'; // HH:MM:SS
str += d.getMilliseconds() + ' ' + element.distance + 'cm'; // .MMM 6cm
console.log(str);
});
console.log("----------------------------------------");
setTimeout(Retrieve, 5000); // 5초마다 DB조회 (저장확인)
}); // client.query( … )
}

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(Triggering); // 실시간 거리측정
setImmediate(Retrieve); // DB에서 조회하여 화면출력
console.log("======================================");
console.log("근접거리가 20cm 이내에만 MariaDB 에 저장합니다");
console.log("======================================");