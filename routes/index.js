var express = require('express');
var router = express.Router();
const isURL = require('validator/lib/isURL')
const ourUrl = 'https://kevin-url-shortener.herokuapp.com/'
const googleApiKey = process.env.GOOGLE_URL_SHORTENER_API_KEY
const Url = require('../models/url.js')
const shortid = require('shortid')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET new url. */
router.get('/new/*', function(req, res, next) {
  let originalUrl = req.params[0]

  // check for valid url
  if (!isURL(originalUrl)) {
    res.send({
      error: "Wrong url format, make sure you have a valid protocol and enter a real website."
    })
  }

  let randomId = shortid.generate()

  // find if shortId exist before
  Url.findOne({shortenId: randomId}).exec()
  .then((existingId) => {
    if(existingId) {
      return res.status(500).send({error: "Sorry our random generator is done the impossible and generate something that's not random. Please refresh and try again"})
    }
  })

  // save the new url with unique id
  const newUrl = new Url({
    originalUrl: originalUrl,
    shortenId: randomId
  })
  .save()
  .then((url) => {
    return res.send({
      original_url: url.originalUrl,
      shorten_url: `${ourUrl}${url.shortenId}`
    })
  })
});

module.exports = router;
