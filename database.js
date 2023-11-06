import "dotenv/config";
import mysql from "mysql2";

const _pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
  })
  .promise();

const _execute = async (query) => {
  try {
    const [row] = await _pool.execute(query);
    return row;
  } catch (err) {
    throw err;
  }
};

export const queryEntryCount = async () => {
  const result = await _execute("SELECT COUNT(*) AS count FROM entry");
  return result[0].count;
};

export const queryLanguage = async () => {
  return await _execute("SELECT id, code, name FROM language");
};

export const insertDefinition = async (entry) => {
  try {
    const { word, definition, word_language, definition_language } = entry;

    const query = `
      INSERT INTO entry (word, definition, word_language, definition_language)
      VALUES (?, ?, ?, ?)
  `;

    const result = await _pool.execute(query, [
      word,
      definition,
      word_language,
      definition_language,
    ]);

    return {
      success: result[0].affectedRows > 0,
      error: "",
    };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { success: false, error: "Entry already exists" };
    }
    return { success: false, error: err.sqlMessage };
  }
};

export const updateDefinition = async (entry) => {
  const { word, definition, word_language, definition_language } = entry;
  const query = `
    UPDATE entry
    SET definition = ?, word_language = ?, definition_language = ?
    WHERE word = ?
  `;

  const result = await _pool.execute(query, [
    definition,
    word_language,
    definition_language,
    word,
  ]);

  return { success: result[0].affectedRows > 0 };
};

export const queryDefinition = async (word) => {
  const query = `
    SELECT e.*, wl.name AS word_language, dl.name AS definition_language
    FROM entry AS e 
    JOIN language AS wl
    ON e.word_language = wl.id
    JOIN language as dl
    ON e.definition_language = dl.id
    WHERE word = ? 
    `;
  const result = await _pool.execute(query, [word]);
  return result[0][0];
};

export const deleteDefinition = async (word) => {
  const query = `
    DELETE FROM entry
    WHERE word = ?
  `;
  const result = await _pool.execute(query, [word]);
  return { success: result[0].affectedRows > 0 };
};
