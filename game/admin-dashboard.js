function fetchAdminLeaderboard() {
    fetch('/leaderboard')  // Ensure this matches the correct endpoint
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch leaderboard:', response.statusText);
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log('Leaderboard data:', data);  // Log the fetched data

            const leaderboard = document.getElementById('admin-leaderboard');
            leaderboard.innerHTML = '';  // Clear existing entries

            // Check if data is an array
            if (Array.isArray(data)) {
                data.forEach((entry, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${index + 1}. ${entry.player_name}: ${entry.score}`;
                    leaderboard.appendChild(listItem);
                });
            } else {
                console.error('Leaderboard data is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching leaderboard data:', error));
}

// Call fetchLeaderboard when the page loads
window.onload = fetchLeaderboard;
