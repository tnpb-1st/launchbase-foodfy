const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../config/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },

    forgotForm(req, res) {
        return res.render("session/forgot-password.njk")
    },

    newPassword(req, res) {
        return res.render("session/new-password.njk")
    },

    async login(req, res) {
        req.session.userId = req.user.id
        req.session.is_admin = req.user.is_admin
        req.session.user = req.user

        const { is_admin } = req.session

        if (is_admin === true) {
            return res.redirect('/admin/')
        } else {
            return res.redirect('/users/user-information')
        }

        
    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect('/users/login')
    },

    async forgot(req, res) {
        const user = req.user

        try {
            // criar um token para o usuário
            const token = crypto.randomBytes(20).toString("hex")

            // criar uma expiração para esse token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'noreply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
                    <title>Document</title>
                </head>
                <body>
                    <div class="container">
                        <h2>Recuperação de Senha</h2>
                        <h1>Foodfy</h1>
                        
                        <h3>Use este link abaixo para resetá-la</h3>
                        <a 
                            href="http://localhost:3000/users/password-reset?token=${token}"
                            target="_blank"
                        >LINK PARA RESET DA SENHA</a>
                        <p>ele expirará em 1 hora</p>
                    </div>
                    
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            border: 0;
                            max-width: 800px;
                            max-height: 600px;
                            margin: 13px 0;
                        }
                    
                        .container {
                            display: grid;
                            grid-template-columns: 1fr;
                            grid-template-rows: 1fr;
                            justify-items: center;
                            background-color: antiquewhite;
                            max-width: 600px;
                            margin: 0 auto;
                            border: 0;
                            border-radius: 24px;
                            padding: 0;
                            font-family: 'Courier New', Courier, monospace;
                        }
                
                        h1 {
                            font-size: 3rem;
                            font-style: italic;
                            font-weight: 700;
                        }
                    
                    
                        h2 {
                            font-weight: 600;
                            padding: 0;
                            margin: 13px 0;
                            margin-top: 8px;
                        }
                    
                        img {
                            width: 300px;
                            height: 155px;
                            margin-bottom: 0;
                            border-radius: 50%;
                        }
                    
                        a {
                            margin: 0;
                            margin-bottom: 8px;
                            color: white;
                            background-color: lightcoral;
                            padding: 8px 32px;
                            font-size: 16px;
                            border-radius: 8px;
                            font-weight: 500;
                            text-decoration: none;
                        }
                    </style>
                </body>
                </html>
                
                `
            })

            // avisar o usuário que enviamos o email
            return res.render('session/forgot-password', {
                success: 'Verifique seu email para resetar sua senha'
            })
        } catch (err) {
            console.error(err)
            return res.render('session/forgot-password', {
                error:'Ocorreu um erro inesperado, tente novamente'
            })
        }
        
        

    },

    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token})
    },

    async reset(req, res) {
        const { user } = req
        const { password, token } = req.body
        try {
            // criar um novo hash de senha
            const newPassword = await hash(password, 8)

            // atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            // avisa o usuario que ele tem uma nova senha
            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada! Faça o seu login"
            })
            
            
        } catch (err) {
            console.error(err)
            return res.render('session/password-reset', {
                error:'Ocorreu um erro inesperado, tente novamente',
                user: req.body,
                token
            })
        }

    }
}
