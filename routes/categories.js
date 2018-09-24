var express = require('express');
var router = express.Router();

var categoryDBModel = require('../models/category.js');
var category = new categoryDBModel.Schema("category").model;



/* GET categories listing. */
router.post('/', function(req, res) {
    try {
        let categoryId = JSON.parse(req.body.id);
        if (categoryId == 0) {
            category.find({}, function(err, categoryList) {
                if (err) {
                    res.send({ errorCode: 3, result: [], errorMessage: err });
                } else {
                    res.send({ errorCode: 0, result: categoryList, errorMessage: "Category Basarili" });
                }
            });
        } else if (categoryId == 1) {
            //TODO Special Algorithm
            category.find({}, function(err, categoryList) {
                if (err) {
                    res.send({ errorCode: 3, result: [], errorMessage: err });
                } else {
                    res.send({ errorCode: 0, result: categoryList, errorMessage: "Category Basarili" });
                }
            });
        } else if (categoryId == 2) {
            //TODO internet
            category.find({}, function(err, categoryList) {
                if (err) {
                    res.send({ errorCode: 3, result: [], errorMessage: err });
                } else {
                    res.send({ errorCode: 0, result: categoryList, errorMessage: "Category Basarili" });
                }
            });
        } else {
            //TODO :diğerleri uzunluk gibi bunlarda subcategorilerin getirilmesi yeterli
            category.find({ _id: { $in: categoryId } }, function(err, category) {
                if (err) {
                    res.send({ errorCode: 3, result: [], errorMessage: err });
                } else {
                    res.send({ errorCode: 0, result: category, errorMessage: "id Basarili" });
                }
            });
        }
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});
router.post('/subcategories', function(req, res) {
    try {
        let categoryId = req.body.id;
        if (categoryId != null) {
            category.findOne({ _id: categoryId}, function(err, category) {
                if (err) {
                    res.send({ errorCode: 3, result: [], errorMessage: err });
                } else {
                    res.send({ errorCode: 0, result: category.subcategory, errorMessage: "id Basarili" });
                }
            });
        } else {
            return { errorCode: 1, result: [], errorMessage: "id is NULL" }
        }
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }

});
/*
router.post('/add', function(req, res) {
    let categorym = new category({"name" : "Uzunluk",
    "desc" : "Uzunluk birimleri",
    "icon" : "length",
    "subcategory" : [ 
       
    ]
});

    categorym.save(function(error) {
        res.send("sayfa bilgileri başarılı bir şekilde kaydedildi.");
        if (error) {
            res.send(error);
        }
    });
       
});
*/
module.exports = router;