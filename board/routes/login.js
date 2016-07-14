'use strict';
const express = require('express');
const router = express.Router();
const database = require('../middleware/database');
const auth = require('../middleware/auth');

router.get( '/', (req, res, next) => {

    if ( req.session.name ) {
        console.log('Logined');
        res.redirect('/tweet/');
    } else {
        console.log('DINED');
        res.render('./auth/login');
    }

});

router.post( '/', (req, res, next) => {
    auth.login(req, res, next);
});

router.get( '/register', (req, res, next) => {
    res.render('./auth/register');
});

router.post( '/register', (req, res, next) => {
    database.addUser( req, res, next, (db, name, email, hash) => {
        db.serialize( () => {
            const stmt = db.prepare( 'INSERT INTO users VALUES(?,?,?,?,?,?,?)' );
            stmt.run( [name, email, hash, '', 0, [], [] ] );
            stmt.finalize();
            req.session.name = name;
            res.redirect(302, '/tweet/');
        });
    });
});

module.exports = router;