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
 
function handleLogin(req, res) {
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', () => {
            console.log("Login form data received:", body);
 
            // Parse the URL-encoded body (form data)
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');
 
            if (!username || !password) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Invalid input' }));
                return;
            }
 
            // Query the database to validate the admin credentials
            db.query(
                'SELECT * FROM admin WHERE username = ? AND password = ?',
                [username, password],
                (err, results) => {
                    console.log("Database query results:", results);
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: 'Database query failed' }));
                        return;
                    }
 
                    if (results.length > 0) {
                        console.log("Login successful, serving Admin Dashboard...");
 
                        // Serve the admin dashboard HTML page directly after login
                        const filePath = path.join(__dirname, 'game', 'admin-dashboard.html');
                        fs.readFile(filePath, (err, data) => {
                            if (err) {
                                res.writeHead(404, { "Content-Type": "text/plain" });
                                res.end("404 Not Found");
                            } else {
                                res.writeHead(200, { "Content-Type": "text/html" });
                                res.end(data);
                            }
                        });
                    } else {
                        console.log("Invalid login credentials.");
                        res.writeHead(302, { Location: '/' });
                        res.end(); // Redirect back to login
                    }
                }
            );
        });
    }
}
 
 
function serveStaticFiles(req, res) {
    // Only serve static files for non-POST requests
    if (req.method === 'POST') return false;
 
    let filePath;
    if (req.url === '/') {
        filePath = path.join(__dirname, 'game', 'login.html'); // Serve login page
    } else {
        filePath = path.join(__dirname, 'game', req.url);
    }
 
    fs.readFile(filePath, (err, data) => {
        if (err) {
        console.error('Error serving file:', filePath);
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
 
function serveAdminDashboard(req, res) {
    if (req.url === '/admin-dashboard' && req.method === 'GET') {
        db.query('SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 10', (err, results) => {
            if (err) {
        console.error("Error fetching leaderboard:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Database query failed' }));
                return;
            }
        console.log("Leaderboard data:", results);  // Log the fetched leaderboard data
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results)); // Send leaderboard data
        });
        return true;
    }
    return false;
}
 
function handleAdminLeaderboard(req, res) {
    if (req.method === 'GET') {
        db.query('SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 10', (err, results) => {
            if (err) {
                console.error("Error fetching leaderboard:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: 'Database query failed' }));
                return;
            }
            console.log("Leaderboard data fetched from DB:", results); // Log the leaderboard data
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        });
    } else {
        res.writeHead(405, { "Content-Type": "application/json" }); // Method Not Allowed
        res.end(JSON.stringify({ error: 'Invalid method' }));
    }
}
 
 
function handleDeleteRecord(req, res) {
    if (req.url === '/delete-record' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', () => {
            console.log("Received data:", body);
 
            const params = new URLSearchParams(body);
            const player_name = params.get('player_name');
 
            if (!player_name) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid input" }));
                return;
            }
 
            console.log("Deleting player:", player_name);
 
            db.query('DELETE FROM leaderboard WHERE player_name = ?', [player_name], (err, result) => {
                if (err) {
                    console.error("Error deleting record:", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Failed to delete record" }));
                    return;
                }
 
                console.log(`Deleted records for player: ${player_name}`);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true })); // Respond with success
            });
        });
    } else {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid method" }));
    }
}
 
 
// Create the server
const server = http.createServer((req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`); // Log all requests
    if (req.url === '/' || req.url === '/login') {
        handleLogin(req, res) || serveStaticFiles(req, res);
    } else if (req.url === '/admin-dashboard') {
        serveAdminDashboard(req, res);
    } else if (req.url === '/admin-leaderboard') { // Explicitly handle /admin-leaderboard
        handleAdminLeaderboard(req, res);
    } else if (req.url === '/delete-record') {
        handleDeleteRecord(req, res);
    } else if (!handleAPI(req, res)) {
        serveStaticFiles(req, res);
    }
});
 
server.listen(80, () => {
    console.log("Server running on port 80");
});
