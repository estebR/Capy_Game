//Function to call in main.js
function elementIDSListener(game){
    const gameStart=document .querySelector("#gameStart")
    const gameEnd=document .querySelector("#gameEnd")

    //sTART SCREEN BUTTONS
    const start_button=document .querySelector("#start")
    const leaderboard_button=document .querySelector("#leaderboard_button")
    const customize_button=document .querySelector("#customize_button")

    //Game end screen
    const win_lose=document .querySelector("#gameWinLoseSpan")
    const score=document .querySelector("#gameEndScoreSpan")
    //
    const leaderboard=document.querySelector("#leaderboard");
    const customize=document.querySelector("#customize");
    

    //Exit buttons for in screen
    const exit_leaderboard=document.querySelector("#exit_leaderboard")
    const exit_customize=document.querySelector("#exit_customize")

    //The buttons that are inside when initially clikc the 
    //Customize button
    const background_button=document.querySelector("#background_button")
    const capybird_button=document.querySelector("#capybird_button")

    //Screen/Layout when clicked buttons inside the Customize screen
    const customize_options=document.querySelector("#customize_options")
    const background_screen=document.querySelector("#customize_background")
    const capybird_screen=document.querySelector("#customize_capybird")

    //Event listnerser for each button
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
    customize_button.addEventListener("click",()=>{
        customize.style.display = "block";
        gameStart.style.display = "none";
        customize_options.style.display = "block";
        background_screen.style.display = "none";
        
    });
    background_button.addEventListener("click",()=>{
        gameStart.style.display = "none";
        customize.style.display = "block";
        customize_options.style.display = "none";
        background_screen.style.display="block" ; 

        capybird_screen.style.display="none"; 
    });
    capybird_button.addEventListener("click",()=>{
        gameStart.style.display = "none";
        customize.style.display = "block";
        customize_options.style.display = "none";

        background_screen.style.display="none"; 
        capybird_screen.style.display="block" ; 
    });
    
    exit_customize.addEventListener("click",()=>{
        customize.style.display="none";
        customize_options.style.display = "none";
        gameStart.style.display = "";
         
    });

}

export default elementIDSListener;
