let express = require('express');     //api routing
let routes = express.Router();
let user = require('./Controller/userController');
let product = require('./Controller/product')
let auth = require('./Controller/authController')
let authMid = require('./Middleware/authMiddleware')
let { mail } = require('./Helpers/mailer')
let dash = require('./Controller/dashboardcontroller')
let category = require('./Controller/categorycontroller')

// user auth routes
routes.get('/', auth.index)                                                           //default
routes.get('/login', auth.index)
routes.get('/dashboard', authMid.authM('user'), dash.index)                              //dashbord user permission
routes.post('/register', auth.Register)                                                //auth controller
routes.post('/login', auth.Login)                                                         //auth login


// //product routes
// routes.get('/product/create', product.addUI);           //only read show form
// routes.post('/product/create', product.add)                 //can create
// routes.get('/product', product.viewAll);                   //product controller will show all products
// routes.get('/product/:id', product.viewDetails)          //

//mailer
routes.get('/forget', auth.forgetpasswordUi)
routes.post('/forget', auth.forgetpassword)

//product routes
routes.get('/product/create', authMid.authM('product_create'), product.addUI)
routes.post('/product/create', authMid.authM('product_create'), product.add)
routes.get('/product/', authMid.authM('product_view'), product.viewAll)
routes.get('/product/:id', authMid.authM('product_view'), product.viewDetails)
routes.get('/product/update/:id', authMid.authM('product_update'), product.updateUI)
routes.post('/product/:id', authMid.authM('product_update'), product.update)
routes.get('/product/delete/:id', authMid.authM('product_delete'), product.pDelete)
routes.get('/product/restore/:id', authMid.authM('product_restore'), product.pRestore)
// routes.post('/register', auth.Register)



//category routes
routes.get('/category/create', authMid.authM('category_create'), category.createUI)
routes.post('/category/create', authMid.authM('category_create'), category.create)
routes.get('/category/', authMid.authM('category_view'), category.viewAll)
routes.get('/category/:id', authMid.authM('category_view'), category.viewDetails)
routes.get('/category/update/:id', authMid.authM('category_update'), category.updateUI)
routes.post('/category/:id', authMid.authM('category_update'), category.update)
routes.post('/category/delete/:id', authMid.authM('category_delete'), category.cDelete)
routes.post('/category/restore/:id', authMid.authM('category_restore'), category.restore)
module.exports = { routes }