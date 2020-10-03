const User = require('../models/User')
const { compare } = require('bcryptjs')

async function show(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: {email}})

    if (!user) return res.render('user/login', {
        user: req.body,
        error: 'Usuário não encontrado'
    })

    // checar a senha inserida com a do banco de dados

    const passed = await compare(password, user.password)

    if (!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email }})

        if (!user) return res.render('session/forgot-password', {
            user: req.body,
            error: 'Email não cadastrado'
        })

        req.user = user
        next()

    } catch (err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    // procurar o usuário
    const { email, password , passwordRepeat, token} = req.body

    const user = await User.findOne({ where: {email} })

    if (!user) return res.render("session/login", {
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })

    // ver se as senhas batem
    if (password !== passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'A senha e a repetição da senha estão incorretas.'
    })

    // verifica se o token é válido
    if (token !== user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        error: 'Token inválido. Faça uma nova solicitação de recuperação de senha'
    })

    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        error: 'O token expirou! Faça uma nova solicitação de recuperação de senha'
    })

    req.user = user
    next()
}

module.exports = {
    show,
    forgot,
    reset
}