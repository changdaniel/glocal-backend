const fetch = require("node-fetch");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
var apikey = require('./weatherkey.json')

var url = "http://api.openweathermap.org/data/2.5/forecast?id=4887398&APPID=".concat(apikey)


function getWeather(){

	fetch(url).then(function(response){
		return(response.json())
	}).then(function(myjson){

		//console.log(myjson)

		var rain = false
		var days = {}
		
		myjson["list"].forEach(function (threehours){

			//console.log(threehours)

			day = threehours["dt_txt"].substring(0,10) 
			if (!(day in days)){
				days[day] = false
			}

			if (threehours["weather"][0]["main"] == "Rain"){
				days[day] = true
			}

		});

		//console.log(days)
		this.setState({weather:days})

	})

}

console.log(getWeather())




// const Http = new XMLHttpRequest()
// Http.open("GET", url)
// Http.send()

// Http.onreadystatechange = function(){
// 	var data = Http.responseText
// 	console.log(data)
// }


