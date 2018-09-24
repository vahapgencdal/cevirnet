var fs=require("fs"),
	http=require("http"),
	url=require("url"),
	path=require("path"),
    fileHandle= require("./mime"),
	util=require('util'),
    dateUtil=require("./dateFormat");
var mime=fileHandle.mime,
fileType = fileHandle.fileInfo;


var root=__dirname;
if(!path.existsSync(root)){
	util.error(root);
	process.exit();
}

exports.listDirectory= function (parentDirectory,req,res){
	fs.readdir(parentDirectory,function(error,files){
          formatBody(parentDirectory,files,req,res);
	});

}


exports.showFile= function (filePath,req,res){
//	fs.readFile(filePath,'binary',function(err,filePath){
//		var contentType=mime.lookupExtension(path.extname(filePath));
//		res.writeHead(200,{
//			"Content-Type":contentType,
//			"Content-Length":Buffer.byteLength(filePath,'binary'),
//			"Server":"NodeJs("+process.version+")"
//		});
//		res.write(filePath,"binary");
//		res.end();
//	})

//    require('path').exists(userFile, function(exists) {
//        console.log("exists: ", exists);
//        if (exists) {
//            fs.readFile(userFile, "binary", function(err, data) {
//                res.writeHead(200, {"Content-Type": "application/zip"});
//                res.write(data, "binary");
//                res.end();
//            });
//        }
//    });
        require('path').exists(filePath, function(exists) {
            console.log("exists: ", exists);
            if (exists) {
                var fileStream = fs.createReadStream(filePath);
                res.writeHead(200);
                fileStream.pipe(res);
                fileStream.on("end", function() {
                    res.end();
                })
            }
        });
    }

exports.urlParse= function (req){
    var pathName=url.parse(req.url).pathname.replace(/%20/g,' '),
        re=/(%[0-9A-Fa-f]{2}){3}/g;

    pathName=pathName.replace(re,function(word){
        var buffer=new Buffer(3),
            array=word.split('%');
        array.splice(0,1);
        array.forEach(function(val,index){
            buffer[index]=parseInt('0x'+val,16);
        });
        return buffer.toString('utf-8');
    });
    return pathName;
}
function ConvertFileSize(size){
    var result = "0KB";
    var filelength = size.toString().length;
    if (filelength < 3){
        result = size + "byte";
    }
    else if (filelength < 7){
        result = parseFloat(size / 1024).toFixed(2) + "KB";
    }
    else if (filelength < 10)
    {
        result = parseFloat(size / 1024 / 1024).toFixed(2) + "MB";
    }
    else if (filelength < 13)
    {
        result = parseFloat(size / 1024 / 1024 / 1024).toFixed(2) + "GB";
    }
    else{
        result = parseFloat(size / 1024 / 1024 / 1024 / 1024).toFixed(2) + "TB";
    }
    return result;
}
function  formatBody(parent,files,req,res){

 var fileInfo = {};
    fileInfo.arrFile=[];
    fileInfo.arrDirectory =[];
    fileInfo.isRoot=false;
    var filePath= exports.urlParse(req);
    console.log("filePath:"+filePath);
    if(filePath=='/file/'){
        fileInfo.isRoot=true;
    }
    files.forEach(function(val,index){
        console.log("val"+parent+val);
        var stat=fs.statSync(path.join(parent,val));
        if(stat.isDirectory(val)){
            val=path.basename(val);
            var directoryObj = {}
            directoryObj.url=filePath+val;
            directoryObj.name =val;
            directoryObj.create_date = "2013-01-23";
            directoryObj.createName="wcw";
            fileInfo.arrDirectory.push(directoryObj);
        }else{
            val=path.basename(val);
            var fileObj = {};
            fileObj.url= filePath+val;
            var extName = path.extname(fileObj.url);
            fileObj.isImage =fileType.isImage(extName) ;
            if(extName.toLowerCase()==".pdf"){
                fileObj.isPdf = true;
            }else{
                fileObj.isPdf = false;
            }
            fileObj.name=val;
            fileObj.create_date = dateUtil.getFormatDateByLong(stat.ctime,"yyyy-MM-dd hh:mm:ss");
            fileObj.createName="wcw";
            fileObj.size=ConvertFileSize(stat.size);
            fileInfo.arrFile.push(fileObj);
        }
    });
    res.render('./file/fileList.html',{fileList:fileInfo});
}
