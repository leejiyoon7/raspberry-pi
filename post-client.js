const request = require('request');
var peer2data = {
	name: "jiyoon",
	age: 24,
	addr: "인천",
	tel: "010-7518-0000" }

request.post (
{ url :'http://192.168.0.199:60001/member',
	form : peer2data,
	headers : { "content-type": "application/x-www-form-urlencoded"}
},
	function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
		}
	}
);