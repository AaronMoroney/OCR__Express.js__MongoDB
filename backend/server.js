// test console.log('server is live!'); // working
//start basic server
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('This is my test server response!');
});

server.listen(process.env.PORT || 3000);