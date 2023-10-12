const http = require("http");
const url = require("url");
const { execute } = require("./database");
const PORT = process.env.PORT || 3000;

/**
 * @param {string} query
 * @param {number} statusCode
 * @param {http.ServerResponse} res
 * @returns {Promise<http.ServerResponse>} result of the query
 */
const dbQuery = async (query, statusCode, res) => {
  try {
    const result = await execute(query);
    return res
      .writeHead(statusCode, { "Content-Type": "application/json" })
      .end(JSON.stringify({ result }));
  } catch (err) {
    return res
      .writeHead(500, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: err.message }));
  }
};

/**
 * Extracts the sql query from url path.
 * @param {string[]} paths
 * @returns {string} query path value
 */
const extractSqlQueryPath = (paths) => {
  const query = paths[paths.length - 1];
  return query.replace(/%20/g, " ").replace(/%22/g, " ");
};

/**
 * Traverses the path and checks if the required paths are present
 * @param {string[]} paths
 * @param {string[]} requiredPaths
 * @returns {boolean} true if all the required paths are present else false
 */
const validatePath = (paths, requiredPaths) => {
  for (let i = 0; i < requiredPaths.length; i++) {
    if (paths[i + 1] !== requiredPaths[i]) {
      return false;
    }
  }
  return true;
};

const listener = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  const parsedUrl = url.parse(req.url, true);
  const paths = parsedUrl.pathname.split("/");

  const isValid = validatePath(paths, ["api", "v1", "sql"]);

  if (!isValid) {
    res
      .writeHead(404, { "Content-Type": "text/html" })
      .end("<h1>Not Found</h1>");
    return;
  }

  const query = extractSqlQueryPath(paths);

  if (req.method === "GET") {
    dbQuery(query, 200, res);
  } else if (req.method === "POST") {
    dbQuery(query, 201, res);
  } else {
    res
      .writeHead(405, { "Content-Type": "text/html" })
      .end("<h1>Request Method Not Allowed</h1>");
    return;
  }
};

const server = http.createServer(listener);

server.listen(PORT, () => {
  console.log(`Serving on: `, server.address());
});
