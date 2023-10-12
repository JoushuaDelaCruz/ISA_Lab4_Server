require("dotenv").config();
const mysql = require("mysql2");

const _pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })
  .promise();

const execute = async (query) => {
  checkIfPatientTableExist();
  const [row] = await _pool.execute(query);
  return row;
};

const checkIfPatientTableExist = async () => {
  const query = `SHOW TABLES FROM ${process.env.DB_NAME} LIKE 'patient'`;
  const [row] = await _pool.execute(query);
  if (row.length === 0) return await createPatientTable();
  return;
};

const createPatientTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS patient (
      patientid INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      dateOfBirth DATETIME,
    )`;

  await _pool.execute(query);
};

module.exports = { execute };
