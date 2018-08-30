'use strict';

// mongoimport --db blog-app --collection authors --file authors-seed-data.json --drop
// mongoimport --db blog-app --collection blogposts --file blogposts-seed-data.json --drop

// db.authors.createIndex( { "userName": 1 }, { unique: true } )
// db.authors.getIndexes()

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-app';
exports.PORT = process.env.PORT || 8080;


