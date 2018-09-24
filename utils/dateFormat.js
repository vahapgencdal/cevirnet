
var format =exports.format = function(date , format){ 
	
  var o = { 
	"M+" : date.getMonth()+1, 
	"d+" : date.getDate(),    
	"h+" : date.getHours(),   
	"m+" : date.getMinutes(), 
	"s+" : date.getSeconds(), 
	"q+" : Math.floor((date.getMonth()+3)/3),
	"S" : date.getMilliseconds() 
  } 
  if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
  } 
  for(var k in o){
	if(new RegExp("("+ k +")").test(format)) {
		 format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
	}
  }
  return format; 
}

var getSmpFormatDate = exports.getSmpFormatDate = function(date,isFull){
	var pattern = "";
	if (isFull==true||isFull==undefined) {
		pattern = "dd-MM-yyyy hh:mm:ss";
	} else {
		pattern = "dd-MM-yyyy";
	}
	return getFormatDate(date,pattern);
}


exports.getSmpFormatNowDate = function(isFull){
	return getSmpFormatDate(new Date(),isFull);
}

exports.getSmpFormatDateByLong = function(l,isFull){
	return getSmpFormatDate(new Date(l),isFull);
}

exports.getFormatDateByLong = function(l,pattern){
	return getFormatDate(new Date(l),pattern);
}

var getFormatDate = exports.getFormatDate = function(date,pattern){
	if(date==undefined){
		date=new Date();
	}
	if(pattern==undefined){
		pattern="yyyy-MM-dd hh:mm:ss";
	}
	return format(date , pattern);
}