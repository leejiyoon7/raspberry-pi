const fs = require('fs');
const http = require('http');
const gpio = require('node-wiring-pi');
const socketio = require('socket.io');
const mcpadc = require('mcp-spi-adc');
const JOYBUTTON = 26;
const RED = 27;
const GREEN = 28;
const BLUE = 29;
const CS_MCP3208 = 10 // Chip Enable(CE0) is set
const VRX = 0 // ADC 0번째 채널선택=아날로그센서
const VRY = 1 // ADC 1번째 채널선택=아날로그센서
const SPI_SPEED = 1000000 // Clock Speed = 1Mhz
var timerid, timeout=800; // 타이머제어용
var xvalue = yvalue = -1; // JoyStick X,Y 측정데이터 저장용
var count = 1;
var lightvalue = 50;

const joyx = mcpadc.openMcp3208(VRX, // 채널0 지정 (X좌표)
{ speedHz: SPI_SPEED }, // Clock속도 지정
(err) => { // Callback함수 등록
console.log("SPI 채널0 초기화완료!");
if (err) console.log('채널0 초기화실패!(HW점검!)');
});

const joyy = mcpadc.openMcp3208(VRY, // 채널1 지정 (Y좌표)
{ speedHz: SPI_SPEED }, // Clock속도 지정
(err) => { // Callback함수 등록
console.log("SPI 채널1 초기화완료!");
if (err) console.log('채널1 초기화실패!(HW점검!)');
});

const JoyStickCheckButton = ( ) => {
	let checkButtonData = gpio.digitalRead(JOYBUTTON);
	if (! checkButtonData) {
		gpio.softPwmWrite(BLUE, lightvalue);
		JoyStick();
	}
	setTimeout(JoyStickCheckButton,300);
}

const JoyStick = ( ) => {

	joyx.read((error, reading)=> {
		console.log(" ▲ ▼ (%d)", reading.rawValue);
		xvalue = reading.rawValue;
	});

	joyy.read((error, reading)=> {
		console.log(" ◀ ▶ (%d)", reading.rawValue);
		yvalue = reading.rawValue;
	});

	if(yvalue<300 || yvalue >3700) {
		count ++;
	}

	if(xvalue<300){
		lightvalue = lightvalue - 5;
		if(lightvalue < 1) {
			console.log("빛의 세기는 1보다 낮을 수 없습니다.");
			lightvalue = 1;
		}
	}
	else if(xvalue>3700) {
		lightvalue = lightvalue + 5;
		if(lightvalue > 100) {
			console.log("빛의 세기는 100보다 클 수 없습니다.");
			lightvalue = 100;
		}
	}

	if ((count % 3) == 1) {
		gpio.digitalWrite(RED, 0);
		gpio.digitalWrite(GREEN, 0);
		gpio.digitalWrite(BLUE, lightvalue); 
		count++;
	}
	else if ((count % 3) == 2){
		gpio.digitalWrite(RED, lightvalue);
		gpio.digitalWrite(GREEN, 0);
		gpio.digitalWrite(BLUE, 0); 
		count++;
	}
	else {
		gpio.digitalWrite(RED, 0);
		gpio.digitalWrite(GREEN, lightvalue);
		gpio.digitalWrite(BLUE, 0); 
		count++;
	}


	if (xvalue != -1 && yvalue != -1){ // x값, y값 모두 읽었다면
		io.sockets.emit('watch', xvalue, yvalue);
		xvalue = yvalue = -1;
	}

	timerid = setTimeout(JoyStick, timeout);
}

process.on('SIGINT', () => { // mcp3208 연결해제
		joyy.close(() => {
			console.log('MCP-ADC가 해제되어,웹서버를 종료합니다');
			console.log('LED를 끄고 프로그램을 종료합니다.');
			gpio.softPwmWrite(RED, 0);
			gpio.softPwmWrite(GREEN, 0);
			gpio.softPwmWrite(BLUE, 0);
			process.exit();
		});
	});

const serverbody = (request, response) => {
	fs.readFile('views/plotly_joy.html', 'utf8', (err, data) => {
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.end(data);
	});
};

const server = http.createServer(serverbody);
const io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
	socket.on('startmsg', function (data) {
		console.log('가동메시지 수신(측정주기:%d)! ', data);
		timeout = data;
		JoyStickCheckButton(); // 타이머가동(조이스틱 기능 활성화)
	});

	socket.on('stopmsg', function (data) {
		console.log('중지메시지 수신!');
		clearTimeout(timerid); // 측정용 타이머를 해제 시킴
	});
});

server.listen(60002, () => {
	gpio.wiringPiSetup();
	gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
	gpio.pullUpDnControl(JOYBUTTON,gpio.PUD_UP);
	gpio.softPwmCreate(RED, 0, 100);
	gpio.softPwmCreate(GREEN, 0, 100);
	gpio.softPwmCreate(BLUE, 0, 100);
	console.log('-----------------------------------------');
	console.log('조이스틱 제어용 웹서버');
	console.log("웹브라우져 접속주소 : http://IP주소:60002/");
	console.log('-----------------------------------------');
});