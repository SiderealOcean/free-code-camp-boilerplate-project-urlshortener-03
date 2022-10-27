const randomstring = require("randomstring");
const dns = require('dns');
const Shorturl = require('../models/shorturl');

exports.validateDNS = (req, res, next) => {

    // Test freeCodeCamp.org - ITEM 4: If you pass an invalid URL...
    // const url = ftp:/john-doe.invalidTLD
    // const newURL = new URL(url);
    // console.log(newURL)
    // print ftp://john-doe.invalidTLD
    //valid format, then the URL is filtered by protocol
    const hostname = (url) => {
        try {
            const newURL = new URL(url);
            if (newURL.protocol != "http:"){
                throw new Error("just https: protocol");
            }
            return newURL.hostname;

        } catch(err){
            if(err) {
               res.json({ "error": 'invalid url' });
               console.log(err)
            }
        }
    }

    const validateHost = (urlHostname) => {
        

        const options = {
            all:true
        };
        dns.lookup(urlHostname, options, (err, addresses) => {
            if (err){
                res.json({"error":"Invalid Hostname"});
                return;
            };
            console.log('addresses: %j', addresses);
            next();
        });
    }
    
    console.log(req.body.url);
    const urlHostname = hostname(req.body.url);
    // console.log(urlHostname);
    if (urlHostname) validateHost(urlHostname);

};

exports.postURL = (req, res, next) => {
    const url = req.body.url;
    const shortURL = randomstring.generate(6);
    const short = new Shorturl({
        url,
        shortURL
    });

    short
    .save()
    .then(result => {
        // console.log(result);
        req.url = url;
        req.shortURL = shortURL;
        next();
    })
    .catch(err => {
        console.log('Error guardar URL', err)
    });
};

exports.getURL = (req, res) => {
    const url = req.url;
    const shortURL = req.shortURL;
    res.json({ "original_url": url,"short_url":shortURL });
};

exports.getRedirect = (req, res) => {
    const generated = req.params.generated;
    // console.log(generated);
    // return;
    Shorturl.findOne({shortURL: generated})
    .then(result => {   
      if (!result) {
        return res.redirect('/');
      }
    //   console.log(result.url);
      res.redirect(result.url)
    })
    .catch(err => console.log(err));

}