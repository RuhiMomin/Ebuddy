let joi = require('joi')
let { User } = require('../Schema/userSchema');
let secure = require('../Helpers/security')
let { UserPermission } = require('../Schema/userPermissionSchema')

let { mail } = require('../Helpers/mailer');
const { generate } = require('otp-generator');


async function check(data) {     //userdata validation
    let schema = joi.object({
        username: joi.string().required(),
        email: joi.string().required(),
        contact: joi.string().required(),
        password: joi.string().min(8).max(15).required()
    })
    let valid = await schema.validateAsync(data).catch((err) => {       //error handling
        return { error: err }
    });
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message);
        }
        return { error: msg }
    }
    return { data: valid }
}
async function register(params) {
    let valid = await check(params).catch((err) => {       ///error handling
        return { error: err }
    });
    if (!valid || (valid && valid.error)) {            //double check 
        return { error: valid.error };
    }
    let finduser = await User.findOne({ where: { email: params.email } }).catch((err) => {
        return { error: err } //check if email exist in db
    })
    console.log(finduser)
    if (finduser || (finduser && finduser.error)) {       //find need to b empty always (for no same name)
        return { error: "already exist1" }
    }
    let msg_dig = await secure.hash(params.password).catch((err) => {
        return { error: err }            //hash the password
    })

    if (!msg_dig || (msg_dig && msg_dig.error)) {
        return { error: error }
    }
    let userData = {             //format user data
        name: params.username,
        email: params.email,
        contact: params.contact,
        password: msg_dig.data                           //password in string
    }
    let data = await User.create(userData).catch((err) => {               //insert into db
        return { error: err }               //return all default value
    })

    if (!data || (data && data.error)) {
        return { error: "ERROR" }                  //db error
    }
    let userpermission = {
        user_id: data.id,
        permission_id: 1
    }
    let upData = await UserPermission.create(userpermission).catch((err) => {
        return { error: err }
    })
    if (!upData || (upData && upData.error)) {
        return { error: "error" }
    }
    return { data }
}

async function checkLogin(data) {
    let schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data).catch((err) => {
        return { error: err }
    })
    if (!valid || (valid && valid.error)) {
        let jungle = []
        for (let i of valid.error.details) {
            jungle.push(i.message);
        }
        return { error: err }
    }
    return { data: valid }
}
async function Login(admin) {
    let verify = await checkLogin(admin).catch((err) => {  //user validation
        return { error: err }
    })
    if (!verify || (verify && verify.error)) {    //error handling
        return { error: verify.error }
    }
    let find = await User.findOne({ where: { email: admin.email } }).catch((err) => {
        return { error: err }  //check email exist
    })
    if (!find || (find && find.error)) {
        return { error: 'invalid email' }
    }
    let pass = await secure.compare(admin.password, find.password).catch((err) => {
        return { error: err }      //compare password to db password
    })
    if (!pass || (pass && pass.error)) {
        return { error: "wrong password" }
    }
    let token = await secure.encrypt({ id: find.id }, "#1234").catch((err) => {
        return { error: err }     //generate token
    })
    if (!token || (token && token.error)) {
        return { error: token.error }
    }
    let upData = await User.update({ token: token }, { where: { id: find.id } }).catch((err) => {
        return { error: err }      //update token.....save what n where 
    })
    if (!upData || (upData && upData.error) || (upData && upData[0] <= 0)) {
        return { error: "internal server error" }
    }
    return { token: token }
}

async function checkforp(params) {
    let schema = joi.object({
        email: joi.string().required()
    })
    let valid = await schema.validateAsync(params).catch((error) => {               //
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg1 = []
        for (let i of valid.error.details) {
            msg1.push(i.message)
        }
        return { error }
    }
    return { data: valid }
}

async function forgetpassword(params) {
    let verify = await checkforp(params).catch((err) => {
        return { error: err }
    })
    if (!verify || (verify && verify.error)) {
        return { error: verify.error }
    }
    let find = await User.findOne({ where: { email: params.email } }).catch((err) => {
        return { error: err }
    })
    if (!find || (find && find.error)) {
        return { error: 'USER NOT FOUND' }
    }
    let otp = generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

    let hashotp = await secure.hash(otp).catch((error) => {
        return { error }
    })
    if (!hashotp || (hashotp && hashotp.error)) {
        return { error: hashotp.error }
    }
    let saveotp = await User.update({ otp: hashotp.data }, { where: { id: find.id } }).catch((err) => {
        return { error: err }
    })
    if (!saveotp || (saveotp && saveotp.error)) {
        return { error: saveotp.error }
    }

    let mailoption = {
        from: 'ruhimom832@gmail.com',
        to: params.email,
        subject: 'baigan',

        html: `
        <h1>${otp}</h1>
        <p>helllo world </P>
        <a>enter for otp </a>
        `
    }
    let sendmail = await mail(mailoption).catch((err) => {
        return { error: err }
    })
    if (!sendmail || (sendmail && sendmail.error)) {
        console.log(sendmail)
        return { data: 'mail is not send' }
    }
    return { data: `mail is send to ${params.email}` }
}

module.exports = { register, Login, forgetpassword }