const express = require('express')
const nunjucks = require('nunjucks')
const server = express()
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')


server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
server.use(express.urlencoded({ extendend: true })) // quando true manda o express trabalhar com uma biblioteca que suporte nested objects como o JSON
server.use(express.static('public'))
server.use(express.static('images'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    nocache: true,
    watch: true
}) 

server.listen(5000, function () {
    console.log("Server is running!")
})

server.use(function(req, res) {
    res.status(404).render('error.njk');
});