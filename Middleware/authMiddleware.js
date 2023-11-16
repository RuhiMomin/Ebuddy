let { User } = require('../Schema/userSchema');
let { sequelizeCon, Model, DataTypes, Op, QueryTypes } = require('../Init/dbconfig')
let secure = require('../Helpers/security')
function authM(permission) {
    return async (req, res, next) => {
        let token = req.session.token
        if (typeof (token) != "string") {
            return res.redirect('/login?msg=Unauthorized1')
        }
        let decrypt = await secure.decrypt(token, '#1234').catch((err) => {
            return { error: err }
        });
        if (!decrypt || (decrypt && decrypt.error)) {
            return res.redirect('/login?msg=Unauthorized2')
        }
        let query = `select user.id,user.name, user.email,user.contact,p.name as permission
            from user 
            left join userPermission as up on user.id=up.user_id
            left join permission as p on up.permission_id=p.id
            where user.id='${decrypt.id}'
            and token='${token}'`;
        let user = await sequelizeCon.query(query, { type: QueryTypes.SELECT }).catch((err) => {
            return { error: err }
        })
        if (!user || (user && user.error)) {
            return res.redirect('/login?msg=Unauthorized3')
        }
        let permiss = {}
        for (let i of user) {
            if (i.permission) {
                permiss[i.permission] = true
            }
        }
        if (permiss.length <= 0 || !permiss[permission]) {
            return res.redirect('/login?msg=Unauthorized4')
        }
        req['userData'] = {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            contact: user[0].contact,
            permiss
        }
        next();
    }
}

module.exports = {
    authM
}