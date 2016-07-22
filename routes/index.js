var express = require('express');
var router = express.Router();
const axios = require('axios')
const isURL = require('validator/lib/isURL')
const urlApi = 'https://www.googleapis.com/urlshortener/v1/url/'
const googleApiKey = process.env.GOOGLE_URL_SHORTENER_API_KEY

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/*', function(req, res, next) {
  let originalUrl = req.params[0]
  console.log(originalUrl)
  // set data for posting to google shorterner api
  let data = { longUrl: originalUrl }
  // set option configs for axios
  let params = { params: { key: googleApiKey }}
  // use validator library to check if email is valid
  if (isURL(originalUrl)) {
    // call the api
    axios.post(urlApi, data, params)
    .then(response => res.send({
      'original URL': originalUrl,
      'short URL': response.data.id
    }))
    .catch((response) => console.log(response))
  } else {
    res.send({
      error: "Wrong url format, make sure you have a valid protocol and real site."
    })
  }
});

module.exports = router;
