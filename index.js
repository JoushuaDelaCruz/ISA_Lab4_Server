const http = require("http");
const url = require("url");
const Dictionary = require("./dictionary");
const PORT = process.env.PORT || 3000;
const dictionary = new Dictionary();

/**
 * Retrieves the definition of a word from the dictionary.
 * @param {url.UrlWithParsedQuery} parsedUrl
 * @param {http.ServerResponse} res
 */
const getWord = (parsedUrl, res) => {
  const { word } = parsedUrl.query;

  if (!word) {
    res
      .writeHead(400, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: "Word is missing" }));
    return;
  }

  const definition = dictionary.get(word);
  res
    .writeHead(200, { "Content-Type": "application/json" })
    .end(JSON.stringify({ word, definition }));
  return;
};

/**
 * Enters the word and definition into the dictionary.
 * @param {url.UrlWithParsedQuery} parsedUrl
 * @param {http.ServerResponse} res
 */
const postWord = (parsedUrl, res) => {
  const { word, definition } = parsedUrl.query;

  if (!word || !definition) {
    res
      .writeHead(400, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: "Word or definition is missing" }));
    return;
  }

  const result = dictionary.add({ word, definition });
  if (!result) {
    res
      .writeHead(409, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: "Word already exists" }));
    return;
  }
  res.writeHead(201, { "Content-Type": "application/json" }).end(
    JSON.stringify({
      totalEntries: dictionary.getEntryCount(),
      word,
      definition,
    })
  );
  return;
};

const listener = (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/api/definitions/") {
    if (req.method === "GET") {
      return getWord(parsedUrl, res);
    } else if (req.method === "POST") {
      return postWord(parsedUrl, res);
    } else {
      res
        .writeHead(405, { "Content-Type": "text/html" })
        .end("<h1>Request Method Not Allowed</h1>");
      return;
    }
  }

  res
    .writeHead(404, { "Content-Type": "text/html" })
    .end("<h1>404 Not Found</h1>");
  return;
};

const server = http.createServer(listener);

server.listen(PORT, () => {
  console.log(`Serving on: `, server.address());
});
