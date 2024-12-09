const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Database connection
const db = mysql.createConnection({
    host: '35.196.44.64',
    user: 'nodeuser',
    password: 'nodeuser', // Replace with your database password
    database: 'game',
});

// Function to serve static files or API responses
function sendFile(reqObj, resObj) {
    const parsedUrl = url.parse(reqObj.url, true);
    const pathname = parsedUrl.pathname;

    // Check if the request is for an API endpoint
    if (pathname === '/leaderboard' && reqObj.method === 'GET') {
        // Handle GET /leaderboard
        db.query('SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 10', (err, results) => {
            if (err) {
                resObj.writeHead(500, { "Content-Type": "application/json" });
                resObj.end(JSON.stringify({ error: "Database query failed" }));
                return;
            }
            resObj.writeHead(200, { "Content-Type": "application/json" });
            resObj.end(JSON.stringify(results));
        });
    } else if (pathname === '/submit-score' && reqObj.method === 'POST') {
        // Handle POST /submit-score
        let body = '';
        reqObj.on('data', chunk => {
            body += chunk.toString();
        });
        reqObj.on('end', () => {
            const { playerName, score } = JSON.parse(body);
            if (!playerName || typeof score !== 'number') {
                resObj.writeHead(400, { "Content-Type": "application/json" });
                resObj.end(JSON.stringify({ error: "Invalid data format" }));
                return;
            }

            // Check if score qualifies for the leaderboard
            db.query('SELECT score FROM leaderboard ORDER BY score ASC LIMIT 1', (err, results) => {
                if (err) {
                    resObj.writeHead(500, { "Content-Type": "application/json" });
                    resObj.end(JSON.stringify({ error: "Database query failed" }));
                    return;
                }

                const lowestScore = results[0]?.score || 0;

                if (results.length < 10 || score > lowestScore) {
                    // Insert new score and remove the lowest if leaderboard has 10 entries
                    db.query(
                        'INSERT INTO leaderboard (player_name, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = GREATEST(score, ?)',
                        [playerName, score, score],
                        (insertErr) => {
                            if (insertErr) {
                                resObj.writeHead(500, { "Content-Type": "application/json" });
                                resObj.end(JSON.stringify({ error: "Failed to update leaderboard" }));
                                return;
                            }

                            if (results.length === 10) {
                                const deleteQuery = 'DELETE FROM leaderboard WHERE id NOT IN (SELECT id FROM (SELECT id FROM leaderboard ORDER BY score DESC LIMIT 10) AS topScores)';
                                db.query(deleteQuery, (deleteErr) => {
                                    if (deleteErr) {
                                        resObj.writeHead(500, { "Content-Type": "application/json" });
                                        resObj.end(JSON.stringify({ error: "Failed to trim leaderboard" }));
                                        return;
                                    }
                                    resObj.writeHead(200, { "Content-Type": "application/json" });
                                    resObj.end(JSON.stringify({ success: true }));
                                });
                            } else {
                                resObj.writeHead(200, { "Content-Type": "application/json" });
                                resObj.end(JSON.stringify({ success: true }));
                            }
                        }
                    );
                } else {
                    resObj.writeHead(200, { "Content-Type": "application/json" });
                    resObj.end(JSON.stringify({ message: "Score not high enough for leaderboard" }));
                }
            });
        });
    } else {
        // Serve static files for other requests
        let fileName = pathname === '/' ? '/index.html' : pathname;
        fs.readFile('./game' + fileName, (err, data) => {
            if (err) {
                resObj.writeHead(404, { "Content-Type": "text/plain" });
                resObj.end("404 Not Found");
            } else {
                resObj.writeHead(200, { "Content-Type": getContentType(fileName) });
                resObj.end(data);
            }
        });
    }
}

// Determine content type for static files
function getContentType(fileName) {
    const ext = path.extname(fileName);
    switch (ext) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        case '.mp3': return 'audio/mpeg';
        case '.wav': return 'audio/wav';
        default: return 'application/octet-stream';
    }
}

// Create the server
const server = http.createServer(sendFile);
server.listen(80, () => {
    console.log("Server running on port 80");
});
