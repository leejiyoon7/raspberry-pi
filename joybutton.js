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
var count =0;

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
		gpio.digitalWrite(BLUE, 1);
		JoyStick();
	}
	
	setTimeout(JoyStickCheckButton,300);
}

const JoyStick = ( ) => {

	joyy.read((error, reading)=> {
		console.log(" ◀ ▶ (%d)", reading.rawValue);
		yvalue = reading.rawValue;
	});

	if(yvalue<50 || yvalue >4000) {
		if ((count % 3) == 1) {
			gpio.digitalWrite(RED, 0);
			gpio.digitalWrite(GREEN, 0);
			gpio.digitalWrite(BLUE, 1); 
			count++;
		}
		else if ((count % 3) == 2){
			gpio.digitalWrite(RED, 1);
			gpio.digitalWrite(GREEN, 0);
			gpio.digitalWrite(BLUE, 0); 
			count++;
		}
		else {
			gpio.digitalWrite(RED, 0);
			gpio.digitalWrite(GREEN, 1);
			gpio.digitalWrite(BLUE, 0); 
			count++;
		}
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
			gpio.digitalWrite(RED, 0);
			gpio.digitalWrite(GREEN, 0);
			gpio.digitalWrite(BLUE, 0);
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
	gpio.pinMode(RED, gpio.OUTPUT);
	gpio.pinMode(GREEN, gpio.OUTPUT);
	gpio.pinMode(BLUE, gpio.OUTPUT);
	console.log('-----------------------------------------');
	console.log('조이스틱 제어용 웹서버');
	console.log("웹브라우져 접속주소 : http://IP주소:60001/");
	console.log('-----------------------------------------');
});