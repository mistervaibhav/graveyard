// caching the DOM //
var userScore = 0 ;
var computerScore = 0 ;

const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");

const scoreBoard_div = document.querySelector(".score-board");
const result_p = document.querySelector(".result > p");

const rock_div = document.getElementById("rock");
const paper_div = document.getElementById("paper");
const scissors_div = document.getElementById("scissors");
// caching done //

function getComputerChoice() {
  const choices = ["rock" , "paper" , "scissors"];
  const randomNumber = Math.floor(Math.random() * 3) ;
  return choices[randomNumber];
}

function win(userChoice , computerChoice) {
  userScore++;
  userScore_span.innerHTML = userScore ;
  computerScore_span.innerHTML = computerScore ;
  const smallUserWord = "user".fontsize(3).sub();
  const smallCompWord = "comp".fontsize(3).sub();
  const userChoiceDiv = document.getElementById(userChoice);
  result_p.innerHTML = ` ${userChoice} ${smallUserWord}  beats ${computerChoice}  ${smallCompWord} . You WIN ! 🔥 ` ;
  userChoiceDiv.classList.add("green-glow");
  setTimeout( () => userChoiceDiv.classList.remove("green-glow") , 300);

}

function lose(userChoice , computerChoice) {
  computerScore++;
  userScore_span.innerHTML = userScore ;
  computerScore_span.innerHTML = computerScore ;
  const smallUserWord = "user".fontsize(3).sub();
  const smallCompWord = "comp".fontsize(3).sub();
  const userChoiceDiv = document.getElementById(userChoice);
  result_p.innerHTML = ` ${userChoice} ${smallUserWord} loses to ${computerChoice} ${smallCompWord} . You LOSE ! 💩  ` ;
  userChoiceDiv.classList.add("red-glow");
  setTimeout( () => userChoiceDiv.classList.remove("red-glow") , 300);
}

function draw(userChoice , computerChoice) {
  const smallUserWord = "user".fontsize(3).sub();
  const smallCompWord = "comp".fontsize(3).sub();
  const userChoiceDiv = document.getElementById(userChoice);
  result_p.innerHTML = `${userChoice} ${smallUserWord}  equals ${computerChoice}  ${smallCompWord} . It's a DRAW! ` ;
  userChoiceDiv.classList.add("gray-glow");
  setTimeout( () => userChoiceDiv.classList.remove("gray-glow") , 300);
}

function game(userChoice) {
    const computerChoice = getComputerChoice();

    switch (userChoice + computerChoice) {
      case "rockscissors":
      case "paperrock":
      case "scissorspaper":
          win(userChoice , computerChoice);
          break;
      case "rockpaper":
      case "paperscissors":
      case "scissorsrock":
          lose(userChoice , computerChoice);
          break;
      case "rockrock":
      case "paperpaper":
      case "scissorsscissors":
          draw(userChoice , computerChoice);
          break;
    }
}


function main() {
  // adding event listeners //
  rock_div.addEventListener('click', function(){
  	game("rock");
  });

  paper_div.addEventListener('click', function(){
  	game("paper");
  });

  scissors_div.addEventListener('click', function(){
  	game("scissors");
  });
}

main();
