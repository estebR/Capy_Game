const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection with error handling
const db = mysql.createConnection({
    host: '35.196.44.64',
    user: 'nodeuser',
    password: 'nodeuser',
    database: 'game',
});
db.connect((err) => {
    if (err) {
        console.error("Failed to connect to the database:", err);
        process.exit(1);
    }
    console.log("Connected to the database.");
});

// Serve API responses
function handleAPI(req, res) {
    const url = req.url;
    if (url === '/leaderboard' && req.method === 'GET') {
        db.query('SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 10', (err, results) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Database query failed" }));
                return;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        });
    } else if (url === '/submit-score' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { playerName, score } = JSON.parse(body);
                if (!playerName || typeof score !== 'number') {
                    throw new Error("Invalid input");
                }

                db.query(
                    'INSERT INTO leaderboard (player_name, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = GREATEST(score, ?)',
                    [playerName, score, score],
                    (err) => {
                        if (err) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "Failed to update leaderboard" }));
                        } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ success: true }));
                        }
                    }
                );
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
    } else {
        return false;
    }
    return true;
}

// Serve static files
function serveStaticFiles(req, res) {
    const filePath = path.join(__dirname, 'game', req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
        } else {
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
            }[ext] || 'application/octet-stream';
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
}

// Create the server
const server = http.createServer((req, res) => {
    if (!handleAPI(req, res)) {
        serveStaticFiles(req, res);
    }
});

server.listen(80, () => {
    console.log("Server running on port 80");
});
