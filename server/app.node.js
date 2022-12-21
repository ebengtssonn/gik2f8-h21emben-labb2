const http = require("http");

const server = http.createServer((req, res) => {
    console.log(http.METHODS);

    const statsuCode = 425;
    res.writeHead(statsuCode);
    res.end(`Du gjorde ett ${req.method}-anrop till ${req.url}`);
    
});

server.listen("5000",() => console.log("Server running on http://localhost:5000"))