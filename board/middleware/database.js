'use strict';

const SQLite = require('sqlite3').verbose();
const db = new SQLite.Database('./data/db/board.sqlite');
const validator = require('validator');
const crypto = require('crypto');

//const moment = require('moment');

db.run( 'CREATE TABLE IF NOT EXISTS posts( name NOT NULL, tweet NOT NULL, timestamp NOT NULL, id INTEGER PRIMARY KEY NOT NULL )' );
db.run( 'CREATE TABLE IF NOT EXISTS users( name NOT NULL, email NOT NULL, pass NOT NULL, profile, postsLength, follow, follower )' );

const getDatabase = ( req, res, next, page = 1, callback ) => {
 
    const index = ( page - 1 ) * 10;

    let postsLength = 0;
    const sqlCtx = 'SELECT * FROM posts ORDER BY id DESC LIMIT ? OFFSET ?';
    const count = 'SELECT *, COUNT(*) as postsLength FROM posts';

    db.all( sqlCtx, [10, index], ( error, row ) => {

        if ( error ) {
            console.log(error);
            next();
        }
        
        const postsData = row;
        
        db.each( count, [], ( error, row ) => {
            postsLength = row.postsLength;
        }, () => {
            if ( typeof callback === 'function'  ) {
                callback(postsData, postsLength, page);
            }
        });
    });

    // db.each( sqlCtx, [10, index], ( error, row ) => {
    //
    //
    //
    // },  () => {
    //     db.each( 'SELECT *, COUNT(*) as postsLength FROM posts', ( error, row ) => {
    //         postsLength = row.postsLength;
    //     }, () => {
    //         if ( typeof callback === 'function'  ) {
    //             callback(postsData, postsLength, page);
    //         }
    //     });
    // });
};

const removeDatabase = ( req, res, next, id ) => {

    if ( id ) {
        res.redirect( 302, '/tweet/' );
    }

    const name = req.session.name;
    const sqlCtx = 'DELETE FROM posts WHERE ( id = ?)';

    db.serialize( () => {
        const stmt = db.prepare( sqlCtx );
        stmt.run( [id] );
        stmt.finalize();
        res.redirect( 302, '/tweet/' );
    });

};

const getUserPosts = (req, res, next, page = 1, callback) => {

    const name = req.session.name;
    const index = ( page - 1 ) * 10;

    const sqlCtx = 'SELECT * FROM posts WHERE ( name = ? ) ORDER BY id DESC LIMIT ? OFFSET ?';
    const count = 'SELECT *, COUNT(*) as postsLength FROM posts WHERE ( name = ? )';

    db.all( sqlCtx, [name, 10, index], ( error, row ) => {

        if ( error ) {
            console.log(error);
            next();
        }

        const postsData = row;

        let postsLength = 0;

        db.each( count, [name], ( error, row ) => {
            postsLength = row.postsLength;
        }, () => {
            console.log(postsLength);
            if ( typeof callback === 'function'  ) {
                callback(postsData, postsLength, page);
            }
        });
    });

};


const setDatabase = ( res, name, tweet ) => {

    const timestamp = Date.now();
    db.serialize( () => {
        //name, tweet, timestamp
        const stmt = db.prepare( 'INSERT INTO posts VALUES(?,?,?,?)' );
        stmt.run( [name, tweet, timestamp] );
        stmt.finalize();
        res.redirect( 302, '/tweet/' );
    });

};

const deletePost = ( req, res, next ) => {

    const name = req.session.name;
    const sql = 'SELECT * FROM posts';

    db.each('', [], () => {

    });

};


const addUser = ( req, res, next, callback ) => {

    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;

    const sha512 = crypto.createHash('sha512');
    sha512.update(pass);
    const hash = sha512.digest('hex');

    const sql = 'SELECT * FROM users';

    // TODO:メールアドレスもハッシュ化若しくは暗号化する

    // name, email, password, profile, postsLength, follow, follower

    db.each( sql, ( error, row ) => {

        if ( row.name == name ) {
            callback = () => {
                res.render( './auth/register', {
                    addedName: true
                });
            };
        }

    }, () => {
        callback(db, name, email, hash);
    });
};

exports.setDatabase = setDatabase;
exports.removeDatabase = removeDatabase;
exports.getDatabase = getDatabase;
exports.getUserPosts = getUserPosts;
exports.addUser = addUser;
exports.db = db;

class ControllDatabase {

    constructor (sql, option) {
        this.sql = sql;
        this.option = option;
        this.postsData = [];
        this.db = db;
    }

    run (callback) {
        db.each( this.sql , [...this.option], ( error, row ) => {
            this.postsData.push({
                name: row.name,
                tweet: row.tweet,
                timestamp: row.timestamp,
                id: row.id
            });
        }, () => {
            if ( typeof callback === 'function' ) {
                callback();
            }
        });
    }

    insert (callback) {
        db.serialize( () => {
            const stmt = db.prepare(this.sql);
            stmt.run( this.option );
            stmt.finalize();

            if ( typeof callback === 'function' ) {
                callback();
            }

            req.session.name = this.option.name;
            res.redirect(302, '/tweet/');
        });
    }

}