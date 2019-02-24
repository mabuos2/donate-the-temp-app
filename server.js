const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = '0bfd66e0a1f85e7f5f08b6e4e246ed37';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})



var CheckbookAPI = require("checkbook-api");
var Checkbook = new CheckbookAPI({
    api_key: 'd6aa2703655f4ba2af2a56202961ca86',
    api_secret: 'dXbCgzYBMibj8ZwuQMd2NXr6rtvjZ8',
    env: 'demo'
});


app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It is ${weather.main.temp}°F in ${weather.name}! A donation of $${weather.main.temp} has been donated from your bank account to the Environmental Defense Fund!`;
        res.render('index', {weather: weatherText, error: null});

        Checkbook.checks.sendDigitalCheck({
            name: 'Environmental Defense Fund',
            recipient: 'donations@edf.org',
            description: 'Donation Game',
            amount: Number(`${weather.main.temp}`),
        }, function (error, response) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Response:', response);
            }
        });
      }
    }
  });
})






app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})