const request = require('request');
var peer2data = {
	name: "bmlee",
	age: 89,
	addr: "성남",
	tel: "010-222-3333" }

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