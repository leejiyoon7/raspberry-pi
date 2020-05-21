const http=require('http');  
const gpio=require('node-wiring-pi');  
const fs=require('fs');  
const socketio=require('socket.io');  
const LED=2;  const TRIG=0,ECHO=1;  
var startTime,travelTime;//초음파거리계산용  
var index=0,value=[];//측정거리데이터저장용  
var timerid,timeout=800;//타이머제어용  
var cnt=1;//타이머제어용  

constserver=http.createServer(function(request,response) {
  	fs.readFile('views/web_so.html','utf8',function(error,data){  
  	response.writeHead(200,{'Content-Type':'text/html'});
  	response.end(data); 
    }); 
}).listen(65001,function(){ 
    gpio.wiringPiSetup();
    gpio.pinMode(LED,gpio.OUTPUT);
    gpio.pinMode(ECHO,gpio.INPUT);
    gpio.pinMode(TRIG,gpio.OUTPUT);
    gpio.digitalWrite(LED,0);//LED초기화  
    console.log('Serverrunningathttp://IP주소:65001');  
});

constio=socketio.listen(server); 
io.sockets.on('connection',function(socket){
	socket.on('startmsg',function(data){  
		console.log('가동메시지수신(측정주기:%d)!',data);  
		timeout=data;  watchon();//타이머가동(초음파가동)  
	});  socket.on('stopmsg',function(data){  
		console.log('중지메시자수신!');  
		clearTimeout(timerid);  
	});  
});

const watchon = ( ) => {
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
if (distance < 400) { // 센서는 400 cm 이내만 측정가능 함
if (index < 500) {
value[index++] = distance;
console.log('근접거리: %d cm', value[index-1]);
io.sockets.emit('watch', value[index-1]);
}
else index = 0;
if ((index % 2) == 0) gpio.digitalWrite(LED, 1); // 가동중 LED점멸
else gpio.digitalWrite(LED, 0);
}
timerid = setTimeout(watchon, timeout);
}