const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const TRIG = 29;
const ECHO = 28;
var startTime; // 초음파 송출시간
var travelTime; // 초음파수신까지 경과시간
var count = 1;
var total = 0;
const client = mysql.createConnection({
host: 'localhost', // DB서버 IP주소
port: 3306, // DB서버 Port주소
user: 'root', // DB접속 아이디
password: 'asqwzx11', // 암호
database: 'sensordb' //사용할 DB명
});

client.query('TRUNCATE TABLE sonic', (err, result) => {
			if (err) {
				console.log("테이블 초기화 실패!");
				console.log(err);
			}
			else console.log("테이블을 초기화  했습니다!");
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
real_distance = travelTime / 58;

total = total + real_distance;
filtering_distance = total / count;
error_distance =10 - filtering_distance;
if(error_distance<0)
	error_distance = error_distance*(-1);

	console.log("근접거리: %d cm",real_distance.toFixed(2));
		let stamptime = new Date();
		client.query('INSERT INTO sonic VALUES (?, ?, ?, ?)', [stamptime, real_distance.toFixed(2), filtering_distance.toFixed(2), error_distance.toFixed(2)], (err, result) => {
			if (err) {
				console.log("DB저장실패!");
				console.log(err);
			}
			else console.log("DB에 저장을 했습니다!");
		}); /* client.query */
	count++;
	if(count == 41)
		return 0;
setTimeout(Triggering, 500);
}

const Retrieve = function() {
client.query('SELECT * FROM `sonic`', function (error, results, fields) {
console.log("----------------- 현재까지 DB에 저장된 내용을 출력합니다 ---------------");
results.forEach(function(element, i) {
let d = element.stamp, str = '';
str += d.getFullYear() + '.' + (d.getMonth()+1) + '.' + d.getDate() + ' '; // YYYY.MM.DD
str += d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.'; // HH:MM:SS
str += d.getMilliseconds() + ' ' + element.real_distance.toFixed(2) + 'cm' + ' ' + element.filtering_distance.toFixed(2) + 'cm' + ' ' + element.error_distance.toFixed(2) + 'cm'; // .MMM 6cm
console.log(str);
});
if(count == 41)
		return 0;
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