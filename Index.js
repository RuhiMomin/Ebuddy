let express = require('express');
let app = express();
let session = require('express-session')
let { routes } = require('./routes.js');
let config = require('config')
let port = config.get('port')
// let cors = require('cors');


// function corsfun(origin, callback) {
//     console.log("origin", origin)
//     let whitelist = {
//         'localhost': true
//     }
//     if (whitelist[origin]) {
//         callback(null, true);
//     } else {
//         callback(new Error('domain not valid'))
//     }
// }
// app.use(cors({ origin: corsfun }));
// app.use(express.json())



app.use(express.json());                                            //data in body
app.use(express.urlencoded({ extended: true }));                                                                     //if want to accept user
app.use(session({
    secret: '#786@54$'
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))

app.use(routes)
app.listen(port, () => {
    console.log(" Database connected", port)
})
//server creation