const request = require('request');
var data = {
actid: 'LED3',
redcolor: 'ON',
greencolor: 'OFF',
bluecolor: 'OFF'
};
request.put(
{ url :'http://192.168.0.199:60001/led',
form : data,
headers : { "content-type": "application/x-www-form-urlencoded"}
},
function (error, response, body) {
if (!error && response.statusCode == 200) {
console.log(body)
}
}
);
