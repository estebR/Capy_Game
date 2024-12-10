/*
// Function to call in main.js
function elementIDSListener(game){
    //Start and end screens
    // Start and End screens
    const gameStart = document.querySelector("#gameStart");
    const gameEnd = document.querySelector("#gameEnd");
    

    // Start screen buttons
    const start_button = document.querySelector("#start");
    const leaderboard_button = document.querySelector("#leaderboard_button");
    const customize_button = document.querySelector("#customize_button");

    // Game end screen
    const winLoseSpan = document.querySelector("#gameWinLoseSpan");
    const scoreSpan = document.querySelector("#gameEndScoreSpan");    
    const restart = document.querySelector("#restart");
    // Leaderboard and customization
    const leaderboard = document.querySelector("#leaderboard");
    const customize = document.querySelector("#customize");

    // Exit buttons
    const exit_leaderboard = document.querySelector("#exit_leaderboard");
    const exitCustomizeButton = document.querySelector("#exit_customize");

    // Customize options
    const backgroundButton = document.querySelector("#background_button");
    const capybirdButton = document.querySelector("#capybird_button");

    // Customize screen layouts
    const customizeOptions = document.querySelector("#customize_options");
    const backgroundScreen = document.querySelector("#customize_background");
    const capybirdScreen = document.querySelector("#customize_capybird");



start_button.addEventListener("click",()=>{
    gameStart.style.display="none"
    game.scene.resume("scene-game")
})

leaderboard_button.addEventListener("click",()=>{
    console.log("Leaderboard button clicked");
    gameStart.style.display="none";
    leaderboard.style.display="block";

document.getElementById("restartButton").addEventListener("click", () => {
        console.log("Restart button clicked!");
        restartGame();
    });
    


    })

    // Function to fetch leaderboard data
    function fetchLeaderboard() {
    	fetch('/api/leaderboard')
        	.then(response => response.json())
        	.then(data => {
            		const leaderboard = document.querySelector("#leaderboard");
            		leaderboard.innerHTML = ""; // Clear existing entries
            		data.forEach((entry, index) => {
                		const row = document.createElement("div");
                		row.classList.add("row");
                		row.innerHTML = `
                    			<div class="name">${index + 1}. ${entry.player_name}</div>
                    			<div class="score">${entry.score}</div>
                		`;
                		leaderboard.appendChild(row);
            		});
        	})
        	.catch(err => console.error("Error fetching leaderboard:", err));
    }
    // Leaderboard button
    leaderboardButton.addEventListener("click", () => {
        console.log("Leaderboard button clicked");
	fetchLeaderboard();
        gameStart.style.display = "none";
        leaderboard.style.display = "block";
    });


    
exit_leaderboard.addEventListener("click",()=>{

    leaderboard.style.display="none";
    gameStart.style.display="flex";
})
customize_button.addEventListener("click",()=>{
    customize.style.display = "block";
    gameStart.style.display = "none";
    customizeOptions.style.display = "block";
    backgroundScreen.style.display = "none";
    capybirdScreen.style.display = "none";
})

capybirdButton.addEventListener("click", () => {
    customizeOptions.style.display = "none";
    backgroundScreen.style.display = "none";
    capybirdScreen.style.display = "flex";
});

// Background button in customize
backgroundButton.addEventListener("click", () => {
    customizeOptions.style.display = "none";
    backgroundScreen.style.display = "flex";
    capybirdScreen.style.display = "none";
});
exitCustomizeButton.addEventListener("click", () => {
    customize.style.display = "none";
    customizeOptions.style.display = "none";
    gameStart.style.display = "block";
});

//----------------------------The game end mechanics------------
restart.addEventListener("click", () => {
    game.scene.stop("scene-game")
    game.scene.start("scene-game")
    gameEnd.style.display="none"
    gameStart.style.display="block"
});
}

export default elementIDSListener;

*/
function elementIDSListener(game) {
    // Start and End screens
    const gameStart = document.querySelector("#gameStart");
    const gameEnd = document.querySelector("#gameEnd");
    

    // Start screen buttons
    const startButton = document.querySelector("#start");
    const leaderboardButton = document.querySelector("#leaderboard_button");
    const customizeButton = document.querySelector("#customize_button");

    // Game end screen
    const winLoseSpan = document.querySelector("#gameWinLoseSpan");
    const scoreSpan = document.querySelector("#gameEndScoreSpan");    
    const restart = document.querySelector("#restart");
    // Leaderboard and customization
    const leaderboard = document.querySelector("#leaderboard");
    const customize = document.querySelector("#customize");

    // Exit buttons
    const exitLeaderboardButton = document.querySelector("#exit_leaderboard");
    const exitCustomizeButton = document.querySelector("#exit_customize");

    // Customize options
    const backgroundButton = document.querySelector("#background_button");
    const capybirdButton = document.querySelector("#capybird_button");

    // Customize screen layouts
    const customizeOptions = document.querySelector("#customize_options");
    const backgroundScreen = document.querySelector("#customize_background");
    const capybirdScreen = document.querySelector("#customize_capybird");


    
    // Event listeners for each button


    // Start button
    startButton.addEventListener("click", () => {
	const userNameInput = document.querySelector("#username").value.trim();
	if (!userNameInput) {
		alert("Please enter a username to start the game.");
		return;
	}

	localStorage.setItem("player_name", userNameInput);// Save the username locally
	const gameScene = game.scene.getScene("scene-game");
        gameStart.style.display = "none";
        game.scene.resume("scene-game");

	if (gameScene.bgMusic && !gameScene.bgMusic.isPlaying) {
		gameScene.bgMusic.play();
	}
    });

// Function to fetch leaderboard data
    function fetchLeaderboard() {
    	fetch('/leaderboard')
        	.then(response => response.json())
        	.then(data => {
            		const leaderboard = document.querySelector("#leaderboard-rows");
            		leaderboard.innerHTML = ""; // Clear existing entries
            		data.forEach((entry, index) => {
                		const row = document.createElement("div");
                		row.classList.add("row");
                		row.innerHTML = `
                    			<div class="name">${index + 1}. ${entry.player_name}</div>
                    			<div class="score">${entry.score}</div>
                		`;
                		leaderboard.appendChild(row);
            		});
        	})
        	.catch(err => console.error("Error fetching leaderboard:", err));
    }
    // Leaderboard button
    leaderboardButton.addEventListener("click", () => {
        console.log("Leaderboard button clicked");
	fetchLeaderboard();
        gameStart.style.display = "none";
        leaderboard.style.display = "block";
    });


  
    // Exit leaderboard button
    exitLeaderboardButton.addEventListener("click", () => {
        leaderboard.style.display = "none";
        gameStart.style.display = "block";
    });

    // Customize button
    customizeButton.addEventListener("click", () => {
        customize.style.display = "block";
        gameStart.style.display = "none";
        customizeOptions.style.display = "block";
        backgroundScreen.style.display = "none";
        capybirdScreen.style.display = "none";
    });

    // Background button in customize
    backgroundButton.addEventListener("click", () => {
        customizeOptions.style.display = "none";
        backgroundScreen.style.display = "block";
        capybirdScreen.style.display = "none";
    });

    // Capybird button in customize
    capybirdButton.addEventListener("click", () => {
        customizeOptions.style.display = "none";
        backgroundScreen.style.display = "none";
        capybirdScreen.style.display = "block";

    });
 
    // Exit customize button
    exitCustomizeButton.addEventListener("click", () => {
        customize.style.display = "none";
        customizeOptions.style.display = "none";
        gameStart.style.display = "block";
        capybirdScreen.style.display="none";
        backgroundScreen.style.display="none";
    });
    //----------------------------The game end mechanics------------
    restart.addEventListener("click", () => {
        game.scene.stop("scene-game")
        game.scene.start("scene-game")
        gameEnd.style.display="none"
        gameStart.style.display="block"
    });

    return { gameStart, gameEnd, winLoseSpan, scoreSpan };
}

export default elementIDSListener;
