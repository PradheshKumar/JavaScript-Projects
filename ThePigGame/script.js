"use strict";
//ElementVariables
const diceBut = document.querySelector(".btn--roll");
const holdBut = document.querySelector(".btn--hold");
const newBut = document.querySelector(".btn--new");
const diceImg = document.querySelector(".dice");
const ScoreText = [
  document.getElementById("score--0"),
  document.getElementById("score--1"),
];
const CurrentScoreText = [
  document.getElementById("current--0"),
  document.getElementById("current--1"),
];
const Player = [
  document.querySelector(".player--0"),
  document.querySelector(".player--1"),
];

//Variables
let CurPlayer = 0;
let Score = [0, 0];
let CurrentScore = [0, 0];
//EventListners
diceBut.addEventListener("click", RollDice);
holdBut.addEventListener("click", Hold);
newBut.addEventListener("click", Reset);

//Start()
Display();
//Functions
function SwitchPlay() {
  Player[CurPlayer].classList.remove("player--active");
  if (CurPlayer === 0) CurPlayer = 1;
  else CurPlayer = 0;
  Player[CurPlayer].classList.add("player--active");
  Display();
}

function RollDice() {
  let random = Math.trunc(Math.random() * 6) + 1;
  diceImg.src = "dice-" + random + ".png";
  if (random === 1) {
    CurrentScore[CurPlayer] = 0;
    SwitchPlay();
  } else CurrentScore[CurPlayer] += random;
  Display();
}

function Hold() {
  Score[CurPlayer] += CurrentScore[CurPlayer];
  CurrentScore[CurPlayer] = 0;

  SwitchPlay();
  Display();
}

function Display() {
  for (let i = 0; i < 2; i++) {
    ScoreText[i].textContent = Score[i];
    CurrentScoreText[i].textContent = CurrentScore[i];
  }
}
function Reset() {
  CurPlayer = 0;
  Score = [0, 0];
  CurrentScore = [0, 0];
  Display();
}
