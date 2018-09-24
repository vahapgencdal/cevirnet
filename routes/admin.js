var express = require('express');
var router = express.Router();
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
var categoryDBModel = require('../models/category.js');
var category = new categoryDBModel.Schema("category").model;
var categoryMenuDBModel = require('../models/menuCategory.js');
var categoryMenu = new categoryMenuDBModel.Schema("menuCategory").model;
var aboutDBModel = require('../models/about.js');
var about = new aboutDBModel.Schema("about").model;
var contactPageDBModel = require('../models/contactPage.js');
var contactpage = new contactPageDBModel.Schema("contactpage").model;
var formidable = require('formidable');


var isAuthenticated = function(req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/admin');
};

module.exports = function(passport) {


    router.get('/QRCodeUrl', function(req, res) {
        if (!req.session.qrCodeSecret) {
            let secret = speakeasy.generateSecret({ length: 20 });
            console.log(secret.base32); // secret of length 20

            req.session.qrCodeSecret = secret;

            QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
                res.send(data_url) // get QR code data URL
            });
        } else {
            QRCode.toDataURL(req.session.qrCodeSecret.otpauth_url, function(err, data_url) {
                res.send(data_url) // get QR code data URL
            });
        }
    });

    router.post('/QRCodeUrlVerify', function(req, res) {

        let userToken = req.body.token; // Verify the token the user gives
        let secret = req.session.qrCodeSecret;
        let token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        console.log(token);
        console.log(userToken);
        if (token === userToken) {
            res.send({ token: token, userToken: userToken, result: true });
        } else {
            res.send({ token: token, userToken: userToken, result: false });
        }

    });
    /* GET login page. */
    router.get('/login', function(req, res) {
        //if user already authentacated redirect to home page
        if (req.isAuthenticated()) {
            res.redirect('/admin/home');
        } else {
            // Display the Login page with any flash message, if any
            res.render('login', { message: req.flash('message') });
        }
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/admin/home',
        failureRedirect: '/admin/login',
        failureFlash: true
    }));

    /* GET Registration Page */
    router.get('/signup', function(req, res) {
        res.render('register', { message: req.flash('message') });
    });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/admin/home',
        failureRedirect: '/admin/signup',
        failureFlash: true
    }));


    router.get('/home', isAuthenticated, function(req, res) {
        try {
            category.find({}, function(err, categoryList) {

                if (err) {
                    res.render('home', { user: req.user, categoryList: [], categoryMenuList: [] });
                } else {

                    categoryMenu.find(function(err, categoryMenuList) {
                        if (err) {
                            res.render('home', { user: req.user, categoryList: {}, categoryMenuList: {} });
                        } else {
                            res.render('home', { user: req.user, categoryList: categoryList, categoryMenuList: categoryMenuList });
                        }
                    }).sort({ orderNumber: 1 });
                }
            });
        } catch (e) {
            res.render('home', {
                user: req.user,
                categoryList: [],
                categoryMenuList: [],
                errorCode: 'ERROR',
                errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
            });
        }
    });

    router.post('/menuCategory/add', isAuthenticated, function(req, res) {
        try {
            let nameVal = req.body.name;
            let categoryIdVal = JSON.parse(req.body.categoryId);
            let statusVal = req.body.status;
            let orderNumberVal = req.body.orderNumber;

            let categoryMenuObj = new categoryMenu({
                name: nameVal,
                categoryId: categoryIdVal,
                status: statusVal,
                orderNumber: orderNumberVal
            });

            if (nameVal != null || categoryIdVal.length > 0) {
                categoryMenuObj.save(function(error) {
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

    router.post('/menuCategory/update', isAuthenticated, function(req, res) {
        try {
            let idVal = req.body.id;
            let nameVal = req.body.name;
            let categoryIdVal = JSON.parse(req.body.categoryId);
            let statusVal = req.body.status;
            let orderNumberVal = req.body.orderNumber;

            if (nameVal != null || idVal != '') {
                categoryMenu.update({ _id: idVal }, { name: nameVal, orderNumber: orderNumberVal, categoryId: categoryIdVal, status: statusVal }, function(error) {
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

    router.get('/menuCategory/all', isAuthenticated, function(req, res) {
        try {
            categoryMenu.find(function(err, categoryMenuList) {
                if (err) {
                    res.send({ errorCode: 3, result: [], errorMessage: err });
                } else {
                    res.send({ errorCode: 0, result: categoryMenuList, errorMessage: "Category Menu Basarili" });
                }
            }).sort({ orderNumber: 1 });
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: 'ERROR',
                errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
            });
        }
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //NOTE:buton tipini submit yaparsan ajax post yapsan bile URL'e get paramterelerini ekler
    /**
     * About sayfası Kısmı
     */
    router.post('/about/updatecontent', isAuthenticated, function(req, res) {
        try {
            var uuid = require('node-uuid'); //Unique ID
            var path = require('path'); //Path compiler
            var fs = require('fs'); //FileSystem

            var form = new formidable.IncomingForm();
            form.keepExtensions = false;
            form.maxFieldsSize = 5 * 1024 * 1024; //5mb

            form.parse(req, function(err, fields, files) {
                if (files.file === undefined || fields.title === "" || fields.content === "") {
                    res.send({ errorCode: 7, result: "ERROR", errorMessage: "Eksik Bilgi Girdiniz" });
                } else {
                    fs.readFile(files.file.path, function(err, data) {
                        const pathWrite = process.cwd() + '\\public\\images\\' + files.file.name;
                        const pathRead = 'images/' + files.file.name;
                        fs.writeFile(pathWrite, data, function(err) {
                            if (err) {
                                res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                            } else {
                                let aboutP = new about({
                                    "icon": pathRead,
                                    "title": fields.title,
                                    "content": fields.content
                                });
                                about.findOne({}, function(err, aboutContent) {
                                    if (err) {
                                        res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                                    } else {
                                        if (aboutContent != null) {
                                            let upsertData = aboutP.toObject();
                                            delete upsertData._id;
                                            about.update({ _id: aboutContent._id.toString() }, upsertData, { upsert: true }, function(err) {
                                                if (err) {
                                                    res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                                                } else {
                                                    res.send({ errorCode: 5, result: "SUCCESS", errorMessage: "Başarılı Bir Şekilde Güncellendi" });
                                                }
                                            });
                                        } else {
                                            aboutP.save(function(error) {
                                                if (error) {
                                                    res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                                                } else {
                                                    res.send({ errorCode: 0, result: "SUCCESS", errorMessage: "Başarılı Bir Şekilde Güncellendi" });
                                                }
                                            });
                                        }

                                    }
                                });
                            }
                        });
                    });
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

    router.post('/contact/updatecontent', isAuthenticated, function(req, res) {
        try {
            var uuid = require('node-uuid'); //Unique ID
            var path = require('path'); //Path compiler
            var fs = require('fs'); //FileSystem

            var form = new formidable.IncomingForm();
            form.keepExtensions = false;
            form.maxFieldsSize = 5 * 1024 * 1024; //5mb

            form.parse(req, function(err, fields, files) {
                if (files.file === undefined || fields.title === "" || fields.content === "") {
                    res.send({ errorCode: 7, result: "ERROR", errorMessage: "Eksik Bilgi Girdiniz" });
                } else {
                    fs.readFile(files.file.path, function(err, data) {
                        const pathWrite = process.cwd() + '\\public\\images\\' + files.file.name;
                        const pathRead = 'images/' + files.file.name;
                        fs.writeFile(pathWrite, data, function(err) {
                            if (err) {
                                res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                            } else {
                                let contactPageContent = new contactpage({
                                    "title": fields.title,
                                    "content": fields.content,
                                    "icon": pathRead
                                });
                                contactpage.findOne({}, function(err, contactContent) {
                                    if (err) {
                                        res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                                    } else {
                                        if (contactContent !== null) {
                                            let upsertData = contactPageContent.toObject();
                                            delete upsertData._id;
                                            contactpage.update({ _id: contactContent._id.toString() }, upsertData, { upsert: true }, function(err) {
                                                if (err) {
                                                    res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                                                } else {
                                                    res.send({ errorCode: 5, result: "SUCCESS", errorMessage: "Başarılı Bir Şekilde Güncellendi" });
                                                }
                                            });
                                        } else {
                                            contactPageContent.save(function(error) {
                                                if (error) {
                                                    res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                                                } else {
                                                    res.send({ errorCode: 0, result: "SUCCESS", errorMessage: "Başarılı Bir Şekilde Güncellendi" });
                                                }
                                            });
                                        }

                                    }
                                });
                            }
                        });
                    });
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
    router.post('/category/saveorupdate', isAuthenticated, function(req, res) {
        try {
            var uuid = require('node-uuid'); //Unique ID
            var path = require('path'); //Path compiler
            var fs = require('fs'); //FileSystem

            var base64Data = "";

            if (req.body.file.indexOf("png") !== -1) {
                base64Data = req.body.file.replace(/^data:image\/png;base64,/, "");
            } else if (req.body.file.indexOf("jpeg") !== -1) {
                base64Data = req.body.file.replace(/^data:image\/jpeg;base64,/, "");
            } else if (req.body.file.indexOf("svg") !== -1) {
                base64Data = req.body.file.replace(/^data:image\/svg+xml;base64,/, "");
            } else {
                res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
            }

            let category = req.body.category;
            let fileName = req.body.fileName;
            if (base64Data !== "") {
                var pathWrite = process.cwd() + '\\public\\images\\' + fileName;
                var pathRead = 'images/' + fileName;
                fs.writeFile(pathWrite, base64Data, 'base64', function(err) {
                    if (err) {
                        res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                    } else {
                        updateOrSaveCategory(category, pathRead, res);
                    }
                });
            } else {
                updateOrSaveCategory(category, "", res);
            }
        } catch (e) {
            console.log(e);
            res.json({
                errorCode: 'ERROR',
                errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
            });
        }
    });

    function updateOrSaveCategory(categoryFe, pathNew, res) {
        let categoryContent = new category({
            "name": categoryFe.name,
            "desc": categoryFe.desc,
            "icon": pathNew,
            subcategory: categoryFe.subcategory
        });
        if (categoryFe._id === "") {
            categoryContent.save(function(error) {
                if (error) {
                    res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                } else {
                    res.send({ errorCode: 0, result: "SUCCESS", errorMessage: "Başarılı Bir Şekilde Eklendi" });
                }
            });
        } else {
            let upsertData = categoryContent.toObject();
            delete upsertData._id;
            delete upsertData.cDate;
            if (pathNew === "") {
                delete upsertData.icon;
            }
            category.update({ _id: categoryFe._id }, upsertData, function(err) {
                if (err) {
                    res.send({ errorCode: 5, result: "ERROR", errorMessage: "Dosya Yüklemede Bir sorun oluştu" });
                } else {
                    res.send({ errorCode: 5, result: "SUCCESS", errorMessage: "Başarılı Bir Şekilde Güncellendi" });
                }
            });
        }
    }

    return router;
};