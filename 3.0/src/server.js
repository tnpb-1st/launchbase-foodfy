const express = require('express');
const nunjucks = require('nunjucks');
const server = express();
const routes = require('./routes');
const methodOverride = require('method-override');


server.use(express.urlencoded({ extendend: true })); // quando true manda o express trabalhar com uma biblioteca que suporte nested objects como o JSON
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    nocache: true,
    watch: true
}); 

server.listen(5000, function () {
    console.log("Server is running!");
});