const LIAMS_BASE_URL = 'https://vocabularydb-d1be5-default-rtdb.europe-west1.firebasedatabase.app/';
const ALIAS_BASE_URL = 'https://alias-vocabulary-8f745-default-rtdb.europe-west1.firebasedatabase.app/';
const ADD_VOCAB_PASSWORD = 'alpha';
let passwordWasCorrect = false;
let BASE_URL = '';
let rendomIndexNum = 0;
let invaderHP = 300;
let spaceShipHP = 1000;
let spaceShipLVL = 1;
let spaceShipLVLup = 200;
let firebaseVocabulary;
let vocabularyCase = [];
let learnedVocabulary = [];

async function init() {
  const refDialog = document.getElementById('menuDialog');
  if (BASE_URL == '' || firebaseVocabulary == undefined) {
    refDialog.innerHTML = getSelectNameAndBlockTemplate();
    return;
  }
  refDialog.style.display = 'none';
  await fetchAndRenderVocabulary();
}

async function fetchAndRenderVocabulary() {
  let vocabularyResponse = await loadData(firebaseVocabulary);

  let vocabularyArray = Object.keys(vocabularyResponse);
  for (let i = 0; i < vocabularyArray.length; i++) {
    vocabularyCase.push(
      {
        germenWord: vocabularyResponse[vocabularyArray[i]].germenWord,
        englishWord: vocabularyResponse[vocabularyArray[i]].englishWord
      }
    )
  }
  await renderQuestion();
  return vocabularyCase;
};


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

function selectName(name) {
  let refLiamVocabulary = document.getElementById('liamVocabulary');
  let refAliaVocabulary = document.getElementById('aliaVocabulary');

  if (name === 'liam') {
    BASE_URL = LIAMS_BASE_URL;
    refLiamVocabulary.style.backgroundColor = '#00ff00';
    refLiamVocabulary.style.fontWeight = 'bold';
    refAliaVocabulary.style.backgroundColor = '#d2d2d2';
    refAliaVocabulary.style.fontWeight = 'normal';
  } else if (name === 'alia') {
    BASE_URL = ALIAS_BASE_URL;
    refAliaVocabulary.style.backgroundColor = '#00ff00';
    refAliaVocabulary.style.fontWeight = 'bold';
    refLiamVocabulary.style.backgroundColor = '#d2d2d2';
    refLiamVocabulary.style.fontWeight = 'normal';
  }
}

function selectBlock(db) {
  let refBlock1 = document.getElementById('block1');
  let refBlock2 = document.getElementById('block2');

  if (db === 'block1') {
    firebaseVocabulary = "db1/";
    refBlock1.style.backgroundColor = '#00ff00';
    refBlock2.style.backgroundColor = '#d2d2d2';
    refBlock1.style.fontWeight = 'bold';
    refBlock2.style.fontWeight = 'normal';
  } else if (db === 'block2') {
    firebaseVocabulary = "db2/";
    refBlock2.style.backgroundColor = '#00ff00';
    refBlock1.style.backgroundColor = '#d2d2d2';
    refBlock2.style.fontWeight = 'bold';
    refBlock1.style.fontWeight = 'normal';
  }
}

function showMenu() {
  location.reload();
  let refMenuDialog = document.getElementById('menuDialog');
  refMenuDialog.style.display = 'flex';
}

async function showVocabulary() {
  let refMenuDialog = document.getElementById('menuDialog');
  if (BASE_URL == '' || firebaseVocabulary == undefined) {
    refMenuDialog.innerHTML = getSelectNameAndBlockTemplateToShowVocabulary();
    return;
  }
  await fetchAndRenderVocabulary();
  let vocabularyListHTML = '<h2>Vocabulary List</h2>';
  for (let i = 0; i < vocabularyCase.length; i++) {
    vocabularyListHTML += `${vocabularyCase[i].germenWord} - ${vocabularyCase[i].englishWord}<br>`;
  }
  refMenuDialog.innerHTML = vocabularyListHTML;
  refMenuDialog.innerHTML += getGoBackButtonTemplate();
}

function addVocabulary() {
  let refMenuDialog = document.getElementById('menuDialog');

  if (BASE_URL == '' || firebaseVocabulary == undefined) {
    refMenuDialog.innerHTML = getSelectNameAndBlockTemplateForAdd();
    return;
  }

  if (passwordWasCorrect == true) {
    refMenuDialog.innerHTML = getAddVocabularyTemplate();
    return;
  }
  refMenuDialog.innerHTML = getAddVocabularyPasswordTemplate();
}

function verifyAddVocabularyPassword() {
  let refMenuDialog = document.getElementById('menuDialog');
  let refPasswordInput = document.getElementById('addVocabularyPassword');
  if (!refPasswordInput) return;
  if (refPasswordInput.value !== ADD_VOCAB_PASSWORD) {
    refMenuDialog.innerHTML = getWrongPasswordTemplate();
    return;
  }
  refMenuDialog.innerHTML = getAddVocabularyTemplate();
  passwordWasCorrect = true;
}

async function addToDatabase() {
  let refMenuDialog = document.getElementById('menuDialog');
  let refGermenWordInput = document.getElementById('germenWordInput');
  let refEnglishWordInput = document.getElementById('englishWordInput');

  if (refGermenWordInput.value == '' || refEnglishWordInput.value == '') {
    refMenuDialog.innerHTML = getFillInBothFieldsTemplate();
    return;
  }

  let newVocabulary = {
    germenWord: refGermenWordInput.value,
    englishWord: refEnglishWordInput.value
  };
  tryAndCatchToDatabase(newVocabulary, refMenuDialog, refGermenWordInput, refEnglishWordInput);
}

async function tryAndCatchToDatabase(newVocabulary, refMenuDialog, refGermenWordInput, refEnglishWordInput) {
  try {
    await fetchToFirebase(newVocabulary);
    refMenuDialog.innerHTML = getVocabularyAddedSuccessfullyTemplate();
    refGermenWordInput.value = '';
    refEnglishWordInput.value = '';
    setTimeout(() => {
      addVocabulary();
    }, 1500);
  } catch (error) {
    console.error('Error:', error);
    refMenuDialog.innerHTML = getVocabularyAddFailedTemplate();
  }
}

async function fetchToFirebase(newVocabulary) {
  await fetch(BASE_URL + firebaseVocabulary + ".json", {
    method: 'POST',
    body: JSON.stringify(newVocabulary),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}