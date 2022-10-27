const express = require('express');
const router = express.Router();

const { validateDNS, postURL, getURL, getRedirect } = require('../controllers/urlShortener');


router.post('/shorturl/', validateDNS, postURL, getURL);

router.get('/shorturl/:generated', getRedirect);


module.exports = router;