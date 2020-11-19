const express = require('express')
const { validationResult, body, check } = require('express-validator')
const route = express.Router()
const Category = require('../models/categories')

//get pages index

route.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if(err) return err
        res.render('admin/categories', {
            categories: categories
        });
    });
});

//get add category
route.get('/add-category', (req, res) => {
    var title = ''


    res.render('admin/add_category', {
        title: title
    })
})
 
//post pages
route.post('/add-category', [check('title', 'don\'t leave title blank').notEmpty()], (req, res) => {
    var title = req.body.title;
    var slog = req.body.title.replace(/\s+/g, '-').toLowerCase();


  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      //  return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    res.render('admin/add_category', {
        alert: alert,
        title: title,

    })
  }
  else {
      Category.findOne({slog: slog}, (err, category) => {
          if(category) {
              req.flash('danger', 'category slog exists please choose another')
              res.render('admin/add_category', {
                title: title
            })
          } else {
              var category = new Category({
                  title: title,
                  slog: slog
              })
              category.save((err) => {
                  if(err) console.log(err)
                  else {
                    Category.find((err, categories) => {
                        if(err) console.log(err)
                        req.app.locals.categories = categories
                      })
                      req.flash('success', 'category added')
                      res.redirect('/admin/category')
                  }
              })
          }
      })
  }
})


//get edit category
route.get('/edit-category/:id', (req, res) => {
    Category.findById(req.params.id, (err, page) => {
        if(err) console.log(err)
        else {
            res.render('admin/edit_category', {
        title: page.title,
        id: page._id
    })
        }
    })

    
})
 
//post edit pages
route.post('/edit-category/:id', [check('title', 'don\'t leave title blank').notEmpty()], (req, res) => {
    var title = req.body.title;
    var slog = title.replace(/\s+/g, '-').toLowerCase();

    var id = req.params.id

  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      //  return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    res.render('admin/edit_category', {
        alert: alert,
        title: title,

        id: id
    })
  }
  else {
      Category.findOne({slog: slog, _id:{'$ne':id}}, (err, category) => {
          if(category) {
              req.flash('danger', 'category title exists please choose another')
              res.render('admin/edit_category', {
                title: title,
                id: id
            })
          } else {
               
            Category.findById(id, (err, category) => {
                if (err) return console.log(err)

                    category.title = title;
                    category.slog = slog;

                    category.save((err) => {
                        if(err) console.log(err)
                        else {
                            Category.find((err, categories) => {
                                if(err) console.log(err)
                                req.app.locals.categories = categories
                              })
                            req.flash('success', 'category edited')
                            res.redirect('/admin/category/edit-category/'+ id)
                        }
                    })
      
            })
            

          }
      })
  }
})


route.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, (err, category) => {
        if(err) console.log(err)
        Category.find((err, categories) => {
            if(err) console.log(err)
            req.app.locals.categories = categories
          })
        req.flash('success', 'category successfully deleted')
        res.redirect('/admin/category')
    })
});

module.exports = route