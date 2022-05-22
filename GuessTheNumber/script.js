"use strict";
let SecretNumber;
function createSecretNumber() {
  SecretNumber = Math.trunc(Math.random() * 21);
  console.log(SecretNumber);
}
createSecretNumber();

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);
  const text = document.querySelector(".message");

  if (!guess) text.textContent = "Enter A Number";
  else if (guess === SecretNumber) {
    text.textContent = "Congrats!!!You Found The Number";
    document.querySelector(".number").textContent = SecretNumber;
  }
});
