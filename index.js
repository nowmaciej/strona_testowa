const request = require('request');
let apiKey = '65eb5a888844453baf8314a8c209aae4';

const express = require('express')
const app = express()

app.use(express.static('public'))
app.set('view engine','ejs')

app.get('/monitoring',function(req,res){
  res.render('monit')
})

app.get('/tablica',function(req,res){
  res.render('tablica')
})

app.get('*',function(req,res){
  const options = {
	  url: `https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=50.014&lng=20.162&apikey=${apiKey}`,
	  headers: {
		'Accept-Language':'pl'  
	  }
  }
  let url = `https://airapi.airly.eu/v2/measurements/point?indexType=AIRLY_CAQI&lat=50.014&lng=20.162&apikey=${apiKey}`
  request(options, function (err, response, body) {
	if(err){
      res.render('index',{pm1:null,pm25:null,pm10:null,cisnienie:null,wilgotnosc:null,temperatura:null,info:null,desc:null,error:'Błąd odpowiedzi'})
    } else {
      let odpowiedz = JSON.parse(body)
      if(odpowiedz.current==undefined){
        res.render('index',{pm1:null,pm25:null,pm10:null,cisnienie:null,wilgotnosc:null,temperatura:null,info:null,desc:null,error:'Błąd parsera'})
      } else {
      let pm1 = odpowiedz.current.values[0].value
      let pm25 = odpowiedz.current.values[1].value
      let pm10 = odpowiedz.current.values[2].value
      let cisnienie = odpowiedz.current.values[3].value
      let wilgotnosc = odpowiedz.current.values[4].value
      let temperatura = odpowiedz.current.values[5].value
      let info = odpowiedz.current.indexes[0].advice
	  let desc = odpowiedz.current.indexes[0].description
      res.render('index',{pm1:pm1,pm25:pm25,pm10:pm10,cisnienie:cisnienie,wilgotnosc:wilgotnosc,temperatura:temperatura,info:info,desc:desc,error:null})}
    }
  })
})

app.listen(3000,function(){
  console.log('Listening on port 3000..')
})

