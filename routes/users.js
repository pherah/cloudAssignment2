var express = require('express');
var router = express.Router();
var dbConn  = require('../database/db');

// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM people ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/users/index.ejs
            res.render('users',{data:''});   
        } else {
            // render to views/users/index.ejs
            res.render('users',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('users/add', {
        id:'',
        name: '',
        age:'',
        gender:'',
        email: '',
       
    })
})

// add a new user
router.post('/add', function(req, res, next) {    
    let id=req.body.id;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let email = req.body.email;
    let errors = false;

    if(name.length === 0 || email.length === 0||age.length==0||gender.length==0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and email");
        // render to add.ejs with flash message
        res.render('users/add', {
            id:id,
            name: name,
            age:age,
            gender:gender,
            email: email,
           
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            id:id,
            name: name,
            age:age,
            gender:gender,
            email: email,
            
        }
        
        // insert query
        dbConn.query('INSERT INTO people SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('users/add', {
                    id:form_data.id,
                    name: form_data.name,
                    age:form_data.age,
                    gender:form_data.gender,
                    email: form_data.email,

                   
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM people WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                name: rows[0].name,
                age: rows[0].age,
                gender: rows[0].gender,
                email: rows[0].email,
               
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let age = req.body.age;
    let gender = req.body.gender;
    let email = req.body.email;
    
    let errors = false;

    if(name.length === 0 || email.length === 0 || age.length==0||gender.length==0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and email ");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            name: name,
            age:age,
            gender:gender,
            email: email,
            
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            id:id,
            name: name,
            age:age,
            gender:gender,
            email: email,
            
        }
        // update query
        dbConn.query('UPDATE people SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    age: form_data.age,
                    gender: form_data.gender,
                    email: form_data.email,
                    
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM people WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/users')
        }
    })
})

module.exports = router;