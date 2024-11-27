const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const url = require('url');
const path = require('path');

const connection = mysql.createConnection({
    host: '35.196.44.64',
    user: 'nodeuser',
    password: 'nodeuser',
    database: 'game',
    connectionLimit: 10
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

sendFile = function (reqObj, resObj) {
    let fileName = url.parse(reqObj.url, true);
    console.log(reqObj.url);
    // We add a parameter for the object
    if (fileName.pathname === "/") {
        fileName.pathname = "/index.html";
    } else {
        fileName.pathname = fileName.pathname;
    }
    fs.readFile(path.join(__dirname, 'game', fileName.pathname), function (err, data) {
        readData(err, data, fileName, resObj);
    });
};

// Function to get all types of file in different directories
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
            return "application/octet-stream";
    }
}

// Function to output the data inside the file we are using
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

// Create the server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/submit-score') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const { username, score } = JSON.parse(body);
            const query = 'INSERT INTO leaderboard (username, score) VALUES (?, ?)';
            connection.query(query, [username, score], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to insert score' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Score submitted successfully' }));
                }
            });
        });
    } else if (req.method === 'GET' && req.url === '/get-leaderboard') {
        const query = 'SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5';
        connection.query(query, (err, result) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch leaderboard' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
        });
    } else {
        sendFile(req, res); // For other routes, send the file (e.g., index.html)
    }
});

server.listen(80, function () {
    console.log("Listening on port 80");
});
