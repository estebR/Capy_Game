fetch('/admin-dashboard-data')
    .then(response => response.json())
    .then(data => {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = data
            .map(player => `<li>${player.player_name}: ${player.score}</li>`)
            .join('');
    })
    .catch(error => console.error('Error fetching leaderboard data:', error));
