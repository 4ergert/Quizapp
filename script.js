const BASE_URL = 'https://vocabularydb-d1be5-default-rtdb.europe-west1.firebasedatabase.app/';
let rendomIndexNum = 0;
let invaderHP = 300;
let spaceShipHP = 1000;
let spaceShipLVL = 1;
let spaceShipLVLup = 200;
let vocabularyToBeLearnedCase = [];

function init() {
  loadData();
  renderQuestion();
}

async function loadData() {
  let response = await fetch(BASE_URL + ".json");
  let vocabulary = await response.json();

  console.log(vocabulary.db1[1].englishWort);
  
}

// for (let vocabularyIndex = 0; vocabularyIndex < vocabulary_db.length; vocabularyIndex++) {
//   vocabularyToBeLearnedCase.push(vocabulary_db[vocabularyIndex]);
// }

addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key === "Enter") {
    submitAnswer()
  }
});

function renderQuestion() {
  let refGermanWord = document.getElementById('germanWord');
  let refMessage = document.getElementById('message');
  let done = document.getElementById('done');

  if (vocabularyToBeLearnedCase.length == 0) {
    winSeq(refMessage);
    return;
  } 
  rendomIndexNum = Math.floor(Math.random() * vocabularyToBeLearnedCase.length);
  let germanWord = vocabularyToBeLearnedCase[rendomIndexNum].germenWord;

  refGermanWord.innerHTML = germanWord;
  renderHP()

  done.innerHTML = `Done: ${vocabulary_db.length - vocabularyToBeLearnedCase.length} / ${vocabulary_db.length}`;
}

function submitAnswer() {
  let refEnglishWord = document.getElementById('englishWord');
  let refShipShoot = document.getElementById('spaceShipShoot');
  let refInvaderShoot = document.getElementById('invaderShoot');
  let refMessage = document.getElementById('message');
  let refRightAnswer = document.getElementById('rightAnswer');

  refMessage.innerHTML = '';
  if (refEnglishWord.value == vocabularyToBeLearnedCase[rendomIndexNum].englishWord) {
    spaceShipShoot(refShipShoot, refMessage, refRightAnswer);
    vocabularyToBeLearnedCase.splice(rendomIndexNum, 1)
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
    refRightAnswer.innerHTML = `''${vocabularyToBeLearnedCase[rendomIndexNum].germenWord}'' <br> heißt auf englisch:`
    refMessage.innerHTML = `${vocabularyToBeLearnedCase[rendomIndexNum].englishWord}`;
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
  refInvaderHP.innerHTML = invaderHP + 'HP';
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