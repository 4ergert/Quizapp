const BASE_URL = 'https://vocabularydb-d1be5-default-rtdb.europe-west1.firebasedatabase.app/';
let rendomIndexNum = 0;
let invaderHP = 300;
let spaceShipHP = 1000;
let spaceShipLVL = 1;
let spaceShipLVLup = 200;
let firebaseVocabulary;
let vocabularyCase = [];
let learnedVocabulary = [];

async function init() {
  firebaseVocabulary = "db1/";
  let vocabularyResponse = await loadData(firebaseVocabulary);

  let vocabularyArray = Object.keys(vocabularyResponse);
  for (let i = 1; i < vocabularyArray.length; i++) {
    vocabularyCase.push(
      {
        germenWord: vocabularyResponse[i].germenWord,
        englishWord: vocabularyResponse[i].englishWord
      }
    )
  }
  renderQuestion();
}

async function loadData(firebaseVocabulary) {
  let response = await fetch(BASE_URL + firebaseVocabulary + ".json");
  let vocabularyAsJSON = await response.json();
  return vocabularyAsJSON;
}

addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key === "Enter") {
    submitAnswer()
  }
});

async function renderQuestion() {
  let refGermanWord = document.getElementById('germanWord');
  let refMessage = document.getElementById('message');
  let refInvaderHP = document.getElementById('invaderHP');

  if (vocabularyCase.length == 0) {
    refInvaderHP.innerHTML = '';
    winSeq(refMessage);
    return;
  }
  rendomIndexNum = Math.floor(Math.random() * vocabularyCase.length);
  refGermanWord.innerHTML = vocabularyCase[rendomIndexNum].germenWord;
  renderHP()
}

function submitAnswer() {
  let refEnglishWord = document.getElementById('englishWord');
  let refShipShoot = document.getElementById('spaceShipShoot');
  let refInvaderShoot = document.getElementById('invaderShoot');
  let refMessage = document.getElementById('message');
  let refRightAnswer = document.getElementById('rightAnswer');

  refMessage.innerHTML = '';
  if (refEnglishWord.value == vocabularyCase[rendomIndexNum].englishWord) {
    spaceShipShoot(refShipShoot, refMessage, refRightAnswer);
    learnedVocabulary.push(vocabularyCase[rendomIndexNum]);
    vocabularyCase.splice(rendomIndexNum, 1)
  } else {
    invaderShoot(refInvaderShoot, refMessage, rendomIndexNum, refRightAnswer);
  }
  refEnglishWord.value = '';
}

function spaceShipShoot(shipShoot, refMessage, refRightAnswer) {
  refRightAnswer.innerHTML = '';
  shipShoot.classList.add('spaceship_shoot');
  shipShoot.style.animation = "shipShoot 0.5s ease-in";

  setTimeout(() => {
    shipShoot.classList.remove('spaceship_shoot');
    shipShoot.style.animation = "";
    refMessage.innerHTML = '!CORRECT!';
    invaderHP -= 100;
    if (invaderHP == 0) {
      lvlUP(refMessage);
    }
    renderQuestion();
  }, 600);
}

function invaderShoot(invaderShoot, refMessage, rendomIndexNum, refRightAnswer) {
  invaderShoot.classList.add('invader_shoot');
  invaderShoot.style.animation = "invaderShoot 0.5s ease-in";

  setTimeout(() => {
    invaderShoot.classList.remove('invader_shoot');
    invaderShoot.style.animation = "";
    refRightAnswer.innerHTML = `''${vocabularyCase[rendomIndexNum].germenWord}'' <br> heißt auf englisch:`
    refMessage.innerHTML = `${vocabularyCase[rendomIndexNum].englishWord}`;
    spaceShipHP -= 100;
    if (spaceShipHP == 0) gameOverSeq(refMessage, refRightAnswer);
    renderQuestion();
  }, 600);
}

function renderHP() {
  let refSpaceShipHP = document.getElementById('spaceShipHP');
  let refInvaderHP = document.getElementById('invaderHP');
  let refSpaceShipLVL = document.getElementById('spaceShipLVL')

  refSpaceShipHP.innerHTML = spaceShipHP + 'HP';
  refInvaderHP.innerHTML = `${vocabularyCase.length}00HP`;
  refSpaceShipLVL.innerHTML = 'LVL ' + spaceShipLVL;
}

function lvlUP(refMessage) {
  refMessage.innerHTML = 'LVL++';
  spaceShipHP += spaceShipLVLup;
  spaceShipLVL++;
  invaderHP = 300;
}

function gameOverSeq(refMessage, refRightAnswer) {
  let refSpaceShipSection = document.getElementById('spaceShipSection');

  refRightAnswer.innerHTML = '';
  refSpaceShipSection.setAttribute('style', 'display:none !important');
  refMessage.innerHTML = '<img src="./img/game_over.png" width="200px" alt="">'
  setTimeout(() => {
    refMessage.innerHTML = 'GAME OVER';
    setTimeout(() => {
      location.reload();
    }, 2000);
  }, 2000);
}

function winSeq(refMessage) {
  let refGermanQuestion = document.getElementById('germanQuestion');
  let refSubmit = document.getElementById('submitSection');

  refMessage.innerHTML = 'You Win!!!';
  refGermanQuestion.innerHTML = '!!!Hervoragend!!! <br> Push "Strg + R" to restart your training';
  refSubmit.style.display = 'none'
}