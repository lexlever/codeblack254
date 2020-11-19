const express = require('express')
const route = express.Router()
const Product = require('../models/product')

route.get('/add/:product', (req, res) => {
    var slog = req.params.product
    Product.findOne({slog: slog}, function (err, p) {
        if (err)
            console.log(err);

        if(typeof req.session.cart == 'undefined') {
            req.session.cart = []
            req.session.cart.push({
                title: slog,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: p.imgSrc
            })
        } else {
            var cart = req.session.cart
            var newItem = true

            for (var i = 0; i < cart.length; i++) {
                if(cart[i].title === slog) {
                    cart[i].qty++;
                    newItem = false;
                    break
                }
            }
            if(newItem) {
                cart.push({
                    title: slog,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: p.imgSrc
                })
            }
        }

       // console.log(req.session.cart)
        req.flash('success', 'Product added')
        res.redirect('back')
        
    });
    
});

//get checkout page

route.get('/checkout', (req, res) => {

    if(req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart
        res.redirect('/cart/checkout')
    } else {
    res.render('checkout', {
        title: 'checkout',
        cart: req.session.cart
    })
}
})

route.get('/update/:product', (req, res) => {
    var slog = req.params.product
    var cart = req.session.cart
    var action = req.query.action

    for(var i = 0; i < cart.length; i++ ) {
        if(cart[i].title == slog) {
            switch (action) {
                case 'add':
                    cart[i].qty++
                    break
                case 'remove':
                    cart[i].qty--
                    if(cart[i].qty < 1) cart.splice(i, 1)
                    break
                case 'clear':
                    cart.splice(i, 1)
                    if(cart.length == 0) delete req.session.cart
                    break
                default:
                    console.log('update problem')
                    break
            }
            break
        }
    }
    req.flash('success', 'cart successfully updated')
    res.redirect('/cart/checkout')
})

route.get('/clear', (req, res) => {

    delete req.session.cart
    req.flash('success', 'cart successfully updated')
    res.redirect('/cart/checkout')
})

module.exports = route