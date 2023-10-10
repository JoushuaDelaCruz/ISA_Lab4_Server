const http = require("http");
const url = require("url");
const PORT = process.env.PORT || 3000;

const listener = (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/api/definitions/") {
    if (req.method === "GET") {
    } else if (req.method === "POST") {
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
