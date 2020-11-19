const express = require('express')
const route = express.Router()
const Product = require('../models/product')
const Category = require('../models/categories')

route.get('/', (req, res) => {
    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });
    
});


route.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slog: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });

});

route.get('/:category/:product', function (req, res) {

    Product.findOne({slog: req.params.product}, (err, product) => {
        if(err) console.log(err) 
        res.render('product', {
            title: product.title,
            p: product
        })
    })

});

module.exports = route