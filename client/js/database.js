const SERVER_URL = "http://localhost:3000/api/v1/sql/";
const makeRequest = (method, url, successHandler, errHandler) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && (xhr.status === 201 || xhr.status === 200)) {
      const response = JSON.parse(xhr.responseText);
      successHandler(response);
    }
    if (xhr.readyState === 4 && xhr.status !== 201 && xhr.status !== 200) {
      const response = JSON.parse(xhr.responseText);
      errHandler(response);
    }
  };
  xhr.send();
};

const errHandler = (response) => {
  alert(response.error);
  console.log(response);
};

const insertTable = () => {
  const query = `\"INSERT INTO patient (name, dateOfBirth) VALUES ('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01');\"`;
  const url = SERVER_URL + query;
  makeRequest(
    "POST",
    url,
    () => alert("Successfully inserted new patients"),
    errHandler
  );
};

const selectSuccessHandler = (response) => {
  const result = response.result;
  const container = document.getElementById("resultsContainer");
  container.innerHTML = "";
  result.map((data) => {
    container.innerHTML += JSON.stringify(data) + "<br>";
  });
};
/**
 * The selectPattern and insertPattern are taken from (https://chat.openai.com/)
 * to check if the user input is a select or insert statement
 */
const executeSQL = () => {
  const query = document.getElementById("sqlStatement").value;
  const url = SERVER_URL + `\"${query}\"`;
  const selectPattern = /select/i;
  if (selectPattern.test(query)) {
    makeRequest("GET", url, selectSuccessHandler, errHandler);
  }
  const insertPattern = /insert/i;
  if (insertPattern.test(query)) {
    makeRequest("POST", url, (res) => console.log(res), errHandler);
  }
  console.log(url);
};
