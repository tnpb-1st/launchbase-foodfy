const User = require('../models/User')

function onlyUsers(req, res, next) {
    if (!req.session.userId) return res.redirect('/users/login')
    
    next()
}

async function onlyAdms(req, res, next) {
    if (!req.session.userId) return res.redirect('/users/login')

    const { userId: id } = req.session
    
    const user = await User.findOne({ where: {id} })

    if (user.is_admin === false) return res.render('users/edit.njk', {
        user: user,
        error: "Você não é um ADM para realizar essa ação"
    })

    next()
}

module.exports = {
    onlyUsers,
    onlyAdms
}