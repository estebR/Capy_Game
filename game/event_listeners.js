//Function to call in main.js
function elementIDSListener(game){
    const gameStart = document.querySelector("#gameStart")
    const gameEnd = document.querySelector("#gameEnd")
    const start_button = document.querySelector("#start")
    const leaderboard_button = document.querySelector("#leaderboard_button")
    const custom_button = document.querySelector("#custom")
    const win_lose = document.querySelector("#gameWinLoseSpan")
    const score = document.querySelector("#gameEndScoreSpan")
    const leaderboard = document.querySelector("#leaderboard");
    const exit_leaderboard = document.querySelector("#exit_leaderboard")

   
    start_button.addEventListener("click",()=>{
        gameStart.style.display="none"
        game.scene.resume("scene-game")
    })
    
    leaderboard_button.addEventListener("click",()=>{
        console.log("Leaderboard button clicked");
        gameStart.style.display="none";
        leaderboard.style.display="block";

        
        })
    exit_leaderboard.addEventListener("click",()=>{
        
        leaderboard.style.display="none";
        gameStart.style.display="";
    })
    custom_button.addEventListener("click"),()=>{
        
    }
    

}

export default elementIDSListener;
