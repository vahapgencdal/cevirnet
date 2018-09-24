var express = require('express');
var router = express.Router();
var config = require('./../utils/config');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs'); //FileSystem
var categoryDBModel = require('../models/category.js');
var category = new categoryDBModel.Schema("category").model;

var speechNumbers = [
    { numbers: ["çeyrek", "ceyrek", "cerek", "0.25"], value: 0.25 },
    { numbers: ["yarım", "yarim", "yarm", "0.5"], value: 0.5 },
    { numbers: ["bi", "bir", "birr", "biir","ilk", "1"], value: 1 },
    { numbers: ["iki", "ikii", "ik", "iiki", "2"], value: 2 },
    { numbers: ["üç", "üc", "uc", "uç", "3"], value: 3 },
    { numbers: ["dürt", "düt", "dürr", "dürtt", "4"], value: 4 },
    { numbers: ["beş", "beşş", "beşt", "bes", "bess", "5"], value: 5 },
    { numbers: ["altı", "alt", "alti", "6"], value: 6 },
    { numbers: ["yedi", "yedii", "yed", "yeedi", "7"], value: 7 },
    { numbers: ["sekiz", "sekız", "sekz", "ekz", "8"], value: 8 },
    { numbers: ["dokuz", "dokz", "okuz", "dokız", "9"], value: 9 },
    { numbers: ["on", "onn", "10"], value: 10 },
    { numbers: ["yirmi", "yirm", "yirimi", "yimi", "20"], value: 20 },
    { numbers: ["otuz", "otz", "tuz", "30"], value: 30 },
    { numbers: ["kırk", "kık", "kırık", "kirk", "40"], value: 40 },
    { numbers: ["elli", "alli", "50"], value: 50 },
    { numbers: ["altmış", "altmis", "atmis", "almış", "almiş"], value: 60 },
    { numbers: ["yetmiş", "yetmis", "yetms", "yatmis", "70"], value: 70 },
    { numbers: ["seksen", "sekzen", "80"], value: 80 },
    { numbers: ["doksan", "dokzan", "90"], value: 90 },
    { numbers: ["yüz", "yuz"], value: 100 },
    { numbers: ["bin", "bın"], value: 1000 },
    { numbers: ["milyon", "milion", "millyon", "milyonn", "1000000"], value: 1000000 },
    { numbers: ["milyar", "millar", "milar", "miliar", "1000000000"], value: 1000000000 },
    { numbers: ["trilyon", "tirilyon", "tiriliyon", "1000000000"], value: 1000000000 },

];

var endfixes = [
    "dir", "dır", "dur", "dür", "dör", "dor", "dar", "der",
    "tir", "tır", "tur", "tür", "tör", "tor", "tar", "ter",
]

router.post('/record', function(req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = false;
    form.maxFieldsSize = 2 * 1024 * 1024; //2mb

    form.parse(req, function(err, fields, files) {

        // if(files.file===undefined||fields.title ===""|| fields.content===""){
        //     res.send({ errorCode: 7, result: "ERROR", errorMessage: "Eksik Bilgi Girdiniz"});
        // }else{

        //}


        const projectId = 'spech-tp-text';
        let file = "D:\\workspace\\ecevir\\CevirNet\\utils\\speechCredenticals.json";
        var speech = require('@google-cloud/speech')({
            projectId: projectId,
            keyFilename: file
        });
        //var pathNew = process.cwd() + '\\cookie\\audio.raw';

        //var binAudio = new Buffer(, 'base64');

        /* fs.writeFile(pathNew, binAudio, function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log("basarili");
                }
            });
*/
        //fs.readFile(pathNew, function (err, data) {
        // const fileof = fs.readFileSync(pathNew);
        // const audioBytes = fileof.toString('base64');
        const bs64Str = fields.file.replace("data:audio/wav;base64,", "");
        const decBase64 = new Buffer(bs64Str, 'base64').toString('utf-8');
        const audio = {
            content: decBase64
        };
        const config = {
            "encoding": "LINEAR16",
            "sampleRateHertz": 16000,
            "languageCode": "en-US",
        };
        const request = {
            audio: audio,
            config: config
        };
        speech.recognize(request)
            .then((results) => {
                const transcription = results[0].results[0].alternatives[0].transcript;
                console.log(`Transcription: `, transcription);
            })
            .catch((err) => {
                console.error('ERROR:', err);
            });





    });


    // Instantiates a client


    // Instantiates a client
    // const speech = Speech();
    // Your Google Cloud Platform project ID

    //const speechClient = Speech({
    //   projectId: projectId,
    //   keyFilename: file
    // });


    /**7
     *  var speech = require('@google-cloud/speech')({
        projectId: config.speechApiKey
        //keyFilename: '/config/KeyFile.json'
    });

     const request = {
        config: {
            encoding: 'LINEAR16',
            sampleRate: 16000,
            languageCode: 'tr-TR'
        },
        singleUtterance: false,
        interimResults: true
    };

     // Create a recognize stream
     const recognizeStream = speech.createRecognizeStream(request)
     .on('error', function (error) {
            console.log('Error');
            console.log(error)
        })
     .on('data', function (data) {
            console.log('Data');
            console.log(data);
        });

     // Send the microphone input to the Speech API
     stream.pipe(recognizeStream);

     stream.on('end', function () {
        fileWriter.end();
        recognizeStream.end();
        console.log('||| Audio stream ended');
    });
     */

});

router.post('/calculate', function(req, res) {
    try {
        const data=req.body.data;
        const dataArray = data.split(" ");
     if(dataArray.length===0){
         res.send({ "errorCode": "ERROR", "errorMessage": "Girdiğiniz Cümle Formatı yanlıştır", result: null });
     }else if(dataArray.length===1){
         if (dataArray[0] === "kaç" || dataArray[0] === "kac" || dataArray[0] === "gac" || dataArray[0] === "gaç") {
             let result = {
                 leftValue: ""
             };
             res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
         }else{
             let result = {
                 leftValue: findFirstNumber(dataArray[0])
             };
             res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
         }
     }else if(dataArray.length===2){
         if (dataArray[0] === "kaç" || dataArray[0] === "kac" || dataArray[0] === "gac" || dataArray[0] === "gaç") {
             let result = {
                 leftUnit: dataArray[1]
             };
             res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
         }else{
             res.send(findUnitName2Length(dataArray[1],dataArray[0]));
         }
     }else if(dataArray.length===3){
         if (dataArray[0] === "kaç" || dataArray[0] === "kac" || dataArray[0] === "gac" || dataArray[0] === "gaç") {
             res.send(findUnitName2Length(dataArray[1],dataArray[2]));
         }else{
             res.send(findUnitName2Length(dataArray[1],dataArray[0]));
         }
     }else if(dataArray.length===4){
         if (dataArray[0] === "kaç" || dataArray[0] === "kac" || dataArray[0] === "gac" || dataArray[0] === "gaç") {
             findUnitName4Length(dataArray[1],dataArray[3],dataArray[2],true,res);
         }else{
             findUnitName4Length(dataArray[1],dataArray[3],dataArray[0],false,res);
         }
     }else{
         res.send({ "errorCode": "ERROR", "errorMessage": "Girdiğiniz Cümle Formatı yanlıştır", result: null });
     }
    } catch(e) {
        console.log(e);
         res.json({
            errorCode: 'ERROR',
            errorMessage: 'Sistemsel bir hata nedeniyle işlem gerçekleştirilemedi'
        });
    }
});

function calculate(leftFirst, rightUnitValue, leftUnitValue, valueToCalculate) {
    if (leftFirst) {
        return parseFloat(valueToCalculate) * (parseFloat(rightUnitValue) / parseFloat(leftUnitValue));
    } else {
        return parseFloat(valueToCalculate) * (parseFloat(leftUnitValue) / parseFloat(rightUnitValue));
    }
}



function findFirstNumber(numberVal) {
    numberVal = numberVal.replace(",", ".");
    if (parseFloat(numberVal) !== NaN) {
        let speechValue = 0;
        speechNumbers.forEach(function(speechNumber) {
            if (speechNumber.numbers.includes(numberVal)) {
                speechValue = speechNumber.value;
            }
        });
        return speechValue;
    } else {
        return parseFloat(numberVal);
    }
}

function findUnitName2Length(unitName,firstVal,res){
    unitName=fixUnitName(unitName);
    category.find({}, function(err, categoryv) {
        if (err) {
            let result = {
                leftValue: findFirstNumber(firstVal),
                leftUnit: ""
            };
            res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
        } else {
            categoryv.forEach(function(categori) {
                categori.subcategory.forEach(function(subcategory) {
                    subcategory.units.forEach(function(unit) {
                        if (unit.name === unitName) {
                            let result = {
                                leftValue: findFirstNumber(firstVal),
                                leftUnit: unit!==null?unit.name:""
                            };
                            res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
                        }
                    });
                });
            });
        }
    });
}
function findUnitName4Length(leftUnitName,rightUnitName,firstVal,calcVal,res){
    leftUnitName=fixUnitName(leftUnitName);
    rightUnitName=fixUnitName(rightUnitName);

    category.find({}, function(err, categoryv) {
        if (err) {
            let result = {
                leftValue: calcVal?"":findFirstNumber(firstVal),
                leftUnit: "",
                rightUnit: "",
                rightValue: calcVal?findFirstNumber(firstVal):"",
            };
            res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
        } else {
            let leftUnitVal="";
            let rightUnitVal="";
            for (let z=0;z<categoryv.length;z++){
                for(let i=0;i<categoryv[z].subcategory.length;i++){
                    for(let j=0;j<categoryv[z].subcategory[i].units.length;j++){
                        if (categoryv[z].subcategory[i].units[j].name === leftUnitName) {
                            leftUnitVal=categoryv[z].subcategory[i].units[j].value;
                        }
                        if (categoryv[z].subcategory[i].units[j].name === rightUnitName) {
                            rightUnitVal=categoryv[z].subcategory[i].units[j].value;
                        }
                    }
                }
            }
            let resultValue = calculate(calcVal, leftUnitVal, rightUnitVal, findFirstNumber(firstVal));
            let result = {
                leftValue: calcVal?resultValue:firstVal,
                leftUnit: leftUnitName,
                rightUnit: rightUnitName,
                rightValue: (!calcVal)?resultValue:firstVal,
            };
            res.send({ "errorCode": "SUCCESS", "errorMessage": "Başarılı", result: result });
        }
    });
}

function fixUnitName(name){
    let rightUnitName = name.toLowerCase();
    rightUnitName = doLowerWithFirstCapital(rightUnitName);
    return deleteEndFix(rightUnitName);
}

function deleteEndFix(word) {
    let endFixOfWord = word.substring(word.length - 3, word.length);
    endfixes.forEach(function(endfix) {
        if (endFixOfWord === endfix) {
            word = word.substring(0, word.length - 3);
        }
    });
    return word;
}

function doLowerWithFirstCapital(word) {
    return word.toLowerCase().replace(word.substring(0, 1), word.substring(0, 1).toUpperCase());
}

module.exports = router;