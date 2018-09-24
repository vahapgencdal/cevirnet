var express = require('express');
var router = express.Router();
var aboutDBModel = require('../models/about.js');
var about = new aboutDBModel.Schema("about").model;
/* GET home page. */
router.get('/', function(req, res) {
    /*
    let aboutP = new about({
        "icon": "images/abautLogo.png",
        "title": "title",
        "content": "content"
    });

    aboutP.save(function(error) {
        res.send("sayfa bilgileri başarılı bir şekilde kaydedildi.");
        if (error) {
            res.send(error);
        }
    });
    */
    try {
        about.findOne({}, function(err, aboutContent) {
            if (err) {
                res.render({ errorCode: 3, result: { icon: "images/abautLogo.png", title: "", content: "" }, errorMessage: err });
            } else {
                res.render("about", {
                    icon: aboutContent.icon,
                    title: aboutContent.title,
                    content: aboutContent.content,
                    page: 'about',
                    errorCode: 'SUCCESS',
                    errorMessage: 'Başarılı'
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.render("about", {
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }

});


module.exports = router;