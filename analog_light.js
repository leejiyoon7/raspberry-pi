const gpio = require('node-wiring-pi');
const mcpadc = require('mcp-spi-adc'); // MCP3208 제어모듈
const CS_MCP3208 = 10; // Chip Enable(CE0) is set
const SPI_SPEED = 1000000; // Clock Speed = 1Mhz
const LIGHT = 0; // ADC 0번째 채널선택=아날로그센서
const LED = 1; // 3색LED (물리핀번호 12번)
var timerid, timeout=800; // 타이머제어용
var lightdata = -1; // 조도값 측정데이터 저장용

const Light = mcpadc.openMcp3208(LIGHT, // 채널0 지정 (아날로그조도센서)
{ speedHz: SPI_SPEED }, // Clock속도 지정
(err) => { // 초기화처리후 콜백함수 등록
console.log("SPI 채널0 초기화완료!");
console.log("-----------------------------");
if (err) console.log('채널0 초기화실패!(HW점검!)');
});

const AnalogLight = function() {
Light.read((error, reading)=> {
console.log(" 현재 측정된 조도값 (%d)", reading.rawValue);
lightdata = reading.rawValue;
});

if ( lightdata != -1 ){ // 아날로그 조도센서값을 읽었다면
if (lightdata > 2200) // 어두우면, 파랑색LED를 최대 밝기로 켜기
gpio.softPwmWrite(LED, 100);
else if (lightdata < 500) // 매우 밝으면, 최소 밝기로 켜기
gpio.softPwmWrite(LED, 1);
else // 밝으면, 중간 밝기로 켜기
gpio.softPwmWrite(LED, 30);
lightdata = -1;
}
timerid = setTimeout(AnalogLight, timeout);
}

process.on('SIGINT', ( ) => {
Light.close( ( ) => { // mcp3208 연결해제
console.log('MCP-ADC가 해제되어, 프로그램을 종료합니다');
gpio.softPwmWrite(LED, 0); // LED끄기
process.exit();
});
});

gpio.wiringPiSetup();
gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
gpio.softPwmCreate(LED, 1, 100);
console.log("------------------------------------------------------------------------------------------");
console.log("전등을 끄거나 켜서 밝기를 변화시켜보면서 프로그램을 확인하세요");
console.log("------------------------------------------------------------------------------------------");
setImmediate(AnalogLight);
