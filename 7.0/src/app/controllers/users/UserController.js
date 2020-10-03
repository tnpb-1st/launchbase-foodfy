const User = require('../../models/User')
const Recipe = require('../../models/Recipe')
const crypto = require('crypto')
const mailer = require('../../../config/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    registerForm(req, res) {
        return res.render("admin/users/register.njk")
    },

    async showUsers(req, res) {
        const { userId:admId } = req.session 

        const users = await User.getAll(admId)

        return res.render('admin/users/all_users.njk', { users })
    },

    async post(req, res) {

        // criamos uma senha de numeros e letras para o usuario de forma automatica
        try {
            const userPassword = crypto.randomBytes(10).toString("hex")
    
            // criptografamos a senha do novo usuario e a colocamos no banco de dados
            const cryptoPassword = await hash(userPassword, 8)

            await User.create({
                ...req.body,
                password: cryptoPassword
            })

            // enviamos um email para o usuario com a senha não criptografada

            await mailer.sendMail({
                to: req.body.email,
                from: 'noreply@foodfy.com.br',
                subject: 'Envio da sua senha',
                html: 
                `
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
                        <h2>Envio de Senha</h2>
                        <h1>Foodfy</h1>
                        
                        <h3>Segue abaixo a senha para a realização do seu login</h3>
                        <span>${userPassword}</span>
                
                        <p>o usuário será esse email para o qual a senha foi enviada</p>
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
                    
                        span {
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

            return res.render('admin/users/edit.njk', {
                success: 'O usuário foi criado com sucesso',
                user: req.body
            })
        
        } catch (err) {
            console.error(err)
            return res.render('admin/users/register', {
                error: 'Não foi possível cadastrar o usuário',
                user: req.body
            })
        }
    },

    async show(req, res) {
        const { userId:id, is_admin } = req.session
        
        let { user } = req

        if (!user) return res.render('users/login', {
            error: 'Usuário não encontrado'
        })

        if (is_admin === true) {
            return res.render('admin/users/edit.njk', { user })
        } else {
            return res.render('users/users/edit.njk', { user })
        }

    },

    async updateForm(req, res) {
        let { user } = req

        return res.render('admin/users/edit.njk', { user })
    },

    async update(req, res) {
        try {
            const { userId , is_admin:user_admin } = req.session 

            const body = req.body
            let { name, email, is_admin } = body

            await User.update(body.id, {
                name,
                email,
                is_admin: is_admin || false
            })

            if (user_admin === true) {
                if ((is_admin === false) && (body.id === userId)) {
                
                    req.session.destroy()
                    return res.render('session/login', {
                        success: 'Você deixou de ser um adm'
                    })
                
                } else {
                    
                    return res.render('admin/users/edit', {
                        user: req.body,
                        success: 'Conta atualizada com sucesso'
                    })
                }
            } else {
                return res.render('users/users/edit', {
                    user: req.body,
                    success: 'Conta atualizada com sucesso'   
                })
            }
            

        } catch (err) {
            console.error(err)
        }
    },

    async delete(req, res) {
        const { id:user_id } = req.params
        const { userId:adm_id } = req.session

        try {
            if (user_id === adm_id) {
                const users = await User.getAll()
                
                return res.render('admin/users/all_users.njk', {
                    error: 'Você não pode deletar a si mesmo',
                    users
                })
           
            } else {
                const user = await User.findOne( {where: { id:user_id }})
            
                // checar se um adm está tentando deletar outro
                if (user.is_admin === true) {
                    return res.render('admin/users/edit.njk', {
                        error: 'você não pode deletar esse usuário porque ele ainda é um ADM',
                        user: user
                    })
                }

                // checar se um usuário tem receitas registradas
                const recipes = await User.getUserRecipes(user_id)
                
                if (recipes.length === 0) {
                    await User.delete(user_id)

                    const all_users = await User.getAll()
                    
                    return res.render('admin/users/all_users.njk', {
                        success: 'O usuário foi deletado com sucesso',
                        users: all_users
                    })
                } else { // teremos que transferir as receitas do usuário antes de deletá-lo
                    
                    const recipesTransferencePromise = recipes.map(recipe => {
                        return Recipe.updateAndChangeUser({
                            ...recipe, 
                            user_id: adm_id
                        })
                    })

                    // transferimos as receitas para o adm da sessão
                    await Promise.all(recipesTransferencePromise)

                    // deletar o usuario
                    await User.delete(user_id)

                    const all_users = await User.getAll()
                    
                    return res.render('admin/users/all_users.njk', {
                        success: 'O usuário foi deletado com sucesso',
                        users: all_users
                    })
                }
            }

        } catch (err) {
            
            return res.render('admin/users/edit.njk', {
                error: 'O usuário não pôde ser deletado por algum erro inesperado',
                user: req.body
            })
        }
        
    }
}