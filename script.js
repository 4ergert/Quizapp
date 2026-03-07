const LIAMS_BASE_URL = 'https://vocabularydb-d1be5-default-rtdb.europe-west1.firebasedatabase.app/';
const ALIAS_BASE_URL = 'https://alias-vocabulary-8f745-default-rtdb.europe-west1.firebasedatabase.app/';
const ADD_VOCAB_PASSWORD = 'alpha';
const LAST_USED_NAME_STORAGE_KEY = 'lastUsedVocabularyName';
const LAST_USED_BLOCK_STORAGE_KEY_PREFIX = 'lastUsedVocabularyBlock';
let passwordWasCorrect = false;
let BASE_URL = '';
let selectedName = 'liam';
let rendomIndexNum = 0;
let invaderHP = 300;
let spaceShipHP = 1000;
let spaceShipLVL = 1;
let spaceShipLVLup = 200;
let firebaseVocabulary;
let vocabularyGroupWinCounts = {};
let vocabularyCase = [];
let learnedVocabulary = [];

window.addEventListener('DOMContentLoaded', async () => {
  setupExclusiveDropdownGroups();
  const lastUsedName = localStorage.getItem(LAST_USED_NAME_STORAGE_KEY);

  if (lastUsedName === 'liam' || lastUsedName === 'alia') {
    await selectName(lastUsedName, { moveToNextGroup: true });
    return;
  }

  await selectName('liam', { moveToNextGroup: false });
});

function setupExclusiveDropdownGroups() {
  const dropdownGroups = document.querySelectorAll('.dropdown_group');

  dropdownGroups.forEach((dropdown) => {
    dropdown.addEventListener('toggle', () => {
      if (!dropdown.open) {
        return;
      }

      dropdownGroups.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.open = false;
        }
      });
    });
  });
}

function goToNextDropdownGroup(currentIndex) {
  const dropdownGroups = document.querySelectorAll('.dropdown_group');
  const currentGroup = dropdownGroups[currentIndex];
  const nextGroup = dropdownGroups[currentIndex + 1];

  if (currentGroup) {
    currentGroup.open = false;
  }

  if (nextGroup) {
    nextGroup.open = true;
  }
}

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
  vocabularyCase = [];
  let vocabularyResponse = await loadData(firebaseVocabulary);

  if (!vocabularyResponse || typeof vocabularyResponse !== 'object') {
    await renderQuestion();
    return vocabularyCase;
  }

  let vocabularyArray = Object.keys(vocabularyResponse);
  for (let i = 0; i < vocabularyArray.length; i++) {
    const currentVocabulary = vocabularyResponse[vocabularyArray[i]];

    if (!currentVocabulary?.germenWord || !currentVocabulary?.englishWord) {
      continue;
    }

    vocabularyCase.push(
      {
        germenWord: currentVocabulary.germenWord,
        englishWord: currentVocabulary.englishWord
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

  incrementCurrentBlockWinCount().catch((error) => {
    console.error('Win-Count konnte nicht gespeichert werden:', error);
  });
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

async function selectName(name, options = { moveToNextGroup: true }) {
  let refLiamVocabulary = document.getElementById('liamVocabulary');
  let refAliaVocabulary = document.getElementById('aliaVocabulary');
  let refSummaryName = document.getElementById('summary_name');

  if (name === 'liam') {
    selectedName = 'liam';
    BASE_URL = LIAMS_BASE_URL;
    refSummaryName.innerHTML = 'Liam';
    refLiamVocabulary.style.backgroundColor = '#00ff00';
    refLiamVocabulary.style.fontWeight = 'bold';
    refAliaVocabulary.style.backgroundColor = '#d2d2d2';
    refAliaVocabulary.style.fontWeight = 'normal';
  } else if (name === 'alia') {
    selectedName = 'alia';
    BASE_URL = ALIAS_BASE_URL;
    let refSummaryName = document.getElementById('summary_name');
    refSummaryName.innerHTML = 'Alia';
    refAliaVocabulary.style.backgroundColor = '#00ff00';
    refAliaVocabulary.style.fontWeight = 'bold';
    refLiamVocabulary.style.backgroundColor = '#d2d2d2';
    refLiamVocabulary.style.fontWeight = 'normal';
  } else {
    return;
  }

  localStorage.setItem(LAST_USED_NAME_STORAGE_KEY, selectedName);

  await refreshVocabularyGroupButtons();

  if (options.moveToNextGroup) {
    goToNextDropdownGroup(0);
  }
}

function selectBlock(db) {
  let refSummaryBlock = document.getElementById('summary_vocabulary');

  let dbKey = db;
  if (/^block\d+$/i.test(db)) {
    dbKey = `db${db.replace(/\D/g, '')}`;
  }

  firebaseVocabulary = `${dbKey}/`;
  refSummaryBlock.innerHTML = getBlockLabel(dbKey);
  highlightSelectedBlockButton(dbKey);
  localStorage.setItem(getLastUsedBlockStorageKey(), dbKey);

  goToNextDropdownGroup(1);
}

async function refreshVocabularyGroupButtons() {
  const refGroupButtons = document.getElementById('vocabularyGroupButtons');
  if (!refGroupButtons || BASE_URL === '') {
    return;
  }

  try {
    const dbKeys = await fetchVocabularyDbKeysAndWinCounts();

    if (dbKeys.length === 0) {
      refGroupButtons.innerHTML = '<p>Noch kein Block vorhanden</p>';
      return;
    }

    refGroupButtons.innerHTML = dbKeys
      .map((dbKey) => `<button data-block-key="${dbKey}" onclick="selectBlock('${dbKey}')" type="button">${getBlockButtonContent(dbKey)}</button>`)
      .join('');

    const savedBlockKey = localStorage.getItem(getLastUsedBlockStorageKey());
    if (savedBlockKey && dbKeys.includes(savedBlockKey)) {
      firebaseVocabulary = `${savedBlockKey}/`;
      document.getElementById('summary_vocabulary').innerHTML = getBlockLabel(savedBlockKey);
    }

    const selectedDbKey = firebaseVocabulary?.replace('/', '');
    if (selectedDbKey) {
      highlightSelectedBlockButton(selectedDbKey);
    }
  } catch (error) {
    console.error('Vocabulary blocks konnten nicht geladen werden:', error);
  }
}

async function fetchVocabularyDbKeysAndWinCounts() {
  const response = await fetch(`${BASE_URL}.json`);
  const allData = await response.json();
  const allKeys = Object.keys(allData || {});
  vocabularyGroupWinCounts = {};

  allKeys.forEach((key) => {
    if (!/^db\d+$/.test(key)) {
      return;
    }

    const winCount = Number(allData?.[key]?._meta?.winCount || 0);
    vocabularyGroupWinCounts[key] = Number.isFinite(winCount) && winCount > 0 ? winCount : 0;
  });

  return allKeys
    .filter((key) => /^db\d+$/.test(key))
    .sort((a, b) => Number(a.replace('db', '')) - Number(b.replace('db', '')));
}

function getBlockLabel(dbKey) {
  return `Block ${dbKey.replace('db', '')}`;
}

function getLastUsedBlockStorageKey() {
  return `${LAST_USED_BLOCK_STORAGE_KEY_PREFIX}_${selectedName}`;
}

function getBlockButtonContent(dbKey) {
  const starCount = getBlockStarCount(dbKey);
  const starsHtml = Array.from({ length: starCount }, (_, index) => `<span class="block-star" style="--star-index:${index};">★</span>`).join('');
  const starLine = starCount > 0 ? `<br><span class="block-stars" aria-label="${starCount} Sterne">${starsHtml}</span>` : '';
  return `${getBlockLabel(dbKey)}${starLine}`;
}

function getBlockStarCount(dbKey) {
  const starCount = Number(vocabularyGroupWinCounts[dbKey] || 0);
  return Number.isFinite(starCount) && starCount > 0 ? starCount : 0;
}

async function incrementCurrentBlockWinCount() {
  const selectedDbKey = firebaseVocabulary?.replace('/', '');

  if (!selectedDbKey) {
    return;
  }

  const currentCountResponse = await fetch(`${BASE_URL}${selectedDbKey}/_meta/winCount.json`);
  const currentCountData = await currentCountResponse.json();
  const currentCount = Number(currentCountData || 0);
  const nextCount = (Number.isFinite(currentCount) ? currentCount : 0) + 1;

  await fetch(`${BASE_URL}${selectedDbKey}/_meta/winCount.json`, {
    method: 'PUT',
    body: JSON.stringify(nextCount),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  vocabularyGroupWinCounts[selectedDbKey] = nextCount;

  const currentButton = document.querySelector(`#vocabularyGroupButtons button[data-block-key="${selectedDbKey}"]`);
  if (currentButton) {
    currentButton.innerHTML = getBlockButtonContent(selectedDbKey);
  }
}

function highlightSelectedBlockButton(selectedDbKey) {
  const allBlockButtons = document.querySelectorAll('#vocabularyGroupButtons button[data-block-key]');
  allBlockButtons.forEach((button) => {
    const isSelected = button.dataset.blockKey === selectedDbKey;
    button.style.backgroundColor = isSelected ? '#00ff00' : '#d2d2d2';
    button.style.fontWeight = isSelected ? 'bold' : 'normal';
  });
}

async function createNextVocabularyBlock() {
  if (BASE_URL === '') {
    alert('Bitte zuerst Liam oder Alia waehlen.');
    return;
  }

  try {
    const dbKeys = await fetchVocabularyDbKeysAndWinCounts();
    const maxIndex = dbKeys.reduce((max, dbKey) => {
      const currentIndex = Number(dbKey.replace('db', ''));
      return currentIndex > max ? currentIndex : max;
    }, 0);

    const nextDbKey = `db${maxIndex + 1}`;
    const initialBlockPayload = {
      _meta: {
        createdAt: new Date().toISOString(),
        createdBy: `add-block-button-${selectedName}`,
        winCount: 0
      }
    };

    const createResponse = await fetch(`${BASE_URL}${nextDbKey}.json`, {
      method: 'PUT',
      body: JSON.stringify(initialBlockPayload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!createResponse.ok) {
      const errorBody = await createResponse.text();
      throw new Error(`HTTP ${createResponse.status}: ${errorBody}`);
    }

    await refreshVocabularyGroupButtons();
    selectBlock(nextDbKey);
  } catch (error) {
    console.error('Neuer Firebase-Block konnte nicht erstellt werden:', error);
    alert('Fehler beim Erstellen von db[n] in Firebase.');
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

//Levenshtein-Toleranz: <= 0 statt <= 1, da Google oft sehr passende Vorschläge macht, die sich aber in einem Buchstaben unterscheiden (z.B. "hause" statt "haus") - das soll dann nicht als Fehler gewertet werden
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
    const isVeryClose = levenshteinDistance(normalizedWord, firstSuggestion) <= 0;

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