// test console.log('server is live!'); // working
//start basic server

const http = require('http');
const app = require('./app');

//set portkey
app.set('port', process.env.PORT || 3000);

const server = http.createServer(app);

server.listen(process.env.PORT || 3000);