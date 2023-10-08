class Dictionary {
  constructor() {
    this.dataStore = new Array();
  }

  /**
   * Adds a word and its description to the dictionary.
   * @param {string} word
   * @return {string} definition
   * @returns {boolean} true if word is added to the dictionary else false.
   */
  add({ word, definition }) {
    const inDataStore = this.dataStore.find((item) => item.word === word)
      ? true
      : false;
    if (inDataStore) {
      return false;
    } else {
      this.dataStore.push({ word, definition });
      return true;
    }
  }

  /**
   * Retrieves the definition of a word from the dictionary.
   * @param {string} word
   * @return {string} definition/empty string if word is not found.
   */
  get(word) {
    const item = this.dataStore.find((item) => item.word === word);
    if (!item) {
      return "";
    }
    return item.definition;
  }

  /**
   * Returns the number of entries in the dictionary.
   * @returns {number} number of entries in the dictionary.
   */
  getEntryCount() {
    return this.dataStore.length;
  }
}

module.exports = Dictionary;
