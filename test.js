const gpio = require('node-wiring-pi');
const BUTTON = 23;
const BLUE = 27;
const RED = 28;
const GREEN = 29;
const BUZZER = 26;
const LIGHT = 31;

const CheckLight = function(){
        gpio.digitalWrite(BLUE, 0);
        gpio.digitalWrite(RED, 0);
        gpio.digitalWrite(GREEN, 0);
        var data = gpio.digitalRead(LIGHT);
        if(!data){
                console.log("Nodejs : Bright");
                gpio.digitalWrite(BLUE, 0);
                gpio.digitalWrite(RED, 0);
                gpio.digitalWrite(GREEN, 0);
        }
        else{
                console.log("Nodejs : Dark");
                gpio.digitalWrite(BLUE, 1);
                gpio.digitalWrite(RED, 1);
                gpio.digitalWrite(GREEN, 1);
        }
        setTimeout(CheckLight, 500);
}

const CheckButton = function(){
        let data = gpio.digitalRead(BUTTON);
        let B = gpio.digitalRead(BLUE);
        let R = gpio.digitalRead(RED);
        let G = gpio.digitalRead(GREEN);
        if(!data){
                if(B == 1 && R == 1 && G == 1){
                        BuzzerOn();
                }
        }
        setTimeout(CheckButton, 500);
}

const BuzzerOn = function(){
        gpio.digitalWrite(BUZZER, 1);
        setTimeout(BuzzerOff, 100);
        console.log("Buzzer On");
}

const BuzzerOff = function(){
        gpio.digitalWrite(BUZZER, 0);
        console.log("Buzzer Off");
}

process.on('SIGINT', function(){
        gpio.digitalWrite(BUZZER, 0);
        gpio.digitalWrite(BLUE, 0);
        gpio.digitalWrite(RED, 0);
        gpio.digitalWrite(GREEN, 0);
        console.log("Program Exit...");
        process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(BLUE, gpio.OUTPUT);
gpio.pinMode(RED, gpio.OUTPUT);
gpio.pinMode(GREEN, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
setImmediate(CheckButton);
setImmediate(CheckLight);