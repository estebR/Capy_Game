const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require("path")
//call back function

sendFile = function(req,res) {
        console.log(req.url)
        let fileName = url.parse(req.url, "true"); // Parse the URL to get the pathname (file path requested by the user)
            if (fileName.pathname === '/') {
        fileName.pathname = '/index.html'; // Set to load index.html
    }
        fs.readFile("public_html"+fileName.pathname,function (err, content){
        if (err) {
                return console.log(err)
        }
        sendBack(res, 200, determineContent(fileName.pathname),content)
});}


const myserver = http.createServer(sendFile); //create a server object
myserver.listen(80, function() {console.log("Listening on port 80" );
});


// Function to send the response back to the client
function sendBack(res, statusCode, contentType, content) {
        res.writeHead(statusCode, {"Content-Type": contentType});
        res.write(content);
        res.end();
}
// Function to determine the content type based on the file extension
function determineContent(x) {
        switch(path.extname(x)){

                case ".jpg":
                        return "image/jpeg";
                case ".png":
                        return "image/png";
                case ".html":
                        return "text/html";
                case ".txt":
                        return "text/plain";
                case ".mp3":
                        return "audio/mpeg";
                case ".wav":
                        return "audio/wav";
                case ".js":
                        return "text/javascript";
                case ".css":
                        return "text/css";
}}