export class Schema {
  /**
   * @param {string} message
   */
  set message(message) {
    this._message = message;
  }

  /**
   * @param {string} error
   */
  set error(error) {
    this._error = error;
  }

  /**
   * @param {Entry} entry
   */
  set entry(entry) {
    this._entry = entry;
  }

  toJSON() {
    return {
      message: this._message,
      error: this._error,
      entry: this._entry,
    };
  }
}

export class Entry {
  constructor({ word, definition, word_language, definition_language } = {}) {
    this._word = word;
    this._definition = definition;
    this._word_language = word_language;
    this._definition_language = definition_language;
  }

  /**
   * @param {string} word
   */
  set word(word) {
    this._word = word;
  }

  /**
   * @param {string} definition
   */
  set definition(definition) {
    this._definition = definition;
  }

  /**
   * @param {number} word_language
   */
  set word_language(word_language) {
    this._word_language = word_language;
  }

  /**
   * @param {number} definition_language
   */
  set definition_language(definition_language) {
    this._definition_language = definition_language;
  }

  toJSON() {
    return {
      word: this._word || "",
      definition: this._definition || "",
      word_language: this._word_language || "",
      definition_language: this._definition_language || "",
    };
  }
}
