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

// Serve API responses for leaderboard and score submission
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
            console.log("Received data:", body);
            try {
                const { player_name, score } = JSON.parse(body);
                if (!player_name || typeof score !== 'number') {
                    throw new Error("Invalid input");
                }

                db.query(
                    'INSERT INTO leaderboard (player_name, score) VALUES (?, ?) ON DUPLICATE KEY UPDATE score = GREATEST(score, ?)',
                    [player_name, parseInt(score, 10), parseInt(score, 10)],
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

function serveStaticFiles(req, res) {
    // Check if the request is for the login page or the game page (index.html)
    let filePath = path.join(__dirname, 'game', req.url === '/' ? 'login.html' : req.url);

    // Check if the request is for a file in the /game directory (images, audio, js, css)
    if (req.url !== '/' && req.url.startsWith('/game')) {
        filePath = path.join(__dirname, 'game', req.url.replace('/game', ''));  // Strip '/game' prefix from URL
    }

    console.log("Requested URL:", req.url); // Log the requested URL
    console.log("File path being served:", filePath); // Log the file path being served

    // Read and serve the requested file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("File not found:", err); // Log any file reading errors
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

// Handle admin login (POST request)
function handleLogin(req, res) {
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            if (!username || !password) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Invalid input' }));
                return;
            }

            db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password], (err, results) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: 'Database query failed' }));
                    return;
                }

                if (results.length > 0) {
                    // Admin login successful, redirect to the admin dashboard
                    res.writeHead(302, { 'Location': '/admin-dashboard' });
                    res.end();
                } else {
                    // Invalid login, redirect back to login page
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                }
            });
        });
    }
}

// Serve the admin dashboard page
function serveAdminDashboard(req, res) {
    if (req.url === '/admin-dashboard') {
        db.query('SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 10', (err, results) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Database query failed' }));
                return;
            }

            let leaderboardHTML = results.map(player => `<li>${player.player_name}: ${player.score}</li>`).join('');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>Admin Dashboard</h1>
                <ul>${leaderboardHTML}</ul>
                <form action="/delete-record" method="POST">
                    <label for="score">Enter Score to Delete:</label>
                    <input type="number" name="score" id="score" required>
                    <button type="submit">Delete</button>
                </form>
            `);
        });
    }
}

// Handle leaderboard record deletion
function handleDeleteRecord(req, res) {
    if (req.url === '/delete-record' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { score } = JSON.parse(body);
            db.query('DELETE FROM leaderboard WHERE score = ?', [score], (err, result) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: 'Failed to delete record' }));
                    return;
                }

                res.writeHead(302, { 'Location': '/admin-dashboard' });
                res.end();
            });
        });
    }
}

// Create the server
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/login' || req.url === '/admin-dashboard') {
        handleLogin(req, res) || serveStaticFiles(req, res) || serveAdminDashboard(req, res) || handleDeleteRecord(req, res);
    } else if (!handleAPI(req, res)) {
        serveStaticFiles(req, res);
    }
});

server.listen(80, () => {
    console.log("Server running on port 80");
});
