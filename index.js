// const http = require('http');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    let response = '<h1>Hello from Node.js!</h1>';
    response += 'Home page';
    res.send(response);
});

app.get('/posts', function (req, res) {
    let response = '<h1>Hello from Node.js!</h1>';
    response += '<h2>You are viewing the post page!</h2>';
    res.send(response);
});

app.get('/users', function (req, res) {
    let response = '<h1>Hello from Node.js!</h1>';
    response += '<h2>You are viewing the user page!</h2>';
    res.send(response);
});

app.get('**', function (req, res) {
    let response = 'Page not found!';
    res.send(response);
});

app.listen(3000);

// HOMEWORK
// - Read about POST and GET request, when they are used and roughly how they work

// DNS - Domain name server, takes care of translating URLs (web addresses) to IP addresses of the servers where the website is hosted
// nodemon - installed through npm install -g nodemon - a package that does not require programmer to rerun node application anytime a change is made

// Usually application hosted on Node.js will be using custom ports (they won't be using port 80/443)
// Users will be able to access the application through a reverse proxy
// Reverse proxy - standard webserver that listens to web requests and then redirects
// them to our application on it's own port e.g. 3000. Response from application is forwarded back to the user
// http.createServer(function(req,res) {
//     // HTTP STATUS
//     // 2xx - Everything went alright
//     // 3xx - Redirects
//     // 4xx - Something went wrong, but not terribly wrong
//     // 5xx - Something got seriously messed up
//
//     if(req.url === '/') {
//         header(res);
//         res.write('Home page');
//     } else if(req.url === '/posts') {
//         header(res);
//         res.write('<h2>You are viewing the post page!');
//     } else if(req.url === '/users') {
//         header(res);
//         res.write('<h2>You are viewing the users page!');
//     } else {
//         res.writeHead(404);
//         res.write('Page not found!');
//     }
//
//     res.end();
// }).listen(3000);
//
// function header(res) {
//     res.writeHead(200);
//     res.write('<h1>Hello from Node.js</h1>');
// }
