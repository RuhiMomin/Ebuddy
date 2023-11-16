let authModel = require("../Model/authModel")
async function Register(req, res) {
    console.log(req.body)
    let modelData1 = await authModel.register(req.body).catch((err) => {
        return { error: err }              //check errror in req
    })
    if (!modelData1 || (modelData1 && modelData1.error)) {
        let error = (modelData1 && modelData1.error) ? modelData1.error : 'internal server error'
        return res.send({ error })
    }
    // return res.send({ data: modelData1.data })
    return res.redirect('/?msg=success')
}

async function Login(req, res) {
    let modelData2 = await authModel.Login(req.body).catch((err) => {
        return { error: err }
    })
    if (!modelData2 || (modelData2 && modelData2.error)) {
        let error = (modelData2 && modelData2.error) ? modelData2.error : "internal server error"
        return res.send({ error })
    }
    // return res.send({ data: modelData2.data, token: modelData2.token })
    req.session.token = modelData2.token
    return res.redirect('/dashboard')
}

async function index(req, res) {
    res.render('regLog', {})
}

async function forgetpasswordUi(req, res) {
    return res.render("forgertpassword", {})    //url
}

async function forgetpassword(req, res) {
    let forgetdata = await authModel.forgetpassword(req.body).catch((err) => {
        return { error: err }
    })
    if (!forgetdata || (forgetdata && forgetdata.error)) {
        console.log(forgetdata, "this is error from email")
        let error = (forgetdata && forgetdata.error) ? forgetdata.error : 'internal server error'
        return res.send({ error })
    }
    return res.send({ data: forgetdata })
}

module.exports = { Register, Login, index, forgetpassword, forgetpasswordUi }