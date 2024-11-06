Hamza
Updated upstream


const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Serve files from the 'dist' directory
sendFile = function (reqObj, resObj) {
    let fileName = url.parse(reqObj.url, true);
    console.log("Request for:", reqObj.url);

    // Serve 'index.html' for the root route
    if (fileName.pathname === "/") {
        fileName.pathname = "/index.html";
    }

    // Construct file path
    const filePath = "./dist" + fileName.pathname;

    // Check if the file exists
    fs.exists(filePath, function (exists) {
        if (!exists) {
            // If file not found, fallback to 'index.html' for SPA routes
            fs.readFile("./dist/index.html", function (err, data) {
                readData(err, data, { pathname: "/index.html" }, resObj);
            });
        } else {
            // Read the requested file
            fs.readFile(filePath, function (err, data) {
                readData(err, data, fileName, resObj);
            });
        }
    });
};

// Determine the content type based on file extension
function getContentType(x) {
    switch (path.extname(x)) {
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
            return "application/octet-stream"; // Default content type
    }
}

// Respond with the file data or a 404 error
function readData(err, data, fileName, resObj) {
    if (err) {
        resObj.writeHead(404, { "Content-Type": "text/plain" });
        resObj.write("404 not found");
        resObj.end();
    } else {
        resObj.writeHead(200, { "Content-Type": getContentType(fileName.pathname) });
        resObj.write(data);
        resObj.end();
    }
}

const myserver = http.createServer(sendFile); // Create a server object
myserver.listen(80, function () {
    console.log("Listening on port 80");
});

Stashed changes

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
        fs.readFile("."+fileName.pathname,function(err, data){
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
myserver.listen(80, function() {console.log("Listening on port 80" )});
main
