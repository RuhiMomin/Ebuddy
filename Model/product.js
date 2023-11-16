let { Product } = require("../Schema/productSchema");
let joi = require("joi");

async function createproduct(params) {
    let valid = await checkproduct(params).catch((err) => {
        return { error: err };
    });

    if (!valid || (valid && valid.error)) {
        return { error: valid.error };
    }

    let productData = {
        name: params.name,
        price: params.price,
        description: params.description,
    };

    let data = await Product.create(productData).catch((err) => {
        return { error: err };
    });

    if (!data || (data && data.error)) {
        console.log(data.error)
        return { error: "Internal server error" };
    }

    return { data: data };
}

async function checkproduct(data) {
    let Schema = joi.object({
        name: joi.string().required(),
        price: joi.string().required(),
        description: joi.string().required(),
    });

    let valid = await Schema.validateAsync(data).catch((err) => {
        return { error: err };
    });

    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (let i of valid.error.details) {
            msg.push(i.message);
        }
        return { error: msg };
    }

    return { data: valid };
}

async function viewAll(params) {
    let limit = (params.limit) ? parseInt(params.limit) : 10;
    let page = (params.page) ? parseInt(params.page) : 1;
    let offset = (page - 1) * limit
    let counter = await Product.count().catch((error) => {
        return { error }
    })
    if (!counter || (counter && counter.error)) {
        return { error: 'internal server error' }
    }
    if (counter <= 0) {
        return { error: 'record not found' }
    }
    let data = await Product.findAll({ limit, offset }).catch((error) => {
        return (error)
    })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data, total: counter, page, limit }
}

async function viewDetails(id) {
    let data = await Product.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    return { data: data }
}

async function checkUpdate(data) {
    let schema = joi.object({
        id: joi.number().required(),
        productName: joi.string().required(),
        productPrice: joi.number().required(),
        desc: joi.string().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function update(id, params) {
    params.id = id
    let valid = await checkUpdate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    data.name = params.productName       //set and where clause to see which column is updated
    data.price = params.productPrice
    data.description = params.desc
    let updateProduct = await Product.update(data, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateProduct || (updateProduct && updateProduct.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data }
}


async function checkDelete(data) {
    let schema = joi.object({                //userdata validation(iD)
        id: joi.number().required()
    });
    let valid = await schema.validateAsync(data).catch((err) => {
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


async function pDelete(id) {
    let valid = await checkDelete({ id }).catch((error) =>
     { return { error }; });                            

    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((err) => {
        return { error: err }
    })
    if (data.is_deleted == decision) {
        return { error: "Product is already deleted" }
    }
    let updateProduct = await Product.update({ is_deleted: true }, { where: { id } }).catch((err) => {
        return { error: err }
    });
    if (!updateProduct || (updateProduct && updateProduct.error)) {
        return { error: "Internal server error", status: 500 }
    }
    if (updateProduct <= 0) {
        return { error: "record not deleted" }
    }
    return { data: "record successfully deleted" }
}
// async function pRestore(id) {
//     let valid = await checkDelete({ id }).catch((error) => { return { error }; });
//     if (!valid || (valid && valid.error)) {
//         return { error: valid.error }
//     }
//     let data = await Product.findOne({ where: { id }, raw: true }).catch((err) => {
//         return { error: err }
//     })
//     if (data.is_deleted == false) {
//         return { error: "Product is already deleted" }
//     }
//     let updateProduct = await Product.update({ is_deleted: false }, { where: { id } }).catch((err) => {
//         return { error: err }
//     });
//     if (!updateProduct || (updateProduct && updateProduct.error)) {
//         return { error: "Internal server error", status: 500 }
//     }
//     if (updateProduct <= 0) {
//         return { error: "record not deleted" }
//     }
//     return { data: "record successfully restore" }
// }


module.exports = { createproduct, viewAll, viewDetails, checkUpdate, update, pDelete };

