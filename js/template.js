function getSelectNameAndBlockTemplate() {
  return `
  <h2><br> Please select <br> a <span>name</span> and <br> a <span>vocabulary</span> block <br> to start the <br> game!</h2>
  <section class="input_space">
    <button onclick="showMenu()" type="button">go back</button>
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
      <button onclick="showMenu()" type="button">go back</button>
    </section>
  `;
}