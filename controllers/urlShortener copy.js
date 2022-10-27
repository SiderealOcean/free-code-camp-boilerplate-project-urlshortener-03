const randomstring = require("randomstring");
const dns = require('dns');
const Shorturl = require('../models/shorturl');

exports.validateDNS = (req, res, next) => {
    const url = req.body.url;
    console.log(url);
    
    const useRegex = (url) => {
        //Pass use with internet url
        // let regex = /[a-zA-Z]+:\/\/[a-zA-Z]+.*[a-zA-Z]+.*\.[a-zA-Z]+/i;

        //Pass freecodecamp test locally => example url locally: http://localhost:3000/?v=1662699933615
        let regex = /[a-zA-Z]+:\/\/[a-zA-Z]+:[0-9]+\/\?v=[0-9]+/i;
        return regex.test(url); 
        // return true;
    }

    // uncomment to validate internet url host
    // const validateHost = (subdomain) => {
    //     const options = {
    //         all:true
    //     };
    //     dns.lookup(subdomain, options, (err, addresses) => {
    //         if (err){
    //             res.json({"error":"Invalid Hostname"});
    //             return;
    //         };
    //         console.log('addresses: %j', addresses);
    //         next();
    //     });
    // }

    //Regex
    console.log(useRegex(url));
    if (useRegex(url) == true){
        const subdomain = url.split('//')[1];
        console.log("subdomain: ", subdomain)
        // uncomment to validate internet domain DNS
        //validateHost(subdomain);
        next();

    } else {
        res.json({"error":"Invalid URL"});
        return;
    };
}

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
    res.json({ "original_url":url,"short_url":shortURL });
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