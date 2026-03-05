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

  explodeInvader();
  refMessage.innerHTML = 'You Win!!!';
  refGermanQuestion.innerHTML = '!!!Hervoragend!!! <br> Push "Strg + R" to restart your training';
  refSubmit.style.display = 'none'
}

function explodeInvader() {
  const refInvader = document.querySelector('.invader');
  const refInvaderImg = document.querySelector('.invader img');

  if (!refInvader || !refInvaderImg) {
    return;
  }

  refInvader.classList.add('invader_explode');
  refInvaderImg.classList.add('invader_explode_img');

  setTimeout(() => {
    refInvaderImg.style.visibility = 'hidden';
  }, 700);
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

  const canSaveVocabulary = await confirmSpellingWithGoogle(
    newVocabulary.germenWord,
    newVocabulary.englishWord
  );

  if (!canSaveVocabulary) {
    return;
  }

  await tryAndCatchToDatabase(newVocabulary, refMenuDialog, refGermenWordInput, refEnglishWordInput);
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

async function confirmSpellingWithGoogle(germanWord, englishWord) {
  const germanCheck = await checkGoogleSpelling(germanWord, 'de');
  const englishCheck = await checkGoogleSpelling(englishWord, 'en');
  const warningLines = [];

  if (!germanCheck.isLikelyCorrect && germanCheck.suggestion) {
    warningLines.push(`Deutsch: "${germanWord}" -> Vorschlag: "${germanCheck.suggestion}"`);
  }

  if (!englishCheck.isLikelyCorrect && englishCheck.suggestion) {
    warningLines.push(`English: "${englishWord}" -> suggestion: "${englishCheck.suggestion}"`);
  }

  if (warningLines.length === 0) {
    return true;
  }

  return confirm(
    `Moeglicher Rechtschreibfehler gefunden:\n\n${warningLines.join('\n')}\n\nTrotzdem speichern?`
  );
}

async function checkGoogleSpelling(word, languageCode) {
  const cleanedWord = word.trim();

  if (cleanedWord.length < 2) {
    return { isLikelyCorrect: true, suggestion: '' };
  }

  try {
    const suggestions = await fetchGoogleSuggestionsJsonp(cleanedWord, languageCode);

    if (suggestions.length === 0) {
      return { isLikelyCorrect: true, suggestion: '' };
    }

    const normalizedWord = cleanedWord.toLowerCase();
    const hasExactMatch = suggestions.some((entry) => normalizeSuggestion(entry) === normalizedWord);
    const hasCompletionMatch = suggestions.some((entry) => {
      const normalizedSuggestion = normalizeSuggestion(entry);
      return (
        normalizedSuggestion.startsWith(`${normalizedWord} `) ||
        normalizedSuggestion.startsWith(`${normalizedWord}-`) ||
        normalizedSuggestion.startsWith(`${normalizedWord}'`)
      );
    });

    const firstSuggestion = normalizeSuggestion(suggestions[0]);
    const isVeryClose = levenshteinDistance(normalizedWord, firstSuggestion) <= 1;

    if (hasExactMatch || hasCompletionMatch || isVeryClose) {
      return { isLikelyCorrect: true, suggestion: suggestions[0] };
    }

    return { isLikelyCorrect: false, suggestion: suggestions[0] };
  } catch (error) {
    console.warn('Google spelling check failed:', error);
    return {
      isLikelyCorrect: false,
      suggestion: 'Google-Pruefung nicht erreichbar'
    };
  }
}

function fetchGoogleSuggestionsJsonp(query, languageCode) {
  return new Promise((resolve, reject) => {
    const callbackName = `googleSuggest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement('script');
    const timeoutMs = 4000;

    const cleanup = () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window[callbackName];
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Google JSONP timeout'));
    }, timeoutMs);

    window[callbackName] = (payload) => {
      clearTimeout(timeoutId);
      cleanup();

      const suggestions = Array.isArray(payload?.[1]) ? payload[1] : [];
      resolve(suggestions);
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      cleanup();
      reject(new Error('Google JSONP request failed'));
    };

    script.src = `https://suggestqueries.google.com/complete/search?client=chrome&hl=${languageCode}&q=${encodeURIComponent(query)}&callback=${callbackName}`;
    document.head.appendChild(script);
  });
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

function normalizeSuggestion(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, '');
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j < cols; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}