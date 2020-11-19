const express = require('express')
const route = express.Router()
const Page = require('../models/model')

route.get('/', (req, res) => {
    Page.findOne({slog: 'home'}, function (err, page) {
        if (err)
            console.log(err);

        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
    
});
route.get('/:slog', (req, res) => {
    var slog = req.params.slog

    Page.findOne({slog: slog}, (err, page) => {
      if(err) console.log(err)
    if(!page) {
        res.redirect('/')
    } else {
        res.render('index', {
        title: page.title,
        content: page.content
    })
    }  
    })
    
    
})

module.exports = route