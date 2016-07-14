'use strict';
const express = require('express');
const router = express.Router();
const database = require('../middleware/database');

//var validator = require('validator');
// サニタイズを行う
// cache = validator.escape(id);

router.get('/', (req, res, next) => {
    database.getDatabase(req, res, next, 1, (data, length) => {
        res.render( 'tweet/index', {
            tweets: data,
            postsLength: length,
            userName: req.session.name || false
        });
    });
});

router.get( '/user/', (req, res, next) => {
    
    const page = req.params.page;
    
    database.getUserPosts(req, res, next, page, (data, length, page) => {
        res.render( 'tweet/user', {
            tweets: data,
            postsLength: length,
            userName: req.session.name || false
        });
    });
});

router.get( '/user/page/:page([0-9]+)?', (req, res, next) => {
    
    const page = req.params.page;
    
    database.getUserPosts(req, res, next, page, (data, length, page) => {
        res.render( 'tweet/user', {
            tweets: data,
            postsLength: length,
            page: page,
            userName: req.session.name || false
        });
    });
});

router.get('/page/:page([0-9]+)?', (req, res, next) => {

    const page = req.params.page;

    if ( page != 0) {
        database.getDatabase(req, res, page, (data, length, page) => {
            res.render( 'tweet/index', {
                tweets: data,
                postsLength: length,
                page: page,
                userName: req.session.name || false
            });
        });
    } else {
        res.redirect( 302, '/tweet/' );
    }
    
});

router.post( '/', (req, res, next) => {

    const name = req.session.name;

    if ( !name ) {
        res.redirect('/tweet/');
        return;
    }

    const tweet =　req.body.tweet;
    database.setDatabase(res, name, tweet);

});

module.exports = router;
