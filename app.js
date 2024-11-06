<<<<<<< HEAD
const http = require('http');
const fs= require('fs');
const url= require('url');
const path= require('path');
sendFile = function (reqObj, resObj) {
        let fileName = url.parse(reqObj.url,true);
        console.log(reqObj.url);
	//We add a parameter for the object
	if (fileName.pathname==="/"){
		fileName.pathname="/index.html"
	}
	else {
		fileName.pathname=fileName.pathname
	}
	console.log(fileName.pathname);

        fs.readFile("."+fileName.pathname,function(err, data){
		readData(err,data,fileName,resObj);
	});
};
//Function to get all types of file in different directories
function getContentType(x){
=======
>>>>>>> 29e809fd7626b62c4a7e9dab486724788bc8172c

