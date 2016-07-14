'use strict';
const db = require('./database.js').db;
const crypto =require('crypto');
const validator = require('validator');


function login( req, res, next ) {

    const pass = req.body.pass;
    const name = req.body.name;
    const mail = req.body.mail || '';

    let isLogin = false;

    const sha512 = crypto.createHash('sha512');
    sha512.update(pass);
    const hash = sha512.digest('hex');

    db.each( 'SELECT * FROM users' , ( error, row ) => {

        if ( name == row.name ) {
            // TODO: mailの一致も調べるのを後で追加する?
            if ( hash == row.pass ) {
                isLogin = true;
                req.session.name = row.name;
                res.redirect('/tweet/');
            }
        }

    }, () => {

        if ( !isLogin ) {
            res.render('./auth/login', {
                isLogin: 'dined'
            });
        }

    });
}


function sessionCheck(req, res, next) {

    if ( req.session.name ) {
        console.log('Logined');
        next();
    } else {
        console.log('DINED');
        res.redirect('/auth/');
    }

}

class validation {
    Constructor (text) {
        this.escapeRegExp(text);
    }

    isEmail () {
        return validator.isEmail(this.text);
    }

    escapeRegExp(string) {
        this.text = string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    }


}


module.exports.sessionCheck = sessionCheck;
module.exports.login = login;