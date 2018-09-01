'use strict';

// mongoimport --db blog-app --collection authors --file authors-seed-data.json --drop
// mongoimport --db blog-app --collection blogposts --file blogposts-seed-data.json --drop

// changed default connection name to blogs :(
// mongoimport --db blog-app --collection blogs --file blogposts-seed-data.json --drop

// db.authors.createIndex( { "userName": 1 }, { unique: true } )
// db.authors.getIndexes()

// mongoimport -h ds133642.mlab.com:33642 -d blogs-app-db -c authors -u napes -p passmlab7 --file authors-seed-data.json
// mongoimport -h ds133642.mlab.com:33642 -d blogs-app-db -c blogposts -u napes -p passmlab7 --file blogposts-seed-data.json

// changed default connection name to blogs :(
// mongoimport -h ds133642.mlab.com:33642 -d blogs-app-db -c blogs -u napes -p passmlab7 --file blogposts-seed-data.json

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-app';
exports.PORT = process.env.PORT || 8080;


