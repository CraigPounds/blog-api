'use strict';

exports.DATABASE_URL =
 process.env.DATABASE_URL || 'mongodb://localhost/blogs-db';
exports.TEST_DATABASE_URL = 
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blogs-db';
exports.PORT = process.env.PORT || 8080;