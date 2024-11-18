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
        fs.readFile("./game"+fileName.pathname,function(err, data){
                readData(err,data,fileName,resObj);
        });
};
//Function to get all types of file in different directories
function getContentType(x){

        switch(path.extname(x)){

        case ".html":
                return "text/html";

        case ".jpg":
                return "image/jpeg";
        case ".png":
                return "image/png";
        case ".wav":
                return "audio/wav";

        case ".mp3":
                return "audio/mpeg";

        case ".css":
                return "text/css";

        case ".js":
                return "text/javascript";

        case ".txt":
                return "text/plain";
	default:
		return "application/octet-stream";

        }
}
//Function to output the dat inside the file we are using
function readData(err,data,fileName,resObj){
        if (err) {
                        resObj.writeHead(404, {"Content-Type":"text/plain"});
                        resObj.write("404 not found");
                        resObj.end();
                }
        else{
                        resObj.writeHead(200,{"Content-Type":getContentType(fileName.pathname)});
                        resObj.write(data);
                        resObj.end();

                }
};
const myserver = http.createServer(sendFile); //create a server object
myserver.listen(3000, function() {console.log("Listening on port 80" )});
