function getSelectNameAndBlockTemplate() {
  return `
  <h2><br> Please select <br> a <span>name</span> and <br> a <span>vocabulary</span> block <br> to start the <br> game!</h2>
  <section class="input_space">
    <button onclick="showMenu()" type="button">menu</button>
  </section>
  `;
}

function getSelectNameAndBlockTemplateForAdd() {
  return `
  <h2><br> Please select <br> a <span>name</span> and <br> a <span>vocabulary</span> block <br> to add new vocabulary to the database!</h2>
  <section class="input_space">
    <button onclick="showMenu()" type="button">menu</button>
  </section>
  `;
}

function getAddVocabularyTemplate() {
  return `
    <h2><br> Please add new <br> vocabulary to the <br> database!</h2>
    <section class="input_space">
      <label for="germenWord">Germen Word</label>
      <input id="germenWordInput" type="text">
      <label for="englishWord">English Word</label>
      <input id="englishWordInput" type="text">
      <button onclick="addToDatabase()" type="button">add to database</button>
      <button onclick="showMenu()" type="button">menu</button>
    </section>
  `;
}

function getAddVocabularyPasswordTemplate() {
  return `
    <h2><br> Please enter the <br> password to add <br> vocabulary!</h2>
    <section class="input_space">
      <label for="addVocabularyPassword">Password</label>
      <input id="addVocabularyPassword" type="password" autocomplete="off">
      <button onclick="verifyAddVocabularyPassword()" type="button">continue</button>
      <button onclick="showMenu()" type="button">menu</button>
    </section>
  `;
}

function getFillInBothFieldsTemplate() {
  return `
    <h2><br> Please fill in both fields! <br> Try again!</h2>
    <section class="input_space">
      <button onclick="addVocabulary()" type="button">menu</button>
    </section>
  `;
}

function getWrongPasswordTemplate() {
  return `
    <h2><br> Wrong password! <br> Access denied.</h2>
    <section class="input_space">
      <button onclick="showMenu()" type="button">menu</button>
      <button onclick="addVocabulary()" type="button">try again</button>
    </section>
  `;
}

function getVocabularyAddedSuccessfullyTemplate() {
  return `
    <h2><br> Vocabulary added successfully!</h2>
    <section class="input_space">
      😊
    </section>
  `;
}

function getVocabularyAddFailedTemplate() {
  return `
    <h2><br> Failed to add vocabulary! <br> Please try again later!</h2>
    <section class="input_space">
      😞
    </section>
  `;
}

function getGoBackButtonTemplate() {
  return `
    <section class="input_space">
      <button onclick="showMenu()" type="button">menu</button>
    </section>
  `;
}

function getSelectNameAndBlockTemplateToShowVocabulary() {
  return `
  <h2><br> Please select <br> a <span>name</span> and <br> a <span>vocabulary</span> block <br> to show the vocabulary list!</h2>
  <section class="input_space">
    <button onclick="showMenu()" type="button">menu</button>
  </section>
  `;
}