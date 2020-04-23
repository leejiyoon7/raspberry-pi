const gpio = require('node-wiring-pi');
const BUZZER = 21; //물리핀번호 29
const RED = 0; //물리핀번호 11
const BLUE = 3; //물리핀번호 15
const TOUCH = 7; //물리핀번호 7
const LIGHT = 22; //물리핀번호 31
var count = 0;
var change = 0;
var change2 = 0;

const TurnOff = function() {
        gpio. digitalWrite(BUZZER, 0);
 }

const CheckTouch = function() {
        var data = gpio.digitalRead(TOUCH);
        gpio.digitalWrite(BLUE,1);
        var data2 = gpio.digitalRead(LIGHT);
        var data3 = data2;
        if(data){
                count++;
        }
        if (data && (count %2)==1){
                console.log("Nodejs: START!");
                gpio.digitalWrite(RED,1);
                gpio.digitalWrite(BLUE,0);
                
              }
        else if(!data && (count %2) == 1){
                console.log("Nodejs:ing!");
                gpio.digitalWrite(RED,1);
                gpio.digitalWrite(BLUE,0);
                data2 = gpio.digitalRead(LIGHT);
                if(!data2)
                        change = 1;
                else
                        change2 = -1;
                if((change - change2) == 2){
                      gpio.digitalWrite(BUZZER,1);
                        setTimeout(TurnOff,300);
                        change = 0;
                        change2 = 0;
                        }
        }else {
                console.log("Nodejs:stop!");
                gpio.digitalWrite(RED,0);
                gpio.digitalWrite(BLUE,1);
        }
        setTimeout(CheckTouch,700);
      }
        
process.on('SIGINT',function(){
        gpio.digitalWrite(RED,0);
        gpio.digitalWrite(BLUE,0);
        gpio.digitalWrite(BUZZER,0);
        console.log("Program exit");
});

gpio.setup('wpi');
gpio.pinMode(TOUCH,gpio.INPUT);
gpio.pinMode(LIGHT,gpio.INPUT);
gpio.pinMode(BUZZER,gpio.OUTPUT);
gpio.pinMode(BLUE,gpio.OUTPUT);
gpio.pinMode(RED,gpio.OUTPUT);
setTimeout(CheckTouch,10);