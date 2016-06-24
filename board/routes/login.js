const express = require('express');
const router = express.Router();



router.get( '/', (req, res, next) => {



    res.send('respond with a resource');
});

module.exports = router;


// サンプルコード
//
// db.serialize( function () {
//     db.run( 'CREATE TABLE IF NOT EXISTS items(name, value )' );
//     var stmt = db.prepare( 'INSERT INTO items VALUES(?,?)' );
//     stmt.run( ['Banana', 300] );
//     stmt.run( ['Apple', 150] );
//     stmt.run( ['Mango', 250] );
//     stmt.finalize();
//
//     db.each( 'SELECT * FROM items', function ( error, row ) {
//         console.log( row.name + ':' + row.value );
//     });
// });