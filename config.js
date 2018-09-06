'use strict';

// mongoimport --db blog-app --collection authors --file blog-api/authors-seed-data.json --drop
// mongoimport --db blog-app --collection blogposts --file blog-api/blogposts-seed-data.json --drop

// *changed default connection name to blogs because I wasn't able to connect to blogposts ???
// mongoimport --db blog-app --collection blogs --file blog-api/blogposts-seed-data.json --drop

// db.authors.createIndex( { "userName": 1 }, { unique: true } )
// db.authors.getIndexes()

// mongoimport -h ds133642.mlab.com:33642 -d blogs-app-db -c authors -u napes -p passmlab7 --file blog-api/authors-seed-data.json
// mongoimport -h ds133642.mlab.com:33642 -d blogs-app-db -c blogposts -u napes -p passmlab7 --file blog-api/blogposts-seed-data.json

// *changed default connection name to blogs because I wasn't able to connect to blogposts ???
// mongoimport -h ds133642.mlab.com:33642 -d blogs-app-db -c blogs -u napes -p passmlab7 --file blog-api/blogposts-seed-data.json

// {
//   "title": "AI and Manufacturing",
//   "content": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
//   "author_id": "ObjectId(ajf9292kjf0)"
// }

// mLab
// mongodb://napes:passmlab7@ds133642.mlab.com:33642/blogs-app-db

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blog-app';
exports.PORT = process.env.PORT || 8080;
