const express = require('express');
const router = express.Router();
const database = require('../middleware/database');

//var validator = require('validator');
// サニタイズを行う
// cache = validator.escape(id);

router.get('/', (req, res, next) => {
    database.getDatabase(req, res);

});


router.get('/page/:page', (req, res, next) => {

    var page = req.params.page;

    if ( isFinite(page) && page >= 0) {
        database.getDatabase(req, res, page);
    } else {
        res.redirect( 302, '/tweet/' );
    }
    
});

router.post( '/', (req, res, next) => {

    var name = req.body.userName;
    var tweet =　req.body.tweet;

    console.log(tweet.length);

    database.setDatabase(res, name, tweet);

});

module.exports = router;
