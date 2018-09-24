var express = require('express');
var router = express.Router();
var conttants = require("../utils/constants");

var menuCategoryDBModel = require('../models/menuCategory.js');
var menuCategory = new menuCategoryDBModel.Schema("menuCategory").model;

var categoryDBModel = require('../models/category.js');
var category = new categoryDBModel.Schema("category").model;

router.get('/', function(req, res) {
    try {
        menuCategory.find().sort({ categoryId: 1 })
            .then(function(menuCategories) {
                var result = {};
                return category.find().sort({ _id: 1 }).exec()
                    .then(function(categories) {
                        return { menuCategories: menuCategories, categories: categories, subcategories: categories[0].subcategory, page: 'index' };
                    });
            })
            .then(function(result) {
                res.charset = 'utf8';
                res.contentType('html');
                res.render("index", result);
            })
            .then(undefined, function(err) {
                console.log("Oops Bir hata oluştu : ");
                console.log(err);
            });
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});

router.post('/menuCategory/add', function(req, res) {
    try {
        let name = req.body.name;
        let categoryId = req.body.categoryId;

        console.log(name);
        let mc = new menuCategory({
            name: name,
            categoryId: categoryId,
            status: conttants.ACTIVE_RECORDS
        }, { versionKey: false });

        if (name != null || categoryId > 0) {
            mc.save(function(error) {
                res.send("Menu categorisi Başarılı bir şekilde eklendi.");
                if (error) {
                    res.send(error);
                }
            });
        } else {
            res.send("Menu Adı veya Categori Seçmediniz Lütfen Tekrar Deneyiniz");
        }
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }

});
router.post('/menuCategory/update', function(req, res) {
    try {
        let id = req.body.id;
        let name = req.body.name;
        let status = req.body.status;
        let categoryId = req.body.categoryId;
        if (name != null || categoryId > 0) {
            menuCategory.update({ categoryId: id }, { name: name, categoryId: categoryId, status: status }, function(error) {
                res.send("Menu categorisi Başarılı bir şekilde Güncellendi.");
                if (error) {
                    res.send(error);
                }
            });
        } else {
            res.send("Menu Adı veya Categori Seçmediniz Lütfen Tekrar Deneyiniz");
        }
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});

router.post('/menuCategory/findByName', function(req, res) {
    try {
        let name = req.body.name;
        menuCategory.find({ status: constants.ACTIVE_RECORDS, name: name }, function(err, categoryMenuList) {
            if (err) {
                res.send({ errorCode: 3, result: [], errorMessage: err });
            } else {
                res.send({ errorCode: 0, result: categoryMenuList, errorMessage: "Category Basarili" });
            }
        });
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});
router.get('/menuCategory/all', function(req, res) {
    try {
        menuCategory.find(function(err, categoryMenuList) {
            if (err) {
                res.send({ errorCode: 3, result: [], errorMessage: err });
            } else {
                res.send({ errorCode: 0, result: categoryMenuList, errorMessage: "Category Basarili" });
            }
        }).sort({ categoryId: 1 });
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});


router.post('/calculate', function(req, res) {
    try {
        if (req.body.leftUnit == 'undefined' || req.body.leftUnit == '' || req.body.leftUnit == null) {
            return res.json({ "responseCode": 1, "responseDesc": "lütfen ilk değer seçiniz!" });
        }

        if (req.body.leftUnitValue == 'undefined' || req.body.leftUnitValue == '' || req.body.leftUnitValue == null) {
            return res.json({ "responseCode": 1, "responseDesc": "ilk değer value boş geldi!" });
        }

        if (req.body.rightUnit == 'undefined' || req.body.rightUnit == '' || req.body.rightUnit == null) {
            return res.json({ "responseCode": 1, "responseDesc": "lütfen ikinci değer seçiniz!" });
        }

        if (req.body.rightUnitValue == 'undefined' || req.body.rightUnitValue == '' || req.body.rightUnitValue == null) {
            return res.json({ "responseCode": 1, "responseDesc": "ikinci değer value boş geldi!" });
        }

        if (req.body.valueToCalculate == 'undefined' || req.body.valueToCalculate == '' || req.body.valueToCalculate === null) {
            return res.json({ "responseCode": 1, "responseDesc": "Lütfen değer giriniz!" });
        }

        var returnValue = "";

        console.log(req.body.leftFirst);
        if (req.body.leftFirst) {
            returnValue = parseFloat(req.body.valueToCalculate) * (parseFloat(req.body.rightUnitValue) / parseFloat(req.body.leftUnitValue));
        } else {
            returnValue = parseFloat(req.body.valueToCalculate) * (parseFloat(req.body.leftUnitValue) / parseFloat(req.body.rightUnitValue));
        }

        res.send({ errorCode: 0, result: "Success", errorMessage: returnValue });
    } catch (e) {
        console.log(e);
        res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});

module.exports = router;