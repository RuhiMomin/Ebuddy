//nodemailer works on callback 
// cb converts to promise
// tls(transport layer security) pass for two step verification


let mailer = require('nodemailer')
function mail(mailoption) {
    return new Promise((res, rej) => {
        let transporter = mailer.createTransport({  //predefined method
            host: 'smtp.gmail.com',   
            port: 465,                  //keys
            secure: true,
            auth: {
                user: "ruhimomin832@gmail.com",
                pass: "owmc ppue pkzi gsao"
            }
        })
        transporter.sendMail(mailoption, (err, info) => {    //method
            if (err) {
                return rej(err)
            }
            console.log(info);
            return res(`mail is send to ${mailoption.to}`)
        })
    })
}
module.exports = { mail } 