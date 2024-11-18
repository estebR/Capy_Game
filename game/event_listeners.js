// Function to call in main.js
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
        gameStart.style.display = "none";
        game.scene.resume("scene-game");
    });

    // Leaderboard button
    leaderboardButton.addEventListener("click", () => {
        console.log("Leaderboard button clicked");
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
    });
}

export default elementIDSListener;
