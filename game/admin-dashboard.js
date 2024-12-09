fetch('/admin-leaderboard') // Adjust endpoint if necessary
    .then(response => {
        console.log('Leaderboard response:', response);
        return response.json();
    })
    .then(data => {
        console.log('Leaderboard data:', data); // Log fetched data
        const leaderboard = document.getElementById('admin-leaderboard');
        leaderboard.innerHTML = ''; // Clear existing items
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.player_name}: ${item.score}`;
            leaderboard.appendChild(li);
        });
    })
    .catch(err => {
        console.error('Error fetching leaderboard:', err);
    });
