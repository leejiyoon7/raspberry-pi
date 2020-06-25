const gpio = require('node-wiring-pi');
const bleno = require('@abandonware/bleno');
const util = require('util');
const SERVICE_UUID = 'ff01'; // 서비스식별자 (16bit 임의지정)
const CHARACTERISTIC_UUID = 'ff03'; // 특성식별자 (16bit 임의지정)
const LED = 1; // 물리12번, wPi 1번
var analog_data = 0;
var nodename = "jiyoonpi"; // 블루투스기기명
var Characteristic = bleno.Characteristic;
var PrimaryService = bleno.PrimaryService;

const ApproachCharacteristic = function() {
	ApproachCharacteristic.super_.call(this, {
	uuid: CHARACTERISTIC_UUID,
	properties : ['read', 'notify', 'write'] ,
	value : null
		});
	this._value = 0; // 연속 센서데이터
	this._updateValueCallback = null; // 활성화 콜백함수
};

util.inherits(ApproachCharacteristic, Characteristic);
// central 기기(예,스마트폰)에서 read request 를 하면, (peripheral 에서) 이 함수가 실행됨
ApproachCharacteristic.prototype.onReadRequest = (offset, callback) => {
	var data1 = Buffer.from(this._value.toString());
	console.log("블루투스> 데이터1회송신서비스: " + data1);
	callback(this.RESULT_SUCCESS, data1);
}
// central 기기(예,스마트폰)에서 write request 를 하면, (peripheral 에서) 이 함수가 실행됨
// (BLE 를 통해서 한번에 최대 20Byte까지 수신할 수 있음.)
ApproachCharacteristic.prototype.onWriteRequest =
(data, offset, withoutResponse, callback) => {
	if (data == "on") {
		console.log("블루투스> 데이터수신(write요청): " + data + ' (LED ON)');
		gpio.digitalWrite(LED, 1);
	}
	else if (data == "off") {
		console.log("블루투스> 데이터수신 (write요청): " + data + ' (LED OFF)');
		gpio.digitalWrite(LED, 0);
	}
	else console.log("블루투스> 데이터수신: " + data + ' on/off 이외데이터');
	callback(this.RESULT_SUCCESS); // central 기기로 응답(성공)을 전송
};
ApproachCharacteristic.prototype.onSubscribe = (maxValueSize, updateValueCallback) => {
	console.log("----------------------------------------------------------------------------------------------");
	console.log("블루투스> 상대방이 센서데이터 연속서비스 가입(Subscribe)요청합니다");
	console.log("----------------------------------------------------------------------------------------------");
	this._updateValueCallback = updateValueCallback; // 연속적으로 송신하는 콜백함수를 활성화시킴
};
ApproachCharacteristic.prototype.onUnsubscribe = (maxValueSize, updateValueCallback) => {
	console.log("--------------------------------------------------------------------------------------------------");
	console.log("블루투스> 상대방이 센서데이터 연속서비스 탈퇴(Unsubscribe)요청합니다");
	console.log("--------------------------------------------------------------------------------------------------");
	this._updateValueCallback = null; // 연속적으로 송신하는 콜백함수를 비활성화시킴
};
bleno.on('stateChange', (state) => {
	if (state == = 'poweredOn') {
		bleno.startAdvertising(nodename, [SERVICE_UUID]);
		console.log("----------------------------------------------------");
		console.log("블루투스 > ON (" + nodename + " 가동)");
	}
	else {
		bleno.stopAdvertising();
		console.log("블루투스 > Advertising 을 중단합니다");
	}
});
const approachCharacteristic = new ApproachCharacteristic();
bleno.on('advertisingStart', (error) => {
	if (!error) {
		console.log("블루투스 > Advertising 을 시작합니다...");
		console.log("----------------------------------------------------");
		bleno.setServices([ // 서비스프로파일 셋업
			new PrimaryService({
			uuid: SERVICE_UUID,
			characteristics : [approachCharacteristic]
				})
		]);
	}
	else
		console.log("블루투스 > Advertising 도중 오류발생");
});
bleno.on('accept', (addr) => {
	console.log("블루투스 > 상대편(%s)이 연결을 수락했습니다", addr);
	setInterval(() => { bleno.updateRssi((error, rssi) = > {
		bleno.setMaxListeners(0); // 최대Listner 개수를 비활성화(0)시켜, 제한을 풀어줍니다.
		console.log("수신감도(5초마다): 2m이내(-20~-50), 3~7m(-60~-80), 8m이상(-90~-120) > " + rssi);
	}); }, 5000);
});
bleno.on('disconnect', (addr) => {
	console.log("블루투스 > 상대편(%s)이 연결을 끊었습니다", addr);
});
bleno.on('servicesSet', (err) => {
	if (!err)
		console.log("블루투스> 상대에게 보낼ServiceProfile을 생성합니다");
});

process.on('SIGINT', () => {
	console.log("\n블루투스> 프로그램을 종료합니다");
	process.exit();
});
gpio.wiringPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);
setInterval(() => {
	analog_data++; // 가상의 아날로그 센서데이터를 측정한다고 가정함(즉, 1초마다 1씩증가시켜 업데이트함)
	approachCharacteristic._value = analog_data;
	if (approachCharacteristic._updateValueCallback) {
		console.log('블루투스 > 연속데이터 송신 : ${ approachCharacteristic._value }');
		const notificationBytes = Buffer.from(String(approachCharacteristic._value));
		approachCharacteristic._updateValueCallback(notificationBytes);
	}
}, 1000);