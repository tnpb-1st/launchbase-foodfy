const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body);
        
    for (let key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function isAdm(userId) {

    const id = userId
    const user = await User.findOne({ where: {id} })

    if (user.is_admin === true) {
        return true
    }
    return false
} 

async function show(req, res, next) {
    const { userId: id} = req.session

    const user = await User.findOne({ where: {id}})

    if (!user) return res.render('session/login', {
        error: 'Usuário não encontrado'
    })

    req.user = user

    next()
}

async function post(req, res, next) {
    // check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render('admin/users/register.njk', fillAllFields)
    }

    // check if user exists [email]
    const { email } = req.body
    const user = await User.findOne({ where: { email }})
    
    if (user) return res.render('admin/users/register.njk', {
        error: 'Usuário já cadastrado',
        user: req.body
    })

    next()
}

async function update(req, res, next) {
    // check if the user is an ADM

    const { userId } = req.session // id do utilizador

    const adm = await isAdm(userId)

    if (adm === true) {
        const fillAllFields = checkAllFields(req.body)
        
        if (fillAllFields) {
            return res.render('admin/users/edit.njk', fillAllFields)
        }

        const { id } = req.params

        const user = await User.findOne({ where: {id} })

        if (!user) {
            return res.render('admin/users/all_users.njk', {
                error: 'Usuario não encontrado'
            })
        }

        req.user = user

        next()

    } else {
        const fillAllFields = checkAllFields(req.body)
        
        if (fillAllFields) {
            return res.render('users/edit.njk', fillAllFields)
        }

        const id = userId

        const user = await User.findOne({ where: {id} })

        req.user = user

        next()
    }
    
   
}

module.exports = {
    post,
    show,
    update
}