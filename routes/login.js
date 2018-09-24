var express = require('express');
var router = express.Router();
var userDBModel = require('../models/user');
var user = new userDBModel.Schema("user").model;
var crypt = require('../utils/crypt');
var config = require('../utils/config');


const passport = require('passport');

router.get('/', function(req, res) {
    res.render('login', { errorCode: 0, result: "", errorMessage: 'SUCCESS' });
});






router.post('/encryptpass', function(req, res) {
    let password = crypt.encryptAes(req.body.upass, config.session_secret);
    res.send(password);
});
router.post('/decryptpass', function(req, res) {
    let password = crypt.decryptAes(req.body.upass, config.session_secret);
    res.send(password);
});

router.post('/', function(req, res) {

    let uname = req.body.uname;
    let upass = req.body.upass;

    user.findOne({ username: uname }, function(err, userContent) {
        if (err) {
            res.send({ errorCode: 5, result: "Kullanıcı Bulunamadı", errorMessage: err });
        } else {
            res.redirect('/admin/index?errorCode=0&result:"userContent"&errorMessage:"SUCCESS"');
        }
    });


    res.render('login', {
        errorCode: 'ERROR',
        result: "Hatalı  Giriş Yaptınız" + username + " " + password + " " + rememberme,
        errorMessage: 'ERROR'
    });
});
/*
router.post('/add', function (req, res) {

    let username = req.body.uname;
    let password = req.body.upass;

    let userN = new user({
        username: username,
        password: password,
        email: "avahap19@gmail.com",
        roles:
            {
                role: "MODERATOR",
                perms: [
                    {
                        perm: 'ALL'
                    }
                ]
            }

    });

    userN.save(function(error) {
        res.send("ekleme yapıldı");
        if (error) {
            res.send(error );
        }
    });

});
*/
module.exports = router;