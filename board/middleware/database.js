const SQLite = require('sqlite3').verbose();
const db = new SQLite.Database('./data/db/board.sqlite');
const validator = require('validator');
//const moment = require('moment');

db.run( 'CREATE TABLE IF NOT EXISTS posts( name, tweet, timestamp )' );
db.run( 'CREATE TABLE IF NOT EXISTS users( name, email, password, profile, postsLength, follow, follower )' );

const getDatabase = ( req, res, page ) => {

    const postsData = [];

    // LIMIT で最大数指定
    // SELECT カラム名, ... FROM テーブル名 LIMIT 行数 OFFSET 開始位置;
    // SELECT カラム名, ... FROM テーブル名 LIMIT 開始位置, 行数;

    let postsLength = 0;

    var offset;
    if ( !page ) {
        offset = 0;
    } else {
        offset = page - 1;
    }



    db.each( 'SELECT * FROM posts order by timestamp DESC LIMIT 10 OFFSET ' + offset * 10, ( error, row ) => {
        //console.log( row.name + ':' + row.tweet );
        postsData.push({
            name: validator.escape(row.name),
            tweet: validator.escape(row.tweet),
            timestamp: row.timestamp
        });
    },  () => {
        db.each( 'SELECT COUNT(*) as postsLength from posts', ( error, row) => {
            postsLength = row['postsLength'];
        }, () => {
            res.render( 'tweet/index', {
                tweets: postsData,
                postsLength: postsLength
            });
        });
    });
};


const setDatabase = ( res, name, tweet ) => {

    const timestamp = Date.now();

    db.serialize( function () {
        const stmt = db.prepare( 'INSERT INTO posts VALUES(?,?,?)' );
        stmt.run( [name, tweet, timestamp] );
        stmt.finalize();
    });
    res.redirect( 302, '/tweet/' );

};

exports.setDatabase = setDatabase;
exports.getDatabase = getDatabase;
exports.db = db;
//exports.postData = postData;