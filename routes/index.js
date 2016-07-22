var express = require('express');
var router = express.Router();
const isURL = require('validator/lib/isURL')
const ourUrl = 'https://kevin-url-shortener.herokuapp.com/'
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


/* GET home page. */
router.get('/*', function(req, res, next) {
  const shortenUrl = req.params[0]
  const originalUrl = Url.findOne({shortenId: shortenUrl}).exec()
  if (!originalUrl) {
    res.send({error: "There's no record of that shorten url on our database."})
  }

  originalUrl.then((url) => {
    if (url.originalUrl.includes('https://')) {
      return res.redirect(`${url.originalUrl}`)
    }
    if (url.originalUrl.includes('http://')) {
      return res.redirect(`${url.originalUrl}`)
    }
    return res.redirect(`https://${url.originalUrl}`)
  })
  .catch((err) => {
    res.status(500).send({error: 'Our database is off on holiday, please wait and try again later'})
  })
});

module.exports = router;
