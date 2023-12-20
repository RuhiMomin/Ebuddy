
let product = require('../Model/product')
async function add(req, res) {
    let modelData = await product.createproduct(req.body).catch((err) => {
        return { error: err }
    })

    if (!modelData || (modelData && modelData.error)) {
        let error = (modelData && modelData.error) ? modelData.error : 'internal server'
        return res.redirect('/product/create')
    }
    return res.redirect('/product')
}



async function viewAll(req, res) {
    let products = await product.viewAll(req.query, req.userData.permiss).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        return res.render('product/view', { error: products.error })
    }
    console.log(req.userData.permiss)
    return res.render('product/view', { products: products.data, page: products.page, limit: products.limit, total: products.total, permiss: req.userData.permiss })
}


async function viewDetails(req, res) {
    let products = await product.viewDetails(req.params.id).catch((error) => {
        return { error }
    })
    console.log("product", products)
    if (!products || (products && products.error)) {
        return res.render('product/view', { error: products.error, product: {} })
    }
    return res.render('product/details', { product: products.data })
}


async function updateUI(req, res) {
    let products = await product.viewDetails(req.params.id).catch((err) => {
        return { error: err }
    })
    console.log("products", products)

    if (!products || (products && products.error)) {
        let url = (product && product.data && products.data.id) ? '/product/' + products.data.id : '/product';
        return res.redirect(url);
    }
    return res.render('product/update', { product: products.data })
}


async function update(req, res) {
    let products = await product.update(req.params.id, req.body).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product'
        return res.redirect(url)
    }
    let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product'
    return res.redirect(url)
}


async function jquery(req, res) {
    return res.render('jquery', {})
}


async function addUI(req, res) {
    return res.render('product/add', {})
}

async function pDelete(req, res) {
    let products = await product.pDelete(req.params.id, true).catch((err) => {
        return { error: err }
    })
    if (!products || (products && products.error)) {
        console.log("runnig on 82 product controller")
        let url = (req.params && req.params.id) ? '/product/' + req.params.id : '/product';
        return res.redirect(url);
    }
    console.log("runnig on 86 product controller")

    return res.redirect("/product");
}

async function pRestore(req, res) {
    let products = await product.pDelete(req.params.id, false).catch((err) => {
        return { error: err }
    })
    // console.log("pro",products)
    if (!products || (products && products.error)) {
        let url = (req.params && req.params.id) ? '/product/' + req.params.id : '/product';
        return res.redirect(url);
    }

    return res.redirect("/product");
}

module.exports = { add, viewAll, jquery, addUI, viewDetails, updateUI, update, pDelete, pRestore } 