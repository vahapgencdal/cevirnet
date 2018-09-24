var express = require('express');
var router = express.Router();
var request = require('request');

var contactDBModel = require('../models/contact.js');
var contact = new contactDBModel.Schema("contact").model;
var contactPageDBModel = require('../models/contactPage.js');
var contactpage = new contactPageDBModel.Schema("contactpage").model;


/*
       let contactP = new contactpage({
           "icon" : "images/mobileLogo.png",
           "title" : "content",
           "content" :  "content"
       });

            contactP.save(function(error) {
                res.send("sayfa bilgileri başarılı bir şekilde kaydedildi."); 
            if (error) {
                res.send(error ); 
             }
            });
   */
router.get('/', function(req, res) {
    try {
        contactpage.findOne({}, function(err, contactContent) {
            if (err) {
                res.send({ errorCode: 3, result: [], errorMessage: err });
            } else {
                res.render('contact', {
                    icon: contactContent.icon,
                    header: contactContent.title,
                    body: contactContent.content,
                    page: 'contact'
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.render("contact", {
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});

router.get('/all', function(req, res) {
    try {
        contact.find({}, function(err, contactMessageList) {
            if (err) {
                res.send({ errorCode: 3, result: [], errorMessage: err });
            } else {
                res.send({ errorCode: 0, result: contactMessageList, errorMessage: "Contact Message Basarili" });
            }
        });
    } catch (e) {
        console.log(e);
        res.send({ errorCode: 0, result: [], errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi' });
    }
});

router.post('/iAmNotRobot', function(req, res) {
    try {
        if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({ "responseCode": 1, "responseDesc": "Lütfen robot olmadığınızı doğrulayınız!" });
        }


        // Put your secret key here.
        var secretKey = "6LeD-CoUAAAAAFU522E7ope2YR0gQuY64g_stsjL";
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl, function(error, response, body) {
            body = JSON.parse(body);

            // Success will be true or false depending upon captcha validation.
            if (body.success !== undefined && !body.success) {
                return res.json({ "responseCode": 1, "responseDesc": "Robot testinden başarıyla geçemediniz.Tekrar deneyiniz!" });
            }
            res.json({ "responseCode": 0, "responseDesc": "Sucess" });

        });
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 0,
            result: {},
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi',
            responseCode: 1,
            responseDesc: "Robot testinden başarıyla geçemediniz.Tekrar deneyiniz!"
        });
    }
});

router.post('/add', function(req, res) {
    try {
        let message = req.body.message;
        let email = req.body.email;
        let userName = req.body.userName;

        let contactMessage = new contact({
            "email": email,
            "userName": userName,
            "message": message
        });

        if (email != null) {
            contactMessage.save(function(error) {
                res.send("mesajınız başarılı bir şekilde gönderildi. En kısa zamanda dönüş yapılacaktır.");
                if (error) {
                    res.send(error);
                }
            });
        } else {
            res.send("Lütfen Email alanını doldurunuz !");
        }
    } catch (e) {
        console.log(e);
        res.send({ errorCode: 0, result: {}, errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi' });
    }
});


router.post('/addContactPageContent', function(req, res) {
    try {
        let title = req.body.title;
        let content = req.body.content;
        let icon = req.body.icon;

        let contactPageContent = new contactpage({
            "title": title,
            "content": content,
            "icon": icon
        });

        if (content != null) {
            contactPageContent.save(function(error) {
                res.send("İletişim sayfası içeriği başarılı bir şekilde kaydedildi.");
                if (error) {
                    res.send(error);
                }
            });
        } else {
            res.send("content is NULL");
        }
    } catch (e) {
        console.log(e);
        res.send({ errorCode: 0, result: {}, errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi' });
    }
});


module.exports = router;