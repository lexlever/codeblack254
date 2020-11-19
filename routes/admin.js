const express = require('express')
const { validationResult, body, check } = require('express-validator')
const route = express.Router()
const Page = require('../models/model')

//get pages index

route.get('/', function (req, res) {
    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
        res.render('admin/pages', {
            pages: pages
        });
    });
});

//get add page
route.get('/add-page', (req, res) => {
    var title = ''
    var slog = ''
    var content = ''

    res.render('admin/add_page', {
        title: title,
        slog: slog,
        content: content
    })
})
 
//post pages
route.post('/add-page', [check('title', 'don\'t leave title blank').notEmpty(), check('content', 'don\,t leave content page blank').notEmpty()], (req, res) => {
    var title = req.body.title;
    var slog = req.body.slog.replace(/\s+/g, '-').toLowerCase();
    if (slog == "")
        slog = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      //  return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    res.render('admin/add_page', {
        alert: alert,
        title: title,
        slog: slog,
        content: content
    })
  }
  else {
      Page.findOne({slog: slog}, (err, page) => {
          if(page) {
              req.flash('danger', 'page slog exists please choose another')
              res.render('admin/add_page', {
                title: title,
                slog: slog,
                content: content
            })
          } else {
              var page = new Page({
                  title: title,
                  slog: slog,
                  content: content,
                  sorting: 100
              })
              page.save((err) => {
                  if(err) console.log(err)
                  Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                    if(err) console.log(err)
                    req.app.locals.pages = pages
                  })
                  
                      req.flash('success', 'page added')
                      res.redirect('/admin/pages')
                 
              })
          }
      })
  }
})

//sort pages function 

function sortPages(ids, callback) {
    var count = 0
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i]
        count++

        ((count) => {
        Page.findById(id, (err, page) => {
            page.sorting = count
            page.save((err) => {
                if(err) console.log(err)
                ++count
                if(count >= ids.length) {
                    callback()
                }
            })
        })
    })(count)
}
}


//post reorder pages
route.post('/reorder-pages', function (req, res) {
    var ids = req.body['id[]']

    sortPages(ids, function() {
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
  if(err) console.log(err)
  req.app.locals.pages = pages
});
});
    })





//get edit page
route.get('/edit-page/:id', (req, res) => {
    Page.findById(req.params.id, (err, page) => {
        if(err) console.log(err)
        else {
            res.render('admin/edit_page', {
        title: page.title,
        slog: page.slog,
        content: page.content,
        id: page._id
    })
        }
    })

    
})
 
//post edit pages
route.post('/edit-page/:id', [check('title', 'don\'t leave title blank').notEmpty(), check('content', 'don\,t leave content page blank').notEmpty()], (req, res) => {
    var title = req.body.title;
    var slog = req.body.slog.replace(/\s+/g, '-').toLowerCase();
    if (slog == "")
        slog = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id

  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      //  return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    res.render('admin/edit_page', {
        alert: alert,
        title: title,
        slog: slog,
        content: content,
        id: id
    })
  }
  else {
      Page.findOne({slog: slog, _id:{'$ne':id}}, (err, page) => {
          if(page) {
              req.flash('danger', 'page slog exists please choose another')
              res.render('admin/edit_page', {
                title: title,
                slog: slog,
                content: content,
                id: id
            })
          } else {
               
            Page.findById(id, (err, page) => {
                if (err) return console.log(err)

                    page.title = title;
                    page.slog = slog;
                    page.content = content;

                    page.save((err) => {
                        if(err) console.log(err)
                        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                            if(err) console.log(err)
                            req.app.locals.pages = pages
                          });
                            req.flash('success', 'page added')
                            res.redirect('/admin/pages/edit-page/'+ id)
                        
                    })
      
            })
            

          }
      })
  }
})


route.get('/delete-page/:id', function (req, res) {
    Page.findByIdAndRemove(req.params.id, (err, page) => {
        if(err) console.log(err)
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if(err) console.log(err)
            req.app.locals.pages = pages
          });
        req.flash('success', 'page successfully deleted')
        res.redirect('/admin/pages')
    })
});

    

module.exports = route